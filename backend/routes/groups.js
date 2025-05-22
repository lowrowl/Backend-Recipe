const express = require('express');
const Group = require('../models/Group');
const Recipe = require('../models/Recipe');
const router = express.Router();

// Crear grupo
router.post('/', async (req, res) => {
  const { name, recipes } = req.body;

  try {
    const newGroup = new Group({ name, recipes });
    await newGroup.save();
    res.status(201).json(newGroup);
  } catch (error) {
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

module.exports = router;