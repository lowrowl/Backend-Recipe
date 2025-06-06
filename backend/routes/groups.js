const express = require('express');
const Group = require('../models/Group');
const Recipe = require('../models/Recipe');
const router = express.Router();
const multer = require('../multer');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const auth = require('../middleware/auth'); // Solo si quieres proteger los endpoints

// Crear grupo (con imagen)
router.post('/', auth, multer.single('image'), async (req, res) => {
  try {
    const { name, recipes } = req.body;

    let imageUrl = null;

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'groups'
      });
      imageUrl = result.secure_url;
      fs.unlinkSync(req.file.path); // Eliminamos el archivo local temporal
    }

    const newGroup = new Group({
      name,
      recipes: recipes || [],
      image: imageUrl
    });

    await newGroup.save();
    res.status(201).json(newGroup);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Obtener todos los grupos
router.get('/', async (req, res) => {
  try {
    const groups = await Group.find().populate('recipes');
    res.json(groups);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener un grupo específico
router.get('/:id', async (req, res) => {
  try {
    const group = await Group.findById(req.params.id).populate('recipes');
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }
    res.json(group);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Añadir receta a grupo
router.put('/:id/addRecipe', async (req, res) => {
  const { recipeId } = req.body;

  try {
    const group = await Group.findById(req.params.id);
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    // Verifica si ya existe la receta en el grupo
    if (group.recipes.includes(recipeId)) {
      return res.status(400).json({ error: 'La receta ya está en el grupo' });
    }

    group.recipes.push(recipeId);
    await group.save();
    res.json(group);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar grupo
router.delete('/:id', async (req, res) => {
  try {
    const group = await Group.findByIdAndDelete(req.params.id);
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }
    res.json({ message: 'Group deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener recetas de un grupo específico

router.get('/:id/recipes', async (req, res) => {
  try {
    const groupId = req.params.id;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    // Buscamos las recetas donde esté este grupo asociado
    const recipes = await Recipe.find({ groups: groupId });

    res.json(recipes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;