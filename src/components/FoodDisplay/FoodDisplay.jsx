import React from 'react'
import './FoodDisplay.css'
import { StoreContext } from '../../context/StoreContext'
import FoodItem from '../FoodItem/FoodItem'

const FoodDisplay = ({ category }) => {
  const { food_list, loading } = React.useContext(StoreContext)

  if (loading) {
    return <div className='food-display'><p>Loading dishes...</p></div>
  }

  if (!food_list || food_list.length === 0) {
    return <div className='food-display'><p>No dishes available.</p></div>
  }

  return (
    <div className='food-display' id='food-display'>
      <h2>Top dishes near you</h2>
      <div className="food-display-list">
        {food_list.map((item, index) => {
          if (category === "All" || category === item.category) {
            return <FoodItem  
              key={item._id} 
              id={item._id}
              name={item.name}
              description={item.description}
              price={item.price}
              image={item.image}
            />
          }
          return null
        })}
      </div>
    </div>
  )
}

export default FoodDisplay
