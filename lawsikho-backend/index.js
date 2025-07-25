import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import { port,mongoURI } from './config.js'
import router from './SRC/routes/admin.route.js'
const app=express()
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors())

app.use('/',router)
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // allow any origin
  next();
});


mongoose.connect(mongoURI, { useNewUrlParser: true })
.then(()=>{
    console.log('mongodb is connected')
    app.listen(port,()=>console.log(`server running on http://localhost:${port}`))
}
)

.catch((err)=>console.error('Error:',err))

