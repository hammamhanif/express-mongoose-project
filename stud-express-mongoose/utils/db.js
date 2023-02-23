const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/hmm',{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
});

// Menambah 1 data
// const contact1 = new Contact({
//     nama : 'Hilal Faiq',
//     noHp : "085710304050",
//     email : "faiq@gmail.com",
// });

// contact1.save().then((contact) => {console.log(contact)});