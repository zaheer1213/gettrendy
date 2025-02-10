import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import "./Services.css";
import { FaRupeeSign, FaTruck } from "react-icons/fa";
import { BsFillTelephoneInboundFill } from "react-icons/bs";
import { RiSecurePaymentFill } from "react-icons/ri";

const Services = () => {
  return (
    <>
      <Container className="Services-Container">
        <Row className="service-row">
          <Col className="margin-btm">
            <div className="service-colum">
              <div>
                <span>
                  {" "}
                  <FaTruck className="icon service-icon" />
                </span>
              </div>
              <div>
                <strong>Flexible Delivery</strong>
              </div>
            </div>
          </Col>
          <Col className="margin-btm">
            <div className="service-colum">
              <div>
                <span>
                  {" "}
                  <FaRupeeSign className="icon service-icon" />
                </span>
              </div>
              <div>
                <strong>100% Money Back </strong>
              </div>
            </div>
          </Col>
          <Col className="margin-btm">
            <div className="service-colum">
              <div>
                <span>
                  {" "}
                  <RiSecurePaymentFill className="icon service-icon" />
                </span>
              </div>
              <div>
                <strong>Secure Payments</strong>
              </div>
            </div>
          </Col>
          <Col className="margin-btm">
            <div className="service-colum">
              <div>
                <span>
                  {" "}
                  <BsFillTelephoneInboundFill className="icon service-icon" />
                </span>
              </div>
              <div>
                <strong>24 Hours Support</strong>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Services;
