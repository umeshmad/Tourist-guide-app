const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const app = express();
app.use(cors());
app.use(express.json());

// Serve uploaded images as static files
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);
app.use("/uploads", express.static(uploadsDir));

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only image files are allowed"));
  }
});

// Image upload endpoint
app.post("/upload/image", upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  const imageUrl = `http://localhost:3000/uploads/${req.file.filename}`;
  res.json({ success: true, url: imageUrl });
});
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
    const email = req.query.email;

    const filter = query
      ? {
        $or: [
          { hotel_name: { $regex: query, $options: "i" } },
          { nearest_cities: { $regex: query, $options: "i" } },
          { city: { $regex: query, $options: "i" } },
        ]
      }
      : {};

    const rawHotels = await db
      .collection("Hotels")
      .find(filter)
      .toArray();

    if (!email) {
      return res.json(rawHotels);
    }

    const since = new Date();
    since.setDate(since.getDate() - 60);

    const [logs, matchingAttractions] = await Promise.all([
      db.collection('Behaviour_Logs').find({ email, timestamp: { $gte: since } }).toArray(),
      query 
        ? db.collection('Attraction_places').find({ city: { $regex: query, $options: "i" } }).toArray()
        : db.collection('Attraction_places').find({}).toArray()
    ]);

    const { categoryWeights, regionWeights } = buildBehaviourMaps(logs);
    const locationSupportedCategories = getDynamicSupportedCategoriesForLocation(matchingAttractions);

    const scoredHotels = rawHotels.map(h => {
      const hotelRegion = classifyRegion({
        attraction_type: h.features || '',
        category: h.description || '',
        city: h.nearest_cities || h.city || '',
        attraction_name: h.hotel_name || ''
      });
      const catBonus = categoryWeights[(h.features || '').toLowerCase()] || 0;
      const regBonus = getRegionBehaviourBonus(regionWeights, hotelRegion, locationSupportedCategories);
      const total = catBonus + regBonus;
      return {
        ...h,
        regionType: hotelRegion,
        preferenceScore: total,
        preferenceMatch: total > 0,
      };
    }).sort((a, b) => b.preferenceScore - a.preferenceScore);

    res.json(scoredHotels);
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
        ...attraction,
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
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weathercode,wind_speed_10m,rain,precipitation`
    );
    const data = await responce.json();
    res.json(data.current);
  } catch (err) {
    res.status(500).json({ error: "Weather fetch failed" });
  }
})

// ── Shared weather alert helper ──────────────────────────────────────────────
// Derives a single worst-level alert from open-meteo current weather data.
// Thresholds (lowered for demo): rain yellow=0.1mm, amber=1mm, red=5mm
//                                wind yellow=5km/h, amber=15km/h, red=30km/h
function deriveAlert(current, locationName) {
  const weathercode = current.weathercode || 0;
  let rain = current.rain ?? current.precipitation ?? 0;
  const wind = current.wind_speed_10m || 0;

  // If weathercode says it's raining but rain field is still 0, synthesize a value
  if (rain === 0 && weathercode >= 51 && weathercode <= 82) {
    if (weathercode >= 65) rain = 3.0;      // heavy rain → amber
    else if (weathercode >= 61) rain = 0.8; // moderate rain → yellow
    else rain = 0.2;                        // drizzle → yellow
  }
  if (rain === 0 && weathercode >= 95) rain = 6.0; // thunderstorm → red

  const ORDER = { red: 0, amber: 1, yellow: 2 };
  let level = null;
  const parts = [];

  // Rain level
  let rainLevel = rain >= 5 ? 'red' : rain >= 1 ? 'amber' : rain >= 0.1 ? 'yellow' : null;
  if (rainLevel) {
    const msg = rain >= 5 ? 'Extreme rainfall' : rain >= 1 ? 'Heavy rain' : 'Light rain';
    parts.push(msg);
    if (!level || ORDER[rainLevel] < ORDER[level]) level = rainLevel;
  }

  // Wind level
  let windLevel = wind >= 30 ? 'red' : wind >= 15 ? 'amber' : wind >= 5 ? 'yellow' : null;
  if (windLevel) {
    const msg = wind >= 30 ? 'Dangerous winds' : wind >= 15 ? 'Strong winds' : 'Moderate winds';
    parts.push(msg);
    if (!level || ORDER[windLevel] < ORDER[level]) level = windLevel;
  }

  if (!level) return null;
  return { level, rain: +rain.toFixed(2), wind: +wind.toFixed(1), weathercode, message: `${parts.join(' & ')} in ${locationName}.` };
}

// ── /weather/alert  (per-place, small radius, used in Attraction expanded card) ─
app.get("/weather/alert", async (req, res) => {
  try {
    const lat = req.query.lat;
    const lon = req.query.lon;

    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weathercode,wind_speed_10m,rain,precipitation`
    );
    const data = await response.json();
    const current = data.current;
    const wind = current.wind_speed_10m || 0;
    let rain = current.rain ?? current.precipitation ?? 0;
    const weathercode = current.weathercode || 0;

    // Small radius: 0.2° (~22km) – finds only the attraction itself and immediate neighbours
    const attractions = await db.collection("Attraction_places").find({
      latitude:  { $gte: parseFloat(lat) - 0.2, $lte: parseFloat(lat) + 0.2 },
      longitude: { $gte: parseFloat(lon) - 0.2, $lte: parseFloat(lon) + 0.2 },
    }).limit(10).toArray();

    const alerts = [];
    attractions.forEach((place) => {
      const a = deriveAlert(current, place.attraction_name);
      if (a) alerts.push({ ...a, place: place.attraction_name });
    });

    res.json({ rain, wind, weathercode, alerts });
  } catch (err) {
    res.status(500).json({ error: "Alert fetch failed" });
  }
});

