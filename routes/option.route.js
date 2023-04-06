const express = require('express');
const router = express.Router();
const optionControler = require('../controlers/option.controller');
const multer = require('multer')
const { join } = require('path');



let storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, join(__dirname + '/../uploads/options'))
    },
    filename: async function (req, file, callback) {
        req.Uploaded = true

        try {
            callback(null, "_tmp_" + Date.now() + '_' + file.originalname);
        } catch (error) {
            req.Uploaded = false
        }
    }
});

let upload = multer({ storage }).single('file');

router.post('/', upload, optionControler.postOption);

router.get('/', optionControler.getOption);

router.get('/:id', optionControler.getOne);

router.patch('/:id', optionControler.patch);

router.delete('/:id', optionControler.delete);

module.exports = router;
