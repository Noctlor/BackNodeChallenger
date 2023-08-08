const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  placas: {
    type: String,
    required: true
  },
  marca: {
    type: String,
    required: true
  },
  color: {
    type: String,
    required: true
  },
  posicion: {
    latitud: { type: Number, required: true },
    longitud: { type: Number, required: true }
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

module.exports = mongoose.model('Car', carSchema);