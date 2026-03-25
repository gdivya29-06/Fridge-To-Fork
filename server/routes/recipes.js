const express = require('express');
const router = express.Router();
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

// ── OpenAI caller ───────────────────────────────────────────────
async function callAI(messages, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        { model: 'gpt-4o-mini', messages },
        { headers: { 'Authorization': `Bearer ${OPENAI_API_KEY}`, 'Content-Type': 'application/json' } }
      );
      return response.data.choices[0].message.content;
    } catch (error) {
      if (error.response?.status === 429 && i < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, 5000 * (i + 1)));
        continue;
      }
      throw error;
    }
  }
}
async function getFoodImageFromUnsplash(recipeName) {
  try {
    const UNSPLASH_KEY = process.env.UNSPLASH_ACCESS_KEY;
    if (!UNSPLASH_KEY) return null;

    const cleanName = recipeName
      .replace(/kesar|stuffed|spiced|classic|homemade|traditional/gi, '')
      .trim();

    const query = encodeURIComponent(
      `${cleanName} plated dish recipe food`
    );

    const url =
      `https://api.unsplash.com/search/photos?query=${query}` +
      `&per_page=5&orientation=squarish&content_filter=high` +
      `&client_id=${UNSPLASH_KEY}`;

    const response = await axios.get(url);
    const results = response.data.results;

    if (results && results.length > 0) {
      return results[0].urls.regular;
    }

    return null;

  } catch (error) {
    console.error('Unsplash error:', error.message);
    return null;
  }
}

// ── Image map ───────────────────────────────────────────────────
const KEYWORD_IMAGE_MAP = {
  'butter chicken': 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=800',
  'murgh makhani': 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=800',
  'rogan josh': 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800',
  'palak paneer': 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800',
  'shahi paneer': 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=800',
  'paneer butter masala': 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=800',
  'matar paneer': 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=800',
  'malai kofta': 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=800',
  'dal makhani': 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800',
  'dal tadka': 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800',
  'chana masala': 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800',
  'chole': 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800',
  'rajma': 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800',
  'aloo gobi': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800',
  'aloo matar': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800',
  'dum aloo': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800',
  'baingan bharta': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800',
  'biryani': 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800',
  'hyderabadi biryani': 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800',
  'pulao': 'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=800',
  'jeera rice': 'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=800',
  'khichdi': 'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=800',
  'aloo paratha': 'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=800',
  'paratha': 'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=800',
  'naan': 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800',
  'roti': 'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=800',
  'tandoori chicken': 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800',
  'chicken tikka': 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800',
  'paneer tikka': 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=800',
  'seekh kebab': 'https://images.unsplash.com/photo-1555126634-323283e090fa?w=800',
  'pav bhaji': 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=800',
  'vada pav': 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=800',
  'samosa': 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800',
  'chole bhature': 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800',
  'masala dosa': 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=800',
  'dosa': 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=800',
  'idli': 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800',
  'upma': 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800',
  'poha': 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800',
  'sambar': 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800',
  'rasam': 'https://images.unsplash.com/photo-1547592180-85f173990554?w=800',
  'chicken 65': 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800',
  'pepper chicken': 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800',
  'kerala fish curry': 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800',
  'hakka noodles': 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800',
  'gobi manchurian': 'https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?w=800',
  'chilli paneer': 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=800',
  'chilli chicken': 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800',
  'gulab jamun': 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=800',
  'jalebi': 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=800',
  'gajar ka halwa': 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800',
  'kheer': 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800',
  'rasmalai': 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=800',
  'carbonara': 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800',
  'lasagna': 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=800',
  'risotto': 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=800',
  'pizza': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800',
  'pasta': 'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=800',
  'sushi': 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=800',
  'ramen': 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800',
  'pad thai': 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=800',
  'bibimbap': 'https://images.unsplash.com/photo-1553163147-622ab57be1c7?w=800',
  'pho': 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800',
  'rendang': 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800',
  'hummus': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800',
  'falafel': 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=800',
  'shawarma': 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=800',
  'shakshuka': 'https://images.unsplash.com/photo-1510693206972-df098062cb71?w=800',
  'paella': 'https://images.unsplash.com/photo-1534080564583-6be75777b70a?w=800',
  'burger': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800',
  'sandwich': 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800',
  'tacos': 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800',
  'burrito': 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=800',
  'steak': 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800',
  'pancake': 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800',
  'omelette': 'https://images.unsplash.com/photo-1510693206972-df098062cb71?w=800',
  'soup': 'https://images.unsplash.com/photo-1547592180-85f173990554?w=800',
  'salad': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800',
  'fried rice': 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800',
  'noodles': 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800',
  'cake': 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800',
  'chicken': 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800',
  'fish': 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800',
  'paneer': 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=800',
  'dal': 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800',
  'rice': 'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=800',
  'curry': 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800',
  'egg': 'https://images.unsplash.com/photo-1510693206972-df098062cb71?w=800',
  'bread': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800',
};

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=800',
  'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800',
  'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800',
  'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800',
  'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800',
  'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800',
];

