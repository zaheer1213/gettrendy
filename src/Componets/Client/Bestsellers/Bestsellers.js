import React, { useEffect, useState } from "react";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import {
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBCardImage,
  MDBBtn,
} from "mdb-react-ui-kit";
import "./Bestsellers.css";
import { FaCartPlus, FaEye, FaRegHeart, FaShoppingCart } from "react-icons/fa";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASEURL } from "../Comman/CommanConstans";
import Loader from "../Loader/Loader";
import { useAuth } from "../../AuthContext/AuthContext";
import { useCart } from "../../CartContext/CartContext";

const Bestsellers = () => {
  const { userToken } = useAuth();
  const { addToCart } = useCart();
  const [pageAll, setPageAll] = useState(1);
  const [limitAll, setLimitAll] = useState(3);
  const [allProducts, setAllProducts] = useState([]);
  const [pagesCountAll, setPagesCountAll] = useState(1);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/shop");
    window.scroll(0, 0);
  };
  const getAllProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${BASEURL}/customers/products?page=${pageAll}&limit=${limitAll}`
      );
      setLoading(false);
      if (response) {
        setAllProducts(response.data.rows);
        setPagesCountAll(response.data.pages_count);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };
  const truncateText = (text, limit) => {
    return text.length > limit ? text.slice(0, limit) + "..." : text;
  };
  const navigateToProduct = (id) => {
    navigate("/perticularproductpage", { state: { productId: id } });
    window.scroll(0, 0);
  };
  const handleAddToCart = (product) => {
    if (userToken) {
      addToCart(product, 1);
    } else {
      navigate("/login");
      window.scroll(0, 0);
    }
  };
  const renderPaginationCount = () => {
    return pagesCountAll;
  };
  const handlePageChange = (event, value) => {
    setPageAll(value);
    getAllProducts();
  };
  useEffect(() => {
    getAllProducts();
  }, [pageAll]);
  return (
    <>
      {loading ? <Loader /> : ""}
      <Container className="Bestsellers-container">
        <Row>
          <div
            data-aos="fade-down"
            data-aos-duration="2000"
            data-aos-easing="ease-in-out"
            className="section-title mb-5"
          >
            <div className="section-line"></div>
            <div className="text-center">
              <h5>More to Discover</h5>
              <h1>Bestsellers of the week</h1>
            </div>

            <div className="section-line"></div>
          </div>
          <Col md={4}>
            <div className="promo-banner">
              <h4>Weekend Sales</h4>
              <h2>Unlock Up to 26% Off on Premium Products!</h2>
              <button
                className="btn mt-3"
                style={{ background: "#E9272D", color: "white" }}
                onClick={() => handleNavigate()}
              >
                Shop Now
              </button>{" "}
              <br />
              <img
                src="/Images/teshirt6.png"
                alt="Vegetable Bag"
                className="img-fluid mt-3"
              />
            </div>
          </Col>
          <Col md={8}>
            <div>
              <Row>
                {allProducts && allProducts?.length > 0 ? (
                  allProducts.map((product) => (
                    <Col
                      lg={4}
                      md={6}
                      sm={12}
                      key={product.id}
                      className="mb-5"
                    >
                      <Card className=" ">
                        <div className="product-image-container">
                          <Card.Img
                            variant="top"
                            src={BASEURL + product.product_image}
                            alt="Product Image"
                            className="particular-product-image"
                          />
                        </div>
                        <Card.Body>
                          <Card.Title className="product-title">
                            {product.product_name}
                          </Card.Title>
                          <Card.Text className="product-description">
                            {truncateText(product.description, 100)}
                          </Card.Text>
                          <div className="button-section text-center">
                            <Button
                              variant="outline-dark"
                              className="view-more-btn"
                              onClick={() => navigateToProduct(product.id)}
                            >
                              View More
                            </Button>
                            <Button
                              className="add-to-cart-btn"
                              onClick={() => handleAddToCart(product)}
                            >
                              Add To Cart
                            </Button>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))
                ) : (
                  <div className="text-center mb-5">
                    <h4>No Data Found</h4>
                  </div>
                )}
              </Row>
            </div>
            <div className="display-start mb-5">
              <Stack spacing={2}>
                <Pagination
                  count={renderPaginationCount()}
                  page={pageAll}
                  variant="outlined"
                  shape="rounded"
                  onChange={handlePageChange}
                />
              </Stack>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Bestsellers;
