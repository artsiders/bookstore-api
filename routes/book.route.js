const express = require('express');
const router = express.Router();
const bookControler = require('../controlers/book.controller');
const multer = require('multer')
const path = require("path")
const { popExtension } = require('../utils/function.utils');



let storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + '/../uploads/')
    },
    filename: async function (req, file, callback) {
        req.Uploaded = true
        try {
            callback(null, Date.now() + '_' + file.originalname);

            // sent extension file to next()
            req.extension = path.extname(file.originalname)
        } catch (error) {
            req.Uploaded = false
        }
    }
});
let upload = multer({ storage }).single('file');


router.post('/', upload, bookControler.postBook);

router.get('/', bookControler.getBook);

router.get('/:id', bookControler.getOne);

router.patch('/:id', bookControler.patch);

router.delete('/:id', bookControler.delete);

module.exports = router;
