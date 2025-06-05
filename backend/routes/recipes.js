const express = require('express');
const router = express.Router();
const Recipe = require('../models/Recipe');
const multer = require('multer');
const path = require('path');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

// Configuración de Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configuración de multer para archivo temporal
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'temp/'); // carpeta temporal
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Utilidad para normalizar campos (si solo hay uno, multer lo deja como string)
const normalize = (field) => Array.isArray(field) ? field : (field ? [field] : []);

router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { name, description } = req.body;
    let { ingredients, steps } = req.body;

    let imageUrl = null;

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'recipes'
      });
      imageUrl = result.secure_url;
      fs.unlinkSync(req.file.path);
    }

    // Normaliza los campos para que siempre sean arrays de strings
    ingredients = normalize(ingredients);
    steps = normalize(steps);

    const newRecipe = new Recipe({
      name,
      description,
      ingredients,
      steps,
      image: imageUrl,
    });

    await newRecipe.save();
    res.status(201).json(newRecipe);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Obtener todas las recetas
router.get('/', async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar receta
router.delete('/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndDelete(req.params.id);
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    res.json({ message: 'Recipe deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;