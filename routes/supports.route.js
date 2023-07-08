const express = require('express');
const router = express.Router();
const supportsControler = require('../controlers/supports.controller');
const multer = require('multer')
const { join } = require('path');


let storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, join(__dirname + '/../uploads/'))
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


let upload = multer({ storage }).fields([{ name: 'pdf', maxCount: 1 }, { name: 'docx', maxCount: 1 }]);


router.post('/', upload, supportsControler.postBook);

router.patch('/:id', upload, supportsControler.patchBook);

router.get('/', supportsControler.getBook);

router.get('/:id', supportsControler.getOne);

router.delete('/:id', supportsControler.delete);

module.exports = router;
