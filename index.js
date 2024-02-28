const express = require('express')
const axios = require('axios')
const path = require('path')
const app = express()
var bodyParser = require('body-parser')
const { error } = require('console')

const base_url = "http://localhost:3000"
//const base_url = "http://10.104.7.149"
//const base_url = "http://node56420-noedrestfifu.proen.app.ruk-com.cloud"

app.set('views', path.join(__dirname, "/public/views"))
app.set('view engine', 'ejs')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended:false}))

app.use(express.static(__dirname + '/public'))

//1111111111111
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
 //use คือ user ที่ลบตัวท้ายไปตัวนึง
 app.get('/restaurants/create',(req,res)=>{ 
     res.render("restaurant/create")
 })
 //use คือ user ที่ลบตัวท้ายไปตัวนึง
 app.post('/restaurants/create',async(req,res)=>{
    try{
     const data = { name: req.body.name , location: req.body.location}
     await axios.post(base_url + '/restaurant' ,data)
     res.redirect('/restaurant')
    }catch(err){
     res.status(500).send(err)
    }
 })
 // show create desktop
 
 //update
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
 
 app.post('/restaurant/update/:id',async(req,res)=>{
    try{
        const data = { name: req.body.name , location: req.body.location}
     await axios.put(base_url + '/restaurant/' + req.params.id,data)
     res.redirect('/restaurant')
    }catch(err){
     console.error(err)
     res.status(500).send(err)
    }
 })
 //update
 
 //use คือ user ที่ลบตัวท้ายไปตัวนึง
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

 //333333333333333333333

/*//ดูทั้งหมด
app.get('/showtime', async(req,res)=>{
    try{
     const respones = await axios.get(base_url + '/showtime')
     res.render("showtime/bookssss",{showtime:respones.data})
    }catch(err){
     console.error(err)
     res.status(500).send('Error')
    }
 })
 //ดูทั้งหมด
 
 //ดูแต่ละอัน
 app.get('/showtime/:id',async(req,res)=>{
     try{
         const respones = await axios.get(base_url + '/showtime/' + req.params.id)
         res.render("showtime/bookkkk",{showtime:respones.data})
        }catch(err){
         console.error(err)
         res.status(500).send('Error')
        }
 })
 //ดูแต่ละอัน
 
 // show create desktop
 app.get('/showtim/create',(req,res)=>{ 
     res.render("showtime/create")
 })
 
 app.post('/showtim/create',async(req,res)=>{
    try{
     const data = { starttime: req.body.starttime , theater: req.body.theater}
     await axios.post(base_url + '/showtime' ,data)
     res.redirect('/showtime')
    }catch(err){
     console.error(err)
     res.status(500).send('Error')
    }
 })
 // show create desktop
 
 //update
 app.get('/showtime/update/:id',async(req,res)=>{
     try{
         const respones = await axios.get(
             base_url + '/showtime/' + req.params.id) 
             res.render('showtime/update',{showtime: respones.data})
   } catch(err){
       console.error(err)
       res.status(500).send('Error')
     }
 })
 
 app.post('/showtime/update/:id',async(req,res)=>{
    try{
        const data = { starttime: req.body.starttime , theater: req.body.theater}
     await axios.put(base_url + '/showtime/' + req.params.id,data)
     res.redirect('/showtime')
    }catch(err){
     console.error(err)
     res.status(500).send('Error')
    }
 })
 //update
 
 //delete
 app.get('/showtim/delete/:id',async(req,res)=>{
    try{
     await axios.delete(base_url + '/showtime/' + req.params.id)
     res.redirect('/showtime')
    }catch(err){
     console.error(err)
     res.status(500).send('Error')
    }
 })
 //delete

  //44444444444444444444

//ดูทั้งหมด
app.get('/Reservation', async(req,res)=>{
    try{
     const respones = await axios.get(base_url + '/Reservation')
     res.render("Reservation/booksss",{Reservation:respones.data})
    }catch(err){
     console.error(err)
     res.status(500).send('Error')
    }
 })
 //ดูทั้งหมด
 
 //ดูแต่ละอัน
 app.get('/Reservation/:id',async(req,res)=>{
     try{
         const respones = await axios.get(base_url + '/Reservation/' + req.params.id)
         res.render("Reservation/bookkk",{showtime:respones.data})
        }catch(err){
         console.error(err)
         res.status(500).send('Error')
        }
 })
 //ดูแต่ละอัน

 // show create desktop
 app.get('/Reservatio/create',(req,res)=>{ 
     res.render("Reservation/create")
 })
 
 app.post('/Reservatio/create',async(req,res)=>{
    try{
    const data = { Reservation_id: req.body.Reservation_id , Reservation_Date_Time: req.body.Reservation_Date_Time}
     await axios.post(base_url + '/Reservation' ,data)
     res.redirect('/Reservation')
    }catch(err){
     console.error(err)
     res.status(500).send('Error')
    }
 })
 // show create desktop

 //update
 app.get('/Reservation/update/:id',async(req,res)=>{
     try{
         const respones = await axios.get(
             base_url + '/Reservation/' + req.params.id) 
             res.render('Reservation/update',{Reservation: respones.data})
   } catch(err){
       console.error(err)
       res.status(500).send('Error')
     }
 })
 
 app.post('/Reservation/update/:id',async(req,res)=>{
    try{
        const data = { Reservation_id: req.body.Reservation_id , Reservation_Date_Time: req.body.Reservation_Date_Time}
     await axios.put(base_url + '/Reservation/' + req.params.id,data)
     res.redirect('/Reservation')
    }catch(err){
     console.error(err)
     res.status(500).send('Error')
    }
 })
 //update
 
 //delete
 app.get('/Reservatio/delete/:id',async(req,res)=>{
    try{
     await axios.delete(base_url + '/Reservation/' + req.params.id)
     res.redirect('/Reservation')
    }catch(err){
     console.error(err)
     res.status(500).send('Error')
    }
 })
 //delete */

app.listen(5500,()=> console.log(`Listening on port 5500`)) //เอาไว้บรรทัดสุดท้ายห้ามยุ่ง