// ── /weather/place-alert  (single location, no DB query, used in expanded card) ─
app.get("/weather/place-alert", async (req, res) => {
  try {
    const { lat, lon, name } = req.query;
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weathercode,wind_speed_10m,rain,precipitation`
    );
    const data = await response.json();
    const current = data.current;
    const alert = deriveAlert(current, name || 'this location');
    res.json({
      temperature_2m: current.temperature_2m,
      weathercode: current.weathercode,
      wind_speed_10m: current.wind_speed_10m,
      rain: current.rain ?? current.precipitation ?? 0,
      alert  // null when no alert
    });
  } catch (err) {
    res.status(500).json({ error: 'Place alert fetch failed' });
  }
});

// ── /weather/district-alerts  (all 25 Sri Lanka districts, used in Home banner) ─
const SL_DISTRICTS = [
  { name: 'Colombo',       lat: 6.9271, lon: 79.8612 },
  { name: 'Gampaha',       lat: 7.0917, lon: 80.0137 },
  { name: 'Kalutara',      lat: 6.5854, lon: 79.9607 },
  { name: 'Kandy',         lat: 7.2906, lon: 80.6337 },
  { name: 'Matale',        lat: 7.4675, lon: 80.6234 },
  { name: 'Nuwara Eliya',  lat: 6.9497, lon: 80.7891 },
  { name: 'Galle',         lat: 6.0535, lon: 80.2210 },
  { name: 'Matara',        lat: 5.9549, lon: 80.5550 },
  { name: 'Hambantota',    lat: 6.1241, lon: 81.1185 },
  { name: 'Jaffna',        lat: 9.6615, lon: 80.0255 },
  { name: 'Kilinochchi',   lat: 9.3803, lon: 80.4020 },
  { name: 'Mannar',        lat: 8.9767, lon: 79.9045 },
  { name: 'Vavuniya',      lat: 8.7514, lon: 80.4971 },
  { name: 'Mullaitivu',    lat: 9.2671, lon: 80.8120 },
  { name: 'Batticaloa',    lat: 7.7170, lon: 81.7000 },
  { name: 'Ampara',        lat: 7.3002, lon: 81.6747 },
  { name: 'Trincomalee',   lat: 8.5874, lon: 81.2152 },
  { name: 'Kurunegala',    lat: 7.4867, lon: 80.3647 },
  { name: 'Puttalam',      lat: 8.0362, lon: 79.8283 },
  { name: 'Anuradhapura',  lat: 8.3114, lon: 80.4037 },
  { name: 'Polonnaruwa',   lat: 7.9403, lon: 81.0188 },
  { name: 'Badulla',       lat: 6.9934, lon: 81.0550 },
  { name: 'Moneragala',    lat: 6.8728, lon: 81.3500 },
  { name: 'Ratnapura',     lat: 6.7056, lon: 80.3847 },
  { name: 'Kegalle',       lat: 7.2513, lon: 80.3464 },
];

app.get("/weather/district-alerts", async (req, res) => {
  try {
    const results = await Promise.allSettled(
      SL_DISTRICTS.map(async (d) => {
        const resp = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${d.lat}&longitude=${d.lon}&current=weathercode,wind_speed_10m,rain,precipitation`
        );
        const json = await resp.json();
        const alert = deriveAlert(json.current, `${d.name} District`);
        if (!alert) return null;
        return { district: d.name, ...alert };
      })
    );

    const ORDER = { red: 0, amber: 1, yellow: 2 };
    const alerts = results
      .filter(r => r.status === 'fulfilled' && r.value !== null)
      .map(r => r.value)
      .sort((a, b) => ORDER[a.level] - ORDER[b.level]);

    res.json({ alerts });
  } catch (err) {
    res.status(500).json({ error: 'District alerts failed' });
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
        emergencyContact: user.emergencyContact,
        preferences: user.preferences || null
      }
    });
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
});


