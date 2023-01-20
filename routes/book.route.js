const express = require('express');
const router = express.Router();
const bookControler = require('../controlers/book.controller');
const multer = require('multer')
const path = require("path")
const dayjs = require("dayjs");
const { popExtension } = require('../utils/function.utils');



let storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + '/../uploads/')
    },
    filename: async function (req, file, callback) {
        let name = file.originalname.split(' ').join('_');
        name = popExtension(name)
        let extension = path.extname(file.originalname)
        name = dayjs().format("YYYY_MM_DD") + '_' + name
        callback(null, name + extension);
    }
});
let upload = multer({ storage }).single('file');

router.post('/', upload, bookControler.postBook);

router.get('/', bookControler.getBook);

router.get('/:id', bookControler.getOne);

router.patch('/:id', bookControler.patch);

router.delete('/:id', bookControler.delete);

module.exports = router;
