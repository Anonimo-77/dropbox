const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/dropbox', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(db=> console.log('DB is connected'))
    .catch(err => console.error);