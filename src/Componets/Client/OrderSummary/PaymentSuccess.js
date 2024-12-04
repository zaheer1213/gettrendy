import moment from "moment/moment";
import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";

function PaymentSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const [orderNumber, setOrderNumber] = useState(0);

  useEffect(() => {
    const orderNumber = location?.state?.orderNumber;
    setOrderNumber(orderNumber);
  }, []);
  return (
    <Container className="my-5 text-center">
      <Row className="justify-content-center">
        <Col md={8}>
          <div className="box-shadow p-5 bg-white">
            <i className="fas fa-check-circle fa-3x text-success mb-3"></i>
            <h2 className="mb-4" style={{fontWeight:"bold"}}>Thank You for Your Order!</h2>

            <p>
              Your order has been placed successfully and will be processed
              shortly.
            </p>

            <h4 className="mt-4">Order Number: {orderNumber}</h4>
            <p>
              Payment Method: <strong>Cash on Delivery</strong>
            </p>
            <p>Order Date: {moment(new Date()).format("DD-MM-YYYY")}</p>

            <div className="mt-5">
              <Button
                onClick={() => navigate("/myOrders")}
                className="btn btn-danger mx-2"
              >
                View Order
              </Button>
              <Button
                onClick={() => navigate("/shop")}
                className="btn btn-outline-primary mx-2"
              >
                Continue Shopping
              </Button>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default PaymentSuccess;
