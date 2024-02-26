const express = require('express')
const axios = require('axios')
const path = require('path')
const app = express()
var bodyParser = require('body-parser')

const base_url = "http://localhost:3000"
//const base_url = "http://10.104.7.149"
//const base_url = "http://node56420-noedrestfifu.proen.app.ruk-com.cloud"

app.set('views', path.join(__dirname, "/public/views"))
app.set('view engine', 'ejs')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended:false}))


app.use(express.static(__dirname + '/public'))

//ดูทั้งหมด
app.get('/', async(req,res)=>{
   try{
    const respones = await axios.get(base_url + '/movie')
    res.render("books",{movie:respones.data})
   }catch(err){
    console.error(err)
    res.status(500).send('Error')
   }
})
//ดูทั้งหมด

//ดูแต่ละอัน
app.get('/movie/:id',async(req,res)=>{
    try{
        const respones = await axios.get(base_url + '/movie/' + req.params.id)
        res.render("book",{movie:respones.data})
       }catch(err){
        console.error(err)
        res.status(500).send('Error')
       }
})
//ดูแต่ละอัน

// show create desktop
app.get('/create',(req,res)=>{ 
    res.render("create")
})

app.post('/create',async(req,res)=>{
   try{
    const data = { movie_name: req.body.movie_name , genre: req.body.genre}
    await axios.post(base_url + '/books' ,data)
    res.redirect('/')
   }catch(err){
    console.error(err)
    res.status(500).send('Error')
   }
})
// show create desktop

//update
app.get('/update/:id',async(req,res)=>{
    try{
        const respones = await axios.get(
            base_url + '/movie/' + req.params.id) 
            res.render('update',{movie: respones.data})
  } catch(err){
      console.error(err)
      res.status(500).send('Error')
    }
})

app.post('/update/:id',async(req,res)=>{
   try{
    const data = { movie_name: req.body.movie_name , genre: req.body.genre}
    await axios.put(base_url + '/movie/' + req.params.id,data)
    res.redirect('/')
   }catch(err){
    console.error(err)
    res.status(500).send('Error')
   }
})
//update

//delete
app.get('/delete/:id',async(req,res)=>{
   try{
    await axios.delete(base_url + '/books/' + req.params.id)
    res.redirect('/')
   }catch(err){
    console.error(err)
    res.status(500).send('Error')
   }
})
//delete

app.listen(5500,()=> console.log(`Listening on port 5500`)) //เอาไว้บรรทัดสุดท้ายห้ามยุ่ง