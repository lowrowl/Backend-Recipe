const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  ingredients: {
    type: [String],
    required: true,
  },
  steps: {
    type: [String],
    required: true,
  },
  image: {
    type: String,
    required: false, // Puedes cambiar a true si la imagen es obligatoria
  },
  groups: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group', // Hace referencia al modelo de Grupo
  }],
  createdAt: {
    type: Date,
    default: Date.now, // Valor por defecto: fecha actual
  },
  updatedAt: {
    type: Date,
    default: Date.now, // Valor por defecto: fecha actual
  },
});

module.exports = mongoose.model('Recipe', recipeSchema);