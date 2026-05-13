const mongoose = require('mongoose');

const professeurSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  matricule: { type: String, required: true, unique: true },
  motDePasse: { type: String, required: true },
  classes: [
    {
      classe_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Classe' },
      matiere: { type: String, required: true },
    }
  ],
}, { timestamps: true });

module.exports = mongoose.model('Professeur', professeurSchema);