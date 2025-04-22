import React, { createContext, useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import axios from 'axios'
import { useAuth } from '../AuthContext/AuthContext'
import { BASEURL } from '../Client/Comman/CommanConstans'

const CartContext = createContext()

export const CartProvider = ({ children }) => {
  const { userToken, userID } = useAuth()
  const [cartItems, setCartItems] = useState([])
  const [cartQuantity, setCartQuantity] = useState(0) // Total number of items in cart
  const [loading, setLoading] = useState(false)

  // Fetch Cart Items (GET request)
  const fetchCartItems = async () => {
    try {
      setLoading(true)
      const response = await axios.get(
        `${BASEURL}/cart/${userID}?page=1&limit=50`,
        {
          headers: {
            'x-access-token': userToken
          }
        }
      )
      if (response.data) {
        setCartItems(response.data.items)
        setCartQuantity(response.data.totalItems)
      }
    } catch (error) {
      console.error('Failed to fetch cart items:', error)
    } finally {
      setLoading(false)
    }
  }

  // Add item to cart (POST request)
  const addToCart = async (product, quantity, selectedSize) => {
    try {
      const payload = {
        userId: userID,
        productId: product._id,
        quantity: quantity,
        selectedSize: selectedSize
      }

      const response = await axios.post(`${BASEURL}/cart/add`, payload, {
        headers: {
          'x-access-token': userToken
        }
      })

      if (response.data) {
        const newCartItem = response.data.data
        const existingItem = cartItems.find(item => item.id === product._id)

        if (existingItem) {
          setCartItems(prevItems =>
            prevItems.map(item =>
              item.id === product._id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            )
          )
        } else {
          setCartItems(prevItems => [
            ...prevItems,
            { ...newCartItem, quantity: 1 }
          ])
        }

        setCartQuantity(prevQuantity => prevQuantity + 1)
        toast.success('Product added to cart')
      }
    } catch (error) {
      toast.error('Failed to add product to cart')
    }
  }

  // Update cart quantity
  const updateCartQuantity = async (product, newQuantity) => {
    if (newQuantity < 1) {
      // If the quantity is less than 1, remove the item from the cart
      removeFromCart(product._id)
      return
    }

    try {
      const payload = {
        quantity: newQuantity
      }

      const response = await axios.put(
        `${BASEURL}/cart/${userID}/${product._id}`,
        payload,
        {
          headers: {
            'x-access-token': userToken
          }
        }
      )

      if (response.data) {
        // Update the cart items state with the new quantity
        setCartItems(prevItems =>
          prevItems.map(item =>
            item.productId._id === product._id
              ? { ...item, quantity: newQuantity }
              : item
          )
        )
        toast.success('Quantity updated successfully')
      }
    } catch (error) {
      console.error('Failed to update cart item:', error)
      toast.error('Failed to update cart item')
    }
  }

  // Remove item from cart (DELETE request)
  const removeFromCart = async id => {
    try {
      const response = await axios.delete(`${BASEURL}/cart/${userID}/${id}`, {
        headers: {
          'x-access-token': userToken
        }
      })
      if (response.data) {
        // Remove the item from the cart state
        console.log(cartItems, 'prevItems',id)
        setCartItems(prevItems => prevItems.filter(item => item._id !== id))
        setCartQuantity(prevQuantity => prevQuantity - 1)
        toast.success('Item removed from cart')
      }
    } catch (error) {
      console.error('Failed to remove item from cart:', error)
      toast.error('Failed to remove item from cart')
    }
  }

  useEffect(() => {
    if (userToken) {
      fetchCartItems()
    }
  }, [userToken])

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartQuantity,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        loading,
        setCartItems
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  return useContext(CartContext)
}
