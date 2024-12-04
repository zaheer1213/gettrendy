import React from "react";
import { Container, Row, Col, Button, Table } from "react-bootstrap";
import "./CartPage.css";
import Footer from "../Footer/Footer";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../CartContext/CartContext"; // Use the cart context
import { BASEURL } from "../Comman/CommanConstans";

const CartPage = () => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateCartQuantity, loading } = useCart(); // Use the updated context

  // Calculate subtotal
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.product_price * item.quantity,
    0
  );

  const handleSubmit = () => {
    navigate("/checkout");
  };

  return (
    <>
      <Container className="cart-page">
        <h2>Shopping Cart</h2>
        <p>Home • Cart</p>

        {loading ? (
          <p>Loading cart items...</p>
        ) : cartItems.length === 0 ? (
          <p>Your cart is empty</p>
        ) : (
          <Row>
            <Col md={8}>
              <div
                style={{ maxHeight: "500px", overflowY: "auto", width: "100%" }}
              >
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Price</th>
                      <th>Quantity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <Row>
                            <Col md={4}>
                              <img
                                src={BASEURL + item.product_image}
                                alt={item.name}
                                style={{ width: "100px" }}
                              />
                            </Col>
                            <Col md={8}>
                              <p>{item.product_name}</p>
                            </Col>
                          </Row>
                        </td>
                        <td>₹{item.product_price}</td>
                        <td>
                          <div className="d-flex align-items-center">
                            {/* Decrease quantity */}
                            <Button
                              style={{ background: "#E9272D" }}
                              onClick={() =>
                                updateCartQuantity(item, item.quantity - 1)
                              }
                              disabled={item.quantity <= 1}
                            >
                              -
                            </Button>
                            <span className="px-3">{item.quantity}</span>
                            {/* Increase quantity */}
                            <Button
                              style={{ background: "#E9272D" }}
                              onClick={() =>
                                updateCartQuantity(item, item.quantity + 1)
                              }
                            >
                              +
                            </Button>
                            {/* Remove item */}
                            <Button
                              variant="link"
                              onClick={() => removeFromCart(item.id)}
                              className="ml-2"
                            >
                              Remove
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>

              <Button variant="outline-danger" className="mt-3">
                Clear Cart
              </Button>
            </Col>

            <Col md={4}>
              <div className="subtotal-section p-3 shadow-sm">
                <h5>Subtotal</h5>
                <p>₹{subtotal.toFixed(2)}</p>
                <h5>Total</h5>
                <p>₹{subtotal.toFixed(2)}</p>
                <Button
                  style={{ background: "#E9272D" }}
                  className="mt-3"
                  block
                  onClick={handleSubmit}
                >
                  Proceed to Checkout
                </Button>
              </div>
            </Col>
          </Row>
        )}
      </Container>
      <Footer />
    </>
  );
};

export default CartPage;
