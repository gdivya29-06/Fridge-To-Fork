const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const recipeRoutes = require('./routes/recipes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/recipes', recipeRoutes);

app.get('/', (req, res) => {
  res.send('Recipe Generator AI Backend is running!');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});