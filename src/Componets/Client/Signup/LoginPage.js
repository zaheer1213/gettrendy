import React, { useState } from "react";
import { Button, Container, Row, Col, Modal } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import "./LoginPage.css";
import { faEnvelope, faEye, faPhone } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import Loader from "../Loader/Loader";
import { BASEURL } from "../Comman/CommanConstans";
import { useAuth } from "../../AuthContext/AuthContext";
import Footer from "../Footer/Footer";
import OtpInput from "react-otp-input";

const Login = () => {
  const { login } = useAuth();
  const [phone, setPhone] = useState();
  const [password, setPassword] = useState(null);
  const [errors, setErrors] = useState({});
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [type, setType] = useState("password");

  const navigate = useNavigate();

  const handleClose = () => setShow(false);

  const handleClose1 = () => {
    setShow(false);
  };
  const handleShow = () => setShow(true);

  const validateForm = () => {
    let valid = true;
    const newErrors = {};

    // Regular expression to check if the input is exactly 10 digits
    const phoneRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!phone) {
      newErrors.phone = "email address is required";
      valid = false;
    } else if (!phoneRegex.test(phone)) {
      newErrors.phone = "enter valid email address";
      valid = false;
    }

    if (!password) {
      newErrors.password = "password is required";
    }
    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    if (validateForm()) {
      setLoading(true);

      const payload = {
        email: phone,
        password: password,
      };
      try {
        const response = await axios.post(
          BASEURL + "/accounts/user-login/nt/",
          payload
        );
        if (response) {
          if (response.data.error == false) {
            const token = response?.data?.token;
            const userRole = response?.data?.data?.user_role;
            login(token, userRole);
            if (userRole === "Store_admin") {
              navigate("/admin-allcategory");
            } else {
              navigate("/");
            }
            setLoading(false);
            setError(false);
          }
        } else {
          setLoading(false);
          setMessage(response?.data?.message);
          handleShow();
        }
      } catch (error) {
        setError(true);
        setLoading(false);
        setMessage(error?.response?.data?.message || "Something went wrong.");
        handleShow();
      }
    }
  };
  const navigateToRegister = () => {
    navigate("/register");
    window.scroll(0, 0);
  };
  return (
    <>
      {loading ? <Loader /> : ""}
      <Container
        fluid
        className="d-flex align-items-center justify-content-center login-container"
      >
        <Container fluid>
          <Row className="vh-100">
            <Col
              className="d-flex flex-column align-items-center justify-content-center login-image-col"
              style={{
                backgroundColor: "#FFFFFF",
                position: "relative",
              }}
            >
              <div className="login-form-container">
                <h1 className="mb-3 text-center loginheding">Welcome back!</h1>
                <p className="text-center">
                  Already have an account? Sign in here!
                </p>

                <form>
                  <div className="buttomsapcec">
                    <label htmlFor="email" className="title-heading">
                      Email Address
                    </label>
                    <div className="input-group">
                      <input
                        type="email"
                        id="phone"
                        placeholder="Enter your Email Address"
                        className="custom-input"
                        onChange={(e) => setPhone(e.target.value)}
                      />
                      <FontAwesomeIcon
                        icon={faEnvelope}
                        className="input-icon"
                      />
                    </div>
                    {errors && <p className="text-danger">{errors.phone}</p>}
                  </div>
                  <div className="buttomsapcec">
                    <label htmlFor="email" className="title-heading">
                      Password
                    </label>
                    <div className="input-group">
                      <input
                        type={type}
                        id="password"
                        placeholder="********"
                        className="custom-input"
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                      />
                      <FontAwesomeIcon
                        icon={faEye}
                        className="input-icon"
                        onClick={() => setType("text")}
                      />
                    </div>
                    {errors && <p className="text-danger">{errors.password}</p>}
                  </div>
                </form>
                <div className="d-flex align-items-center justify-content-center">
                  <Button
                    className="cutomebutton"
                    onClick={() => handleSubmit()}
                  >
                    Sign In
                  </Button>
                </div>
                <div className="d-flex justify-content-center align-items-center mt-3">
                  <NavLink to="/register" onClick={() => navigateToRegister()}>
                    <p>
                      Not a member?{" "}
                      <span className="create-account pointer">
                        Create an account.
                      </span>
                    </p>
                  </NavLink>
                </div>
              </div>

              {/* Image container */}
              <div className="login-img">
                <img src="/Images/Login_img.png" alt="Login" />
              </div>
            </Col>
          </Row>
        </Container>
      </Container>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Alert</Modal.Title>
        </Modal.Header>
        <Modal.Body>{message}</Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={error ? handleClose : handleClose1}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <Footer />
    </>
  );
};

export default Login;
