require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const elevesRoutes = require('./routes/eleves');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/eleves', elevesRoutes);

// Route de test
app.get('/', (req, res) => {
  res.json({ message: 'API AMMA opérationnelle ✅' });
});

// Connexion MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Connecté à MongoDB Atlas');
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`🚀 Serveur lancé sur le port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ Erreur connexion MongoDB :', err.message);
    process.exit(1);
  });