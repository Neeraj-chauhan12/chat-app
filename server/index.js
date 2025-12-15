const express=require('express')
const app=express();
const cookieParser=require('cookie-parser');
const dotenv=require('dotenv');
const { connectDB } = require('./src/dbConnection/Connection');
dotenv.config();
const cors=require('cors');
const userRouter=require('./src/routes/userRouter');

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin:'http://localhost:5173',
    methods:['GET','POST','PUT','DELETE'],
    credentials:true,
}))



app.use('/api/user',userRouter);

const PORT=process.env.PORT||5000;
connectDB();
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})