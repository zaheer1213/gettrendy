import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart, faStar } from '@fortawesome/free-solid-svg-icons'
import { Breadcrumb, Button, Form } from 'react-bootstrap'
import './PerticularProductPage.css'
import {
  FaFacebook,
  FaLinkedin,
  FaQuestion,
  FaTelegram,
  FaTwitter
} from 'react-icons/fa'
import { FaStar } from 'react-icons/fa'
import Footer from '../Footer/Footer'
import { useLocation, useNavigate } from 'react-router-dom'
import { BASEURL, ImageUrl } from '../Comman/CommanConstans'
import axios from 'axios'
import { useAuth } from '../../AuthContext/AuthContext'
import { useCart } from '../../CartContext/CartContext'
import { ToastContainer, toast, Bounce } from 'react-toastify'
import ReactImageMagnify from 'react-image-magnify'

const PerticularProductPage = () => {
  const { userToken } = useAuth()
  const { addToCart } = useCart()
  const navigation = useNavigate()
  const location = useLocation()
  const [rating, setRating] = useState(0)
  const [hover, setHover] = useState(0)
  const [productData, setProductData] = useState({})
  const [isExpanded, setIsExpanded] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [selectedSizes, setSelectedSizes] = useState({})
  const [inCartStatus, setInCartStatus] = useState({})

  const [formData, setFormData] = useState({
    rating: 0,
    name: '',
    email: '',
    description: ''
  })

  const [errors, setErrors] = useState({})

  const handleInputChange = e => {
    const { name, value } = e.target

    // Only update state if the value has actually changed
    if (formData[name] !== value) {
      setFormData(prevData => ({
        ...prevData,
        [name]: value
      }))
    }
  }

  const validate = () => {
    let errors = {}
    if (!formData.rating) errors.rating = 'Rating is required'
    if (!formData.name) errors.name = 'Name is required'
    if (!formData.email) errors.email = 'Email is required'
    if (!formData.description) errors.description = 'Review is required'
    setErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (!userToken) {
      navigation('/login')
      window.scroll(0, 0)
    } else {
      if (!validate()) {
        toast.error('Please fill out all fields')
        return
      }
      {
        const payload = {
          name: formData.name,
          email: formData.email,
          review: formData.description,
          rating: formData.rating,
          productId: productID
        }

        try {
          const response = await axios.post(
            `${BASEURL}/review/add`,
            payload,
            {
              headers: {
                'x-access-token': userToken
              }
            }
          )
          if (response.data) {
            toast.success('Thank You For The Review')

            setFormData({
              rating: 0,
              name: '',
              email: '',
              description: ''
            })
          }
        } catch (error) {
          toast.error('Failed to submit review')
          console.error(error)
        }
      }
    }
  }

  const reviews = [
    {
      name: 'Naim',
      date: '01 July 2024',
      rating: 3,
      comment: 'Average product'
    },
    {
      name: 'Naim',
      date: '05 July 2024',
      rating: 4,
      comment: 'Good value for money'
    },
    {
      name: 'Naim Ahmed',
      date: '04 September 2024',
      rating: 5,
      comment: 'Nice'
    }
  ]
  const getProductsById = async id => {
    try {
      const response = await axios.get(`${BASEURL}/products/${id}`)
      if (response.data) {
        setProductData(response.data)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const toggleReadMore = () => {
    setIsExpanded(!isExpanded)
  }
  const handleAddToCart = product => {
    const selectedSize = selectedSizes[product._id]
    if (!selectedSize) {
      toast.error('Please select a size before adding to cart.')
      return
    }
    if (userToken) {
      addToCart(product, quantity, selectedSize)
      setInCartStatus(prevStatus => ({
        ...prevStatus,
        [product._id]: true
      }))
    } else {
      navigation('/login')
      window.scroll(0, 0)
    }
  }
  const productID = location?.state?.productId
  useEffect(() => {
    if (productID) {
      getProductsById(productID)
    }
  }, [productID])
  return (
    <>
      <div className='container my-5' style={{ paddingTop: '150px' }}>
        <Breadcrumb>
          <Breadcrumb.Item href='/'>Home</Breadcrumb.Item>
          <Breadcrumb.Item href='/shop'> Products</Breadcrumb.Item>
          <Breadcrumb.Item active>{productData.name}</Breadcrumb.Item>
        </Breadcrumb>
        <div className='row'>
          <div className='col-md-6'>
            <div className='product-image'>
              <div>
                <ReactImageMagnify
                  {...{
                    smallImage: {
                      alt: 'Grapefruit',
                      isFluidWidth: true,
                      src: ImageUrl + productData.image
                    },
                    largeImage: {
                      src: ImageUrl + productData.product_image,
                      width: 1200, // Large image width for zoom
                      height: 1200 // Large image height for zoom
                    },
                    enlargedImagePosition: 'over' // Zoom position: over, beside, etc.
                  }}
                />
              </div>
            </div>
          </div>
          <div className='col-md-6'>
            <div className='product-details'>
              <p className='product-category'>{productData.name}</p>
              <h3 className='product-title'>{productData.name}</h3>

              <p className='stock-status'>
                <span className='badge bg-success'>In Stock</span>
                <FontAwesomeIcon icon={faStar} className='text-warning mx-2' />6
                Reviews
              </p>

              <p className='product-price'>₹{productData.price}.00</p>

              <div>
                <p
                  className={`product-description ${
                    isExpanded ? 'expanded' : ''
                  }`}
                >
                  {productData.description}
                </p>
                <button onClick={toggleReadMore} className='read-more-btn'>
                  {isExpanded ? 'Read Less' : 'Read More'}
                </button>
              </div>
              {productData.sizes && productData.sizes.length > 0 && (
                <div className='size-section mb-2 mt-2'>
                  {productData.sizes.map(size => (
                    <span
                      className={`size-badge ${
                        selectedSizes[productData._id] === size.size
                          ? 'selected'
                          : ''
                      }`}
                      key={size._id}
                      onClick={() =>
                        setSelectedSizes(prev => ({
                          ...prev,
                          [productData._id]: size.size
                        }))
                      }
                    >
                      {size.size}
                    </span>
                  ))}
                </div>
              )}
              <div className='quantity-selector-container'>
                <div className='quantity-selector'>
                  <button
                    className='btn btn-outline-secondary'
                    onClick={() => setQuantity(quantity => quantity - 1)}
                    disabled={quantity == 1}
                  >
                    -
                  </button>
                  <span className='mx-2'>{quantity}</span>
                  <button
                    className='btn btn-outline-secondary'
                    onClick={() => setQuantity(quantity => quantity + 1)}
                  >
                    +
                  </button>
                </div>
                <Button
                  className='btn  button add-to-cart'
                  onClick={() => handleAddToCart(productData)}
                >
                  Add To Cart
                </Button>
              </div>

              <div className='mt-3'>
                <button className='btn btn-outline-dark'>
                  <FontAwesomeIcon icon={faHeart} /> Add Wishlist
                </button>
                <button className='btn btn-outline-dark mx-2'>
                  <FaQuestion /> Ask a question
                </button>
              </div>

              <p>SKU: AB32335</p>
              {/* <p>Category: {productData.sub_category_name}</p> */}

              <div className='social-icons'>
                <FaFacebook className='' />
                <FaTwitter className='' />
                <FaLinkedin className='' />
                <FaTelegram className='' />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='container'>
        <h6 className='h6-title'>DESCRIPTION</h6>
        <h3>{productData.product_name}</h3>
        <p style={{ paddingBottom: '30px' }}>{productData.description}</p>

        <h6 className='h6-title'>REVIEWS</h6>
        <div className='reviews-page'>
          <div className='reviews-section'>
            <div className='customer-reviews-summary'>
              <h3>Customer reviews</h3>
              <h1>
                4.0 <FaStar color='#ffc107' />
              </h1>
              <p>(6 Reviews)</p>
            </div>
            <div className='rating-review'>
              <h3>Rating & Review</h3>
              {reviews.map((review, index) => (
                <div key={index} className='single-review'>
                  <div className='review-header'>
                    <div className='review-rating'>
                      {[...Array(5)].map((star, i) => (
                        <FaStar
                          key={i}
                          color={i < review.rating ? '#ffc107' : '#e4e5e9'}
                        />
                      ))}
                    </div>
                    <p>
                      {review.name} • {review.date}
                    </p>
                  </div>
                  <p>{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
          <div className='review-form-section'>
            <h3>Review this product</h3>
            <p>
              Your email address will not be published. Required fields are
              marked *
            </p>

            <Form onSubmit={handleSubmit}>
              {/* Rating Selection */}
              <div className='rating-selection'>
                <p>Your Rating:</p> &nbsp;
                {[...Array(5)].map((star, index) => {
                  const ratingValue = index + 1
                  return (
                    <FaStar
                      key={index}
                      className='star'
                      color={
                        ratingValue <= (hover || formData.rating)
                          ? '#ffc107'
                          : '#e4e5e9'
                      }
                      onMouseEnter={() => setHover(ratingValue)}
                      onMouseLeave={() => setHover(0)}
                      onClick={() =>
                        setFormData({ ...formData, rating: ratingValue })
                      }
                    />
                  )
                })}
                {errors.rating && (
                  <div
                    className='invalid-feedback mt-5'
                    style={{ display: 'block' }}
                  >
                    {errors.rating}
                  </div>
                )}
              </div>
              <div className='form-group'>
                <Form.Group className='mb-3 mt-3' controlId='formUserName'>
                  <label className='mb-2 mt-2'>Your Name</label>
                  <Form.Control
                    type='text'
                    name='name'
                    placeholder='Enter your name'
                    value={formData.name}
                    onChange={handleInputChange}
                    isInvalid={!!errors.name}
                  />
                  <Form.Control.Feedback type='invalid'>
                    {errors.name}
                  </Form.Control.Feedback>
                </Form.Group>
              </div>

              <div className='form-group'>
                <Form.Group className='mb-3 mt-3' controlId='formUserEmail'>
                  <label className='mb-2 mt-2'>Your Email</label>
                  <Form.Control
                    type='email'
                    name='email'
                    placeholder='Enter your email'
                    value={formData.email}
                    onChange={handleInputChange}
                    isInvalid={!!errors.email}
                  />
                  <Form.Control.Feedback type='invalid'>
                    {errors.email}
                  </Form.Control.Feedback>
                </Form.Group>
              </div>

              <div className='form-group'>
                <Form.Group className='mb-3 mt-3' controlId='formUserReview'>
                  <label className='mb-2 mt-2'>Your Review</label>
                  <Form.Control
                    as='textarea'
                    rows={5}
                    name='description'
                    placeholder='Write your review here...'
                    value={formData.description}
                    onChange={handleInputChange}
                    isInvalid={!!errors.description}
                  />
                  <Form.Control.Feedback type='invalid'>
                    {errors.description}
                  </Form.Control.Feedback>
                </Form.Group>
              </div>

              <button type='submit' className='btn button mt-4 mb-5'>
                Submit
              </button>
            </Form>
          </div>
        </div>
      </div>
      <Footer />
      <ToastContainer
        position='top-center'
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme='light'
        transition={Bounce}
      />
    </>
  )
}

export default PerticularProductPage
