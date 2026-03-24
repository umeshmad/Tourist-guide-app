const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");

const app = express();
app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://umeshmaduwantha:Passivevoice%4010@cluster0.oymmo9e.mongodb.net/?appName=Cluster0";
const client = new MongoClient(uri);
let db;

async function mongodbconnect() {
  try {
    await client.connect();
    db = client.db("Tourust_giude_app");
    console.log("MongoDB Connected");
  } catch (err) {
    console.error(err);
  }
}

app.get("/search", async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) return res.json([]);

    const places = await db
      .collection("Attraction_places")
      .find({ attraction_name: { $regex: "^" + query, $options: "i" } })
      .limit(10)
      .toArray();

    res.json(places);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});
app.get("/Hotels", async(req,res)=>{
  try{
    const query=req.query.q;
    if(!query){
      return res.json([]);
    }
    const hotels=await db
      .collection("Hotels")
      .find({$or:[
        {hotel_name:{$regex:query, $options: "i"}},
        {nearest_cities:{$regex:"^"+query+"$",$options:"i"}}
      ]})
      .toArray();
    res.json(hotels)
  }catch(err){
    console.error(err);
    res.status(500).json({error: "Something went wrong"})
  }
  
})

app.get("/Attraction/nearby", async(req,res)=>{
  try{
    const query=req.query.names;
    if(!query){
      return res.json([]);
    }
    const names=query.split(',').map((n)=>n.trim());

    const attraction=await db.collection('Attraction_places')
    .find({attraction_name:{$in:names}})
    .toArray();

    res.json(attraction);
  }catch(err){
    console.error(err);
    res.status(500).json({error:"Something went wrong"});
  }
})

app.get("/Hotels/nearby",async(req,res)=>{
  try{
    const {lat,lon,radius=10}=req.query;
    if(!lat || !lon){
      return res.json([]);
    }
    const userLat=parseFloat(lat);
    const userLon=parseFloat(lon);
    const maxRadius=parseFloat(radius);

    const getdistancekm=(lat1,lng1,lat2,lng2)=>{
      const R = 6371;
      const dLat = (lat2 - lat1) * (Math.PI / 180);
      const dLng = (lng2 - lng1) * (Math.PI / 180);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
      return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }
    const allhotels=await db.collection("Hotels")
    .toArray()

    const nearby=allhotels.map((hotel)=>({...hotel,distanceKm:getdistancekm(userLat,userLon,hotel.latitude,hotel.longitude)}))
    .filter((hotel)=>hotel.distanceKm<=maxRadius)
    .sort((a,b)=>a.distanceKm-b.distanceKm)
    res.json(nearby);
  }catch(err){
    console.error(err);
    res.status(500).json({error:"Something went wrong"});
  }
})
async function createServer() {
  await mongodbconnect();
  app.listen(3000, "0.0.0.0", () => {
    console.log("Server is running on http://10.30.10.119:3000");
  });
}

createServer();