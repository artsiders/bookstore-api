const Book = require('../models/book.model');


module.exports.getBook = (req, res) => {
    Book.find().then(
        (books) => {
            res.sendFile(__dirname + "/uploads/image.jpg")
            res.status(200).json({
                type: "success",
                message: "",
                data: books
            });
        }
    ).catch(
        (error) => {
            res.status(400).json({
                type: "error",
                message: "impossible de d'obtenie les donnée pour le moment",
                data: []
            });
            console.log(error);
        }
    );
}

// module.exports.post = (req, res) => {
//     var workbook = XLSX.readFile('./uploads/' + req.file.filename);
//     var sheetNameList = workbook.SheetNames;
//     const worksheet = workbook.Sheets[sheetNameList[0]]
//     const datas = XLSX.utils.sheet_to_json(worksheet)

//     let resultDatas = []

//     const convertToDate = (dateString) => {
//         // return typeof dateString
//         if (dateString != undefined) {
//             try {
//                 let d = dateString.split("/");
//                 let dat = new Date(d[2] + '-' + d[1] + '-' + d[0]);
//                 dat = dayjs(dat).format("YYYY-MM-DD")
//                 return dat;
//             } catch (error) {
//                 return ""
//             }
//         }
//         return ""
//     }

//     datas.forEach(data => {
//         data.Date = convertToDate(data.Date)
//         resultDatas.push(data)
//     });
//     Evangile.insertMany(resultDatas).then(() => {
//         res.status(201).json({
//             error: false,
//             message: "Fichier excel importer avec succès !",
//             data: {},
//         });
//     }).catch(error => {
//         res.status(500).json({
//             error: true,
//             message: "Impossible d'importer le fichier",
//             data: {},
//         });
//     })

// }



module.exports.postBook = (req, res) => {
    const book = new Book({
        theme: req.body.theme,
        fileName: req.file.filename,
        option: req.body.option,
        niveau: req.body.niveau,
        year: req.body.year,
        description: req.body.description,
    });

    book.save(book).then(
        (value) => {
            res.status(201).json({
                type: "success",
                message: "fichier ajouter avec succès",
                data: value,
            });
        }
    ).catch(
        (error) => {
            res.status(400).json({
                type: "error",
                message: "impossible d'ajouter",
                errors: ""
            });
            console.log(error);
        }
    );
}

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
                message: "utilisateur non trouver !",
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
                message: "utilisateur supprimer avec succès",
            });
        }
    ).catch(
        (error) => {
            res.status(400).json({
                type: "error",
                message: "impossible de modifier l'utilisateur",
            });
            console.log(error);
        }
    );
}

module.exports.patch = (req, res) => {
    const books = new book({
        _id: req.params['id'],
        fullName: req.body.fullName,
        email: req.body.email,
        speciality: req.body.speciality,
        password: req.body.password,
    });

    Book.findOneAndUpdate({ _id: req.params['id'] }, books, {
        new: true
    }).then(
        (value) => {
            res.status(201).json({
                type: "success",
                message: "utilisateur modifier avec succès",
                data: value,
            });
        }
    ).catch(
        (error) => {
            res.status(400).json({
                type: "error",
                message: "impossible de modifier",
                errors: [error]
            });
        }
    );
}