import React, { useEffect, useState } from "react";
import { FaShoppingCart, FaRegHeart, FaEye } from "react-icons/fa";
import "./AllProducts.css";
import { Row, Col, Nav, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASEURL } from "../Comman/CommanConstans";
import { Pagination, Stack } from "@mui/material";
import Loader from "../Loader/Loader";
import { useAuth } from "../../AuthContext/AuthContext";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useCart } from "../../CartContext/CartContext";
import { faUtensils, faWeightHanging } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const AllProducts = () => {
  const { userToken } = useAuth();
  const { addToCart } = useCart();
  const navigation = useNavigate();
  const [allProducts, setAllProducts] = useState([]);
  const [chickenProducts, setChickenProducts] = useState([]);
  const [muttonProducts, setMuttonProducts] = useState([]);
  const [seafoodProducts, setSeafoodProducts] = useState([]);

  const [pageAll, setPageAll] = useState(1);
  const [pageChicken, setPageChicken] = useState(1);
  const [pageMutton, setPageMutton] = useState(1);
  const [pageSeafood, setPageSeafood] = useState(1);

  const [limitAll, setLimitAll] = useState(8);
  const [limitChicken, setLimitChicken] = useState(8);
  const [limitMutton, setLimitMutton] = useState(8);
  const [limitSeafood, setLimitSeafood] = useState(8);

  const [pagesCountAll, setPagesCountAll] = useState(1);
  const [pagesCountChicken, setPagesCountChicken] = useState(1);
  const [pagesCountMutton, setPagesCountMutton] = useState(1);
  const [pagesCountSeafood, setPagesCountSeafood] = useState(1);
  const [allCategories, setAllCategories] = useState([]);

  const [loading, setLoading] = useState(false);

  const [activeTab, setActiveTab] = useState("allProducts");

  const filteredProducts =
    activeTab === "allProducts"
      ? allProducts
      : allProducts.filter(
          (product) => product.sub_category_name === activeTab
        );

  const navigateToShop = () => {
    window.scroll(0, 0);
    navigation("/shop");
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
        setPagesCountAll(response.data.pages_count); // Set pagination for all products
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const getChickenProducts = async (id) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${BASEURL}/customers/all-products?page=${pageChicken}&limit=${limitChicken}&sub_category=${id}`
      );
      setLoading(false);
      if (response) {
        setChickenProducts(response.data.rows);
        setPagesCountChicken(response.data.pages_count);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const getMuttonProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${BASEURL}/customers/all-products?page=${pageMutton}&limit=${limitMutton}&sub_category=819322ba-f5a3-489b-856f-44bc65ad7013`
      );
      setLoading(false);
      if (response) {
        setMuttonProducts(response.data.rows);
        setPagesCountMutton(response.data.pages_count); // Set pagination for mutton products
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const getSeafoodProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${BASEURL}/customers/all-products?page=${pageSeafood}&limit=${limitSeafood}&sub_category=27019ee6-c0b2-4a2c-9382-0e7c8061063a`
      );
      setLoading(false);
      if (response) {
        setSeafoodProducts(response.data.rows);
        setPagesCountSeafood(response.data.pages_count); // Set pagination for seafood products
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const handlePageChange = (event, value) => {
    if (activeTab === "allProducts") {
      setPageAll(value);
      getAllProducts();
    } else {
      setPageAll(value); // Update the page number for the current sub-category
      getProductsBySubCategory(activeTab); // Fetch products for the active sub-category
    }
  };

  const handleTabSelect = (name, id) => {
    setActiveTab(name);

    if (name === "allProducts") {
      getAllProducts();
    } else {
      getProductsBySubCategory(id);
    }
  };

  const getProductsBySubCategory = async (id) => {
    try {
      setLoading(true);
      console.log(id);
      const response = await axios.get(
        `${BASEURL}/customers/all-products?page=${pageAll}&limit=${limitAll}&sub_category=${id}`
      );
      setLoading(false);
      if (response) {
        setAllProducts(response.data.rows); // Assuming you want to show products in the same state
        setPageAll(response.data.pages_count); // Update pagination count
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const renderPaginationCount = () => {
    if (activeTab === "allProducts") {
      return pagesCountAll;
    } else if (activeTab === "Chicken") {
      return pagesCountChicken;
    } else if (activeTab === "Mutton") {
      return pagesCountMutton;
    } else if (activeTab === "SeeFood") {
      return pagesCountSeafood;
    }
  };

  const getAllCategories = async () => {
    try {
      const response = await axios.get(
        `${BASEURL}/customers/sub-category?page=1&limit=50`
      );
      if (response) {
        setAllCategories(response.data.rows);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  const navigateToProduct = (id) => {
    navigation("/perticularproductpage", { state: { productId: id } });
    window.scroll(0, 0);
  };

  const handleAddToCart = (product) => {
    if (userToken) {
      addToCart(product, 1);
    } else {
      navigation("/login");
      window.scroll(0, 0);
    }
  };

  useEffect(() => {
    if (activeTab === "allProducts") {
      getAllProducts();
    } else if (activeTab === "Chicken") {
      // getChickenProducts();
    } else if (activeTab === "Mutton") {
      getMuttonProducts();
    } else if (activeTab === "SeeFood") {
      getSeafoodProducts();
    }
    getAllCategories();
  }, [pageAll, pageChicken, pageMutton, pageSeafood, activeTab]);
  return (
    <>
      {loading ? <Loader /> : ""}
      <div className="product-container">
        <div
          data-aos="fade-down"
          data-aos-duration="2000"
          data-aos-easing="ease-in-out"
          className="section-title"
        >
          <div className="section-line"></div>
          <div className="text-center">
            <h5>All Product Shop</h5>
            <h1>Featured Products</h1>
          </div>

          <div className="section-line"></div>
        </div>
        <div className="header">
          <Nav variant="tabs" activeKey={activeTab}>
            <Nav.Item>
              <Nav.Link
                onClick={() => handleTabSelect("allProducts", null)}
                eventKey="allProducts"
              >
                All Products
              </Nav.Link>
            </Nav.Item>
            {/* {allCategories &&
            allCategories.map((row) => (
                <Nav.Item key={row.id}>
                    <Nav.Link
                        onClick={() => handleTabSelect(row.name, row.id)}
                        eventKey={row.name} // Set eventKey to category name
                    >
                        {row.name}
                    </Nav.Link>
                </Nav.Item>
            ))} */}
          </Nav>
          <div>
            <input
              type="search"
              placeholder="Search for any delicious product"
            />
          </div>
        </div>

        <Row className="product-cards">
          {allProducts && allProducts?.length > 0 ? (
            allProducts.map((product) => (
              <Col lg={3} md={6} sm={12} key={product.id} className="mb-5">
                <div className="card">
                  <div
                    className="image-container"
                    onClick={() => navigateToProduct(product.id)}
                  >
                    <img
                      src={BASEURL + product.product_image}
                      alt={product.product_name}
                    />
                  </div>
                  <div
                    className="card-info mb-3"
                    onClick={() => navigateToProduct(product.id)}
                  >
                    <h5 className="mb-3">{product.product_name}</h5>
                    <div className="mb-3">
                      {product.no_of_pices ? (
                        <span>
                          <FontAwesomeIcon icon={faUtensils} /> &nbsp;
                          {product.no_of_pices} Pieces
                        </span>
                      ) : (
                        ""
                      )}{" "}
                      &nbsp;&nbsp;
                      {product.weight ? (
                        <span>
                          <FontAwesomeIcon icon={faWeightHanging} /> &nbsp;
                          {product.weight} g
                        </span>
                      ) : (
                        ""
                      )}
                    </div>

                    <p style={{ fontWeight: "bold" }}>₹{product.price}</p>
                  </div>
                  <div className="card-icons">
                    <FaShoppingCart
                      className="icon"
                      onClick={() => handleAddToCart(product)}
                      title="Add To Cart"
                    />
                    <FaRegHeart className="icon" title="Add To Wishlist" />
                    <FaEye
                      className="icon"
                      title="Quick View"
                      onClick={() => navigateToProduct(product.id)}
                    />
                  </div>
                </div>
              </Col>
            ))
          ) : (
            <div className="text-center mb-5">
              <h4>No Data Found</h4>
            </div>
          )}

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
          <div className="text-center">
            <Button className="button" onClick={() => navigateToShop()}>
              Shop Now
            </Button>
          </div>
        </Row>
      </div>
      <ToastContainer
        position="top-center"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
    </>
  );
};

export default AllProducts;
