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

app.listen(5500,()=> console.log(`Listening on port 5500`))