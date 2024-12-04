import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { BASEURL } from "../../Client/Comman/CommanConstans";
import { useAuth } from "../../AuthContext/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import Loader from "../../Client/Loader/Loader";

const AddMainCategory = () => {
  const { userToken } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    categoryname: "",
    categoryimage: null,
    description: "",
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [categoryId, setCategoryId] = useState(null);
  const [originalData, setOriginalData] = useState({
    categoryname: "",
    categoryimage: null,
    description: "",
  });
  const [Category, setALLCategory] = useState([]);
  const [loading, setLoading] = useState(false);
  const handleBack = () => {
    window.history.back();
  };

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
    if (!formData.categoryname)
      errors.categoryname = "Category name is required";
    if (!categoryId) {
      if (!formData.categoryimage)
        errors.categoryimage = "Category image is required";
    }
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
    if (categoryId) {
      const formDataToSend = new FormData();
      if (originalData.categoryname !== formData.categoryname) {
        formDataToSend.append("category_name", formData.categoryname);
      }
      if (originalData.categoryimage !== formData.categoryimage) {
        formDataToSend.append("category_image", formData.categoryimage);
      }
      if (originalData.description !== formData.description) {
        formDataToSend.append("category_description", formData.description);
      }

      try {
        const response = await axios.put(
          `${BASEURL}/kgn-admin/category/${categoryId}`,
          formDataToSend,
          {
            headers: {
              "x-access-token": userToken,
            },
          }
        );
        if (response.data) {
          navigate("/admin-allcategory");
        }
        setMessage("Category added successfully");
      } catch (error) {
        setMessage("Failed to add product");
        console.error(error);
      }
    } else {
      const formDataToSend = new FormData();
      formDataToSend.append("category_name", formData.categoryname);
      formDataToSend.append("category_image", formData.categoryimage);
      formDataToSend.append("category_description", formData.description);

      try {
        const response = await axios.post(
          `${BASEURL}/kgn-admin/category`,
          formDataToSend,
          {
            headers: {
              "x-access-token": userToken,
            },
          }
        );
        if (response.data) {
          navigate("/admin-allcategory");
        }
        setMessage("Category added successfully");
      } catch (error) {
        setMessage("Failed to add Category");
        console.error(error);
      }
    }
  };

  const getCategoryById = async (id) => {
    try {
      const headers = {
        "x-access-token": userToken,
      };
      setLoading(true);
      const response = await axios.get(`${BASEURL}/kgn-admin/category/${id}`, {
        headers,
      });
      if (response) {
        setLoading(false);
        const data = response.data.data;
        setFormData({
          categoryname: data.category_name,
          description: data.category_description,
        });
        setSelectedImage(BASEURL + data.category_image);
        setOriginalData({
          categoryname: data.name,
          description: data.category_description,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    const categoryId = location?.state?.mainCategoryId;
    if (categoryId) {
      getCategoryById(categoryId);
      setCategoryId(categoryId);
    }
  }, []);
  return (
    <>
      {loading ? <Loader /> : ""}
      <Container className="bg-filler">
        <Row className="py-3">
          <Row className="">
            <div className="text-start">
              <FontAwesomeIcon
                icon={faArrowLeft}
                className="backicon pointer mb-3"
                onClick={handleBack}
              />
            </div>
            <h1 className="mb-3">{categoryId ? "Edit" : "Add"} Category</h1>
            {message && <div className="alert alert-info">{message}</div>}
          </Row>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formProductName">
                  <Form.Label>Category name</Form.Label>
                  <Form.Control
                    type="text"
                    name="categoryname"
                    placeholder="Enter category name"
                    value={formData.categoryname}
                    onChange={handleInputChange}
                    isInvalid={!!errors.categoryname}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.categoryname}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Row>
                  <Col lg={8}>
                    <Form.Group className="mb-3" controlId="formProductImage">
                      <Form.Label>Category image</Form.Label>
                      <Form.Control
                        type="file"
                        name="categoryimage"
                        onChange={handleInputChange}
                        isInvalid={!!errors.categoryimage}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.categoryimage}
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
                {categoryId ? "Edit" : "Add"} Category
              </Button>
            </div>
          </Form>
        </Row>
      </Container>
    </>
  );
};

export default AddMainCategory;
