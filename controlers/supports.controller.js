const Book = require('../models/supports.model');
const pdf2img = require('pdf-img-convert');
const fs = require('fs');
const { join } = require('path');
const { popExtension } = require('../utils/function.utils');
const path = require('path');

const UPLOAD_DIR = __dirname + "/../uploads/";


module.exports.getBook = (req, res) => {
    const option = req.query.option
    const search = req.query.search
    const level_value = req.query.level_value
    const page = parseInt(req.query.page)
    let title = {
        $regex: search,
        $options: 'i'
    };

    const reqQuery = {}
    if (option) reqQuery.option = option
    if (level_value) reqQuery.level_value = level_value
    if (search !== "" && search !== "tous") reqQuery.title = title

    Book.count(reqQuery)
        .then(countBook => {
            const limit = 10
            const totalPages = Math.ceil(countBook / limit)
            Book.find(reqQuery).limit(limit).skip((page - 1) * 10).then(
                (books) => {
                    res.status(200).json({
                        type: "success",
                        message: "",
                        data: books,
                        totalPages
                    });
                }
            ).catch(
                (error) => {
                    res.status(400).json({
                        type: "error",
                        message: "Impossible d'obtenir ces données pour le moment",
                        data: []
                    });
                    console.log(error);
                }
            );

        })
        .catch(err => console.log(err))
}


module.exports.postBook = (req, res, next) => {
    if (!req.Uploaded) {
        return res.status(201).json({
            type: "error",
            message: "Impossible d'importer les fichiers. Vérifier les informations et réessayer",
            data: {},
        });
    }
    const pdfName = req.files.pdf[0].filename
    const docxName = req.files.docx[0].filename
    const { _idUser, theme, option, level, level_value, year, description } = req.body
    const finalPdfName = year + '_' + _idUser + path.extname(pdfName);
    const finalDocxName = year + '_' + _idUser + path.extname(docxName);
    const thumbnailName = popExtension(finalPdfName) + "_thumbnail.jpg";

    if ((!!_idUser && !!theme && !!option && !!level && !!year) === false) {
        return res.status(400).json({
            type: "warning",
            message: "Vérifier les données et réessayer ultérieurement !",
            data: {},
        });
    }

    Book.findOne({ pdfName: finalPdfName }).then(docs => {
        const isExist = !!docs
        if (isExist) {
            // delete uload file is already exist in the database
            fs.unlink(join(UPLOAD_DIR + pdfName), (err) => {
                if (err) console.log(err)
            })
            fs.unlink(join(UPLOAD_DIR + docxName), (err) => {
                if (err) console.log(err)
            })
            return res.status(400).json({
                type: "warning",
                message: "Vous ne pouvez pas ajouter deux rapports la même année ! Mais vous pouvez modifier le rapport actuel.",
                data: {},
            });
        } else {
            // give corect name to the docx file
            fs.rename(join(UPLOAD_DIR + docxName),
                join(UPLOAD_DIR + finalDocxName), (err) => {
                    if (err) console.log(err)
                })

            // give corect name to the pdf file 
            fs.rename(join(UPLOAD_DIR + pdfName),
                join(UPLOAD_DIR + finalPdfName), (err) => {
                    if (!err) {
                        // make a thumbnail if file is corectly rename
                        (async function (finalPdfName) {
                            pdfArray = await pdf2img
                                .convert(join(UPLOAD_DIR + finalPdfName), {
                                    width: 200,
                                    page_numbers: [1],
                                });
                            const thumbnail = join(UPLOAD_DIR + thumbnailName)

                            fs.writeFile(thumbnail, pdfArray[0], (error) => {
                                if (error) console.error("ERROR: " + error)
                            });

                        })(finalPdfName);
                    } else console.log("ERROR: " + err);
                })

            const book = new Book({
                _idUser: _idUser,
                theme: theme,
                pdfName: finalPdfName,
                docxName: finalDocxName,
                thumbnail: thumbnailName,
                option: option,
                level: level,
                level_value: level_value,
                year: year,
                description: description,
            });

            book.save(book).then(
                (value) => {
                    res.status(201).json({
                        type: "success",
                        message: "Fichier ajouté avec succès",
                        data: value,
                    });
                }
            ).catch(
                (error) => {
                    res.status(400).json({
                        type: "error",
                        message: "Impossible d'ajouter le fichier",
                        errors: ""
                    });
                    console.log(error);
                }
            );
        }
    })

}