function extractItemCategoryTypes(placeOrText) {
  let text = '';
  if (typeof placeOrText === 'string') {
    text = placeOrText.toLowerCase();
  } else if (placeOrText && typeof placeOrText === 'object') {
    text = `${placeOrText.category || ''} ${placeOrText.attraction_type || ''} ${placeOrText.attraction_name || ''} ${placeOrText.city || ''} ${placeOrText.description || ''}`.toLowerCase();
  }

  const types = new Set();
  if (/\b(beach|beaches|surf|coastal|coast|lagoon|ocean|sea|bay|island)\b/i.test(text)) {
    types.add('coastal');
  }
  if (/\b(hill|hills|mountain|mountains|highland|tea|waterfall|waterfalls|trekking|peak|trail|riverston)\b/i.test(text)) {
    types.add('hill');
  }
  if (/\b(temple|temples|ancient|ruin|ruins|heritage|stupa|fort|museum|monument|dagoba)\b/i.test(text)) {
    types.add('heritage');
  }

  if (types.size === 0) {
    types.add('general');
  }
  return Array.from(types);
}

function classifyRegion(place) {
  const types = extractItemCategoryTypes(place);
  if (types.includes('coastal')) return 'coastal';
  if (types.includes('hill')) return 'hill';
  if (types.includes('heritage')) return 'heritage';
  return 'inland';
}

function getDynamicSupportedCategoriesForLocation(locationPlaces) {
  const supported = new Set();
  if (Array.isArray(locationPlaces)) {
    for (const p of locationPlaces) {
      const types = extractItemCategoryTypes(p);
      types.forEach(t => supported.add(t));
    }
  }
  if (supported.size === 0) {
    supported.add('coastal');
    supported.add('hill');
    supported.add('heritage');
    supported.add('general');
  }
  return Array.from(supported);
}

function buildBehaviourMaps(logs) {
  const categoryWeights = {};
  const regionWeights = {};

  for (const log of logs) {
    const text = `${log.itemName || ''} ${log.itemCategory || ''} ${log.regionType || ''}`;
    const types = extractItemCategoryTypes(text);

    for (const t of types) {
      regionWeights[t] = Math.min((regionWeights[t] || 0) + 1, 10);
    }
    const cat = (log.itemCategory || '').toLowerCase();
    if (cat) categoryWeights[cat] = Math.min((categoryWeights[cat] || 0) + 1, 10);
  }

  return { categoryWeights, regionWeights };
}

function getRegionBehaviourBonus(regionWeights, itemRegionType, locationSupportedCategories) {
  if (!itemRegionType || !locationSupportedCategories || locationSupportedCategories.length === 0) return 0;

  // Zero out bonus if current location has NO attractions of this category type (e.g. Beaches in Kandy)
  if (!locationSupportedCategories.includes(itemRegionType)) {
    return 0;
  }

  return regionWeights[itemRegionType] || 0;
}

function deriveContextRegionFromQuery(query) {
  if (!query) return null;
  const types = extractItemCategoryTypes(query);
  if (types.includes('coastal')) return 'coastal';
  if (types.includes('hill')) return 'hill';
  if (types.includes('heritage')) return 'heritage';
  return null;
}

function deriveContextRegionFromGPS(lat, lon) {
  if (!lat || !lon) return null;
  lat = parseFloat(lat);
  lon = parseFloat(lon);
  if (isNaN(lat) || isNaN(lon)) return null;

  if (lat >= 6.7 && lat <= 7.5 && lon >= 80.4 && lon <= 81.2) return 'hill';
  if (lat >= 7.8 && lat <= 9.2 && lon >= 80.0 && lon <= 81.5) return 'heritage';
  if (lon < 80.15 || lon > 81.45 || lat < 6.15) return 'coastal';
  return 'inland';
}

