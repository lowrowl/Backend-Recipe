const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'El nombre de la receta es obligatorio'], 
    minlength: [3, 'El nombre debe tener al menos 3 caracteres'] 
  },
  description: { 
    type: String, 
    required: [true, 'La descripción es obligatoria'], 
    minlength: [10, 'La descripción debe tener al menos 10 caracteres'] 
  },
  ingredients: [{ 
    type: String, 
    required: [true, 'Debe incluir ingredientes']
  }],
  steps: [{ 
    type: String, 
    required: [true, 'Debe incluir pasos de preparación']
  }],
  image: { 
    type: String, 
    required: [true, 'La imagen es obligatoria'] 
  },
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  },
  groups: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group'
  }]
}, { timestamps: true });

module.exports = mongoose.model('Recipe', recipeSchema);
