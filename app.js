
import  express  from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv'
import userSchema from './models/userSchema.js';
import Mail from './api/mail.js';
const email=[]
const vehicle =[]

const app=express();
dotenv.config();
app.use(express.json());

const port = 3000;

mongoose.connect(process.env.MONGODB_URI,{
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: 'Challan'
}).then(()=>{
  console.log("connected to mongoDb")
}).catch(err => console.log(err))



app.post('/api',async(req,res)=>{
  // console.log(req)
  const email=req.body.email;
  const vehicle =req.body.vehicle;
  const data=await userSchema.insertMany({email, vehicle})
  if (data){
     res.sendStatus(200);
  }
  else{
    res.sendStatus(400);
  }
});




async function myFunction() {
  try {
    const data = await userSchema.find(); // Use the User model here
    console.log("Function executed!");
    console.log(data);
    const map= data.map(async(item)=>{
      await Mail(item.vehicle,item.email)
    })
    console.log(map);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// app.get('/api',async(req,res)=>{
//   const ok= await myFunction();
//   res.sendStatus(200);
// });

function scheduleFunction(intervalInHours, asyncFunc) {
  const millisecondsPerHour = 60 * 60 * 1000; // 1 hour = 60 minutes * 60 seconds * 1000 milliseconds
  const intervalInMilliseconds = intervalInHours * millisecondsPerHour;

  async function wrapper() {
    try {
      await myFunction(); // Await the asynchronous function
    } catch (error) {
      console.error("Error in scheduled function:", error);
    }
  }

  wrapper(); // Call the function immediately on start

  setInterval(wrapper, intervalInMilliseconds);
}

const intervalHours = 24;
scheduleFunction(intervalHours, myFunction);



app.listen(3000, () => {
  console.log(`Server is listening on port ${port}`);
});