module.exports.patchBook = (req, res, next) => {
    const { _idUser, theme, option, level, level_value, description, year } = req.body

    let bookDatas = {}
    const isFile = req.body.isFile //string "true" or "false"

    // si les fichiers doivent aussi etre modifier
    if (isFile === "true") {
        // si un des deux fichier manque
        if (!req.Uploaded) {
            return res.status(400).json({
                type: "error",
                message: "Impossible d'importer les fichiers. Vérifier les informations et réessayer",
                data: {},
            });
        } else {
            const pdfName = req.files.pdf[0].filename
            const docxName = req.files.docx[0].filename
            const finalPdfName = year + '_' + _idUser + path.extname(pdfName);
            const finalDocxName = year + '_' + _idUser + path.extname(docxName);
            const thumbnailName = popExtension(finalPdfName) + "_thumbnail.jpg";

            // give corect name to the docx file
            fs.rename(join(UPLOAD_DIR + docxName),
                join(UPLOAD_DIR + finalDocxName), (err) => {
                    if (err) console.log(err)
                })

            // give corect name to the pdf file 
            fs.rename(join(UPLOAD_DIR + pdfName),
                join(UPLOAD_DIR + finalPdfName), (err) => {
                    if (!err) {
                        // make a thumbnail if file is corectly rename
                        (async function (finalPdfName) {
                            pdfArray = await pdf2img
                                .convert(join(UPLOAD_DIR + finalPdfName), {
                                    width: 200,
                                    page_numbers: [1],
                                });
                            const thumbnail = join(UPLOAD_DIR + thumbnailName)

                            fs.writeFile(thumbnail, pdfArray[0], (error) => {
                                if (error) console.error("ERROR: " + error)
                            });

                        })(finalPdfName);
                    } else console.log("ERROR: " + err);
                })

            bookDatas = {
                theme: theme,
                option: option,
                level: level,
                level_value: level_value,
                description: description,
                pdfName: finalPdfName,
                docxName: finalDocxName,
                thumbnail: thumbnailName
            };
        }
    } else {
        bookDatas = {
            theme: theme,
            option: option,
            level: level,
            level_value: level_value,
            description: description,
        };
    }

    Book.findOneAndUpdate({ _id: req.params.id }, bookDatas, {
        new: true
    }).then(
        (value) => {
            res.status(201).json({
                type: "success",
                message: "Fichier modifié avec succès",
                data: value,
            });
        }
    ).catch(
        (error) => {
            res.status(400).json({
                type: "error",
                message: "Impossible de modifier le fichier",
                errors: ""
            });
            console.log(error);
        }
    );
}

// module.exports.patch = (req, res) => {
//     const { theme, description } = req.body
//     const books = new Book({
//         theme: theme,
//         description: description,
//     });

//     Book.findOneAndUpdate({ _id: req.params['id'] }, books, {
//         new: true
//     }).then(
//         (value) => {
//             res.status(201).json({
//                 type: "success",
//                 message: "utilisateur modifier avec succès",
//                 data: value,
//             });
//         }
//     ).catch(
//         (error) => {
//             res.status(400).json({
//                 type: "error",
//                 message: "impossible de modifier",
//                 errors: [error]
//             });
//         }
//     );
// }

module.exports.getOne = (req, res) => {
    Book.findOne({ _id: req.params.id }).then(
        (books) => {
            res.status(200).json({
                type: "success",
                message: "",
                data: books,
            });
        }).catch((error) => {
            res.status(400).json({
                type: "info",
                message: "Utilisateur introuvable !",
                data: [],
            });
            console.log(error);
        });
}

module.exports.delete = (req, res) => {
    Book.deleteOne({ _id: req.params.id }).then(
        () => {
            res.status(204).json({
                type: "success",
                message: "Utilisateur supprimé avec succès",
            });
        }
    ).catch(
        (error) => {
            res.status(400).json({
                type: "error",
                message: "Impossible de modifier l'utilisateur",
            });
            console.log(error);
        }
    );
}