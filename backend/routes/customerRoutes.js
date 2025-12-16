const express = require('express');
const router = express.Router();
const { auth, adminOnly } = require('../middlewares/auth');
const { getProfile, listCustomers } = require('../controllers/customerController');

router.get('/me', auth, getProfile);
router.get('/', adminOnly, listCustomers); // admin use

module.exports = router;
