const express = require('express');
const { composeGearImages } = require('../controllers/customBuilderController');

const router = express.Router();

router.post('/compose', composeGearImages);

module.exports = router;
