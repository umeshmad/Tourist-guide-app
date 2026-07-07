const dns = require("dns");
dns.setServers(["1.1.1.1", "8.8.8.8"]);
const { MongoClient } = require("mongodb");
const uri = "mongodb+srv://umeshmaduwantha:Passivevoice%4010@cluster0.oymmo9e.mongodb.net/yourDatabaseName?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const db = client.db("Tourust_giude_app");
    const users = await db.collection("Users").find({}).toArray();
    console.log("Users in DB:");
    console.log(JSON.stringify(users.map(u => ({ email: u.email, name: u.name, phone: u.phone, emergencyContact: u.emergencyContact })), null, 2));
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}
run();
