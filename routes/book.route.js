const express = require('express');
const router = express.Router();
const bookControler = require('../controlers/book.controller');
const multer = require('multer')
const path = require("path")
const dayjs = require("dayjs")



let storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + '/../uploads/')
    },
    filename: function (req, file, callback) {
        let name = file.originalname.split(' ').join('_');
        name = name.split(".")
        name.pop()
        name = name.join('_')
        let extension = path.extname(file.originalname)
        callback(null, dayjs().format("YYYY_MM_DD") + '_' + name + extension);
    }
});
let upload = multer({ storage }).single('file');

router.post('/', upload, bookControler.postBook);

router.get('/', bookControler.getBook);

router.get('/:id', bookControler.getOne);

router.patch('/:id', bookControler.patch);

router.delete('/:id', bookControler.delete);

module.exports = router;
