const express = require('express');
const router = express.Router();
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

async function callAI(messages, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        { model: 'google/gemma-3-4b-it:free', messages },
        { headers: { 'Authorization': `Bearer ${OPENROUTER_API_KEY}`, 'Content-Type': 'application/json' } }
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

const KEYWORD_IMAGE_MAP = {
  // North Indian
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
  'sarson da saag': 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=800',
  'kadhi pakora': 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800',
  'navratan korma': 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800',
  'nihari': 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800',
  'haleem': 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800',
  'paya': 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800',
  'keema matar': 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800',
  'mutton korma': 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800',

  // Biryani varieties
  'biryani': 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800',
  'hyderabadi biryani': 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800',
  'lucknowi biryani': 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800',
  'awadhi biryani': 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800',
  'ambur biryani': 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800',
  'malabar biryani': 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800',
  'pulao': 'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=800',
  'jeera rice': 'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=800',
  'khichdi': 'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=800',

  // Breads
  'aloo paratha': 'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=800',
  'gobi paratha': 'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=800',
  'paratha': 'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=800',
  'naan': 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800',
  'garlic naan': 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800',
  'kulcha': 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800',
  'bhatura': 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800',
  'puri': 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800',
  'roti': 'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=800',
  'makki di roti': 'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=800',
  'lachha paratha': 'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=800',

  // Tandoor
  'tandoori chicken': 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800',
  'chicken tikka': 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800',
  'paneer tikka': 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=800',
  'seekh kebab': 'https://images.unsplash.com/photo-1555126634-323283e090fa?w=800',
  'galouti kebab': 'https://images.unsplash.com/photo-1555126634-323283e090fa?w=800',
  'boti kebab': 'https://images.unsplash.com/photo-1555126634-323283e090fa?w=800',
  'tikka masala': 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800',

  // Street food
  'pav bhaji': 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=800',
  'vada pav': 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=800',
  'pani puri': 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800',
  'golgappa': 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800',
  'aloo tikki': 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800',
  'samosa': 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800',
  'chole bhature': 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800',
  'dahi puri': 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800',
  'papdi chaat': 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800',
  'bhel puri': 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800',
  'misal pav': 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=800',

  // South Indian
  'masala dosa': 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=800',
  'dosa': 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=800',
  'rava dosa': 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=800',
  'paper dosa': 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=800',
  'uttapam': 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=800',
  'idli': 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800',
  'medu vada': 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800',
  'upma': 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800',
  'rava upma': 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800',
  'poha': 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800',
  'pongal': 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800',
  'appam': 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=800',
  'sambar': 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800',
  'rasam': 'https://images.unsplash.com/photo-1547592180-85f173990554?w=800',
  'avial': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800',
  'bisi bele bath': 'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=800',
  'curd rice': 'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=800',
  'tamarind rice': 'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=800',
  'lemon rice': 'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=800',
  'coconut rice': 'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=800',
  'chicken 65': 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800',
  'pepper chicken': 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800',
  'kerala fish curry': 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800',
  'meen moilee': 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800',
  'puttu': 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800',
  'idiyappam': 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800',
  'pesarattu': 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=800',

  // Indo-Chinese
  'chicken manchurian': 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800',
  'gobi manchurian': 'https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?w=800',
  'chilli paneer': 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=800',
  'chilli chicken': 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800',
  'hakka noodles': 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800',
  'schezwan fried rice': 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800',
  'honey chilli potato': 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800',

  // Rajasthani
  'dal baati churma': 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800',
  'dal baati': 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800',
  'laal maas': 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800',
  'ker sangri': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800',
  'gatte ki sabzi': 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800',

  // Sweets
  'gulab jamun': 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=800',
  'jalebi': 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=800',
  'ladoo': 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=800',
  'besan ladoo': 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=800',
  'gajar ka halwa': 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800',
  'halwa': 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800',
  'kheer': 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800',
  'rasmalai': 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=800',
  'rasgulla': 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=800',
  'mysore pak': 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=800',
  'payasam': 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800',
  'kesari': 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800',
  'modak': 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=800',
  'barfi': 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=800',
  'kulfi': 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800',
  'phirni': 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800',
  'malpua': 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=800',
  'shrikhand': 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800',

  // Drinks
  'lassi': 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=800',
  'mango lassi': 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=800',
  'masala chai': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
  'filter coffee': 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800',
  'thandai': 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=800',
  'aam panna': 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=800',

  // General Indian
  'paneer': 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=800',
  'handi': 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=800',
  'korma': 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800',
  'vindaloo': 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800',
  'curry': 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800',
  'masala': 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800',
  'sabzi': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800',
  'dal': 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800',
  'tikka': 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800',
  'raita': 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800',
  'dhokla': 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800',
  'khandvi': 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800',
  'thepla': 'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=800',
  'undhiyu': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800',
  'kosha mangsho': 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800',
  'machher jhol': 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800',
  'litti chokha': 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800',
  'momos': 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800',
  'thukpa': 'https://images.unsplash.com/photo-1547592180-85f173990554?w=800',

  // Italian
  'carbonara': 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800',
  'spaghetti bolognese': 'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=800',
  'cacio e pepe': 'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=800',
  'lasagna': 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=800',
  'risotto': 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=800',
  'tiramisu': 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800',
  'pizza': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800',
  'pasta': 'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=800',
  'spaghetti': 'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=800',
  'gnocchi': 'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=800',
  'pesto': 'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=800',
  'arancini': 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800',
  'bruschetta': 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800',
  'caprese': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800',
  'ossobuco': 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800',
  'panna cotta': 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800',
  'cannoli': 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800',
  'gelato': 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800',
  'focaccia': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800',
  'ciabatta': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800',
  'minestrone': 'https://images.unsplash.com/photo-1547592180-85f173990554?w=800',

  // Asian
  'sushi': 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=800',
  'ramen': 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800',
  'pad thai': 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=800',
  'bibimbap': 'https://images.unsplash.com/photo-1553163147-622ab57be1c7?w=800',
  'kimchi': 'https://images.unsplash.com/photo-1583224994559-1c69cafc7b57?w=800',
  'pho': 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800',
  'nasi goreng': 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800',
  'mie goreng': 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800',
  'rendang': 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800',
  'satay': 'https://images.unsplash.com/photo-1555126634-323283e090fa?w=800',
  'laksa': 'https://images.unsplash.com/photo-1547592180-85f173990554?w=800',
  'dim sum': 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800',
  'spring roll': 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800',
  'tempura': 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800',
  'teriyaki': 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800',
  'stir fry': 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800',
  'gyoza': 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800',
  'takoyaki': 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800',
  'okonomiyaki': 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800',
  'mochi': 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=800',
  'green curry': 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800',
  'massaman curry': 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800',
  'tom yum': 'https://images.unsplash.com/photo-1547592180-85f173990554?w=800',
  'khao soi': 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800',
  'mango sticky rice': 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800',

  // Middle Eastern
  'hummus': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800',
  'falafel': 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=800',
  'shawarma': 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=800',
  'kebab': 'https://images.unsplash.com/photo-1555126634-323283e090fa?w=800',
  'tagine': 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?w=800',
  'baklava': 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=800',
  'shakshuka': 'https://images.unsplash.com/photo-1510693206972-df098062cb71?w=800',
  'tabbouleh': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800',
  'fattoush': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800',
  'knafeh': 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=800',
  'maqluba': 'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=800',
  'mansaf': 'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=800',

  // Western & Fast food
  'burger': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800',
  'sandwich': 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800',
  'wrap': 'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?w=800',
  'hot dog': 'https://images.unsplash.com/photo-1619740455993-9d622ff4f4f1?w=800',
  'tacos': 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800',
  'burrito': 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=800',
  'quesadilla': 'https://images.unsplash.com/photo-1618040996337-56904b7850b9?w=800',
  'nachos': 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=800',
  'fries': 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=800',
  'steak': 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800',
  'schnitzel': 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800',
  'goulash': 'https://images.unsplash.com/photo-1547592180-85f173990554?w=800',
  'paella': 'https://images.unsplash.com/photo-1534080564583-6be75777b70a?w=800',
  'moussaka': 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=800',
  'coq au vin': 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800',
  'beef bourguignon': 'https://images.unsplash.com/photo-1547592180-85f173990554?w=800',
  'ratatouille': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800',
  'fish and chips': 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800',
  'shepherd pie': 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=800',

  // Breakfast
  'pancake': 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800',
  'waffle': 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=800',
  'french toast': 'https://images.unsplash.com/photo-1484723091739-30990d81a2aa?w=800',
  'omelette': 'https://images.unsplash.com/photo-1510693206972-df098062cb71?w=800',
  'granola': 'https://images.unsplash.com/photo-1517093157656-b9eccef91cb1?w=800',
  'porridge': 'https://images.unsplash.com/photo-1517093157656-b9eccef91cb1?w=800',

  // Soups
  'soup': 'https://images.unsplash.com/photo-1547592180-85f173990554?w=800',
  'stew': 'https://images.unsplash.com/photo-1547592180-85f173990554?w=800',
  'chowder': 'https://images.unsplash.com/photo-1547592180-85f173990554?w=800',
  'borscht': 'https://images.unsplash.com/photo-1547592180-85f173990554?w=800',

  // Proteins
  'chicken': 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800',
  'fish': 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800',
  'salmon': 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800',
  'shrimp': 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800',
  'prawn': 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800',
  'egg': 'https://images.unsplash.com/photo-1510693206972-df098062cb71?w=800',
  'tofu': 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800',

  // Salads & Veggies
  'salad': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800',
  'caesar salad': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800',
  'spinach': 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=800',
  'mushroom': 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800',
  'potato': 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800',
  'broccoli': 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=800',
  'cauliflower': 'https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?w=800',
  'eggplant': 'https://images.unsplash.com/photo-1490885578174-acda8905c2c6?w=800',

  // Noodles & Rice
  'fried rice': 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800',
  'rice': 'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=800',
  'noodles': 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800',
  'chow mein': 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800',
  'lo mein': 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800',

  // Desserts
  'cake': 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800',
  'brownie': 'https://images.unsplash.com/photo-1607131399685-9e3fc84a4568?w=800',
  'cookie': 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=800',
  'muffin': 'https://images.unsplash.com/photo-1558303166-58f2a16f8043?w=800',
  'pie': 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=800',
  'ice cream': 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800',
  'cheesecake': 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800',
  'pudding': 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800',
  'bread pudding': 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800',
  'crepe': 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800',
  'macaron': 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=800',
  'croissant': 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800',

  // Drinks
  'smoothie': 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=800',
  'juice': 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=800',
  'milkshake': 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=800',
  'tea': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
  'coffee': 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800',
  'lemonade': 'https://images.unsplash.com/photo-1523677011781-c91d1bbe2f9e?w=800',

  // Bread
  'bread': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800',
  'bagel': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800',
};

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=800',
  'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800',
  'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800',
  'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800',
  'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800',
  'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=800',
  'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=800',
  'https://images.unsplash.com/photo-1630383249896-424e482df921?w=800',
  'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800',
  'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=800',
  'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800',
  'https://images.unsplash.com/photo-1484723091739-30990d81a2aa?w=800',
  'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=800',
  'https://images.unsplash.com/photo-1574484284002-952d92456975?w=800',
  'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800',
  'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800',
  'https://images.unsplash.com/photo-1547592180-85f173990554?w=800',
  'https://images.unsplash.com/photo-1544025162-d76694265947?w=800',
  'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800',
  'https://images.unsplash.com/photo-1553621042-f6e147245754?w=800',
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800',
  'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800',
  'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800',
  'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=800',
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800',
  'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=800',
  'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800',
  'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=800',
  'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=800',
  'https://images.unsplash.com/photo-1553163147-622ab57be1c7?w=800',
];

