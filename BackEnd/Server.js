const express=require("express");
const cors=require("cors");
const {MongoClient}=require("mongodb");

const app=express();
app.use(cors());

const uri="mongodb+srv://umeshmaduwantha:Passivevoice%4010@cluster0.oymmo9e.mongodb.net/?appName=Cluster0";
const client=new MongoClient(uri);

async function mongodbconnect(){
    try{
        await client.connect();
        console.log("Mongo DB Connect");
    }catch(err){
        console.error(err);
    }finally{
        await client.close();
    }
}

app.get("/",(req,res)=>{res.send("Mongo db is connected the server and running")});

async function createServer(){
    try{
        await mongodbconnect();
        app.listen(3000, ()=>{
            console.log("Server is running on http://localhost:3000");
        })
    }catch(err){
        console.error("Mongo db error",err);
    }

}

createServer();





