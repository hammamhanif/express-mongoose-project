const express = require('express');
const expressLayouts = require('express-ejs-layouts');

const app = express();
const port = 4321;

const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');

const {body, validationResult,check}= require('express-validator');
const methodOverride = require('method-override');

require('./utils/db');
const Contact = require('./model/contact');

// Setup MethodOverride
app.use(methodOverride('_method'));

// Setup EJS
// Use EJS in project
app.set('view engine', 'ejs');

// use Express Layouts
app.use(expressLayouts);

// Use Static File
app.use(express.static('public'));

// Urlunloaded
app.use(express.urlencoded({extended:true}));

// Konfigurasi flash
app.use(cookieParser('secret'));
app.use(
  session({
    cookie: {maxAge: 6000},
    secret: 'secret',
    resave: 'true',
    saveUninitialized: true,
  })
);

app.use(flash());

// Halaman Home
app.get('/index', (req, res) => {
    const mahasiswa = [
      {nama: 'Rayhan Saputra P',
        email: 'RayhanSa123@gmail.com',
      },
      {nama: 'Hammam Ahmad Hanif',
    email:'hammam123ahmad@gmail.com'},
      {nama: 'Haskal Aji Pamungkas',
        email: 'Haskal123@gmail.com',
      },
      {nama: 'Adi Bagas Pratama',
        email: 'adi1234@gmail.com',
      },
      {nama: 'Adit Jafar T',
        email: 'adi1TEJEJ@gmail.com',
      },
    ]
    res.render('index',{
      layout:'partials/main-layouts',
      nama:'Hammam Ahmad',
      title:'Halaman Home',
    mahasiswa,
    });
  });

//   Halaman Abaout
app.get('/about', (req, res) => {
    res.render('about',{
      layout:'partials/main-layouts',
      title: 'Halaman About'});
  });

// Halaman Contact
app.get('/contact', async(req, res) => {
    const contacts = await Contact.find();
    res.render('contact',{
      layout:'partials/main-layouts',
      title: 'Halaman Contact',
      contacts,
      msg: req.flash('msg'),
    });
    // res.send('Ini adalah Halaman About!');
  });
  

  // Tambah Data
app.get('/contact/add',(req, res)=>{
    res.render('add-contact',{
      title: 'Form Tambah Contact',
      layout:'partials/main-layouts',
    });
});

// Validator Contact
app.post('/contact',
[
 body('nama').custom(async (value)=>{
  const duplikat = await Contact.findOne({nama:value});
  if(duplikat){
    throw new Error('Nama Contact Sudah Digunakan!');
  }
  return true;
}),
check('email', 'Email tidak valid!').isEmail(),
check('noHp','Nomor Handphone tidak valid!').isMobilePhone('id-ID'),
],
(req,res) => {
  const errors =validationResult(req);
  if(!errors.isEmpty()){
    res.render('add-contact',{
      title: 'Form Tambah Contact',
      layout:'partials/main-layouts',
      errors: errors.array(),
    })
  }
  else{
    Contact.insertMany(req.body,(error,result)=>{
      req.flash('msg','Data Contact Berhasil Ditambahkan!');
      res.redirect('/contact');
    });
  }
}
  
);

// Delete Contact
app.delete('/contact', (req, res)=>{
  Contact.deleteOne({nama: req.body.nama}).then((result)=>{
    req.flash('msg','Data Contact berhasil dihapus!');
    res.redirect('/contact');
  });
});

app.get('/contact/edit/:nama',async (req, res)=>{
  const contact = await Contact.findOne({nama: req.params.nama});

  res.render('edit-contact',{
    title: 'Form Ubah Contact',
    layout:'partials/main-layouts',
    contact,
  });
});

app.put('/contact',
[
 body('nama').custom(async(value,{req})=>{
  const duplikat = await Contact.findOne({nama: value});
  if(value !== req.body.oldNama && duplikat){
    throw new Error('Nama Contact Sudah Digunakan!');
  }
  return true;
}),
check('email', 'Email tidak valid!').isEmail(),
check('noHp','Nomor Handphone tidak valid!').isMobilePhone('id-ID'),
],
(req,res) => {
  const errors =validationResult(req);
  if(!errors.isEmpty()){
    res.render('edit-contact',{
      title: 'Form Ubah Contact',
      layout:'partials/main-layouts',
      errors: errors.array(),
      contact: req.body,
    })
  }
  else{
    Contact.updateOne(
      {_id:req.body._id},
      {
        $set: {
          nama:req.body.nama,
          email:req.body.email,
          noHp:req.body.noHp,
        },
      }).then(result=>{
        req.flash('msg','Data Contact Berhasil Diubah!');
        res.redirect('/contact');

      })

  }
}
  
);


// Halaman Detail
app.get('/contact/:nama', async(req, res) => {

    const contact = await Contact.findOne({nama: req.params.nama});
  
    res.render('detail',{
      layout:'partials/main-layouts',
      title: 'Halaman Detail Contact',
      contact,
      
    });
  });

app.listen(port, () => {
     console.log(`Example app listening on port ${port}`)
});