let usedImagesInRequest = [];

function getFoodImage(recipeName, index) {
  const nameLower = recipeName.toLowerCase();
  const sorted = Object.entries(KEYWORD_IMAGE_MAP).sort((a, b) => b[0].length - a[0].length);
  for (const [keyword, url] of sorted) {
    if (nameLower.includes(keyword) && !usedImagesInRequest.includes(url)) {
      usedImagesInRequest.push(url);
      return url;
    }
  }
  for (let i = 0; i < FALLBACK_IMAGES.length; i++) {
    const img = FALLBACK_IMAGES[(index + i) % FALLBACK_IMAGES.length];
    if (!usedImagesInRequest.includes(img)) {
      usedImagesInRequest.push(img);
      return img;
    }
  }
  return FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
}

const LANGUAGE_INSTRUCTIONS = {
  'Hindi': 'हिंदी में लिखें। सभी description, ingredients, instructions, tips हिंदी में होने चाहिए।',
  'Tamil': 'தமிழில் எழுதவும். அனைத்து description, ingredients, instructions, tips தமிழில் இருக்க வேண்டும்.',
  'Telugu': 'తెలుగులో రాయండి. అన్ని description, ingredients, instructions, tips తెలుగులో ఉండాలి.',
  'Spanish': 'Escribe en español.',
  'French': 'Écris en français.',
  'English': 'Write everything in English.',
};

// ── Detect ingredients from image ──────────────────────────────
router.post('/detect-ingredients', async (req, res) => {
  try {
    const { image, mimeType } = req.body;
    const text = await callAI([
      {
        role: 'user',
        content: [
          { type: 'image_url', image_url: { url: `data:${mimeType || 'image/jpeg'};base64,${image}` } },
          { type: 'text', text: 'List all food ingredients you can see in this image. Return ONLY a JSON array of ingredient names, nothing else. Example: ["chicken", "tomato", "garlic"]. If no food ingredients are visible, return [].' }
        ]
      }
    ]);
    const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const ingredients = JSON.parse(cleaned);
    res.json({ ingredients });
  } catch (error) {
    console.error('Error detecting ingredients:', error);
    res.status(500).json({ error: 'Failed to detect ingredients from image' });
  }
});

