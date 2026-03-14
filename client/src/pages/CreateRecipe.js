import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import RecipeCard from '../components/RecipeCard';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const INGREDIENTS_DATABASE = [
  'Chicken', 'Chicken breast', 'Chicken thigh', 'Chicken tikka', 'Minced chicken',
  'Mutton', 'Lamb', 'Beef', 'Pork', 'Turkey',
  'Eggs', 'Egg yolk', 'Egg white',
  'Salmon', 'Tuna', 'Prawns', 'Shrimp', 'Fish fillet', 'Crab', 'Lobster',
  'Paneer', 'Tofu', 'Tempeh',
  'Chickpeas', 'Lentils', 'Black beans', 'Kidney beans', 'Moong dal', 'Toor dal', 'Chana dal',
  'Rice', 'Basmati rice', 'Brown rice', 'Jasmine rice', 'Biryani rice',
  'Pasta', 'Spaghetti', 'Penne', 'Macaroni', 'Noodles', 'Rice noodles',
  'Bread', 'Whole wheat bread', 'Sourdough bread', 'Pita bread',
  'Flour', 'Whole wheat flour', 'Rice flour', 'Cornflour',
  'Oats', 'Quinoa', 'Couscous', 'Semolina', 'Poha', 'Idli batter',
  'Onion', 'Red onion', 'Spring onion', 'Shallots',
  'Tomato', 'Cherry tomatoes', 'Sun-dried tomatoes',
  'Potato', 'Sweet potato', 'Baby potatoes',
  'Garlic', 'Ginger', 'Garlic paste', 'Ginger paste',
  'Carrot', 'Baby carrots',
  'Capsicum', 'Red capsicum', 'Yellow capsicum', 'Green capsicum',
  'Spinach', 'Baby spinach', 'Palak',
  'Cauliflower', 'Broccoli', 'Cabbage', 'Brussels sprouts',
  'Mushroom', 'Button mushrooms', 'Shiitake mushrooms',
  'Peas', 'Green beans', 'Corn', 'Baby corn',
  'Eggplant', 'Brinjal', 'Zucchini', 'Cucumber',
  'Beetroot', 'Radish', 'Turnip',
  'Lettuce', 'Kale', 'Celery', 'Asparagus',
  'Pumpkin', 'Bottle gourd', 'Ridge gourd', 'Drumstick',
  'Milk', 'Coconut milk', 'Almond milk', 'Oat milk',
  'Butter', 'Ghee', 'Cream', 'Heavy cream', 'Sour cream',
  'Cheese', 'Cheddar cheese', 'Mozzarella', 'Parmesan', 'Feta cheese',
  'Yogurt', 'Greek yogurt', 'Curd',
  'Lemon', 'Lime', 'Orange', 'Lemon juice',
  'Tomato puree', 'Tomato paste',
  'Apple', 'Banana', 'Mango', 'Pineapple', 'Papaya',
  'Blueberries', 'Strawberries', 'Raspberries',
  'Avocado', 'Coconut', 'Dates',
  'Salt', 'Black pepper', 'White pepper', 'Red chili powder',
  'Turmeric', 'Cumin', 'Coriander powder', 'Garam masala',
  'Cardamom', 'Cinnamon', 'Cloves', 'Bay leaves', 'Star anise',
  'Mustard seeds', 'Fennel seeds', 'Fenugreek seeds',
  'Paprika', 'Oregano', 'Thyme', 'Rosemary', 'Basil',
  'Curry powder', 'Biryani masala', 'Chaat masala', 'Sambar powder',
  'Coriander leaves', 'Mint leaves', 'Parsley', 'Curry leaves',
  'Kasuri methi', 'Saffron',
  'Olive oil', 'Sunflower oil', 'Coconut oil', 'Sesame oil', 'Vegetable oil',
  'Soy sauce', 'Fish sauce', 'Oyster sauce', 'Worcestershire sauce',
  'Tomato ketchup', 'Mayonnaise', 'Mustard sauce', 'Hot sauce', 'Sriracha',
  'Vinegar', 'Apple cider vinegar', 'Balsamic vinegar',
  'Cashews', 'Almonds', 'Peanuts', 'Walnuts', 'Pistachios',
  'Sesame seeds', 'Sunflower seeds', 'Chia seeds', 'Flax seeds',
  'Poppy seeds', 'Pumpkin seeds',
  'Sugar', 'Brown sugar', 'Honey', 'Maple syrup', 'Jaggery',
  'Baking powder', 'Baking soda', 'Yeast', 'Vanilla extract',
  'Cocoa powder', 'Dark chocolate', 'Condensed milk',
  'Cornstarch', 'Gelatin', 'Agar agar',
];

