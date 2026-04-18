const express = require('express');
const cors = require('cors');
const recipeRoutes = require('./routes/recipes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/recipes', recipeRoutes);

app.get('/', (req, res) => {
  res.send('Recipe Generator AI Backend is running!');
});
console.log("OPENAI KEY EXISTS:", !!process.env.OPENAI_API_KEY);
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});