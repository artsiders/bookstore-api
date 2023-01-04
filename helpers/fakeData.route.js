const express = require('express');
const router = express.Router();
const fakeData = require('./fakeData.controler')

router.post('/meditations', fakeData.fakeMeditaton)
router.post('/users', fakeData.fakeUser)
router.post('/subscriptions', fakeData.fakeSubscription)

module.exports = router;