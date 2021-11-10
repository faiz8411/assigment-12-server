const express = require('express')
const app = express()
const cors = require('cors')

const { MongoClient } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 5000
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wusl0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
console.log(uri)


async function run() {
    try {
        await client.connect();
        // console.log('data cnnected succesfully')
        const database = client.db("Bicycle_mart")
        const productsCollection = database.collection('products')


        app.post("/addServices", async (req, res) => {
            console.log(req.body);
            const result = await productsCollection.insertOne(req.body);
            res.send(result);
        });


        app.get("/allProducts", async (req, res) => {
            const result = await productsCollection.find({}).limit(6).toArray();
            res.send(result);
            console.log(result);
        });
        app.get("/Products", async (req, res) => {
            const result = await productsCollection.find({}).toArray();
            res.send(result);
            console.log(result);
        });



    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);
app.get('/', (req, res) => {
    res.send('Hello Bicycle lover!')
})

app.listen(port, () => {
    console.log(` listening at ${port}`)
})