const express = require('express')
const mongoose = require('mongoose')
const app = express();
const port = 3000;
const cors = require('cors')
const categoryRoutes = require('./routes/categories')
const brandRoutes = require('./routes/brand')
const productRoutes = require('./routes/product')
const customerRoutes = require('./routes/customer')
const authRoutes = require('./routes/auth')


app.use(cors())
app.use(express.json())
app.get('/',(req,res)=>{
    res.send("server running")
});
app.use('/category', categoryRoutes);
app.use('/brand', brandRoutes)
app.use('/product', productRoutes)
app.use('/customer', customerRoutes)
app.use('/auth', authRoutes)

async function connectDb(){
    await mongoose.connect("mongodb://localhost:27017",{
        dbName:"angular-app-db"
    })
}

connectDb().catch((err)=>{
    console.error(err);
})
app.listen(port,()=>{
    console.log('server running on port 3000...')
})