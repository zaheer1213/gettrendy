import React, { useEffect, useState } from 'react'
import './Checkout.css' // Custom styles for alignment and spacing
import Footer from '../Footer/Footer'
import axios from 'axios'
import { BASEURL, KEY } from '../Comman/CommanConstans'
import { useAuth } from '../../AuthContext/AuthContext'
import { useCart } from '../../CartContext/CartContext'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const Checkout = () => {
  const navigate = useNavigate()
  const { userToken, userID } = useAuth()
  const { cartItems } = useCart()
  const [countries, setCountries] = useState([])
  const [formData, setFormData] = useState({
    userId: '',
    fullName: '',
    companyName: '',
    country: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    postcode: '',
    phone: '',
    email: '',
    orderNotes: ''
  })

  const [errors, setErrors] = useState({})
  const [shipping, setShipping] = useState(50)
  const [paymentType, setPaymentType] = useState('UPI')

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item?.productId?.price * item.quantity,
    0
  )

  const total = subtotal + shipping

  // Handle input change
  const handleChange = e => {
    const { name, value } = e.target

    // Allow only numbers and restrict length to 10 digits
    if (name === 'phone') {
      if (/^\d{0,10}$/.test(value)) {
        setFormData({ ...formData, [name]: value })
      }
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }

  // Validation function
  const validate = () => {
    const newErrors = {}
    if (!formData.fullName) newErrors.fullName = 'Full Name is required'
    // if (!formData.country) newErrors.country = "Country/Region is required";
    if (!formData.address) newErrors.address = 'Street Address is required'
    if (!formData.city) newErrors.city = 'Town/City is required'
    // if (!formData.state) newErrors.state = "State/County is required";
    if (!formData.postcode) newErrors.postcode = 'Postcode/ZIP is required'
    if (!formData.phone) newErrors.phone = 'Phone is required'
    if (!formData.email) newErrors.email = 'Email is required'

    return newErrors
  }

  const getUserInfo = async () => {
    try {
      const response = await axios.get(`${BASEURL}/auth/${userID}`, {
        headers: {
          'x-access-token': userToken || localStorage.getItem('token')
        }
      })
      const data = response.data.data
      setFormData({
        fullName: data.name,
        phone: data.phone,
        email: data.email,
        userId: data._id
      })
    } catch (error) {
      console.log(error)
    }
  }
  const generateOrderId = () => {
    // Generate a random number between 100 and 999 (inclusive)
    return Math.floor(100 + Math.random() * 900)
  }
  // Handle form submission
  const handleSubmit = async e => {
    const formErrors = validate()

    if (Object.keys(formErrors).length === 0) {
      const orderId = generateOrderId()
      try {
        const payload = {
          name: formData.fullName,
          user: formData.userId,
          amount: total,
          order_id: orderId,
          delivery_address: formData.address,
          delivery_cost: shipping,
          pincode: formData.postcode,
          city: formData.city,
          notes: formData.orderNotes,
          payment_type: paymentType,
          mobile_number: formData.phone,
          email: formData.email
        }
        const response = await axios.post(
          `${BASEURL}/orders/place-order`,
          payload,
          {
            headers: {
              'x-access-token': userToken
            }
          }
        )
        if (response.data.error === false) {
          if (paymentType === 'CASH') {
            navigate('/order-Summary', {
              state: { orderId: response?.data?.data?.id }
            })
          } else {
            window.location.href = response.data.pay_page_url
          }
        } else {
          toast.error('something went wrong')
        }
      } catch (error) {
        console.log(error)
        const message1 = error?.response?.data?.message[0]
        const message2 = error?.response?.data?.message
        toast.error(message2 || message1 || 'something went wrong')
      }
    } else {
      setErrors(formErrors)
    }
  }
  // Load Razorpay script dynamically
  const loadRazorpayScript = () => {
    return new Promise(resolve => {
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }

  // Open Razorpay Payment
  const openRazorpayPayment = async order => {
    const scriptLoaded = await loadRazorpayScript()

    if (!scriptLoaded) {
      alert(
        'Failed to load Razorpay SDK. Please check your internet connection.'
      )
      return
    }

    const options = {
      key: KEY,
      amount: order.amount,
      currency: 'INR',
      order_id: order.id,
      name: 'Get Trendy Store',
      description: 'Payment for your order',
      image: '/Images/Get_Trendy_Logo.png',
      handler: async function (response) {
        // console.log('Payment successful:', response);
        window.location.href = '/success'
      },
      prefill: {
        name: order.customerName,
        email: order.customerEmail,
        contact: order.customerContact
      },
      theme: {
        color: '#F37254'
      }
    }

    const rzp = new window.Razorpay(options)
    rzp.open()

    rzp.on('payment.failed', function (response) {
      console.error('Payment failed:', response.error)
      alert('Payment Failed. Please try again.')
    })
  }

  // Payment Verification
  const verifyPayment = async (paymentData, orderId) => {
    try {
      const response = await fetch('http://localhost:5000/api/verify-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ paymentData, orderId })
      })

      const result = await response.json()

      if (result.success) {
        alert('Payment Verified Successfully!')
      } else {
        alert('Payment Verification Failed!')
      }
    } catch (error) {
      console.error('Error during payment verification:', error)
      alert('Error during payment verification.')
    }
  }

  // Proceed to Payment
  const proceedToPayment = async checkoutData => {
    try {
      const response = await fetch(`${BASEURL}/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(checkoutData)
      })

      const result = await response.json()

      if (!result.order || !result.order.id) {
        alert('Failed to create order. Please try again.')
        return
      }

      openRazorpayPayment(result.order)
    } catch (error) {
      console.error('Error during payment initiation:', error)
      alert('Something went wrong. Please try again.')
    }
  }

  // Handle Checkout
  const handleCheckout = () => {
    const checkoutData = {
      userId: userID,
      address: {
        fullName: formData.fullName,
        streetAddress: formData.address,
        apartment: formData.apartment,
        city: formData.city,
        zip: formData.postcode,
        orderNotes: formData.orderNotes
      },
      shippingMethod: 'Flat rate',
      paymentMethod: 'UPI',
      totalAmount: total,
      phone: formData.phone,
      email: formData.email,
      status: 'Pending'
    }

    proceedToPayment(checkoutData)
  }

  const getCountries = async () => {
    try {
      const response = await axios.get('https://restcountries.com/v3.1/all')
      const countryList = response.data.map(country => country.name.common)
      setCountries(countryList) // Set the country list in state
    } catch (error) {
      console.error('Error fetching country list: ', error)
    }
  }

  useEffect(() => {
    if (userToken) {
      getUserInfo()
    }
    getCountries()
  }, [userToken])
  return (
    <>
      <div className='container checkout-page'>
        <h2>Checkout</h2>
        <p>Home &bull; Checkout</p>
        <div className='row'>
          <div className='col-md-8'>
            <div className='billing-details'>
              <h3>Billing Details</h3>
              <form>
                {/* Full Name */}
                <div className='form-group'>
                  <label>
                    Full Name <span className='require'>*</span>
                  </label>
                  <input
                    type='text'
                    className={`form-control ${
                      errors.fullName ? 'is-invalid' : ''
                    }`}
                    placeholder='Full Name'
                    name='fullName'
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                  />
                  {errors.fullName && (
                    <p className='text-danger'>{errors.fullName}</p>
                  )}
                </div>

                {/* Country */}
                {/* <div className="form-group">
                  <label>
                    Country / Region <span className="require">*</span>
                  </label>
                  <select
                    className="form-control"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Country</option>
                    {countries.map((country, index) => (
                      <option key={index} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                  {errors.country && (
                    <p className="text-danger">{errors.country}</p>
                  )}
                </div> */}

                {/* Street Address */}
                <div className='form-group'>
                  <label>
                    Street Address <span className='require'>*</span>
                  </label>
                  <input
                    type='text'
                    className='form-control'
                    placeholder='Street address'
                    name='address'
                    value={formData.address}
                    onChange={handleChange}
                    required
                  />
                  {errors.address && (
                    <p className='text-danger'>{errors.address}</p>
                  )}
                </div>

                {/* Apartment */}
                <div className='form-group'>
                  <label>Apartment, suite, unit (optional)</label>
                  <input
                    type='text'
                    className='form-control'
                    placeholder='Apartment, suite, unit'
                    name='apartment'
                    value={formData.apartment}
                    onChange={handleChange}
                  />
                </div>

                {/* City */}
                <div className='form-group'>
                  <label>
                    Town / City <span className='require'>*</span>
                  </label>
                  <input
                    type='text'
                    className='form-control'
                    placeholder='Town/City'
                    name='city'
                    value={formData.city}
                    onChange={handleChange}
                    required
                  />
                  {errors.city && <p className='text-danger'>{errors.city}</p>}
                </div>

                {/* State */}
                {/* <div className="form-group">
                  <label>
                    State / County <span className="require">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="State/County"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                  />
                  {errors.state && (
                    <p className="text-danger">{errors.state}</p>
                  )}
                </div> */}

                {/* Postcode */}
                <div className='form-group'>
                  <label>
                    Postcode / ZIP <span className='require'>*</span>
                  </label>
                  <input
                    type='number'
                    className='form-control'
                    placeholder='ZIP'
                    name='postcode'
                    value={formData.postcode}
                    onChange={handleChange}
                    required
                  />
                  {errors.postcode && (
                    <p className='text-danger'>{errors.postcode}</p>
                  )}
                </div>

                {/* Phone */}
                <div className='form-group'>
                  <label>
                    Phone <span className='require'>*</span>
                  </label>
                  <input
                    type='tel'
                    className='form-control'
                    placeholder='Phone'
                    name='phone'
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                  {errors.phone && (
                    <p className='text-danger'>{errors.phone}</p>
                  )}
                </div>

                {/* Email */}
                <div className='form-group'>
                  <label>
                    Email <span className='require'>*</span>
                  </label>
                  <input
                    type='email'
                    className='form-control'
                    placeholder='Email'
                    name='email'
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  {errors.email && (
                    <p className='text-danger'>{errors.email}</p>
                  )}
                </div>

                {/* Order Notes */}
                <div className='form-group'>
                  <label>Order notes (optional)</label>
                  <textarea
                    className='form-control'
                    placeholder='Notes about your order'
                    name='orderNotes'
                    value={formData.orderNotes}
                    onChange={handleChange}
                  />
                </div>
              </form>
            </div>
          </div>
          <div className='col-md-4'>
            <div className='order-summary'>
              <h3>Your Order</h3>
              {/* Wrap the table body in a div to apply scrolling */}
              <div className='table-container'>
                <table className='table'>
                  <thead>
                    <tr>
                      <th className='text-bold'>Product</th>
                      <th className='text-bold'>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Dynamically map over cart items */}
                    {cartItems.map(item => (
                      <tr key={item.id}>
                        <td>
                          {item.productId.name} x {item.quantity}
                        </td>
                        <td>₹{item.productId.price * item.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Subtotal */}
              <table className='table'>
                <tbody>
                  <tr>
                    <td>
                      <strong>Subtotal</strong>
                    </td>
                    <td>₹{subtotal}</td>
                  </tr>

                  {/* Shipping */}
                  <tr>
                    <td>
                      <strong>Shipping</strong>
                    </td>
                    <td>
                      <input
                        type='radio'
                        name='shipping'
                        value='flat'
                        checked={shipping === 50}
                        onChange={() => setShipping(50)}
                      />{' '}
                      Flat rate: ₹50.00 <br />
                      <input
                        type='radio'
                        name='shipping'
                        value='local'
                        checked={shipping === 25}
                        onChange={() => setShipping(25)}
                      />{' '}
                      Local pickup: ₹25.00
                    </td>
                  </tr>
                  {/* payment Type */}
                  <tr>
                    <td>
                      <strong>Payment Type</strong>
                    </td>
                    <td>
                      <input
                        type='radio'
                        name='Payment Type'
                        value='CASH'
                        checked={paymentType === 'CASH'}
                        onChange={() => setPaymentType('CASH')}
                      />{' '}
                      CASH ON DELIVERY <br />
                      <input
                        type='radio'
                        name='Payment Type'
                        value='UPI'
                        checked={paymentType === 'UPI'}
                        onChange={() => setPaymentType('UPI')}
                      />{' '}
                      UPI
                    </td>
                  </tr>

                  {/* Total */}
                  <tr>
                    <td className='text-bold'>Total</td>
                    <td className='text-bold'>₹{total}</td>
                  </tr>
                </tbody>
              </table>

              {/* <div>
                <input type="radio" name="payment" value="bank" /> Direct Bank
                Transfer <br />
                <input type="radio" name="payment" value="card" /> Card <br />
                <input
                  type="text"
                  className="form-control mb-3"
                  placeholder="Card number"
                />
                <input
                  type="text"
                  className="form-control mb-3"
                  placeholder="MM/YY"
                />
                <input
                  type="text"
                  className="form-control mb-3"
                  placeholder="CVV"
                />
              </div> */}
              <button
                className='btn'
                style={{ background: '#E9272D', color: 'white' }}
                onClick={() => handleCheckout()}
              >
                Proceed to Payment
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default Checkout
