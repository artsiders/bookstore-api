const express = require('express');
const router = express.Router();
const levelControler = require('../controlers/level.controller');


router.post('/', levelControler.postLevel);

router.get('/', levelControler.getLevel);

module.exports = router;
