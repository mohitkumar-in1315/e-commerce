import React, { useContext } from 'react';
import './Cart.css';
import { StoreContext } from '../../context/StoreContext';
import { useNavigate } from 'react-router-dom';

const foodImages = import.meta.glob('../../assets/food_*.png', { eager: true, import: 'default' });
const getImage = (filename) => {
  const key = `../../assets/${filename}`;
  return foodImages[key] || filename;
};

const DELIVERY_FEE = 2;

const Cart = () => {
  const { cartItems, food_list, removeFromCart, addToCart, getTotalCartAmount, loading } = useContext(StoreContext);
  const navigate = useNavigate();
  
  if (loading) {
    return <div className='cart'><p>Loading cart...</p></div>;
  }

  if (!food_list || food_list.length === 0) {
    return <div className='cart'><p>No products available.</p></div>;
  }

  const subtotal = getTotalCartAmount();
  const total = subtotal + (subtotal > 0 ? DELIVERY_FEE : 0);

  const cartHasItems = Object.values(cartItems).some((qty) => qty > 0);

  return (
    <div className='cart'>
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <br />
        <hr />
        {!cartHasItems && <p className="cart-empty">Your cart is empty.</p>}
        {food_list && food_list.map((item) => {
          if (cartItems[item._id] && cartItems[item._id] > 0) {
            return (
              <div key={item._id}>
                <div className='cart-items-title cart-items-item'>
                  <img src={getImage(item.image)} alt={item.name} />
                  <p>{item.name}</p>
                  <p>${item.price}</p>
                  <div className="cart-qty-controls">
                    <span onClick={() => removeFromCart(item._id)}>-</span>
                    <p>{cartItems[item._id]}</p>
                    <span onClick={() => addToCart(item._id)}>+</span>
                  </div>
                  <p>${item.price * cartItems[item._id]}</p>
                  <p onClick={() => removeFromCart(item._id)} className='cross'>✕</p>
                </div>
                <hr />
              </div>
            );
          }
          return null;
        })}
      </div>

      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>${subtotal.toFixed(2)}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>{subtotal > 0 ? `$${DELIVERY_FEE.toFixed(2)}` : 'Free'}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p><strong>Total</strong></p>
              <p><strong>${total.toFixed(2)}</strong></p>
            </div>
          </div>
          <button
            onClick={() => navigate('/placeorder')}
            disabled={!cartHasItems}
          >
            PROCEED TO CHECKOUT
          </button>
        </div>

        <div className="cart-promocode">
          <div>
            <p>If you have a promo code, enter it here</p>
            <div className="cart-promocode-input">
              <input type='text' placeholder='Promo code' />
              <button>Submit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
