import express from "express";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";

const app = express();
app.use(express.json());
dotenv.config();

// SERVER
const MONGO_URL = process.env.MONGODB_URL;
async function createconnection(){
    const client = new MongoClient(MONGO_URL);
    await client.connect();
    console.log("Mongo connected");
    return client;
}
const client = await createconnection();

// CREATE STUDENT
app.post("/createStudent",async(req,res)=>{
    const data = req.body;
    console.log(data);

    const result = await client
                  .db("stu-teacher")
                  .collection("student")
                  .insertOne(data);
    res.send(result);
})


// GET STUDENT
app.get("/getStudent",async(req,res)=>{
    const result = await client
                  .db("stu-teacher")
                  .collection("student")
                  .find().toArray();
    res.send(result);
})


// CREATE MENTOR
app.post("/createMentor",async(req,res)=>{
    const data = req.body;
    console.log(data);

    const result = await client
                  .db("stu-teacher")
                  .collection("mentor")
                  .insertOne(data);
    res.send(result);
})


// GET MENTOR
app.get("/getMentor",async(req,res)=>{
    const result = await client
                  .db("stu-teacher")
                  .collection("mentor")
                  .find().toArray();
    res.send(result);
})


// ASSIGN MENTOR
app.put("/assignMentor/:studentId",async(req,res)=>{
    const {studentId} = req.params;
    console.log(studentId)
    const result=await client
                  .db("stu-teacher")
                  .collection('student').updateOne(
                   {Id:studentId} ,
                   {$set: {...req.body}});
    res.send(result);
})


// ASSING STUDENT
app.put("/assignStudent/:MentorId",async(req,res)=>{
    const {MentorId} = req.params;
    console.log(MentorId)
    const result=await client
                  .db("stu-teacher")
                  .collection('mentor').updateOne(
                   {Id:MentorId} ,
                   {$set: {...req.body}});
    res.send(result);
})


// STUDENT NOT HAVING A MENTOR
app.get("/whoNothavingMentor",async(req,res)=>{
    const result= await client
                   .db("stu-teacher")
                   .collection("student")
                   .find({ Mentor: { $exists: true, $type: 'array', $eq: [] } }).toArray();
    res.send(result);
})


// GET ALL STUDENT AND MENTOR
app.get("/get",async(req,res)=>{
    const ans = await client
                .db("stu-teacher")
                .collection("student")
                .find().toArray();
    console.log(ans);
    ans?res.send(ans):res.status(804).send({msg:"not found"});
});

// app.get("/",async(req,res)=>{
//     res.send("hi")
// })
const PORT = 3001||process.env.PORT;
app.listen(PORT,()=>console.log("The server is started",PORT));