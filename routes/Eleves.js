const express = require('express');
const router = express.Router();
const Eleve = require('../models/eleve');
const Classe = require('../models/classe');
const auth = require('../middleware/auth');

// GET /api/eleves/:classe_id — Récupérer les élèves d'une classe
router.get('/:classe_id', auth, async (req, res) => {
  try {
    const eleves = await Eleve.find({ classe_id: req.params.classe_id });
    res.json(eleves);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.', erreur: err.message });
  }
});

// POST /api/eleves — Ajouter un élève
router.post('/', auth, async (req, res) => {
  try {
    const { nom, prenom, matricule, classe_id } = req.body;

    if (!nom || !prenom || !matricule || !classe_id) {
      return res.status(400).json({ message: 'Tous les champs sont requis.' });
    }

    const existant = await Eleve.findOne({ matricule });
    if (existant) {
      return res.status(400).json({ message: 'Ce matricule élève existe déjà.' });
    }

    const eleve = await Eleve.create({ nom, prenom, matricule, classe_id, notes: {} });
    res.status(201).json(eleve);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.', erreur: err.message });
  }
});

// POST /api/eleves/:eleve_id/notes — Ajouter une note à un élève
router.post('/:eleve_id/notes', auth, async (req, res) => {
  try {
    const { matiere, note } = req.body;

    if (!matiere || note === undefined) {
      return res.status(400).json({ message: 'Matière et note requises.' });
    }

    if (note < 0 || note > 20) {
      return res.status(400).json({ message: 'La note doit être entre 0 et 20.' });
    }

    const eleve = await Eleve.findById(req.params.eleve_id);
    if (!eleve) {
      return res.status(404).json({ message: 'Élève introuvable.' });
    }

    // Ajouter la note à la matière
    const notesMatiere = eleve.notes.get(matiere) || [];
    notesMatiere.push(note);
    eleve.notes.set(matiere, notesMatiere);
    await eleve.save();

    res.json({ message: 'Note ajoutée.', eleve });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.', erreur: err.message });
  }
});

module.exports = router;