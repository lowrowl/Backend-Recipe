const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'El nombre del grupo es obligatorio'],
    minlength: [3, 'El nombre debe tener al menos 3 caracteres'] 
  },
  image: { 
    type: String, 
    required: [true, 'La imagen del grupo es obligatoria'] 
  },
  recipes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recipe'
  }]
}, { timestamps: true });

module.exports = mongoose.model('Group', groupSchema);
