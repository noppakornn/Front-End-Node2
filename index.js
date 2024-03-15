const express = require('express')
const axios = require('axios')
const path = require('path')
const app = express()
var bodyParser = require('body-parser')
const cookieSession = require('cookie-session')
const bcrypt = require('bcrypt')
const dbConnection = require('./database')
const { body, validationResult } = require('express-validator')

//const base_url = "http://localhost:3000";
const base_url = "http://10.104.4.235:3000";

app.set('views', path.join(__dirname, "/public/views"))
app.set('view engine', 'ejs')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended:false}))

app.use(express.static(__dirname + '/public'))

app.use(cookieSession({
    name: 'session',
    keys: ['key1', 'key2'],
    maxAge:  3600 * 1000 // 1hr
}));

// DECLARING CUSTOM MIDDLEWARE
const ifNotLoggedin = (req, res, next) => {
    if(!req.session.isLoggedIn){
        return res.render('login-register');
    }
    next();
}
const ifLoggedin = (req,res,next) => {
    if(req.session.isLoggedIn){
        return res.redirect('/home');
    }
    next();
}
// END OF CUSTOM MIDDLEWARE
// ROOT PAGE
app.get('/', ifNotLoggedin, (req,res,next) => {
    dbConnection.execute("SELECT `name` FROM `users` WHERE `id`=?",[req.session.userID])
    .then(([rows]) => {
        res.render('home',{
            name:rows[0].name
        });
    });
    
});// END OF ROOT PAGE


// REGISTER PAGE
app.post('/register', ifLoggedin, 
// post data validation(using express-validator)
[
    body('user_email','Invalid email address!').isEmail().custom((value) => {
        return dbConnection.execute('SELECT `email` FROM `users` WHERE `email`=?', [value])
        .then(([rows]) => {
            if(rows.length > 0){
                return Promise.reject('This E-mail already in use!');
            }
            return true;
        });
    }),
    body('user_name','Username is Empty!').trim().not().isEmpty(),
    body('user_pass','The password must be of minimum length 6 characters').trim().isLength({ min: 6 }),
],// end of post data validation
(req,res,next) => {

    const validation_result = validationResult(req);
    const {user_name, user_pass, user_email} = req.body;
    // IF validation_result HAS NO ERROR
    if(validation_result.isEmpty()){
        // password encryption (using bcryptjs)
        bcrypt.hash(user_pass, 12).then((hash_pass) => {
            // INSERTING USER INTO DATABASE
            dbConnection.execute("INSERT INTO `users`(`name`,`email`,`password`) VALUES(?,?,?)",[user_name,user_email, hash_pass])
            .then(result => {
                res.send(`your account has been created successfully, Now you can <a href="/">Login</a>`);
            }).catch(err => {
                // THROW INSERTING USER ERROR'S
                if (err) throw err;
            });
        })
        .catch(err => {
            // THROW HASING ERROR'S
            if (err) throw err;
        })
    }
    else{
        // COLLECT ALL THE VALIDATION ERRORS
        let allErrors = validation_result.errors.map((error) => {
            return error.msg;
        });
        // REDERING login-register PAGE WITH VALIDATION ERRORS
        res.render('login-register',{
            register_error:allErrors,
            old_data:req.body
        });
    }
});// END OF REGISTER PAGE


// LOGIN PAGE
app.post('/', ifLoggedin, [
    body('user_email').custom((value) => {
        return dbConnection.execute('SELECT email FROM users WHERE email=?', [value])
        .then(([rows]) => {
            if(rows.length == 1){
                return true;
                
            }
            return Promise.reject('Invalid Email Address!');
            
        });
    }),
    body('user_pass','Password is empty!').trim().not().isEmpty(),
], (req, res) => {
    const validation_result = validationResult(req);
    const {user_pass, user_email} = req.body;
    if(validation_result.isEmpty()){
        
        dbConnection.execute("SELECT * FROM `users` WHERE `email`=?",[user_email])
        .then(([rows]) => {
            bcrypt.compare(user_pass, rows[0].password).then(compare_result => {
                if(compare_result === true){
                    req.session.isLoggedIn = true;
                    req.session.userID = rows[0].id;

                    res.redirect('/');
                }
                else{
                    res.render('login-register',{
                        login_errors:['Invalid Password!']
                    });
                }
            })
            .catch(err => {
                if (err) throw err;
            });


        }).catch(err => {
            if (err) throw err;
        });
    }
    else{
        let allErrors = validation_result.errors.map((error) => {
            return error.msg;
        });
        // REDERING login-register PAGE WITH LOGIN VALIDATION ERRORS
        res.render('login-register',{
            login_errors:allErrors
        });
    }
});
// END OF LOGIN PAGE

// LOGOUT
app.get('/logout',(req,res)=>{
    //session destroy
    req.session = null;
    res.redirect('/');
});
// END OF LOGOUT

app.use('/', (req,res) => {
    res.status(404).send('<h1>404 Page Not Found!</h1>');
});

