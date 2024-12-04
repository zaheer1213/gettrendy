import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { BASEURL } from "../../Client/Comman/CommanConstans";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../AuthContext/AuthContext";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../../Client/Loader/Loader";

const AddProduct = () => {
  const { userToken } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [subCategory, setSubCategory] = useState();
  const [selectedImage, setSelectedImage] = useState(null);
  const [productId, setProductId] = useState(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    productName: "",
    subCategory: "",
    productImage: null,
    price: "",
    description: "",
    stock: "",
    count: 0,
    weight: "",
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [originalData, setOriginalData] = useState({
    productName: "",
    subCategory: "",
    price: "",
    description: "",
    count: 0,
    weight: "",
  });

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: files ? files[0] : value, // Handle file input
    }));
    if (files) {
      const file = e?.target?.files[0];
      setSelectedImage(URL.createObjectURL(file));
    }
  };

  const validate = () => {
    let errors = {};
    if (!formData.productName) errors.productName = "Product name is required";
    if (!formData.subCategory) errors.subCategory = "Sub category is required";
    if (!productId) {
      if (!formData.productImage)
        errors.productImage = "Product image is required";
    }

    if (!formData.price) errors.price = "Price is required";
    if (!formData.description) errors.description = "Description is required";
    setErrors(errors);
    return Object.keys(errors).length === 0; // Returns true if no errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      setMessage("Please fill out all fields");
      return;
    }
    if (productId) {
      const formDataToSend = new FormData();
      if (originalData.productName !== formData.productName) {
        formDataToSend.append("product_name", formData.productName);
      }
      if (originalData.subCategory !== formData.subCategory) {
        formDataToSend.append("sub_category", formData.subCategory);
      }
      if (originalData.productImage !== formData.productImage) {
        formDataToSend.append("product_image", formData.productImage);
      }
      if (originalData.price !== formData.price) {
        formDataToSend.append("price", formData.price);
      }
      if (originalData.description !== formData.description) {
        formDataToSend.append("description", formData.description);
      }
      if (formData.productImage) {
        formDataToSend.append("product_image", formData.productImage);
      }
      if (formData.count !== originalData.count) {
        formDataToSend.append("no_of_pices", formData.count);
      }
      if (originalData.weight !== formData.weight) {
        formDataToSend.append("weight", formData.weight);
      }
      try {
        const response = await axios.put(
          `${BASEURL}/customers/products/${productId}`,
          formDataToSend,
          {
            headers: {
              "x-access-token": userToken,
            },
          }
        );
        if (response.data) {
          navigate("/admin-allproducts");
        }
        setMessage("Product added successfully");
      } catch (error) {
        setMessage("Failed to add product");
        console.error(error);
      }
    } else {
      const formDataToSend = new FormData();
      formDataToSend.append("product_name", formData.productName);
      formDataToSend.append("sub_category", formData.subCategory);
      formDataToSend.append("product_image", formData.productImage);
      formDataToSend.append("price", formData.price);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("no_of_pices", formData.count);
      formDataToSend.append("weight", formData.weight);

      try {
        const response = await axios.post(
          `${BASEURL}/customers/products`,
          formDataToSend,
          {
            headers: {
              "x-access-token": userToken,
            },
          }
        );
        if (response.data) {
          navigate("/admin-allproducts");
        }
        setMessage("Product added successfully");
      } catch (error) {
        const errorMessage =
          error?.response?.data?.message &&
          Array.isArray(error.response.data.message)
            ? error.response.data.message[0]
            : "Something went wrong";

        toast.error(errorMessage);

        setMessage("Failed to add product");
        console.error(error);
      }
    }
  };
  const getAllSubCategory = async () => {
    try {
      const response = await axios.get(
        `${BASEURL}/customers/sub-category?page=1&limit=50`
      );
      if (response) {
        setSubCategory(response.data.rows);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleBack = () => {
    window.history.back();
  };

  const getProductById = async (id) => {
    try {
      const headers = {
        "x-access-token": userToken,
      };
      setLoading(true);
      const response = await axios.get(`${BASEURL}/kgn-admin/products/${id}`, {
        headers,
      });
      if (response) {
        setLoading(false);
        const data = response.data.data;
        setFormData({
          productName: data.product_name,
          subCategory: data.sub_category,
          price: data.price,
          description: data.description,
          weight: data.weight,
          count: data.no_of_pices,
        });
        setSelectedImage(BASEURL + data.product_image);
        setOriginalData({
          productName: data.product_name,
          subCategory: data.sub_category,
          price: data.price,
          description: data.description,
          weight: data.weight,
          count: data.no_of_pices,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    const product_id = location?.state?.productId;
    setProductId(product_id);

    if (product_id) {
      getProductById(product_id);
    }
    getAllSubCategory();
  }, [productId]);
  return (
    <>
      {loading ? <Loader /> : ""}
      <Container className="py-5">
        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          transition={Bounce}
        />
        <Row>
          <div className="text-start">
            <FontAwesomeIcon
              icon={faArrowLeft}
              className="backicon pointer mb-3"
              onClick={handleBack}
            />
          </div>
          <h1 className="mb-3">{productId ? "Edit" : "Add"} Product</h1>
          {message && <div className="alert alert-info">{message}</div>}
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formProductName">
                  <Form.Label>Product name</Form.Label>
                  <Form.Control
                    type="text"
                    name="productName"
                    placeholder="Enter product name"
                    value={formData.productName}
                    onChange={handleInputChange}
                    isInvalid={!!errors.productName}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.productName}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3" controlId="formSubCategory">
                  <Form.Label>Sub category</Form.Label>
                  <Form.Select
                    name="subCategory"
                    value={formData.subCategory}
                    onChange={handleInputChange}
                    isInvalid={!!errors.subCategory}
                  >
                    <option value="">Select a subcategory</option>
                    {subCategory &&
                      subCategory.map((row) => (
                        <option value={row.id} key={row.id}>
                          {row.name}
                        </option>
                      ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.subCategory}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formPrice">
                  <Form.Label>Price</Form.Label>
                  <Form.Control
                    type="number"
                    name="price"
                    placeholder="Enter product price"
                    value={formData.price}
                    onChange={handleInputChange}
                    isInvalid={!!errors.price}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.price}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Row>
                  <Col lg={8}>
                    <Form.Group className="mb-3" controlId="formProductImage">
                      <Form.Label>Product image</Form.Label>
                      <Form.Control
                        type="file"
                        name="productImage"
                        onChange={handleInputChange}
                        isInvalid={!!errors.productImage}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.productImage}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col lg={4}>
                    {selectedImage && (
                      <div className="mt-3">
                        <img
                          src={selectedImage}
                          alt="Selected Preview"
                          style={{
                            width: "100%",
                            maxHeight: "100px",
                            objectFit: "contain",
                          }}
                        />
                      </div>
                    )}
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formProductName">
                  <Form.Label>Product Count / Pice</Form.Label>
                  <Form.Control
                    type="text"
                    name="count"
                    placeholder="Enter product count"
                    value={formData.count}
                    onChange={handleInputChange}
                    isInvalid={!!errors.count}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.count}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formProductName">
                  <Form.Label>Product Weight</Form.Label>
                  <Form.Control
                    type="text"
                    name="weight"
                    placeholder="Ex 500gm / 1Kg"
                    value={formData.weight}
                    onChange={handleInputChange}
                    isInvalid={!!errors.weight}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.weight}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formDescription">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    isInvalid={!!errors.description}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.description}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <div className="mt-3">
              <Button className="button" type="submit">
                {productId ? "Edit" : "Add"}
              </Button>
            </div>
          </Form>
        </Row>
      </Container>
    </>
  );
};

export default AddProduct;
