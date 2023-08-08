const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 4,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: 5,
    maxlength: 255
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024
  },
  role: {
    type: String,
    required: true,
    enum: ['user', 'admin'],
    default: 'user'
  }
});
userSchema.pre('remove', async function(next) {
  try {
    await Car.deleteMany({ user: this._id }); // Eliminar los coches asociados a este usuario.
    next();
  } catch (err) {
    next(err);
  }
});
module.exports = mongoose.model('User', userSchema);