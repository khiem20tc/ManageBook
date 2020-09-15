const express = require('express');
const path = require('path');
const app = express();

const { PORT } = require('./environments')
const { mongoose } = require('./helpers')

const UserRoute = require('./routes/user')
const BookRoute = require('./routes/book')

// connected mongo database
mongoose.connection.on('error', () => {
	console.log('❌  error occurred from the mongo database')
})
mongoose.connection.once('open', () =>
	console.log('🌨  Connected successfully to mongo database')
)

app.use(express.json());
app.use(express.urlencoded({extended: false}))
app.use(express.static(path.join(__dirname,'public')));

app.set('view engine', 'ejs');
app.use('/home', async(req, res) => {
    await res.render('../../frontend/views/pages/home');
});

app.use('/about', async(req, res) => {
    await res.render('../../frontend/views/pages/about');
});

app.use('/signin', async(req, res) => {
    await res.render('../../frontend/views/pages/signin');
});

app.use('/login', async(req, res) => {
    await res.render('../../frontend/views/pages/login');
});

// app.use('/homeStudent', async(req, res) => {
//     await res.render('../../frontend/views/pages/homeStudent');
// });

// app.use('/profile', async(req, res) => {
//     await res.render('../../frontend/views/pages/profile');
// });

app.use('/user', UserRoute);
app.use('/book', BookRoute);

app.listen(PORT, () => {console.log(`Server is running on ${PORT}...`)});