//ดูทั้งหมด
app.get('/restaurant', async(req,res)=>{
    try{
     const respones = await axios.get(base_url + '/restaurant')
     res.render("restaurant/restaurant_2",{restaurant:respones.data})
    }catch(err){
     console.error(err)
     res.status(500).send('Error')
    }
 })
 //ดูทั้งหมด
 
 //ดูแต่ละอัน
 app.get('/restaurant/:id',async(req,res)=>{
     try{
         const respones = await axios.get(base_url + '/restaurant/' + req.params.id)
         res.render("restaurant/restaurant_1",{restaurant:respones.data})
        }catch(err){
         console.error(err)
         res.status(500).send('Error')
        }
 })
 //ดูแต่ละอัน
 
 // show create desktop
 app.get('/restaurants/create',(req,res)=>{ 
     res.render("restaurant/create")
 })

 app.post('/restaurants/create',async(req,res)=>{
    try{
     const data = { nameres: req.body.nameres , address: req.body.address , opening_hours: req.body.opening_hours , additional_info: req.body.additional_info}
     await axios.post(base_url + '/restaurant' ,data)
     res.redirect('/restaurant')
    }catch(err){
     res.status(500).send(err)
    }
 })
 // show create desktop
 
 app.get('/restaurant/update/:id',async(req,res)=>{
     try{
         const respones = await axios.get(
             base_url + '/restaurant/' + req.params.id) 
             res.render('restaurant/update',{restaurant: respones.data})
   } catch(err){
       console.error(err)
       res.status(500).send('Error')
     }
 })
  //update
 
 app.post('/restaurant/update/:id',async(req,res)=>{
    try{
        const data = { nameres: req.body.nameres , address: req.body.address , opening_hours: req.body.opening_hours , additional_info: req.body.additional_info}
     await axios.put(base_url + '/restaurant/' + req.params.id,data)
     res.redirect('/restaurant')
    }catch(err){
     console.error(err)
     res.status(500).send(err)
    }
 })
 //update
 
 app.get('/restaurant/delete/:id',async(req,res)=>{
    try{
     await axios.delete(base_url + '/restaurant/' + req.params.id)
     res.redirect('/restaurant')
    }catch(err){
     console.error(err)
     res.status(500).send('Error')
    }
 })
 //delete

 app.get('/reservation', async(req,res)=>{
    try{
     const respones = await axios.get(base_url + '/reservation')
     res.render("reservation/reservation_2",{reservation:respones.data})
    }catch(err){
     console.error(err)
     res.status(500).send('Error')
    }
 })
 //ดูทั้งหมด
 
 //ดูแต่ละอัน
 app.get('/reservation/:id',async(req,res)=>{
     try{
         const respones = await axios.get(base_url + '/reservation/' + req.params.id)
         res.render("reservation/reservation_1",{reservation:respones.data})
        }catch(err){
         console.error(err)
         res.status(500).send('Error')
        }
 })
 //ดูแต่ละอัน

 // show create desktop
 app.get('/reservations/create',(req,res)=>{ 
     res.render("reservation/create")
 })

 app.post('/reservations/create',async(req,res)=>{
    try{
     const data = { name: req.body.name , email: req.body.email , date: req.body.date , time: req.body.time , num_people: req.body.num_people, table_num: req.body.table_num}
     await axios.post(base_url + '/reservations' ,data)
     res.redirect('/reservation')
    }catch(err){
     res.status(500).send(err)
    }
 })
 // show create desktop
 
 app.get('/reservation/update/:id',async(req,res)=>{
     try{
         const respones = await axios.get(
             base_url + '/reservation/' + req.params.id) 
             res.render('reservation/update',{reservation: respones.data})
   } catch(err){
       console.error(err)
       res.status(500).send('Error')
     }
 })
  //update
 
 app.post('/reservation/update/:id',async(req,res)=>{
    try{
        const data = { name: req.body.name , email: req.body.email , date: req.body.date , time: req.body.time , num_people: req.body.num_people, table_num: req.body.table_num}
     await axios.put(base_url + '/reservation/' + req.params.id,data)
     res.redirect('/reservation')
    }catch(err){
     console.error(err)
     res.status(500).send(err)
    }
 })
 //update
 
 app.get('/reservation/delete/:id',async(req,res)=>{
    try{
     await axios.delete(base_url + '/reservation/' + req.params.id)
     res.redirect('/reservation')
    }catch(err){
     console.error(err)
     res.status(500).send('Error')
    }
 })
 //delete

 app.get('/table', async(req,res)=>{
    try{
     const respones = await axios.get(base_url + '/table')
     res.render("table/table_2",{table:respones.data})
    }catch(err){
     console.error(err)
     res.status(500).send('Error')
    }
 })
 //ดูทั้งหมด
 
 //ดูแต่ละอัน
 app.get('/table/:id',async(req,res)=>{
     try{
         const respones = await axios.get(base_url + '/table/' + req.params.id)
         res.render("table/table_1",{table:respones.data})
        }catch(err){
         console.error(err)
         res.status(500).send('Error')
        }
 })
 //ดูแต่ละอัน
 
 // show create desktop
 app.get('/tables/create',(req,res)=>{ 
     res.render("table/create")
 })

 app.post('/tables/create',async(req,res)=>{
    try{
     const data = { status: req.body.status}
     await axios.post(base_url + '/tables' ,data)
     res.redirect('/table')
    }catch(err){
     res.status(500).send(err)
    }
 })
 // show create desktop
 
 app.get('/table/update/:id',async(req,res)=>{
     try{
         const respones = await axios.get(
             base_url + '/table/' + req.params.id) 
             res.render('table/update',{table: respones.data})
   } catch(err){
       console.error(err)
       res.status(500).send('Error')
     }
 })
  //update
 
 app.post('/table/update/:id',async(req,res)=>{
    try{
        const data = { status: req.body.status}
     await axios.put(base_url + '/table/' + req.params.id,data)
     res.redirect('/table')
    }catch(err){
     console.error(err)
     res.status(500).send(err)
    }
 })
 //update
 
 app.get('/table/delete/:id',async(req,res)=>{
    try{
     await axios.delete(base_url + '/table/delete/' + req.params.id)
     res.redirect('/table')
    }catch(err){
     console.error(err)
     res.status(500).send('Error')
    }
 })
 //delete

app.listen(8080,()=> console.log(`Listening on port 8080`))