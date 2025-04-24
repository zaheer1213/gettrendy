import React, { useEffect, useState } from 'react'
import {
  Navbar,
  Nav,
  NavDropdown,
  Container,
  Row,
  Col,
  Button,
  Modal
} from 'react-bootstrap'
import {
  FaSignInAlt,
  FaSignOutAlt,
  FaRegUserCircle,
  FaTruck,
  FaHome,
  FaStore,
  FaLayerGroup,
  FaAddressBook
} from 'react-icons/fa'

import './Navigation.css'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { BASEURL, ImageUrl } from '../Comman/CommanConstans'
import { useAuth } from '../../AuthContext/AuthContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { useCart } from '../../CartContext/CartContext'

const Navigation = () => {
  const location = useLocation()
  const { logout, userToken, userID } = useAuth()
  const { cartItems, setCartItems } = useCart()
  const navigate = useNavigate()

  const [showDropdowns, setShowDropdowns] = useState({})
  const [allCategoryList, setAllCategoryList] = useState([])
  const [userName, setUserName] = useState('')
  const [show, setShow] = useState(false)
  const [cartQuantity, setCartQuantity] = useState(0)

  // const cartQuantity = cartItems?.reduce((sum, item) => sum + item.quantity, 0);

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  const [isOpen, setIsOpen] = useState(false)

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  const moveToCart = () => {
    navigate('/cartPage')
    setIsOpen(!isOpen)
    window.scroll(0, 0)
  }

  const moveToCheckout = () => {
    navigate('/checkout')
    setIsOpen(!isOpen)
    window.scroll(0, 0)
  }

  const getUserInfo = async () => {
    try {
      const response = await axios.get(`${BASEURL}/auth/${userID}`, {
        headers: {
          'x-access-token': userToken || localStorage.getItem('token')
        }
      })
      const data = response.data
      const nameParts = data.data.name.split(' ')
      setUserName(nameParts[0])
    } catch (error) {
      console.log(error)
    }
  }

  const handleLogout = () => {
    logout()
    handleClose()
    localStorage.removeItem('token')
    setUserName('')
    setCartItems([])
  }

  const getAllCategories = async () => {
    try {
      const response = await axios.get(`${BASEURL}/category?page=1&limit=50`, {
        headers: {
          'x-access-token': userToken || localStorage.getItem('token')
        }
      })
      if (response) {
        setAllCategoryList(response.data.categories)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleMouseEnter = id => {
    setShowDropdowns(prev => ({ ...prev, [id]: true }))
  }

  const handleMouseLeave = id => {
    setShowDropdowns(prev => ({ ...prev, [id]: false }))
  }
  const navigateToShop = Id => {
    window.scroll(0, 0)
    navigate('/shop', { state: { category: Id } })
  }

  const navigateToProduct = id => {
    window.scroll(0, 0) // Scroll to the top of the page
    navigate('/perticularproductpage', { state: { productId: id } })
  }

  const handleNavItemClick = path => {
    if (userToken) {
      navigate(path)
      window.scroll(0, 0)
    } else {
      navigate('/login')
      window.scroll(0, 0)
    }
  }
  useEffect(() => {
    if (userToken) {
      getUserInfo()
    }
    getAllCategories()
    const totalQuantity = cartItems?.reduce(
      (sum, item) => sum + item.quantity,
      0
    )
    setCartQuantity(totalQuantity)
  }, [userToken, cartItems])
  return (
    <>
      <Navbar
        expand='lg'
        fixed='top'
        className='navigation text-white bg-navbar'
      >
        <Container>
          <Navbar.Brand href='/'>
            <div className='logo-img'>
              <img src='/Images/Get_Trendy_Logo.png' alt='Logo' />
            </div>
          </Navbar.Brand>

          <div className='cart-div'>
            <div className='cart-menu'>
              {userToken && (
                <Nav.Link href='#'>
                  <span
                    className={
                      cartQuantity < 10
                        ? 'cart-item-no small-cart cart-mobile'
                        : 'cart-item-no large-cart cart-mobile'
                    }
                    style={{ color: 'rgba(255, 255, 0, 1)' }}
                  >
                    {cartQuantity}
                  </span>{' '}
                  <img
                    src='/Images/ShoppingCartSimple.svg'
                    onClick={() => toggleSidebar()}
                    className='cart cart-img-mobile'
                    alt='img'
                  />
                </Nav.Link>
              )}
              <Navbar.Toggle aria-controls='navbar-nav' />
            </div>
          </div>

          <Navbar.Collapse id='navbar-nav' className='justify-content-between'>
            <Nav className='me-auto mx-auto'>
              <Nav.Link href='/' active={location.pathname === '/'}>
                <FaHome /> &nbsp; Home
              </Nav.Link>

              <Nav.Link href='/shop' active={location.pathname === '/shop'}>
                <FaStore />
                &nbsp; Shop
              </Nav.Link>



              {/* <Navbar.Toggle aria-controls="basic-navbar-nav" /> */}
              <Navbar.Collapse id='basic-navbar-nav'>
                <Nav className='mr-auto'>
                  <NavDropdown
                    title={
                      <>
                        <FaLayerGroup />
                        &nbsp; Categories
                      </>
                    }
                    id='categories-dropdown'
                  >
                    <div className='dropdown-content'>
                      {allCategoryList &&
                        allCategoryList?.map((category, index) => (
                          <div key={category.id} className='dropdown-item'>
                            <div
                              className='category-header pointer'
                              onClick={() => navigateToShop(category._id)}
                            >
                              <img
                                src={ImageUrl + category.image}
                                alt={category.name}
                                style={{
                                  height: '36px',
                                  width: '36px',
                                  objectFit: 'cover'
                                }}
                                className='category-image'
                              />
                              <strong>{category.name}</strong>
                            </div>

                          </div>
                        ))}
                    </div>
                  </NavDropdown>
                </Nav>
              </Navbar.Collapse>

              {/* Contact */}
              <Nav.Link
                href='/contact'
                active={location.pathname === '/contact'}
              >
                <FaAddressBook />
                &nbsp; Contact
              </Nav.Link>
            </Nav>

            <Nav className='align-items-center'>
              <div className='cart-div'>
                {/* Cart */}
                {userToken && (
                  <Nav.Link href='#'>
                    <span
                      className={
                        cartQuantity < 10
                          ? 'cart-item-no small-cart cart-desktop'
                          : 'cart-item-no large-cart cart-desktop'
                      }
                      style={{ color: 'rgba(255, 255, 0, 1)' }}
                    >
                      {cartQuantity}
                    </span>{' '}
                    <img
                      src='/Images/ShoppingCartSimple.svg'
                      onClick={() => toggleSidebar()}
                      className='cart cart-img-desktop'
                      alt='img'
                    />
                  </Nav.Link>
                )}
              </div>
              {/* {userToken && (
                <NavDropdown
                  title={
                    <>
                      <FontAwesomeIcon icon={faUser} />
                      <span className="ms-2">
                        {userName ? userName : "Hello"}
                      </span>
                    </>
                  }
                  id="basic-nav-dropdown"
                >
                  <NavDropdown.Item
                    onClick={() => handleNavItemClick("/profilePage")}
                  >
                    <FaRegUserCircle size={20} /> &nbsp; Profile
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    onClick={() => handleNavItemClick("/myOrders")}
                  >
                    <FaTruck size={20} /> &nbsp; My Orders
                  </NavDropdown.Item>
                  <NavDropdown.Item onClick={() => handleShow()}>
                    <FaSignOutAlt size={24} />
                    &nbsp; Log Out
                  </NavDropdown.Item>
                </NavDropdown>
              )} */}

              <Nav>
                {userToken ? (
                  <NavDropdown
                    title={
                      <>
                        <FontAwesomeIcon icon={faUser} />
                        <span className='ms-2'>
                          {userName ? userName : 'Hello'}
                        </span>
                      </>
                    }
                    id='basic-nav-dropdown'
                  >
                    <NavDropdown.Item
                      onClick={() => handleNavItemClick('/profilePage')}
                    >
                      <FaRegUserCircle size={20} /> &nbsp; Profile
                    </NavDropdown.Item>
                    <NavDropdown.Item
                      onClick={() => handleNavItemClick('/myOrders')}
                    >
                      <FaTruck size={20} /> &nbsp; My Orders
                    </NavDropdown.Item>
                    <NavDropdown.Item onClick={() => handleShow()}>
                      <FaSignOutAlt size={24} />
                      &nbsp; Log Out
                    </NavDropdown.Item>
                  </NavDropdown>
                ) : (
                  <Nav.Link href='/login'>
                    <FaSignInAlt size={24} />
                    <span className='ms-2'>Sign In</span>
                  </Nav.Link>
                )}
              </Nav>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Alert</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure want to Logout?</Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={handleClose}>
            Close
          </Button>
          <Button variant='danger' onClick={() => handleLogout()}>
            Ok
          </Button>
        </Modal.Footer>
      </Modal>

      <div>
        {/* Sidebar */}
        <div className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
          <div className='cart-header'>
            <h2 className='cart-title'>Shopping Cart</h2>
            <button className='cart-close-btn' onClick={toggleSidebar}>
              X
            </button>
          </div>

          {/* Cart Items Container with Auto Scroll */}
          <div className='cart-items-container'>
            {cartItems?.length > 0 ? (
              cartItems?.map(item => (
                <div
                  className='customs-shop-card mt-3'
                  key={item.productId._id}
                >
                  <Row noGutters className='align-items-center g-5'>
                    <Col xs={4} className='text-center'>
                      <img
                        src={`${ImageUrl}${item?.productId?.image}`}
                        alt='img'
                        className='shop-img'
                      />
                    </Col>

                    <Col xs={8}>
                      <div className='product-card-desc'>
                        <p className='rating'>
                          ★★★★★{' '}
                          <span style={{ color: 'black', marginBottom: '0px' }}>
                            (5.0)
                          </span>
                        </p>
                        <strong>{item?.productId?.name}</strong>
                        <div className='card-text'>
                          <p>
                            ₹{item?.productId?.price}.00 * {item?.quantity}
                          </p>{' '}
                          &nbsp;
                          <p>{item?.selectedSize}</p>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </div>
              ))
            ) : (
              <p>No items in the cart</p>
            )}
          </div>

          {/* Fixed Button Section */}
          <div className='end-section'>
            <Button
              onClick={() => moveToCart()}
              style={{ background: '#E9272D' }}
            >
              View Cart
            </Button>
            <Button
              style={{ background: '#E9272D' }}
              onClick={() => moveToCheckout()}
            >
              Checkout
            </Button>
          </div>
        </div>

        {/* Overlay (Optional) */}
        {isOpen && (
          <div className='sidebar-overlay' onClick={toggleSidebar}></div>
        )}
      </div>
    </>
  )
}

export default Navigation
