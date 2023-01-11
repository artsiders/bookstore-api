const express = require('express');
const router = express.Router();
const specialityControler = require('../controlers/speciality.controller');
const { checkUser } = require('../middleware/auth.middleware');


router.post('/', specialityControler.postSpeciality);

router.get('/', specialityControler.getSpeciality);

router.get('/:id', specialityControler.getOne);

router.patch('/:id', specialityControler.patch);

router.delete('/:id', specialityControler.delete);

module.exports = router;
