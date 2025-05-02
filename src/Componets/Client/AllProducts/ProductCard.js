import React, { useEffect, useState } from 'react'
import { Card, Button, Badge, Col, Row, Container, Nav } from 'react-bootstrap'
import { FaHeart } from 'react-icons/fa'
import './ProductCard.css' // Custom CSS file for additional styling
import axios from 'axios'
import { BASEURL, ImageUrl } from '../Comman/CommanConstans'
import Loader from '../Loader/Loader'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../../CartContext/CartContext'
import { useAuth } from '../../AuthContext/AuthContext'
import { Pagination, Stack } from '@mui/material'
import { toast } from 'react-toastify'

const ProductCard = () => {
  const { userToken } = useAuth()
  const { addToCart } = useCart()
  const navigation = useNavigate()
  const [quantity, setQuantity] = useState(1)
  const [allProducts, setAllProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [pagesCountAll, setPagesCountAll] = useState(1)
  const [inCartStatus, setInCartStatus] = useState({})
  const [pageAll, setPageAll] = useState(1)
  const [limitAll, setLimitAll] = useState(8)
  const [selectedSizes, setSelectedSizes] = useState({})

  const handleAddToCart = product => {
    const selectedSize = selectedSizes[product._id]
    if (!selectedSize) {
      toast.error('Please select a size before adding to cart.')
      return
    }
    if (userToken) {
      addToCart(product, 1, selectedSize)
      setInCartStatus(prevStatus => ({
        ...prevStatus,
        [product._id]: true
      }))
    } else {
      navigation('/login')
      window.scroll(0, 0)
    }
  }
  const increaseQuantity = () => {
    setQuantity(quantity + 1)
  }

  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1)
  }

  const getAllProducts = async () => {
    try {
      setLoading(true)
      const response = await axios.get(
        `${BASEURL}/products?page=${pageAll}&limit=${limitAll}`
      )
      setLoading(false)
      if (response) {
        setAllProducts(response.data.products)
        setPagesCountAll(response.data.totalPages)
      }
    } catch (error) {
      setLoading(false)
      console.log(error)
    }
  }
  const truncateText = (text, limit) => {
    return text.length > limit ? text.slice(0, limit) + '...' : text
  }

  const navigateToProduct = id => {
    navigation('/perticularproductpage', { state: { productId: id } })
    window.scroll(0, 0)
  }
  const navigateToShop = () => {
    window.scroll(0, 0)
    navigation('/shop')
  }
  const handlePageChange = (event, value) => {
    setPageAll(value)
  }

  const renderPaginationCount = () => {
    return pagesCountAll
  }

  const discountAmount = (price, rate) => {
    const amount = (price * rate) / 100
    const originalPrice = price + amount
    return originalPrice
  }
  useEffect(() => {
    getAllProducts()
  }, [pageAll, limitAll])
  return (
    <>
      {loading ? <Loader /> : ''}
      <div>
        <Container className='main-container'>
          <div
            data-aos='fade-down'
            data-aos-duration='2000'
            data-aos-easing='ease-in-out'
            className='section-title mb-3'
          >
            <div className='section-line'></div>
            <div className='text-center'>
              <h5>All Product Shop</h5>
              <h1>Featured Products</h1>
            </div>
            <div className='section-line'></div>
          </div>
          {/* <div className="header">
            <Nav variant="tabs" activeKey="allProducts">
              <Nav.Item>
                <Nav.Link eventKey="allProducts">All Products</Nav.Link>
              </Nav.Item>
            </Nav>
            <div>
              <input
                type="search"
                placeholder="Search for any delicious product"
              />
            </div>
          </div> */}
          <Row className=''>
            {allProducts && allProducts?.length > 0 ? (
              allProducts.map(product => (
                <Col
                  lg={3}
                  md={6}
                  sm={12}
                  key={product._id}
                  className='mb-5 d-flex justify-content-center'
                >
                  <Card className='costume-product-card'>
                    <div className='product-image-container'>
                      <Card.Img
                        variant='top'
                        src={ImageUrl + product.image}
                        alt='Product Image'
                        className='particular-product-image'
                      />
                      <FaHeart className='heart-icon' />
                      {inCartStatus[product._id] && (
                        <Badge className='added-to-cart-badge' bg='success'>
                          Added to cart
                        </Badge>
                      )}
                    </div>
                    <Card.Body>

                      <Card.Title className='product-title'>
                        {product.name}
                      </Card.Title>
                      <Card.Text className='product-description'>
                        {truncateText(product.description, 100)}
                      </Card.Text>
                      <div className='price-section'>
                        <div>
                          <span className='price'>₹{product.price}.00</span>
                          <span className='original-price'>
                            ₹{discountAmount(product.price, 23)}
                          </span>
                        </div>
                        <div>
                          <span className='discount'>23% Off</span>
                        </div>
                      </div>
                      {product.sizes && product.sizes.length > 0 && (
                        <div className='size-section mb-2 mt-2'>
                          {product.sizes.map(size => (
                            <span
                              className={`size-badge ${selectedSizes[product._id] === size.size
                                  ? 'selected'
                                  : ''
                                }`}
                              key={size._id}
                              onClick={() =>
                                setSelectedSizes(prev => ({
                                  ...prev,
                                  [product._id]: size.size
                                }))
                              }
                            >
                              {size.size}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className='button-section'>
                        <Button
                          variant='outline-dark'
                          className='view-more-btn'
                          onClick={() => navigateToProduct(product._id)}
                        >
                          View More
                        </Button>
                        <Button
                          className='add-to-cart-btn'
                          onClick={() => handleAddToCart(product)}
                        >
                          Add to cart
                        </Button>
                        {/* {!inCart ? (
                        <Button className="add-to-cart-btn" onClick={addToCart}>
                          Add to cart
                        </Button>
                      ) : (
                        <div className="quantity-controls">
                          <Button
                            variant="outline-secondary"
                            onClick={decreaseQuantity}
                          >
                            -
                          </Button>
                          <span className="quantity">{quantity}</span>
                          <Button
                            variant="outline-secondary"
                            onClick={increaseQuantity}
                          >
                            +
                          </Button>
                        </div>
                      )} */}
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            ) : (
              <div className='text-center mb-5'>
                <h4>No Data Found</h4>
              </div>
            )}
            <div className='text-center mb-3'>
              <Stack spacing={2}>
                <Pagination
                  count={pagesCountAll} // Total number of pages
                  page={pageAll} // Current page
                  variant='outlined'
                  shape='rounded'
                  onChange={handlePageChange} // Handle page change
                />
              </Stack>
            </div>
            <div className='text-center mb-3 mt-2'>
              <Button className='button' onClick={() => navigateToShop()}>
                Show All
              </Button>
            </div>
          </Row>
        </Container>
      </div>
    </>
  )
}

export default ProductCard
