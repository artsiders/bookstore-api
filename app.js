const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser')
const userRoute = require('./routes/user.route');
const specialityRoute = require('./routes/speciality.route');
const yearRoute = require('./routes/year.route');
const bookRoute = require('./routes/book.route');
const levelRoute = require('./routes/level.route');


const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors());
app.use(cookieParser())

app.use('/users', userRoute);
app.use('/speciality', specialityRoute);
app.use('/year', yearRoute);
app.use('/book', bookRoute);
app.use('/level', levelRoute);

// public endpoint for upload files
app.use('/uploads', express.static('uploads'))


/// mongoose.connect('mongodb+srv://meditation:8vbSf62dopgfgNqL@meditation1.aw8ribq.mongodb.net/?retryWrites=true&w=majority',
mongoose.connect('mongodb://localhost:27017/internship',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

module.exports = app;
