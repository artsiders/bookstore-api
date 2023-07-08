const express = require('express');
const router = express.Router();
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');

// Configuration de Multer pour stocker les fichiers téléchargés
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, join(__dirname + '/../uploads/profile'));
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Initialisation de Multer
const upload = multer({ storage: storage });

// Route pour télécharger une image
router.post('/', upload.single('file'), function (req, res) {
    // Chemin du fichier téléchargé
    const filePath = req.file.path;

    // Conversion en format WebP avec Sharp
    sharp(filePath)
        .webp()
        .toFile(filePath + '.webp', function (err, info) {
            if (err) {
                console.log(err);
                return res.status(500).send(err);
            }

            // Réponse HTTP avec l'URL de l'image WebP
            const url = req.protocol + '://' + req.get('host') + '/' + req.file.filename + '.webp';
            return res.status(200).send({ url: url });
        });
});


module.exports = router;