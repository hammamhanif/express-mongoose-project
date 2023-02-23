const mongoose = require('mongoose');


const Contact = mongoose.model('Contact',{
    nama:{
        type: 'string',
        required: true,
    },
    noHp:{
        type: 'string',
        required: true,
    },
    email:{
        type: 'string',
    },
});

module.exports= Contact;
