const { MongoClient } = require("mongodb");
const dns = require("dns");
dns.setServers(["1.1.1.1", "8.8.8.8"]);

const uri = "mongodb+srv://umeshmaduwantha:Passivevoice%4010@cluster0.oymmo9e.mongodb.net/yourDatabaseName?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri);

async function migrateToGeoJSON() {
    await client.connect();
    const db = client.db("Tourust_giude_app");

    const attractions = await db.collection("Attraction_places")
        .find({ location: { $exists: false }, latitude: { $exists: true }, longitude: { $exists: true } })
        .toArray();

    for (const place of attractions) {
        await db.collection("Attraction_places").updateOne(
            { _id: place._id },
            { $set: { location: { type: "Point", coordinates: [place.longitude, place.latitude] } } }
        );
    }

    await db.collection("Attraction_places").createIndex({ location: "2dsphere" });
    console.log(`Migrated ${attractions.length} attractions, 2dsphere index created`);

    await client.close();
}

migrateToGeoJSON();