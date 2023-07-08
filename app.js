const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser')
const userRoute = require('./routes/user.route');
const optionRoute = require('./routes/option.route');
const yearRoute = require('./routes/year.route');
const internshipRoute = require('./routes/internship.route');
const levelRoute = require('./routes/level.route');
// const sharpRoute = require('./routes/sharp.route');


const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors());
app.use(cookieParser())

// main route
app.use('/main', userRoute);
// internship route 
app.use('/users', userRoute);
app.use('/option', optionRoute);
app.use('/year', yearRoute);

app.use('/internship', internshipRoute);
// app.use('/internship', bookRoute);
// app.use('/internship', bookRoute);

app.use('/level', levelRoute);
// app.use('/sharp', sharpRoute);





// public endpoint for upload files
app.use('/uploads', express.static('uploads'))

mongoose.set("strictQuery", false);
// mongoose.connect('mongodb+srv://salim:6eMhaxCPcCRjrtEv@internship.ul4eyde.mongodb.net/?retryWrites=true&w=majority',
mongoose.connect('mongodb://127.0.0.1:27017/internship',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch((err) => console.log('Connexion à MongoDB échouée !',));

module.exports = app;
