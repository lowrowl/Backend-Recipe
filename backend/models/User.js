const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  nombre: { 
    type: String, 
    required: false 
  },
  apellido: { 
    type: String, 
    required: false
  },
  pais: {
    type: String,
    required: false 
  },
  esChef: { 
    type: Boolean, 
    default: false 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