// ── Generate recipes ────────────────────────────────────────────
router.post('/generate', async (req, res) => {
  try {
    const { ingredients, dietaryPreference, language, allergies, nutrientGoal, equipment } = req.body;

    if (!ingredients || ingredients.length === 0) {
      return res.status(400).json({ error: 'Please provide ingredients' });
    }

    const allergyText = allergies?.length > 0
      ? `IMPORTANT: The user is allergic to: ${allergies.join(', ')}. NEVER include these.`
      : '';

    const nutrientText = nutrientGoal
      ? `Nutrient Goal: ${nutrientGoal}. Tailor recipes to match this goal.`
      : '';

    const equipmentText = equipment?.length > 0
      ? `Available equipment: ${equipment.join(', ')}. Only suggest recipes using these tools.`
      : '';

    const langInstruction = LANGUAGE_INSTRUCTIONS[language] || LANGUAGE_INSTRUCTIONS['English'];
    const targetLanguage = language || 'English';

    const prompt = `You are a world-class chef who knows all famous dishes globally.

The user has these ingredients: ${ingredients.join(', ')}.
${dietaryPreference && dietaryPreference !== 'No Preference' ? `Dietary preference: ${dietaryPreference}.` : ''}
${allergyText}
${nutrientText}
${equipmentText}

Generate exactly 6 FAMOUS, well-known dishes that can be made with these ingredients.
Always suggest REAL, POPULAR dishes that people actually know and love!
Make sure all 6 dishes are DIFFERENT from each other.

LANGUAGE INSTRUCTION:
${langInstruction}
Write "description", "ingredients", "instructions", and "tips" entirely in ${targetLanguage}.

Return ONLY a valid JSON array with exactly this structure, no extra text, no markdown:
[
  {
    "name": "Famous Dish Name",
    "description": "Brief 1 sentence description in ${targetLanguage}",
    "calories": "approximate calories per serving",
    "ingredients": ["ingredient 1 with quantity in ${targetLanguage}"],
    "instructions": ["step 1 in ${targetLanguage}", "step 2 in ${targetLanguage}"],
    "dietaryTags": ["tag1", "tag2"],
    "tips": "one helpful cooking tip in ${targetLanguage}",
    "servings": "number of servings"
  }
]`;

    const text = await callAI([{ role: 'user', content: prompt }]);
    const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const recipes = JSON.parse(cleanedText);

    usedImagesInRequest = [];

    console.log('Fetching YouTube videos for', recipes.length, 'recipes...');

    const recipesWithMedia = await Promise.all(
  recipes.map(async (recipe, index) => {
    const unsplashImage = await getFoodImageFromUnsplash(recipe.name);
    const imageUrl = unsplashImage || getFoodImage(recipe.name, index);
    const youtubeUrl = await getYouTubeVideo(recipe.name);
    console.log(`${recipe.name} → Image: ${imageUrl ? 'Unsplash ✅' : 'Fallback'} | YouTube: ${youtubeUrl ? '✅' : 'null'}`);
    return { ...recipe, imageUrl, youtubeUrl };
  })
);

    res.json({ recipes: recipesWithMedia });

  } catch (error) {
    console.error('Error generating recipes:', error);
    res.status(500).json({ error: 'Failed to generate recipes. Please try again.' });
  }
});

// ── Share recipe ────────────────────────────────────────────────
router.post('/share', async (req, res) => {
  try {
    const { recipe } = req.body;
    if (!recipe) return res.status(400).json({ error: 'No recipe provided' });
    const encoded = Buffer.from(JSON.stringify(recipe)).toString('base64');
    const shareUrl = `${req.protocol}://${req.get('host')}/shared-recipe/${encoded}`;
    res.json({ shareUrl });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate share link' });
  }
});

router.get('/shared/:encoded', async (req, res) => {
  try {
    const recipe = JSON.parse(Buffer.from(req.params.encoded, 'base64').toString('utf8'));
    res.json({ recipe });
  } catch (error) {
    res.status(400).json({ error: 'Invalid share link' });
  }
});

