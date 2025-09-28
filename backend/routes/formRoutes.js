const express = require('express');
const router = express.Router();
const FormEntry = require('../models/formEntry');

// POST route to handle form submissions
router.post('/', async (req, res) => {
  try {
    const newEntry = new FormEntry(req.body);
    await newEntry.save();
    res.status(201).send('Form entry saved');
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// GET route to retrieve all form entries (optional)
router.get('/', async (req, res) => {
  try {
    const entries = await FormEntry.find();
    res.status(200).json(entries);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = router;

