const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const app = express();
app.use(cors());
app.use(express.json());
const dns = require("dns");
const { features } = require("process");

const uri = "mongodb+srv://umeshmaduwantha:Passivevoice%4010@cluster0.oymmo9e.mongodb.net/yourDatabaseName?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri);
let db;

dns.setServers(["1.1.1.1","8.8.8.8"])

async function mongodbconnect() {
  try {
    await client.connect();
    db = client.db("Tourust_giude_app");
    console.log("MongoDB Connected");
  } catch (err) {
    console.error(err);
  }
}

const getdistancekm = (lat1, lng1, lat2, lng2) => {
      const R = 6371;
      const dLat = (lat2 - lat1) * (Math.PI / 180);
      const dLng = (lng2 - lng1) * (Math.PI / 180);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
      return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    };

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

app.get("/Hotels", async (req, res) => {
  try {
    const query = req.query.q;

    const filter = query
      ? {
          $or: [
            { hotel_name: { $regex: query, $options: "i" } },
            { nearest_cities: { $regex: query, $options: "i" } },
          ]
        }
      : {}; // if no query, return all

    const hotels = await db
      .collection("Hotels")
      .find(filter)
      .toArray();

    res.json(hotels);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.get("/Attraction/nearby", async (req, res) => {
  try {
    const query = req.query.names;
    if (!query) {
      return res.json([]);
    }
    const names = query.split(',').map((n) => n.trim());

    const attraction = await db.collection('Attraction_places')
      .find({ attraction_name: { $in: names } })
      .toArray();

    res.json(attraction);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.get("/Hotels/nearby", async (req, res) => {
  try {
    //both 'latitude/longitude' AND 'lat/lon'
    const lat = req.query.latitude || req.query.lat;
    const lon = req.query.longitude || req.query.lon;
    const radius = req.query.radius || 10;

    if (!lat || !lon) {
      return res.json([]);
    }

    const userLat = parseFloat(lat);
    const userLon = parseFloat(lon);
    const maxRadius = parseFloat(radius);

    const allhotels = await db.collection("Hotels").find({}).toArray();

    const nearby = allhotels
      .map((hotel) => ({
        ...hotel,
        distanceKm: (getdistancekm(userLat, userLon, hotel.latitude, hotel.longitude).toFixed(2))
      }))
      .filter((hotel) => hotel.distanceKm <= maxRadius)
      .sort((a, b) => a.distanceKm - b.distanceKm);

    res.json(nearby);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.get("/Attraction/Names",async(req,res)=>{
  try{
    const query=req.query.names;
    const hotelLat=parseFloat(req.query.hotelLat);
    const hotelLon=parseFloat(req.query.hotelLon);
    if(!query) return res.json([]);

    const names=query.split(",").map((n)=>n.trim());
    const attraction=await db.collection('Attraction_places')
    .find({attraction_name:{$in:names}})
    .toArray();

    const result=attraction.map((places)=>({
      ...places,
      distanceKm:(hotelLat&&hotelLon&&places.latitude&&places.longitude)
      ?(getdistancekm(hotelLat, hotelLon, places.latitude, places.longitude).toFixed(2))
      :null 
    }));
    res.json(result)
  }
  catch(err){
    res.status(500).json({error:"Something went wrong"})
  }
});

app.get("/Attraction", async (req, res) => {
  try {
    const query = req.query.q;
    const category=req.query.category;

    const filter = query
      ? {
          $or: [
            { attraction_name: { $regex: query, $options: "i" } },
            { city: { $regex: query, $options: "i" } },
          ]
        }
      : {};
    if(category && category!=="ALL"){
      filter.category=category;
    }

    const attraction = await db
      .collection("Attraction_places")
      .find(filter)
      .toArray();

    res.json(attraction);
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
});


async function createServer() {
  await mongodbconnect();
  app.listen(3000, "0.0.0.0", () => {
    console.log("Server is running on http://172.31.99.233:3000");
  });
}

createServer();