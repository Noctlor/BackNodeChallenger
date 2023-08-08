const express = require('express');
const router = express.Router();
const Car = require('../models/cars');
const User = require('../models/users'); 
const auth = require('../middleware/auth');


router.post('/', async (req, res) => {
  const user = await User.findById(req.body.userId);
  if (!user) return res.status(400).send('Invalid user.');

  let car = new Car({
    placas: req.body.placas,
    marca: req.body.marca,
    color: req.body.color,
    posicion: {
      latitud: req.body.posicion.latitud,
      longitud: req.body.posicion.longitud
    },
    user: user._id
  });

  car = await car.save();
  res.send(car);
});
router.get('/user/:userId/cars', async (req, res) => {
  try {
    const userId = req.params.userId;
    const cars = await Car.find({ user: userId }).populate('user', 'name -_id');
    res.send(cars);
  } catch (error) {
    res.status(500).send('Error al obtener los carros del usuario.');
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const user = req.user;
    if (user.role === 'admin') {
      const cars = await Car.find().populate('user', 'name -_id');
      res.send(cars);
    } else {
      const cars = await Car.find({ user: user._id }).populate('user', 'name -_id');
      res.send(cars);
    }
  } catch (error) {
    res.status(500).send('Error al obtener los carros.');
  }
});


router.get('/:id',auth, async (req, res) => {
    const car = await Car.findById(req.params.id).populate('user', 'name -_id');
    if (!car) return res.status(404).send('The car with the given ID was not found.');
  
    if (req.user.role !== 'admin' && req.user._id !== car.user._id) {
      return res.status(403).send('Access denied.');
    }
  
    res.send(car);
  });


router.put('/:id',auth, async (req, res) => {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).send('The car with the given ID was not found.');
  
    if (req.user.role !== 'admin' && req.user._id.toString() !== car.user.toString()) {
      return res.status(403).send('Access denied.');
    }
  
    car.placas = req.body.placas;
    car.marca = req.body.marca;
    car.color = req.body.color;
    car.posicion = {
      latitud: req.body.posicion.latitud,
      longitud: req.body.posicion.longitud
    };
    
    await car.save();
    
    res.send(car);
  });
  

  router.delete('/:id',auth, async (req, res) => {
    const car = await Car.findById(req.params.id);
  
    if (!car) return res.status(404).send('The car with the given ID was not found.');
  
    if (req.user.role !== 'admin' && req.user._id.toString() !== car.user.toString()) {
      return res.status(403).send('Access denied.');
    }
  
    await car.remove();
    
    res.send(car);
  });

module.exports = router;