function diversifyResults(scoredItems) {
  if (scoredItems.length <= 3) return scoredItems;

  // Collect the highest preferenceScore per region type
  const regionPeak = {};
  for (const item of scoredItems) {
    const r = item.regionType || 'inland';
    if ((item.preferenceScore || 0) > (regionPeak[r] || 0)) regionPeak[r] = item.preferenceScore || 0;
  }

  const peakScores = Object.values(regionPeak).sort((a, b) => b - a);
  if (peakScores.length < 2) return scoredItems; // only one region, nothing to diversify

  const gap = peakScores[0] - peakScores[peakScores.length - 1];

  // Clear dominance → keep score order
  if (gap > 2) return scoredItems;

  // Balanced interest → interleave by region
  const groups = {};
  for (const item of scoredItems) {
    const r = item.regionType || 'inland';
    if (!groups[r]) groups[r] = [];
    groups[r].push(item); // already sorted by score within group
  }

  // Order groups by their peak score descending
  const orderedKeys = Object.keys(groups).sort((a, b) => (regionPeak[b] || 0) - (regionPeak[a] || 0));

  const result = [];
  let i = 0;
  while (result.length < scoredItems.length) {
    let added = false;
    const key = orderedKeys[i % orderedKeys.length];
    if (groups[key] && groups[key].length > 0) {
      result.push(groups[key].shift());
      added = true;
    }
    i++;
    // Safety break: if all groups exhausted
    if (orderedKeys.every(k => !groups[k] || groups[k].length === 0)) break;
  }
  return result;
}

app.get("/Search/All", async (req, res) => {
  try {
    const query = req.query.q?.trim();
    const email = req.query.email;
    if (!query) return res.json({ attractions: [], hotels: [], restaurants: [] });

    // Load preferences + behaviour logs in parallel
    let categoryWeights = {};
    let regionWeights = {};

    if (email) {
      const since = new Date();
      since.setDate(since.getDate() - 60);

      // Automatically log search query to Behaviour_Logs so search history is persisted
      if (query.length >= 3) {
        const queryTypes = extractItemCategoryTypes(query);
        db.collection('Behaviour_Logs').insertOne({
          email,
          itemId: `search_${query.toLowerCase()}`,
          itemName: query,
          itemType: 'search',
          itemCategory: query.toLowerCase(),
          regionType: queryTypes[0] || 'inland',
          timestamp: new Date()
        }).catch(() => {});
      }

      const logs = await db.collection('Behaviour_Logs').find({ email, timestamp: { $gte: since } }).toArray();
      ({ categoryWeights, regionWeights } = buildBehaviourMaps(logs));
    }

    const regexFilter = { $regex: query, $options: 'i' };

    // Parallel DB fetch
    const [rawAttractions, rawHotels, rawRestaurants] = await Promise.all([
      db.collection('Attraction_places').find({
        $or: [
          { attraction_name: regexFilter },
          { city: regexFilter },
          { category: regexFilter },
          { attraction_type: regexFilter },
        ]
      }).limit(30).toArray(),
      db.collection('Hotels').find({
        $or: [
          { hotel_name: regexFilter },
          { nearest_cities: regexFilter },
        ]
      }).limit(15).toArray(),
      db.collection('Resturants').find({
        $or: [
          { restaurant_name: regexFilter },
          { city: regexFilter },
          { cuisine_type: regexFilter },
        ]
      }).limit(15).toArray(),
    ]);

    // Discover supported categories dynamically from returned attractions
    const locationSupportedCategories = getDynamicSupportedCategoriesForLocation(rawAttractions);

    // Score attractions with location-constrained behavioral matching
    let scoredAttractions = rawAttractions.map(p => {
      const itemRegion = classifyRegion(p);
      const catBonus = categoryWeights[(p.category || '').toLowerCase()] || 0;
      const regBonus = getRegionBehaviourBonus(regionWeights, itemRegion, locationSupportedCategories);
      const total = catBonus + regBonus;
      return {
        ...p,
        regionType: itemRegion,
        preferenceScore: total,
        preferenceMatch: total > 0,
      };
    });

    scoredAttractions.sort((a, b) =>
      b.preferenceScore - a.preferenceScore ||
      (parseFloat(b.rating) || 0) - (parseFloat(a.rating) || 0)
    );
    scoredAttractions = diversifyResults(scoredAttractions);

    // Score hotels based on nearby places & location-constrained behavioral matching
    const scoredHotels = rawHotels.map(h => {
      const hotelRegion = classifyRegion({
        attraction_type: h.features || '',
        category: h.description || '',
        city: h.nearest_cities || h.city || '',
        attraction_name: h.hotel_name || ''
      });
      const catBonus = categoryWeights[(h.features || '').toLowerCase()] || 0;
      const regBonus = getRegionBehaviourBonus(regionWeights, hotelRegion, locationSupportedCategories);
      const total = catBonus + regBonus;
      return {
        ...h,
        regionType: hotelRegion,
        preferenceScore: total,
        preferenceMatch: total > 0,
      };
    }).sort((a, b) => b.preferenceScore - a.preferenceScore);

    // Score restaurants
    const scoredRestaurants = rawRestaurants.map(r => {
      const catBonus = categoryWeights[(r.cuisine_type || '').toLowerCase()] || 0;
      return { ...r, preferenceScore: catBonus, preferenceMatch: catBonus > 0 };
    }).sort((a, b) => b.preferenceScore - a.preferenceScore);

    res.json({
      attractions: scoredAttractions,
      hotels: scoredHotels,
      restaurants: scoredRestaurants,
      _debug: { locationSupportedCategories, categoryWeights, regionWeights },
    });
  } catch (err) {
    console.error('Search/All error:', err);
    res.status(500).json({ error: 'Search failed' });
  }
});

