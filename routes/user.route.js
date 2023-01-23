const express = require('express');
const router = express.Router();
const userControler = require('../controlers/user.controller');
const { checkUser } = require('../middleware/auth.middleware');

// router.get("*", checkUser)
router.post('/sign-up', userControler.signUp);
router.post('/sign-in', userControler.signIn);
router.get('/log-out', userControler.logOut);

router.get('/', checkUser, userControler.getAll);

router.get('/:id', userControler.getOne);

router.patch('/:id', userControler.patch);

router.delete('/:id', userControler.delete);

module.exports = router;
