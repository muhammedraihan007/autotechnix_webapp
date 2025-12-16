const express = require('express');
const router = express.Router();
const { addPart, listParts } = require('../controllers/inventoryController');
const { auth, adminOnly } = require('../middlewares/auth');

router.post('/', adminOnly, addPart);
router.get('/', auth, listParts);

module.exports = router;
