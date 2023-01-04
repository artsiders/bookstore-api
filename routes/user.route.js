const express = require('express');
const router = express.Router();
const userControler = require('../controlers/user.controller');


router.post('/sign-up', userControler.signUp);
router.post('/sign-in', userControler.signIn);
router.get('/log-out', userControler.logOut);

router.get('/', userControler.get);

router.get('/:id', userControler.getOne);

router.patch('/:id', userControler.patch);

router.delete('/:id', userControler.delete);

module.exports = router;
