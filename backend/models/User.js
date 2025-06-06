const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  nombre: { 
    type: String, 
    required: [true, 'El nombre es obligatorio'], 
    minlength: [2, 'El nombre debe tener al menos 2 caracteres'] 
  },
  apellido: { 
    type: String, 
    required: [true, 'El apellido es obligatorio'],
    minlength: [2, 'El apellido debe tener al menos 2 caracteres']
  },
  pais: {
    type: String,
    required: [true, 'El país es obligatorio'] 
  },
  esChef: { 
    type: Boolean, 
    default: false 
  },
  email: { 
    type: String, 
    required: [true, 'El email es obligatorio'],
    unique: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'El email no es válido']
  },
  password: { 
    type: String, 
    required: [true, 'La contraseña es obligatoria'], 
    minlength: [8, 'La contraseña debe tener mínimo 8 caracteres']
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
