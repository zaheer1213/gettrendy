import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useAuth } from "../AuthContext/AuthContext";
import { BASEURL } from "../Client/Comman/CommanConstans";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { userToken } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [cartQuantity, setCartQuantity] = useState(0); // Total number of items in cart
  const [loading, setLoading] = useState(false);

  // Fetch Cart Items (GET request)
  const fetchCartItems = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${BASEURL}/orders/cart-item?page=1&limit=50`,
        {
          headers: {
            "x-access-token": userToken,
          },
        }
      );
      if (response.data) {
        setCartItems(response.data.rows);
        setCartQuantity(response.data.count);
      }
    } catch (error) {
      console.error("Failed to fetch cart items:", error);
      // toast.error("Failed to fetch cart items");
    } finally {
      setLoading(false);
    }
  };

  // Add item to cart (POST request)
  const addToCart = async (product, quantity) => {
    try {
      const payload = {
        product: product.id,
        quantity: quantity,
      };
      const response = await axios.post(`${BASEURL}/orders/my-cart`, payload, {
        headers: {
          "x-access-token": userToken,
        },
      });
      if (response.data) {
        const newCartItem = response.data.data;
        const existingItem = cartItems.find((item) => item.id === product.id);

        // If the item already exists, update the quantity
        if (existingItem) {
          setCartItems((prevItems) =>
            prevItems.map((item) =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            )
          );
        } else {
          // If it's a new item, add it to the cart
          setCartItems((prevItems) => [
            ...prevItems,
            { ...newCartItem, quantity: 1 },
          ]);
        }

        // Update cart quantity
        setCartQuantity((prevQuantity) => prevQuantity + 1);
        toast.success("Product added to cart");
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.non_field_errors &&
        error.response.data.non_field_errors[0] ===
          "The fields cart, product must make a unique set."
      ) {
        toast.error("Product already in cart");
      } else {
        // Handle other errors
        toast.error("Failed to add product to cart");
      }
    }
  };

  // Update cart quantity
  const updateCartQuantity = async (product, newQuantity) => {
    if (newQuantity < 1) {
      // If the quantity is less than 1, remove the item from the cart
      removeFromCart(product.id);
      return;
    }

    try {
      const payload = {
        product: product.product,
        quantity: newQuantity,
      };

      const response = await axios.put(
        `${BASEURL}/orders/my-cart/${product.id}`,
        payload,
        {
          headers: {
            "x-access-token": userToken,
          },
        }
      );

      if (response.data) {
        // Update the cart items state with the new quantity
        setCartItems((prevItems) =>
          prevItems.map((item) =>
            item.id === product.id ? { ...item, quantity: newQuantity } : item
          )
        );
        toast.success("Quantity updated successfully");
      }
    } catch (error) {
      console.error("Failed to update cart item:", error);
      toast.error("Failed to update cart item");
    }
  };

  // Remove item from cart (DELETE request)
  const removeFromCart = async (id) => {
    try {
      const response = await axios.delete(`${BASEURL}/orders/cart-item/${id}`, {
        headers: {
          "x-access-token": userToken,
        },
      });
      if (response.data) {
        // Remove the item from the cart state
        setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
        setCartQuantity((prevQuantity) => prevQuantity - 1);
        toast.success("Item removed from cart");
      }
    } catch (error) {
      console.error("Failed to remove item from cart:", error);
      toast.error("Failed to remove item from cart");
    }
  };

  useEffect(() => {
    if (userToken) {
      fetchCartItems();
    }
  }, [userToken]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartQuantity,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        loading,
        setCartItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  return useContext(CartContext);
};