// ── Chat ────────────────────────────────────────────────────────
router.post('/chat', async (req, res) => {
  try {
    const { message, language, selectedRecipe, currentRecipes } = req.body;
    const recipeContext = selectedRecipe
      ? `The user is asking about this SPECIFIC recipe: ${selectedRecipe}.`
      : currentRecipes
        ? `The user has generated these recipes: ${currentRecipes}.`
        : '';

    const prompt = `You are a friendly and helpful cooking assistant.
${recipeContext}
IMPORTANT: Always reply in ${language || 'English'} language.
Keep your answer short, friendly and practical — maximum 3-4 sentences.
User question: ${message}`;

    const reply = await callAI([{ role: 'user', content: prompt }]);
    res.json({ reply });
  } catch (error) {
    console.error('Error in chat:', error);
    res.status(500).json({ error: 'Failed to get response' });
  }
});
// ── Shopping List Generator ─────────────────────────────────────
router.post('/shopping-list', async (req, res) => {
  try {
    const { recipes, language } = req.body;
    if (!recipes || recipes.length === 0) {
      return res.status(400).json({ error: 'No recipes provided' });
    }

    const allIngredients = recipes.flatMap(r => r.ingredients);

    const prompt = `You are a smart shopping assistant.

Here are ingredients from multiple recipes:
${allIngredients.join('\n')}

Create a consolidated shopping list by:
1. Removing duplicates (combine similar items)
2. Grouping into categories
3. Adding approximate quantities needed

Return ONLY a valid JSON object like this, no markdown:
{
  "Vegetables & Fruits": ["2 tomatoes", "1 onion"],
  "Proteins": ["500g chicken breast", "200g paneer"],
  "Dairy": ["1 cup milk", "2 tbsp butter"],
  "Spices & Condiments": ["1 tsp cumin", "2 tsp garam masala"],
  "Grains & Staples": ["2 cups rice", "200g pasta"],
  "Other": ["2 tbsp olive oil"]
}

Write ingredient names in ${language || 'English'}.`;

    const text = await callAI([{ role: 'user', content: prompt }]);
    const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const shoppingList = JSON.parse(cleaned);
    res.json({ shoppingList });

  } catch (error) {
    console.error('Shopping list error:', error);
    res.status(500).json({ error: 'Failed to generate shopping list' });
  }
});
// ── Generate Desserts ───────────────────────────────────────────
router.post('/generate-desserts', async (req, res) => {
  try {
    const { category, ingredients, language } = req.body;

    const langInstructions = {
      'Hindi': 'हिंदी में लिखें।',
      'Tamil': 'தமிழில் எழுதவும்.',
      'Telugu': 'తెలుగులో రాయండి.',
      'Spanish': 'Escribe en español.',
      'French': 'Écris en français.',
      'English': 'Write everything in English.',
    };

    const langInstruction = langInstructions[language] || langInstructions['English'];
    const targetLanguage = language || 'English';

    const prompt = `You are a world-class pastry chef and dessert expert.

Generate exactly 6 famous, delicious ${category} recipes.
${ingredients && ingredients.length > 0 ? `Try to use these ingredients where possible: ${ingredients.join(', ')}.` : ''}

Include a mix of easy and impressive desserts that people actually love!

LANGUAGE: ${langInstruction}

Return ONLY a valid JSON array with exactly this structure, no markdown:
[
  {
    "name": "Dessert Name",
    "description": "Brief 1 sentence description in ${targetLanguage}",
    "calories": "approximate calories per serving",
    "ingredients": ["ingredient 1 with quantity in ${targetLanguage}"],
    "instructions": ["step 1 in ${targetLanguage}", "step 2 in ${targetLanguage}"],
    "dietaryTags": ["tag1", "tag2"],
    "tips": "one helpful tip in ${targetLanguage}",
    "servings": "number of servings"
  }
]`;

    const text = await callAI([{ role: 'user', content: prompt }]);
    const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const recipes = JSON.parse(cleanedText);

    usedImagesInRequest = [];

    const recipesWithMedia = await Promise.all(
      recipes.map(async (recipe, index) => {
        const unsplashImage = await getFoodImageFromUnsplash(recipe.name + ' dessert');
        const imageUrl = unsplashImage || getFoodImage(recipe.name, index);
        const youtubeUrl = await getYouTubeVideo(recipe.name + ' recipe');
        return { ...recipe, imageUrl, youtubeUrl };
      })
    );

    res.json({ recipes: recipesWithMedia });

  } catch (error) {
    console.error('Error generating desserts:', error);
    res.status(500).json({ error: 'Failed to generate desserts. Please try again.' });
  }
});
module.exports = router;