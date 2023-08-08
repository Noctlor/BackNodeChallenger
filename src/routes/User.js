const express = require('express');
const router = express.Router();
const User = require('../models/users');
const jwt = require('jsonwebtoken');



router.post('/', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const user = new User({ name, email, password, role });
    await user.save();
    res.send(user);
  } catch (error) {
    res.status(500).send('Error al crear usuario. Detalles del error: ' + error.message);
  }
});

router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = new User({ name, email, password });
    await user.save();
    res.send(user);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al crear usuario. Detalles del error: ' + error.message);
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || user.password !== password) {
      return res.status(401).send('Credenciales inválidas.');
    }

    // Generar token JWT
    const token = jwt.sign({ userId: user._id, role: user.role }, 'YOUR_SECRET_KEY', { expiresIn: '1h' });

    res.json({ token });
  } catch (error) {
    res.status(500).send('Error al iniciar sesión.');
  }
});


router.get('/', async (req, res) => {


  const users = await User.find();
  res.json(users);
});

// Actualizar usuario
router.put('/:id', async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).send('Access denied.');

  const user = await User.findByIdAndUpdate(req.params.id, {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    role: req.body.role 
  }, { new: true });

  if (!user) return res.status(404).send('The user with the given ID was not found.');
  res.send(user);
});

// Eliminar usuario
router.delete('/:id', async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).send('Access denied.');

  const user = await User.findById(req.params.id);

  if (!user) return res.status(404).send('The user with the given ID was not found.');

  await user.remove();
  
  res.send(user);
});

module.exports = router;
