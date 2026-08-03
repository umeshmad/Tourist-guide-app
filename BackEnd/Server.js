const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const app = express();
app.use(cors());
app.use(express.json());
const dns = require("dns");
const { features } = require("process");
const turf = require("@turf/turf");
const { default: BASE_URL } = require("../FrontEnd/my-app/config");

const uri = "mongodb+srv://umeshmaduwantha:Passivevoice%4010@cluster0.oymmo9e.mongodb.net/yourDatabaseName?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri);
let db;

dns.setServers(["1.1.1.1", "8.8.8.8"])

async function mongodbconnect() {
  try {
    await client.connect();
    db = client.db("Tourust_giude_app");
    console.log("MongoDB Connected");
  } catch (err) {
    console.error(err);
  }
};

async function geocodeCity(cityName) {
  const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json&country=LK`);
  const data = await res.json();
  if (!data.results || data.results.length == 0) return null;
  const { latitude, longitude, name } = data.results[0];
  return { latitude, longitude, name };
}
async function getRouteGeometry(startPoint, endPoint) {
  const url = `https://router.project-osrm.org/route/v1/driving/${startPoint.longitude},${startPoint.latitude};${endPoint.longitude},${endPoint.latitude}?overview=full&geometries=geojson`;
  const res = await fetch(url);
  const data = await res.json();
  if (!data.routes || data.routes.length === 0) return null;
  return data.routes[0].geometry;
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
    const query = req.query.q?.trim();
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
    const query = req.query.q?.trim();

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
    const query = req.query.names?.trim();
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

app.get("/Resturants/nearby", async (req, res) => {
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

    const allresturant = await db.collection("Resturants").find({}).toArray();

    const nearby = allresturant
      .map((resturant) => ({
        ...resturant,
        distanceKm: (getdistancekm(userLat, userLon, resturant.latitude, resturant.longitude).toFixed(2))
      }))
      .filter((resturant) => resturant.distanceKm <= maxRadius)
      .sort((a, b) => a.distanceKm - b.distanceKm);

    res.json(nearby);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.get("/Attractions/nearby", async (req, res) => {
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

    const allAttraction = await db.collection("Attraction_places").find({}).toArray();

    const nearby = allAttraction
      .map((attraction) => ({
        ...hotel,
        distanceKm: (getdistancekm(userLat, userLon, attraction.latitude, attraction.longitude).toFixed(2))
      }))
      .filter((attraction) => attraction.distanceKm <= maxRadius)
      .sort((a, b) => a.distanceKm - b.distanceKm);

    res.json(nearby);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});


app.get("/Attraction/Names", async (req, res) => {
  try {
    const query = req.query.names?.trim();
    const hotelLat = parseFloat(req.query.hotelLat);
    const hotelLon = parseFloat(req.query.hotelLon);
    if (!query) return res.json([]);

    const names = query.split(",").map((n) => n.trim());
    const attraction = await db.collection('Attraction_places')
      .find({ attraction_name: { $in: names } })
      .toArray();

    const result = attraction.map((places) => ({
      ...places,
      distanceKm: (hotelLat && hotelLon && places.latitude && places.longitude)
        ? (getdistancekm(hotelLat, hotelLon, places.latitude, places.longitude).toFixed(2))
        : null
    }));
    res.json(result)
  }
  catch (err) {
    res.status(500).json({ error: "Something went wrong" })
  }
});

app.get("/Attraction", async (req, res) => {
  try {
    const query = req.query.q?.trim();
    const category = req.query.category;

    const filter = query
      ? {
        $or: [
          { attraction_name: { $regex: query, $options: "i" } },
          { city: { $regex: query, $options: "i" } },
        ]
      }
      : {};
    if (category && category !== "All") {
      filter.category = category;
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

app.get("/Resturants", async (req, res) => {
  try {
    const query = req.query.q?.trim();
    const category = req.query.category;

    const filter = {};

    if (query) {
      filter.$or = [
        { restaurant_name: { $regex: query, $options: "i" } },
        { amenity_type: { $regex: query, $options: "i" } },
        { city: { $regex: query, $options: "i" } },
        { nearby_attractions: { $regex: query, $options: "i" } },
      ];
    }

    if (category && category !== "ALL") {
      filter.cuisine_type = { $regex: `^${category}$`, $options: "i" };
    }

    const Restaurants = await db
      .collection("Resturants")
      .find(filter)
      .toArray()

    res.json(Restaurants);
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" })
  }
});

app.post("/log/click", async (req, res) => {
  try {
    const { attraction_name, attraction_id } = req.body;
    await db.collection("search_logs").insertOne({
      attraction_id: attraction_id,
      attraction_name,
      timeStamp: new Date()
    });
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.get("/popular", async (req, res) => {
  try {
    const top = await db.collection("search_logs").aggregate([
      { $match: { attraction_id: { $exists: true, $ne: null, $regex: "^[0-9a-fA-F]{24}$" } } },
      { $group: { _id: "$attraction_id", attraction_name: { $first: "$attraction_name" }, count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
      { $addFields: { attraction_obj_id: { $toObjectId: "$_id" } } },
      {
        $lookup: {
          from: "Attraction_places",
          localField: "attraction_obj_id",
          foreignField: "_id",
          as: "details"
        }
      },
      { $unwind: "$details" },
      { $replaceRoot: { newRoot: { $mergeObjects: ["$details", { count: "$count" }] } } }
    ]).toArray();

    res.json(top);
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" })
  }
});

app.get("/weather", async (req, res) => {
  try {
    const lat = req.query.lat;
    const lon = req.query.lon;

    const responce = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weathercode,wind_speed_10m`
    );
    const data = await responce.json();
    res.json(data.current);
  } catch (err) {
    res.status(500).json({ error: "Weather fetch failed" });
  }
})

app.get("/weather/alert", async (req, res) => {
  try {
    const lat = req.query.lat;
    const lon = req.query.lon;

    const responce = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weathercode,wind_speed_10m,rain`
    );
    const data = await responce.json();
    const current = data.current;

    const rain = current.rain || 0;
    const wind = current.wind_speed_10m || 0;

    const attractions = await db.collection("Attraction_places").find({
      latitude: { $gte: parseFloat(lat) - 0.5, $lte: parseFloat(lat) + 0.5 },
      longitude: { $gte: parseFloat(lon) - 0.5, $lte: parseFloat(lon) + 0.5 },
    }).toArray();

    const alerts = [];

    attractions.forEach((place) => {
      if (rain >= (place.rain_red_mm || 150)) {
        alerts.push({ level: "red", place: place.attraction_name, message: `Extreme rainfall warning at ${place.attraction_name}. Avoid visiting.` });
      } else if (rain >= (place.rain_amber_mm || 100)) {
        alerts.push({ level: "amber", place: place.attraction_name, message: `Heavy rain warning at ${place.attraction_name}. Visit with caution.` });
      } else if (rain >= (place.rain_yellow_mm || 75)) {
        alerts.push({ level: "yellow", place: place.attraction_name, message: `Moderate rain at ${place.attraction_name}. Be prepared.` });
      }

      if (wind >= (place.wind_danger_kmph || 75)) {
        alerts.push({ level: "red", place: place.attraction_name, message: `Dangerous winds at ${place.attraction_name}. Do not visit.` });
      } else if (wind >= (place.wind_warning_kmph || 55)) {
        alerts.push({ level: "amber", place: place.attraction_name, message: `Strong wind warning at ${place.attraction_name}.` });
      } else if (wind >= (place.wind_advisory_kmph || 40)) {
        alerts.push({ level: "yellow", place: place.attraction_name, message: `Wind advisory at ${place.attraction_name}.` });
      }
    });

    res.json({ rain, wind, alerts });

  } catch (err) {
    res.status(500).json({ error: "Alert fetch failed" });
  }
});

app.post("/auth/register", async (req, res) => {
  try {
    const { email, password, name, phone, emergencyContact } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ error: "All fields are required" })
    }
    const existing = await db.collection("Users").findOne({ email });
    if (existing) {
      return res.status(409).json({ error: "Email already registered" })
    }
    await db.collection("Users").insertOne({
      name,
      email,
      password,
      phone,
      emergencyContact,
      createdAt: new Date()
    });
    res.json({ success: true, message: "Registered successfully" })
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Registration failed" });
  }
});

app.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" })
    }
    const user = await db.collection("Users").findOne({ email, password });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" })
    }
    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    })
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed" });
  }
})
app.post("/auth/preferances", async (req, res) => {
  try {
    const { email, preferences } = req.body;
    if (!email || !preferences) {
      return res.status(400).json({ error: "Missing data" });
    }
    const result = await db.collection("Users").updateOne(
      { email: email },
      { $set: { preferences: preferences } },
      { upsert: false }
    );
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "User not found. Please register first." });
    }
    res.json({ success: true });
  } catch (err) {
    console.error("Preferences error:", err);
    res.status(500).json({ error: "Failed to save preferences" });
  }
});

