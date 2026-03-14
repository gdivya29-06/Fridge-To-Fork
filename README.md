# 🍳 Smart Recipe AI

An AI-powered recipe generator that turns your ingredients into delicious recipes instantly!

Built as a B.Tech CSE (AIML) project at **SRM Institute of Science and Technology**.

---

## ✨ Features

- 🤖 **AI Recipe Generation** — Generate 6 famous recipes from your ingredients
- 📸 **Photo Detection** — Upload a photo and AI detects ingredients automatically
- 🌍 **Multi-language Support** — Get recipes in English, Hindi, Tamil, Telugu, Spanish, French
- ⚠️ **Allergy Filter** — Never include allergens you're sensitive to
- 🥗 **Dietary Preferences** — Vegetarian, Vegan, Keto, Halal, Gluten-Free and more
- 🤖 **Cooking Assistant Chatbot** — Ask questions about any recipe while cooking
- ⭐ **Favourites** — Save your favourite recipes locally
- 📖 **My Cookbook** — All your generated recipes saved to your account
- 🔐 **Firebase Authentication** — Secure login and signup

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| React.js | Frontend UI |
| Node.js + Express | Backend Server |
| OpenRouter AI (Gemma) | AI Recipe Generation |
| Firebase Auth | User Authentication |
| Firestore | Recipe History Database |
| Unsplash API | Recipe Images |

---

## 👥 Team

| Name | Role |
|------|------|
| Gummala Divya | Full Stack AI Developer |
| Cyna Benny | UX Tester & Quality Analyst |
| Sujai Jaideep | AI Research Analyst |

---

## 🚀 How to Run Locally

### Prerequisites
- Node.js installed
- OpenRouter API key (free at openrouter.ai)
- Unsplash API key (free at unsplash.com/developers)
- Firebase project

### Backend Setup
```bash
cd server
npm install
```

Create a `.env` file in the server folder:
```
OPENROUTER_API_KEY=your_openrouter_key
UNSPLASH_ACCESS_KEY=your_unsplash_key
PORT=5001
```

Start the server:
```bash
node index.js
```

### Frontend Setup
```bash
cd client
npm install
npm start
```

App runs at `http://localhost:3000`

---

## 📸 Screenshots

### Home Page
![Home](screenshots/home.png)

### Recipe Generator
![Recipes](screenshots/recipes.png)

### My Cookbook
![Cookbook](screenshots/cookbook.png)

---

## 🎯 Future Enhancements

- 📱 Mobile App (React Native)
- 🛒 Grocery Integration
- 📊 Nutrition Tracking
- 🎥 Video Instructions
- 🤝 Social Recipe Sharing

---

*Built with ❤️ by Team Smart Recipe AI — SRM Institute of Science and Technology*