const DIETARY_OPTIONS = [
  { label: 'No Preference', icon: '🍽️' },
  { label: 'Vegetarian', icon: '🥗' },
  { label: 'Vegan', icon: '🌱' },
  { label: 'Gluten-Free', icon: '🌾' },
  { label: 'Dairy-Free', icon: '🥛' },
  { label: 'Keto', icon: '⚡' },
  { label: 'Halal', icon: '☪️' },
  { label: 'Kosher', icon: '✡️' },
];

const LANGUAGES = [
  { code: 'English', label: '🇬🇧 English' },
  { code: 'Hindi', label: '🇮🇳 Hindi' },
  { code: 'Tamil', label: '🇮🇳 Tamil' },
  { code: 'Telugu', label: '🇮🇳 Telugu' },
  { code: 'Spanish', label: '🇪🇸 Spanish' },
  { code: 'French', label: '🇫🇷 French' },
];

const COMMON_ALLERGENS = [
  '🥜 Peanuts', '🌰 Tree Nuts', '🥛 Dairy', '🥚 Eggs',
  '🌾 Gluten', '🦐 Shellfish', '🐟 Fish', '🫘 Soy'
];

function CreateRecipe({ user }) {
  const [ingredients, setIngredients] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [dietary, setDietary] = useState('No Preference');
  const [language, setLanguage] = useState('English');
  const [allergies, setAllergies] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [favourites, setFavourites] = useState(() => {
    try {
      const saved = localStorage.getItem('favouriteRecipes');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [photoLoading, setPhotoLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { role: 'bot', text: '👋 Hi! I am your cooking assistant! Generate some recipes first, then select one and ask me anything about it! 🍳' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('create');
  const fileInputRef = useRef(null);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    setHighlightedIndex(-1);
    if (value.trim().length > 0) {
      const filtered = INGREDIENTS_DATABASE.filter(ing =>
        ing.toLowerCase().includes(value.toLowerCase()) &&
        !ingredients.includes(ing)
      ).slice(0, 8);
      setSuggestions(filtered);
      setShowDropdown(true);
    } else {
      setSuggestions([]);
      setShowDropdown(false);
    }
  };

  const handleKeyDown = (e) => {
    if (!showDropdown) {
      if (e.key === 'Enter') addIngredient(inputValue);
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex(prev => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(prev => Math.max(prev - 1, -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightedIndex >= 0 && suggestions[highlightedIndex]) {
        addIngredient(suggestions[highlightedIndex]);
      } else {
        addIngredient(inputValue);
      }
    } else if (e.key === 'Escape') {
      setShowDropdown(false);
    }
  };

  const addIngredient = (value) => {
    const trimmed = (value || inputValue).trim();
    if (trimmed && !ingredients.includes(trimmed)) {
      setIngredients(prev => [...prev, trimmed]);
    }
    setInputValue('');
    setSuggestions([]);
    setShowDropdown(false);
    setHighlightedIndex(-1);
    inputRef.current?.focus();
  };

  const removeIngredient = (ing) => setIngredients(ingredients.filter(i => i !== ing));

  const toggleAllergy = (allergen) => {
    const clean = allergen.split(' ').slice(1).join(' ');
    if (allergies.includes(clean)) {
      setAllergies(allergies.filter(a => a !== clean));
    } else {
      setAllergies([...allergies, clean]);
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhotoLoading(true);
    setError('');
    try {
      const base64 = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.readAsDataURL(file);
      });
      const response = await axios.post('http://localhost:5001/api/recipes/detect-ingredients', {
        image: base64, mimeType: file.type
      });
      setIngredients(prev => [...new Set([...prev, ...response.data.ingredients])]);
    } catch (err) {
      setError('Could not detect ingredients from photo. Please add them manually!');
    }
    setPhotoLoading(false);
  };

  const generateRecipes = async () => {
    if (ingredients.length === 0) { setError('Please add at least one ingredient!'); return; }
    setError(''); setLoading(true); setRecipes([]); setSelectedRecipe(null);
    try {
      const response = await axios.post('http://localhost:5001/api/recipes/generate', {
        ingredients, dietaryPreference: dietary, language, allergies
      });
      setRecipes(response.data.recipes);

      try {
        await addDoc(collection(db, 'recipes'), {
          userId: user.uid,
          userEmail: user.email,
          ingredients: ingredients,
          recipes: response.data.recipes,
          createdAt: serverTimestamp()
        });
      } catch (err) {
        console.log('Could not save to history:', err);
      }

    } catch (err) {
      setError('Failed to generate recipes. Please try again!');
    }
    setLoading(false);
  };

  const handleSelectForChat = (recipe) => {
    setSelectedRecipe(recipe);
    setActiveTab('chat');
    setChatMessages([
      { role: 'bot', text: `🍳 Great choice! I'm now focused on **${recipe.name}**. Ask me anything about this recipe — ingredients, cooking tips, substitutions, or any questions!` }
    ]);
  };

  const toggleFavourite = (recipe) => {
    const exists = favourites.find(f => f.name === recipe.name);
    const updated = exists ? favourites.filter(f => f.name !== recipe.name) : [...favourites, recipe];
    setFavourites(updated);
    localStorage.setItem('favouriteRecipes', JSON.stringify(updated));
  };

  const isFavourite = (recipe) => favourites.some(f => f.name === recipe.name);

  const sendChatMessage = async () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput.trim();
    setChatMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setChatInput('');
    setChatLoading(true);
    try {
      const response = await axios.post('http://localhost:5001/api/recipes/chat', {
        message: userMsg,
        language,
        selectedRecipe: selectedRecipe ? JSON.stringify({
          name: selectedRecipe.name,
          ingredients: selectedRecipe.ingredients,
          instructions: selectedRecipe.instructions,
          tips: selectedRecipe.tips
        }) : null,
        currentRecipes: recipes.length > 0 ? recipes.map(r => r.name).join(', ') : null
      });
      setChatMessages(prev => [...prev, { role: 'bot', text: response.data.reply }]);
    } catch (err) {
      setChatMessages(prev => [...prev, { role: 'bot', text: 'Sorry, I could not process that. Please try again!' }]);
    }
    setChatLoading(false);
  };

  const btnStyle = {
    background: 'linear-gradient(135deg, #2d4a1e, #4a7c2f)',
    color: 'white', border: 'none', borderRadius: '10px',
    padding: '0.8rem 1.5rem', cursor: 'pointer',
    fontWeight: '700', fontSize: '1rem',
    boxShadow: '0 3px 10px rgba(74,124,47,0.3)'
  };

  const cardStyle = {
    backgroundColor: 'white', borderRadius: '20px', padding: '2rem',
    marginBottom: '1.5rem', boxShadow: '0 4px 20px rgba(74,124,47,0.08)',
    border: '1px solid #c8d8b0'
  };

  return (
    <div style={{ maxWidth: '950px', margin: '0 auto', padding: '2rem' }}>
      <h1 style={{ textAlign: 'center', fontSize: '2rem', fontWeight: '800', color: '#2d4a1e', marginBottom: '0.5rem' }}>
        🍳 Create Your Recipe
      </h1>
      <p style={{ textAlign: 'center', color: '#5a6e4a', marginBottom: '2rem' }}>
        Add ingredients, set preferences, and let AI generate amazing recipes!
      </p>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', backgroundColor: '#e8f0e0', padding: '0.4rem', borderRadius: '12px' }}>
        {[
          { id: 'create', label: '🍳 Create Recipe' },
          { id: 'favourites', label: `⭐ Favourites (${favourites.length})` },
          { id: 'chat', label: `🤖 ${selectedRecipe ? 'Assistant ●' : 'Cooking Assistant'}` }
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
            flex: 1, padding: '0.7rem', borderRadius: '10px', border: 'none',
            background: activeTab === tab.id ? 'linear-gradient(135deg, #2d4a1e, #4a7c2f)' : 'transparent',
            color: activeTab === tab.id ? 'white' : '#5a6e4a',
            fontWeight: '600', cursor: 'pointer', fontSize: '0.95rem',
            transition: 'all 0.2s',
            boxShadow: activeTab === tab.id ? '0 3px 10px rgba(74,124,47,0.3)' : 'none'
          }}>
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'create' && (
        <div>
          <div style={cardStyle}>
            <h2 style={{ fontWeight: '700', marginBottom: '1rem', color: '#1a2e10' }}>Step 1: Add Ingredients</h2>
            <div style={{ backgroundColor: '#f0f4ea', border: '2px dashed #4a7c2f', borderRadius: '12px', padding: '1.5rem', textAlign: 'center', marginBottom: '1.5rem', cursor: 'pointer', transition: 'all 0.2s' }}
              onClick={() => fileInputRef.current.click()}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#e0ecd4'; e.currentTarget.style.borderColor = '#2d4a1e'; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#f0f4ea'; e.currentTarget.style.borderColor = '#4a7c2f'; }}
            >
              <input type="file" ref={fileInputRef} accept="image/*" onChange={handlePhotoUpload} style={{ display: 'none' }} />
              {photoLoading ? (
                <p style={{ color: '#4a7c2f', fontWeight: '600' }}>🔍 AI is detecting ingredients...</p>
              ) : (
                <>
                  <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📸</div>
                  <p style={{ color: '#4a7c2f', fontWeight: '700', marginBottom: '0.3rem' }}>Click to upload a photo of your ingredients</p>
                  <p style={{ color: '#5a6e4a', fontSize: '0.85rem' }}>AI will automatically detect ingredients from the photo!</p>
                </>
              )}
            </div>

            <div style={{ position: 'relative', marginBottom: '1rem' }} ref={dropdownRef}>
              <p style={{ fontWeight: '600', color: '#2d4a1e', marginBottom: '0.5rem', fontSize: '0.95rem' }}>
                🔍 Search and add ingredients:
              </p>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    onFocus={() => { if (inputValue.trim().length > 0) setShowDropdown(true); }}
                    placeholder="Type an ingredient (e.g. chicken, rice, paneer...)"
                    style={{
                      width: '100%', padding: '0.8rem 1rem', borderRadius: '10px',
                      border: '2px solid #c8d8b0', fontSize: '1rem', outline: 'none',
                      backgroundColor: '#f7f9f4', boxSizing: 'border-box',
                      borderColor: showDropdown ? '#4a7c2f' : '#c8d8b0'
                    }}
                  />
                  {showDropdown && suggestions.length > 0 && (
                    <div style={{
                      position: 'absolute', top: '100%', left: 0, right: 0,
                      backgroundColor: 'white', borderRadius: '0 0 12px 12px',
                      boxShadow: '0 8px 25px rgba(74,124,47,0.15)',
                      border: '2px solid #4a7c2f', borderTop: 'none',
                      zIndex: 1000, maxHeight: '250px', overflowY: 'auto'
                    }}>
                      {suggestions.map((suggestion, index) => (
                        <div key={suggestion} onMouseDown={() => addIngredient(suggestion)} onMouseEnter={() => setHighlightedIndex(index)}
                          style={{
                            padding: '0.7rem 1rem', cursor: 'pointer',
                            backgroundColor: highlightedIndex === index ? '#e8f0e0' : 'white',
                            color: highlightedIndex === index ? '#2d4a1e' : '#334155',
                            fontWeight: highlightedIndex === index ? '700' : '500',
                            fontSize: '0.95rem',
                            borderBottom: index < suggestions.length - 1 ? '1px solid #f0f4ea' : 'none',
                            display: 'flex', alignItems: 'center', gap: '0.5rem'
                          }}>
                          <span style={{ color: '#4a7c2f' }}>🥬</span>
                          {suggestion}
                        </div>
                      ))}
                      {!suggestions.some(s => s.toLowerCase() === inputValue.toLowerCase()) && (
                        <div onMouseDown={() => addIngredient(inputValue)}
                          style={{
                            padding: '0.7rem 1rem', cursor: 'pointer',
                            backgroundColor: '#f7f9f4', color: '#4a7c2f',
                            fontWeight: '600', fontSize: '0.9rem',
                            borderTop: '1px solid #e8f0e0',
                            display: 'flex', alignItems: 'center', gap: '0.5rem'
                          }}>
                          <span>➕</span> Add "<strong>{inputValue}</strong>" as custom ingredient
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <button onClick={() => addIngredient(inputValue)} style={btnStyle}>+ Add</button>
              </div>
              <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginTop: '0.4rem' }}>
                💡 Use ↑↓ arrow keys to navigate, Enter to select
              </p>
            </div>

            {ingredients.length > 0 ? (
              <div>
                <p style={{ fontWeight: '600', color: '#2d4a1e', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                  ✅ Added ingredients ({ingredients.length}):
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {ingredients.map((ing, index) => (
                    <span key={index} style={{
                      backgroundColor: '#e8f0e0', color: '#2d4a1e', padding: '0.4rem 0.8rem',
                      borderRadius: '50px', fontSize: '0.9rem', fontWeight: '600',
                      border: '2px solid #c8d8b0', display: 'flex', alignItems: 'center', gap: '0.4rem'
                    }}>
                      {ing}
                      <span onClick={() => removeIngredient(ing)} style={{ cursor: 'pointer', color: '#dc2626', fontWeight: '800', fontSize: '1rem' }}>×</span>
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                No ingredients added yet. Search above or upload a photo!
              </p>
            )}
          </div>

          <div style={cardStyle}>
            <h2 style={{ fontWeight: '700', marginBottom: '0.5rem', color: '#1a2e10' }}>Step 2: Allergy Filter ⚠️</h2>
            <p style={{ color: '#5a6e4a', fontSize: '0.9rem', marginBottom: '1rem' }}>Select anything you are allergic to — AI will never include these!</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.7rem' }}>
              {COMMON_ALLERGENS.map((allergen) => {
                const clean = allergen.split(' ').slice(1).join(' ');
                const selected = allergies.includes(clean);
                return (
                  <button key={allergen} onClick={() => toggleAllergy(allergen)} style={{
                    padding: '0.5rem 1rem', borderRadius: '50px',
                    border: selected ? '2px solid #4a7c2f' : '2px solid #c8d8b0',
                    backgroundColor: selected ? '#e8f0e0' : 'white',
                    color: selected ? '#2d4a1e' : '#5a6e4a',
                    cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem',
                    textDecoration: selected ? 'line-through' : 'none', transition: 'all 0.2s'
                  }}>
                    {allergen} {selected ? '✕' : ''}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={cardStyle}>
            <h2 style={{ fontWeight: '700', marginBottom: '1rem', color: '#1a2e10' }}>Step 3: Dietary Preference</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.8rem' }}>
              {DIETARY_OPTIONS.map((option) => (
                <button key={option.label} onClick={() => setDietary(option.label)} style={{
                  padding: '0.8rem', borderRadius: '10px',
                  border: dietary === option.label ? '2px solid #4a7c2f' : '2px solid #c8d8b0',
                  backgroundColor: dietary === option.label ? '#e8f0e0' : 'white',
                  color: dietary === option.label ? '#2d4a1e' : '#5a6e4a',
                  cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem', transition: 'all 0.2s'
                }}>
                  {option.icon} {option.label}
                </button>
              ))}
            </div>
          </div>

          <div style={cardStyle}>
            <h2 style={{ fontWeight: '700', marginBottom: '1rem', color: '#1a2e10' }}>Step 4: Recipe Language 🌍</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem' }}>
              {LANGUAGES.map((lang) => (
                <button key={lang.code} onClick={() => setLanguage(lang.code)} style={{
                  padding: '0.6rem 1.2rem', borderRadius: '50px',
                  border: language === lang.code ? '2px solid #4a7c2f' : '2px solid #c8d8b0',
                  backgroundColor: language === lang.code ? '#e8f0e0' : 'white',
                  color: language === lang.code ? '#2d4a1e' : '#5a6e4a',
                  cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem', transition: 'all 0.2s'
                }}>
                  {lang.label}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div style={{ backgroundColor: '#fef2f2', color: '#dc2626', padding: '1rem', borderRadius: '10px', marginBottom: '1rem', border: '1px solid #fecaca', fontWeight: '600' }}>
              ⚠️ {error}
            </div>
          )}

          <button onClick={generateRecipes} disabled={loading} style={{
            width: '100%', padding: '1rem',
            background: loading ? '#a8c48a' : 'linear-gradient(135deg, #2d4a1e, #4a7c2f)',
            color: 'white', border: 'none', borderRadius: '12px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: '800', fontSize: '1.1rem', marginBottom: '2rem',
            boxShadow: '0 4px 15px rgba(74,124,47,0.3)', letterSpacing: '0.5px'
          }}>
            {loading ? '⏳ AI is generating your recipes...' : '🚀 Generate Recipes with AI'}
          </button>

          {loading && (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🤖</div>
              <p style={{ color: '#4a7c2f', fontWeight: '700', fontSize: '1.1rem' }}>AI is cooking up your recipes...</p>
              <p style={{ color: '#5a6e4a' }}>This usually takes 10-15 seconds</p>
            </div>
          )}

          {recipes.length > 0 && (
            <div>
              <h2 style={{ textAlign: 'center', fontSize: '1.5rem', fontWeight: '800', marginBottom: '0.5rem', color: '#1a2e10' }}>
                🎉 Your AI Generated Recipes!
              </h2>
              <p style={{ textAlign: 'center', color: '#5a6e4a', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                💬 Click <strong>"Ask AI about this recipe"</strong> on any card to chat about it!
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                {recipes.map((recipe, index) => (
                  <RecipeCard
                    key={index}
                    recipe={recipe}
                    onFavourite={toggleFavourite}
                    isFavourite={isFavourite(recipe)}
                    onSelectForChat={handleSelectForChat}
                    isSelected={selectedRecipe?.name === recipe.name}
                    user={user}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'favourites' && (
        <div>
          <h2 style={{ fontWeight: '800', fontSize: '1.5rem', marginBottom: '1.5rem', color: '#1a2e10' }}>⭐ Your Favourite Recipes</h2>
          {favourites.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: 'white', borderRadius: '20px', border: '1px solid #c8d8b0' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>⭐</div>
              <p style={{ color: '#5a6e4a', fontSize: '1.1rem', fontWeight: '600' }}>No favourites yet!</p>
              <p style={{ color: '#94a3b8' }}>Generate some recipes and click the ⭐ to save them here</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {favourites.map((recipe, index) => (
                <RecipeCard key={index} recipe={recipe} onFavourite={toggleFavourite} isFavourite={true} onSelectForChat={handleSelectForChat} isSelected={selectedRecipe?.name === recipe.name} user={user}/>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'chat' && (
        <div style={cardStyle}>
          <h2 style={{ fontWeight: '800', fontSize: '1.5rem', marginBottom: '0.3rem', color: '#1a2e10' }}>🤖 Cooking Assistant</h2>
          <p style={{ color: '#5a6e4a', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Ask me anything while cooking! I speak {language} 🌍</p>

          {selectedRecipe ? (
            <div style={{ backgroundColor: '#e8f0e0', padding: '0.7rem 1rem', borderRadius: '10px', marginBottom: '1rem', fontSize: '0.85rem', color: '#2d4a1e', fontWeight: '600', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>🍳 Focused on: <strong>{selectedRecipe.name}</strong></span>
              <button onClick={() => { setSelectedRecipe(null); setChatMessages([{ role: 'bot', text: '👋 Hi! Select a recipe and ask me anything about it!' }]); }}
                style={{ background: 'none', border: '1px solid #4a7c2f', borderRadius: '6px', padding: '0.2rem 0.6rem', cursor: 'pointer', color: '#2d4a1e', fontSize: '0.8rem' }}>
                ✕ Clear
              </button>
            </div>
          ) : recipes.length > 0 ? (
            <div style={{ backgroundColor: '#fef3c7', padding: '0.7rem 1rem', borderRadius: '10px', marginBottom: '1rem', fontSize: '0.85rem', color: '#92400e', fontWeight: '600' }}>
              💡 Go back and click <strong>"Ask AI about this recipe"</strong> to focus on a specific dish!
            </div>
          ) : null}

          <div style={{ height: '400px', overflowY: 'auto', backgroundColor: '#f0f4ea', borderRadius: '12px', padding: '1rem', marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            {chatMessages.map((msg, index) => (
              <div key={index} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  background: msg.role === 'user' ? 'linear-gradient(135deg, #2d4a1e, #4a7c2f)' : 'white',
                  color: msg.role === 'user' ? 'white' : '#1a2e10',
                  padding: '0.8rem 1.2rem',
                  borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  maxWidth: '75%', fontSize: '0.95rem', lineHeight: '1.5',
                  boxShadow: '0 2px 8px rgba(74,124,47,0.1)',
                  border: msg.role === 'user' ? 'none' : '1px solid #c8d8b0'
                }}>
                  {msg.text.split(/\*\*(.*?)\*\*/g).map((part, i) =>
  i % 2 === 1 ? <strong key={i}>{part}</strong> : part
)}
                </div>
              </div>
            ))}
            {chatLoading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{ backgroundColor: 'white', padding: '0.8rem 1.2rem', borderRadius: '18px 18px 18px 4px', color: '#5a6e4a', fontSize: '0.95rem', border: '1px solid #c8d8b0' }}>
                  🤖 Thinking...
                </div>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="text" value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && sendChatMessage()}
              placeholder={selectedRecipe ? `Ask about ${selectedRecipe.name}...` : 'Ask any cooking question...'}
              style={{ flex: 1, padding: '0.8rem 1rem', borderRadius: '10px', border: '2px solid #c8d8b0', fontSize: '0.95rem', outline: 'none', backgroundColor: '#f7f9f4' }}
              onFocus={e => e.target.style.borderColor = '#4a7c2f'}
              onBlur={e => e.target.style.borderColor = '#c8d8b0'}
            />
            <button onClick={sendChatMessage} style={btnStyle}>Send 🚀</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CreateRecipe;