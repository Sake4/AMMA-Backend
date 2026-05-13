const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Professeur = require('../models/Professeur');
const Classe = require('../models/Classe');

// POST /api/auth/inscription
router.post('/inscription', async (req, res) => {
  try {
    const { nom, prenom, matricule, classe, matiere, motDePasse } = req.body;

    // Vérifier que tous les champs sont présents
    if (!nom || !prenom || !matricule || !classe || !matiere || !motDePasse) {
      return res.status(400).json({ message: 'Tous les champs sont requis.' });
    }

    // Vérifier si le matricule existe déjà
    const existant = await Professeur.findOne({ matricule });
    if (existant) {
      return res.status(400).json({ message: 'Ce matricule est déjà utilisé.' });
    }

    // Créer la classe si elle n'existe pas encore
    let classeDoc = await Classe.findOne({ nom_classe: classe.toUpperCase() });
    if (!classeDoc) {
      classeDoc = await Classe.create({ nom_classe: classe.toUpperCase() });
    }

    // Hasher le mot de passe
    const hash = await bcrypt.hash(motDePasse, 10);

    // Créer le professeur
    const prof = await Professeur.create({
      nom,
      prenom,
      matricule: matricule.toUpperCase(),
      motDePasse: hash,
      classes: [{ classe_id: classeDoc._id, matiere }],
    });

    // Générer le token JWT
    const token = jwt.sign(
      { id: prof._id, matricule: prof.matricule },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Inscription réussie.',
      token,
      prof: {
        id: prof._id,
        nom: prof.nom,
        prenom: prof.prenom,
        matricule: prof.matricule,
        classes: [{ classe_id: classeDoc._id, nom_classe: classeDoc.nom_classe, matiere }],
      },
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur.', erreur: err.message });
  }
});

// POST /api/auth/connexion
router.post('/connexion', async (req, res) => {
  try {
    const { matricule, motDePasse } = req.body;

    if (!matricule || !motDePasse) {
      return res.status(400).json({ message: 'Matricule et mot de passe requis.' });
    }

    // Chercher le prof
    const prof = await Professeur.findOne({ matricule: matricule.toUpperCase() })
      .populate('classes.classe_id', 'nom_classe');

    if (!prof) {
      return res.status(404).json({ message: 'Matricule introuvable.' });
    }

    // Vérifier le mot de passe
    const valide = await bcrypt.compare(motDePasse, prof.motDePasse);
    if (!valide) {
      return res.status(401).json({ message: 'Mot de passe incorrect.' });
    }

    // Générer le token JWT
    const token = jwt.sign(
      { id: prof._id, matricule: prof.matricule },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Connexion réussie.',
      token,
      prof: {
        id: prof._id,
        nom: prof.nom,
        prenom: prof.prenom,
        matricule: prof.matricule,
        classes: prof.classes.map(c => ({
          classe_id: c.classe_id._id,
          nom_classe: c.classe_id.nom_classe,
          matiere: c.matiere,
        })),
      },
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur.', erreur: err.message });
  }
});

module.exports = router;