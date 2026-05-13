const mongoose = require('mongoose');

const eleveSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  matricule: { type: String, required: true, unique: true },
  classe_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Classe', required: true },
  notes: {
    type: Map,
    of: [Number],
    default: {},
  },
}, { timestamps: true });

module.exports = mongoose.model('Eleve', eleveSchema);