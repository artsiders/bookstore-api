const express = require('express');
const router = express.Router();
const bookControler = require('../controlers/book.controller');
const multer = require('multer')
const { join } = require('path');
const path = require('path');


let storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, join(__dirname + '/../uploads/'))
    },
    filename: async function (req, file, callback) {
        req.Uploaded = true

        try {
            callback(null, Date.now() + '_' + file.originalname);
        } catch (error) {
            req.Uploaded = false
        }
    }
});


let upload = multer({ storage }).fields([{ name: 'pdf', maxCount: 1 }, { name: 'docx', maxCount: 1 }]);


router.post('/', upload, bookControler.postBook);

router.get('/', bookControler.getBook);

router.get('/:id', bookControler.getOne);

router.patch('/:id', bookControler.patch);

router.delete('/:id', bookControler.delete);

module.exports = router;
