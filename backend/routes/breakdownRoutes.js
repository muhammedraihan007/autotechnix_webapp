const express = require('express');
const router = express.Router();
const { auth, adminOnly } = require('../middlewares/auth');
const {
  createBreakdown,
  getBreakdowns,
  getBreakdown,
  updateBreakdownStatus,
} = require('../controllers/breakdownController');

// @route   POST api/breakdowns
// @desc    Create a breakdown request
// @access  Private (Customer)
router.post('/', auth, createBreakdown);

// @route   GET api/breakdowns
// @desc    Get all breakdown requests
// @access  Private (Admin)
router.get('/', adminOnly, getBreakdowns);

// @route   GET api/breakdowns/:id
// @desc    Get a specific breakdown request
// @access  Private (Admin)
router.get('/:id', adminOnly, getBreakdown);

// @route   PUT api/breakdowns/:id
// @desc    Update a breakdown request status
// @access  Private (Admin)
router.put('/:id', adminOnly, updateBreakdownStatus);

module.exports = router;
