// Run once: node seed.js
require('dotenv').config();
const mongoose = require('mongoose');
const Food = require('./models/Food');

const foodData = [
  { name: "Greek salad", price: 12, description: "Fresh greens with feta cheese and olives", category: "Salad", image: "food_1.png" },
  { name: "Veg salad", price: 18, description: "Colorful mix of seasonal vegetables", category: "Salad", image: "food_2.png" },
  { name: "Clover Salad", price: 16, description: "Light and refreshing clover salad", category: "Salad", image: "food_3.png" },
  { name: "Chicken Salad", price: 24, description: "Grilled chicken with fresh greens", category: "Salad", image: "food_4.png" },
  { name: "Lasagna Rolls", price: 14, description: "Classic lasagna in roll form", category: "Rolls", image: "food_5.png" },
  { name: "Peri Peri Rolls", price: 12, description: "Spicy peri peri flavored rolls", category: "Rolls", image: "food_6.png" },
  { name: "Chicken Rolls", price: 20, description: "Tender chicken wrapped in soft rolls", category: "Rolls", image: "food_7.png" },
  { name: "Veg Rolls", price: 15, description: "Fresh vegetables in crispy rolls", category: "Rolls", image: "food_8.png" },
  { name: "Ripple Ice Cream", price: 14, description: "Creamy ripple flavored ice cream", category: "Deserts", image: "food_9.png" },
  { name: "Fruit Ice Cream", price: 22, description: "Mixed fruit ice cream delight", category: "Deserts", image: "food_10.png" },
  { name: "Jar Ice Cream", price: 10, description: "Homestyle ice cream in a jar", category: "Deserts", image: "food_11.png" },
  { name: "Vanilla Ice Cream", price: 12, description: "Classic smooth vanilla ice cream", category: "Deserts", image: "food_12.png" },
  { name: "Chicken Sandwich", price: 12, description: "Grilled chicken in toasted bread", category: "Sandwich", image: "food_13.png" },
  { name: "Vegan Sandwich", price: 18, description: "Plant-based sandwich with fresh veggies", category: "Sandwich", image: "food_14.png" },
  { name: "Grilled Sandwich", price: 16, description: "Crispy grilled sandwich with cheese", category: "Sandwich", image: "food_15.png" },
  { name: "Bread Sandwich", price: 24, description: "Hearty bread sandwich with fillings", category: "Sandwich", image: "food_16.png" },
  { name: "Cup Cake", price: 14, description: "Soft and fluffy cupcake with frosting", category: "Cake", image: "food_17.png" },
  { name: "Vegan Cake", price: 12, description: "Delicious plant-based cake", category: "Cake", image: "food_18.png" },
  { name: "Butterscotch Cake", price: 20, description: "Rich butterscotch flavored cake", category: "Cake", image: "food_19.png" },
  { name: "Sliced Cake", price: 15, description: "Freshly sliced layered cake", category: "Cake", image: "food_20.png" },
  { name: "Garlic Mushroom", price: 14, description: "Sautéed mushrooms with garlic butter", category: "Pure Veg", image: "food_21.png" },
  { name: "Fried Cauliflower", price: 22, description: "Crispy fried cauliflower bites", category: "Pure Veg", image: "food_22.png" },
  { name: "Mix Veg Pulao", price: 10, description: "Aromatic rice with mixed vegetables", category: "Pure Veg", image: "food_23.png" },
  { name: "Rice Zucchini", price: 12, description: "Light rice dish with zucchini", category: "Pure Veg", image: "food_24.png" },
  { name: "Cheese Pasta", price: 12, description: "Creamy cheese pasta", category: "Pasta", image: "food_25.png" },
  { name: "Tomato Pasta", price: 18, description: "Classic tomato sauce pasta", category: "Pasta", image: "food_26.png" },
  { name: "Creamy Pasta", price: 16, description: "Rich and creamy pasta dish", category: "Pasta", image: "food_27.png" },
  { name: "Chicken Pasta", price: 24, description: "Pasta with grilled chicken pieces", category: "Pasta", image: "food_28.png" },
  { name: "Butter Noodles", price: 14, description: "Simple buttery noodles", category: "Noodles", image: "food_29.png" },
  { name: "Veg Noodles", price: 12, description: "Stir-fried vegetable noodles", category: "Noodles", image: "food_30.png" },
  { name: "Somen Noodles", price: 20, description: "Thin Japanese somen noodles", category: "Noodles", image: "food_31.png" },
  { name: "Cooked Noodles", price: 15, description: "Classic cooked noodles with sauce", category: "Noodles", image: "food_32.png" },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  await Food.deleteMany({});
  await Food.insertMany(foodData);
  console.log('✅ Food data seeded successfully!');
  mongoose.disconnect();
}

seed().catch(console.error);
