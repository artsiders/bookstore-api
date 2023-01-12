const express = require('express');
const router = express.Router();
const yearControler = require('../controlers/year.controller');


router.post('/', yearControler.postYear);

router.get('/', yearControler.getYear);

module.exports = router;