app.post("/log/behaviour", async (req, res) => {
  try {
    const {
      email, itemId, itemName, itemType,
      itemCategory, itemEnvironment,
      itemAttractionType, itemCity, itemProvince
    } = req.body;
    if (!email || !itemId) return res.status(400).json({ error: 'Missing required fields' });

    // Derive the region of the tapped attraction
    const regionType = classifyRegion({
      attraction_type: itemAttractionType || '',
      category: itemCategory || '',
      city: itemCity || itemEnvironment || '',
      province: itemProvince || '',
    });

    await db.collection('Behaviour_Logs').insertOne({
      email,
      itemId: String(itemId),
      itemName: itemName || '',
      itemType: itemType || 'attraction',
      itemCategory: itemCategory || '',
      itemEnvironment: itemEnvironment || '',
      // Location-context fields
      regionType,
      sourceRegion: itemCity || itemProvince || '',
      timestamp: new Date(),
    });
    res.json({ success: true, regionType });
  } catch (err) {
    console.error('Behaviour log error:', err);
    res.status(500).json({ error: 'Failed to log behaviour' });
  }
});

app.get("/recommendations/personal", async (req, res) => {
  try {
    const email = req.query.email;
    if (!email) return res.json([]);

    const targetCity = req.query.city;
    const since = new Date();
    since.setDate(since.getDate() - 60);

    const [logs, allAttractions] = await Promise.all([
      db.collection('Behaviour_Logs').find({ email, timestamp: { $gte: since } }).toArray(),
      db.collection('Attraction_places').find({}).toArray(),
    ]);

    const { categoryWeights, regionWeights } = buildBehaviourMaps(logs);

    let locationAttractions = allAttractions;
    if (targetCity) {
      locationAttractions = allAttractions.filter(p => 
        (p.city || '').toLowerCase().includes(targetCity.toLowerCase())
      );
    }

    // Discover supported categories dynamically from the target location's attractions
    const locationSupportedCategories = getDynamicSupportedCategoriesForLocation(
      locationAttractions.length > 0 ? locationAttractions : allAttractions
    );

    // Score every attraction with location-constrained behavioral matching
    let scored = allAttractions.map(p => {
      const itemRegion = classifyRegion(p);
      const catBonus = categoryWeights[(p.category || '').toLowerCase()] || 0;
      const regBonus = getRegionBehaviourBonus(regionWeights, itemRegion, locationSupportedCategories);
      const total = catBonus + regBonus;
      return {
        ...p,
        regionType: itemRegion,
        preferenceScore: total,
        preferenceMatch: total > 0,
      };
    });

    if (targetCity && locationAttractions.length > 0) {
      scored = scored.filter(item => 
        (item.city || '').toLowerCase().includes(targetCity.toLowerCase())
      );
    }

    scored.sort((a, b) =>
      b.preferenceScore - a.preferenceScore ||
      (parseFloat(b.rating) || 0) - (parseFloat(a.rating) || 0)
    );
    scored = diversifyResults(scored);

    res.json(scored.slice(0, 10));
  } catch (err) {
    console.error("Personal recommendations error:", err);
    res.status(500).json({ error: "Failed to fetch recommendations" });
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

// --- Hotel Owner and Admin Portal Endpoints ---

app.post("/owner/register", async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const existing = await db.collection("Hotel_Owners").findOne({ email });
    if (existing) return res.status(409).json({ error: "Email already registered" });

    await db.collection("Hotel_Owners").insertOne({
      name, email, password, phone,
      isApproved: false, createdAt: new Date()
    });
    res.json({ success: true, message: "Registered. Pending admin approval." });
  } catch (err) {
    res.status(500).json({ error: "Registration failed" });
  }
});

app.post("/owner/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await db.collection("Hotel_Owners").findOne({ email, password });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });
    if (!user.isApproved) return res.status(403).json({ error: "Account pending admin approval" });

    res.json({ success: true, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
});

app.post("/owner/hotels", async (req, res) => {
  try {
    const { ownerId, hotel_name, description, star_rating, price_per_night_usd, review_count, features, latitude, longitude, image_url, nearest_cities } = req.body;
    if (!ownerId || !hotel_name) return res.status(400).json({ error: "Missing fields" });

    await db.collection("Hotels").insertOne({
      ownerId: new ObjectId(ownerId),
      hotel_name, description,
      star_rating: star_rating || '',
      price_per_night_usd: price_per_night_usd || '',
      review_count: review_count ? parseInt(review_count) : 0,
      features: features || '',
      latitude: latitude ? parseFloat(latitude) : null,
      longitude: longitude ? parseFloat(longitude) : null,
      image_url, nearest_cities,
      isApproved: false, createdAt: new Date()
    });
    res.json({ success: true, message: "Hotel added. Pending admin approval." });
  } catch (err) {
    res.status(500).json({ error: "Failed to add hotel" });
  }
});

app.put("/owner/hotels/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    delete updates._id; // prevent id update
    updates.isApproved = false; // reset approval on update
    if (updates.latitude) updates.latitude = parseFloat(updates.latitude);
    if (updates.longitude) updates.longitude = parseFloat(updates.longitude);

    await db.collection("Hotels").updateOne({ _id: new ObjectId(id) }, { $set: updates });
    res.json({ success: true, message: "Hotel updated. Pending admin approval." });
  } catch (err) {
    res.status(500).json({ error: "Failed to update hotel" });
  }
});

