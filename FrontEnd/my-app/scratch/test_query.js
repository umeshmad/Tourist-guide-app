const { MongoClient } = require("mongodb");
const uri = "mongodb+srv://umeshmaduwantha:Passivevoice%4010@cluster0.oymmo9e.mongodb.net/yourDatabaseName?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const db = client.db("Tourust_giude_app");
    const attractions = await db.collection("Attraction_places4").find({}).limit(30).toArray();
    console.log("Names in DB:");
    console.log(attractions.map(a => a.attraction_name));
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}
run();