let usedImagesInRequest = [];

function getFoodImage(recipeName, index) {
  const nameLower = recipeName.toLowerCase();
  const sorted = Object.entries(KEYWORD_IMAGE_MAP)
    .sort((a, b) => b[0].length - a[0].length);

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

router.post('/generate', async (req, res) => {
  try {
    const { ingredients, dietaryPreference, language, allergies } = req.body;

    if (!ingredients || ingredients.length === 0) {
      return res.status(400).json({ error: 'Please provide ingredients' });
    }

    const allergyText = allergies && allergies.length > 0
      ? `IMPORTANT: The user is allergic to these ingredients, NEVER include them: ${allergies.join(', ')}.`
      : '';

    const prompt = `You are a world-class chef who knows all famous dishes globally.
    
    The user has these ingredients: ${ingredients.join(', ')}.
    ${dietaryPreference && dietaryPreference !== 'No Preference' ? `Dietary preference: ${dietaryPreference}.` : ''}
    ${allergyText}
    
    Generate exactly 6 FAMOUS, well-known dishes that can be made with these ingredients.
    For example: if ingredients are chicken + rice + spices → suggest Biryani, Chicken Fried Rice, Chicken Pulao, Butter Chicken, Chicken Tikka Masala, Khichdi.
    Always suggest REAL, POPULAR dishes that people actually know and love!
    Make sure all 6 dishes are DIFFERENT from each other.
    
    Write the entire response in ${language || 'English'} language.
    
    Return ONLY a valid JSON array with exactly this structure, no extra text, no markdown:
    [
      {
        "name": "Famous Dish Name",
        "description": "Brief 1 sentence description",
        "calories": "approximate calories per serving",
        "ingredients": ["ingredient 1 with quantity", "ingredient 2 with quantity"],
        "instructions": ["step 1", "step 2", "step 3"],
        "dietaryTags": ["tag1", "tag2"],
        "tips": "one helpful cooking tip",
        "servings": "number of servings"
      }
    ]`;

    const text = await callAI([{ role: 'user', content: prompt }]);
    const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const recipes = JSON.parse(cleanedText);

    usedImagesInRequest = [];
    const recipesWithImages = recipes.map((recipe, index) => {
      const imageUrl = getFoodImage(recipe.name, index);
      return { ...recipe, imageUrl };
    });

    res.json({ recipes: recipesWithImages });

  } catch (error) {
    console.error('Error generating recipes:', error);
    res.status(500).json({ error: 'Failed to generate recipes. Please try again.' });
  }
});

router.post('/chat', async (req, res) => {
  try {
    const { message, language, selectedRecipe, currentRecipes } = req.body;

    const recipeContext = selectedRecipe
      ? `The user is asking about this SPECIFIC recipe: ${selectedRecipe}. Answer all questions based on this recipe only.`
      : currentRecipes
        ? `The user has generated these recipes: ${currentRecipes}. Answer based on these.`
        : '';

    const prompt = `You are a friendly and helpful cooking assistant.
    ${recipeContext}
    IMPORTANT: Detect the language the user is writing in and ALWAYS reply in that SAME language.
    If user writes in Hindi, reply in Hindi. If Tamil, reply in Tamil. If English, reply in English.
    Keep your answer short, friendly and practical — maximum 3-4 sentences.
    User question: ${message}`;

    const reply = await callAI([{ role: 'user', content: prompt }]);
    res.json({ reply });

  } catch (error) {
    console.error('Error in chat:', error);
    res.status(500).json({ error: 'Failed to get response' });
  }
});

module.exports = router;