app.get("/auth/user", async (req, res) => {
  try {
    const email = req.query.email;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }
    const user = await db.collection("Users").findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        emergencyContact: user.emergencyContact
      }
    });
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.get("/route/recommendations", async (req, res) => {
  try {
    const { start, destination, limit = 20, buffer = 20 } = req.query;
    if (!start || !destination) {
      return res.status(400).json({ error: "start and destination are required" });
    }
    const [startPoint, endPoint] = await Promise.all([
      geocodeCity(start),
      geocodeCity(destination)
    ])
    if (!startPoint || !endPoint) {
      return res.status(400).json({ error: "Could not locate one of the given places" });
    }
    const routeGeometry = await getRouteGeometry(startPoint, endPoint);
    if (!routeGeometry) {
      return res.status(404).json({ error: "No route found between these locations" });
    }

    const routeline = turf.lineString(routeGeometry.coordinates);
    const routeLengthKm = turf.length(routeline, { units: "kilometers" });
    const bufferKm = parseFloat(buffer);
    const maxResults = parseInt(limit);

    // Fetch all attractions and filter by distance
    const allPlaces = await db.collection("Attraction_places").find({}).toArray();

    const candidates = allPlaces
      .filter((place) => {
        if (!place.latitude || !place.longitude) return false;
        const point = turf.point([parseFloat(place.longitude), parseFloat(place.latitude)]);
        const distKm = turf.pointToLineDistance(point, routeline, { units: "kilometers" });
        return distKm <= bufferKm;
      })
      .map((place) => {
        const point = turf.point([parseFloat(place.longitude), parseFloat(place.latitude)]);
        const nearest = turf.nearestPointOnLine(routeline, point, { units: "kilometers" });
        const distanceFromRouteKm = turf.pointToLineDistance(point, routeline, { units: "kilometers" });
        return {
          ...place,
          distanceFromRouteKm: parseFloat(distanceFromRouteKm.toFixed(2)),
          distanceAlongRouteKm: parseFloat(nearest.properties.location.toFixed(2)),
        };
      })
      .sort((a, b) => a.distanceAlongRouteKm - b.distanceAlongRouteKm);

    // One place from each city
    const selectedIds = new Set();
    const cityBest = [];

    // Group by city, pick highest-rated 
    const cityMap = {};
    for (const place of candidates) {
      const city = (place.city || "Unknown").trim().toLowerCase();
      if (!cityMap[city]) cityMap[city] = [];
      cityMap[city].push(place);
    }
    for (const city of Object.keys(cityMap)) {
      const best = cityMap[city].sort((a, b) => (parseFloat(b.rating) || 0) - (parseFloat(a.rating) || 0))[0];
      cityBest.push(best);
      selectedIds.add(String(best._id));
    }

    cityBest.sort((a, b) => a.distanceAlongRouteKm - b.distanceAlongRouteKm);

    const extras = candidates.filter(p => !selectedIds.has(String(p._id)));

    // Merge: city picks first (up to limit)
    const merged = [...cityBest, ...extras].slice(0, maxResults);

    merged.sort((a, b) => a.distanceAlongRouteKm - b.distanceAlongRouteKm);

    res.json({
      start: startPoint,
      destination: endPoint,
      routeLengthKm: parseFloat(routeLengthKm.toFixed(2)),
      bufferKm,
      count: merged.length,
      places: merged,
    })
  } catch (err) {
    console.error("Route recommendations error:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
})




async function createServer() {
  await mongodbconnect();
  app.listen(3000, "0.0.0.0", () => {
    console.log("Server is running on http://172.31.99.233:3000");
  });
}

createServer();