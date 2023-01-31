const express = require('express');
const router = express.Router();
const optionControler = require('../controlers/option.controller');


router.post('/', optionControler.postOption);

router.get('/', optionControler.getOption);

router.get('/:id', optionControler.getOne);

router.patch('/:id', optionControler.patch);

router.delete('/:id', optionControler.delete);

module.exports = router;