app.get("/owner/hotels/:ownerId", async (req, res) => {
  try {
    const { ownerId } = req.params;
    const hotels = await db.collection("Hotels").find({ ownerId: new ObjectId(ownerId) }).toArray();
    res.json(hotels);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch hotels" });
  }
});

// Admin routes
app.get("/admin/pending", async (req, res) => {
  try {
    const pendingOwners = await db.collection("Hotel_Owners").find({ isApproved: false }).toArray();
    const pendingHotels = await db.collection("Hotels").find({ isApproved: false }).toArray();
    res.json({ owners: pendingOwners, hotels: pendingHotels });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch pending requests" });
  }
});

app.put("/admin/approve-owner/:id", async (req, res) => {
  try {
    await db.collection("Hotel_Owners").updateOne({ _id: new ObjectId(req.params.id) }, { $set: { isApproved: true } });
    res.json({ success: true, message: "Owner approved" });
  } catch (err) {
    res.status(500).json({ error: "Approval failed" });
  }
});

app.put("/admin/approve-hotel/:id", async (req, res) => {
  try {
    await db.collection("Hotels").updateOne({ _id: new ObjectId(req.params.id) }, { $set: { isApproved: true } });
    res.json({ success: true, message: "Hotel approved" });
  } catch (err) {
    res.status(500).json({ error: "Approval failed" });
  }
});

async function createServer() {
  await mongodbconnect();
  app.listen(3000, "0.0.0.0", () => {
    console.log("Server is running on http://172.31.99.233:3000");
  });
}

app.post("/support/contact", async (req, res) => {
  try {
    const { name, email, subject, message, category } = req.body;
    if (!name || !email || !message || !category) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    await db.collection("Support_Tickets").insertOne({
      name,
      email,
      subject,
      message,
      category,
      status: "Open",
      createdAt: new Date()
    });

    res.json({ success: true, message: "Support ticket created successfully" });
  } catch (err) {
    console.error("Support contact error:", err);
    res.status(500).json({ error: "Failed to submit support ticket" });
  }
});

createServer();