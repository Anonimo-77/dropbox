const express = require('express');
const app = express();

require('./database');

app.use(require('body-parser').json())

app.use(require('body-parser').urlencoded({
    extended: false
}));
const path = require('path');
const fs = require('fs')
const bcrypt = require('bcrypt');
const expSession = require('express-session');
const { User } = require('./models/User');

const { v4: uuid } = require('uuid');
const session = expSession({
    genid: uuid,
    resave: false,
    saveUninitialized: false,
    secret: 'mysecret'
});

app.use(session);

app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/signup', (req,res) => {
    res.sendFile(path.join(__dirname, 'views', 'signup.html'));
});

app.get('/signin', (req,res) => {
    res.sendFile(path.join(__dirname, 'views', 'signin.html'));
});

app.post('/signup', async (req,res) => {
    if (!(await User.findOne({username: req.body.username})) && !(await User.findOne({email: req.body.email}))) {
        const { email, username, password } = req.body;
    
    let encPass = bcrypt.hashSync(password, 10);

    let newUser = new User({
        username,
        email,
        password: encPass
    });

    fs.mkdirSync(path.resolve(__dirname, '..', 'uploads', username));

    await newUser.save();
    
    res.redirect('/signin');
    }
});

app.post('/signin', async (req,res) => {
    const { email, password } = req.body;

    let thatUser = await User.findOne({ email: email });

    if (bcrypt.compareSync(password, thatUser.password)) {
        req.session.user = thatUser._id;
        await req.session.save();
        res.redirect('/home');
    } else {
        res.redirect('/signin');
    }
});

app.get('/home', (req,res) => {
    if (req.session.user) {
        res.sendFile(path.join(__dirname, 'views', 'home.html'))
    } else {
        res.redirect('/signin');
    }
})

app.listen(3000, () => {
    console.log('server on port', 3000);
});