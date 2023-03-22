const express = require('express');
const router = express.Router();
const userControler = require('../controlers/user.controller');
const { checkUser } = require('../middleware/auth.middleware');
const multer = require('multer')
const { join } = require("path")


let storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, join(__dirname + '/../uploads/profile'))
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
// router.get("*", checkUser)
router.post('/sign-up', userControler.signUp);
router.patch('/:id', userControler.update);
router.patch('/image/:id', upload, userControler.updateImage);
router.patch('/contact/:id', userControler.updateContact);
router.post('/sign-in', userControler.signIn);

// router.get('/log-out', userControler.logOut);

router.get('/', checkUser, userControler.getAll);

router.get('/:id', userControler.getOne);

router.delete('/:id', userControler.delete);

module.exports = router;
