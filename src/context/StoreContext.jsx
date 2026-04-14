import { createContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import { food_list as staticFoodList } from '../assets/assets';

export const StoreContext = createContext(null);

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

const StoreContextProvider = ({ children }) => {
  const [food_list, setFoodList] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user") || "null"));
  const [loading, setLoading] = useState(true);

  // Fetch food list from backend
  const fetchFoodList = useCallback(async () => {
    try {
      const { data } = await axios.get(`${API_URL}/food`);
      if (data.success && Array.isArray(data.data) && data.data.length > 0) {
        setFoodList(data.data);
      } else {
        console.warn("Food API returned no data, falling back to static food list.");
        setFoodList(staticFoodList);
      }
    } catch (err) {
      console.error("Failed to fetch food list:", err.message);
      setFoodList(staticFoodList);
    }
  }, []);

  // Load cart from backend if logged in
  const loadCartFromServer = useCallback(async (authToken) => {
    try {
      const { data } = await axios.get(`${API_URL}/cart`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (data.success) setCartItems(data.cartData || {});
    } catch (err) {
      console.error("Failed to load cart:", err.message);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      await fetchFoodList();
      if (token) await loadCartFromServer(token);
      setLoading(false);
    };
    init();
  }, [fetchFoodList, loadCartFromServer, token]);

  const addToCart = async (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }));
    if (token) {
      await axios.post(`${API_URL}/cart/add`, { itemId }, {
        headers: { Authorization: `Bearer ${token}` },
      });
    }
  };

  const removeFromCart = async (itemId) => {
    setCartItems((prev) => {
      const updated = { ...prev };
      if (updated[itemId] > 1) updated[itemId] -= 1;
      else delete updated[itemId];
      return updated;
    });
    if (token) {
      await axios.post(`${API_URL}/cart/remove`, { itemId }, {
        headers: { Authorization: `Bearer ${token}` },
      });
    }
  };

  const getTotalCartAmount = () => {
    let total = 0;
    for (const itemId in cartItems) {
      if (cartItems[itemId] > 0) {
        const item = food_list.find((f) => f._id === itemId);
        if (item) total += item.price * cartItems[itemId];
      }
    }
    return total;
  };

  const login = (authToken, userData) => {
    setToken(authToken);
    setUser(userData);
    localStorage.setItem("token", authToken);
    localStorage.setItem("user", JSON.stringify(userData));
    loadCartFromServer(authToken);
  };

  const logout = () => {
    setToken("");
    setUser(null);
    setCartItems({});
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <StoreContext.Provider
      value={{
        food_list,
        cartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        token,
        user,
        login,
        logout,
        loading,
        API_URL,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
