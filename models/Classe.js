const mongoose = require('mongoose');

const classeSchema = new mongoose.Schema({
  nom_classe: { type: String, required: true, unique: true },
}, { timestamps: true });

module.exports = mongoose.model('Classe', classeSchema);