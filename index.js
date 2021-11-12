const express = require('express')
const app = express()
const cors = require('cors')
const ObjectId = require("mongodb").ObjectId
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
        const ordersCollection = database.collection('orders')
        const usersCollection = database.collection('users')


        app.post("/addServices", async (req, res) => {
            console.log(req.body);
            const result = await productsCollection.insertOne(req.body);
            res.send(result);
        });

        // get all products for home page
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

        // get single products
        app.get("/singleProduct/:id", async (req, res) => {
            const result = await productsCollection.find({ _id: ObjectId(req.params.id) })
                .toArray();
            res.send(result[0]);
        });


        // confirm single order
        app.post("/confirmOrder", async (req, res) => {
            const result = await ordersCollection.insertOne(req.body);
            console.log(result)
            res.send(result);
        });

        // get orders
        app.get("/myOrders", async (req, res) => {
            let query = {}
            const email = req.query.email
            if (email) {
                query = { email: email }
            }

            const cursor = ordersCollection.find(query)
            const orders = await cursor.toArray();


            res.send(orders);
        });

        /// delete order

        app.delete("/deleteOrder/:id", async (req, res) => {
            const result = await ordersCollection.deleteOne({
                _id: ObjectId(req.params.id),
            });
            res.send(result);
            console.log(result)
        });

        // post users
        app.post('/users', async (req, res) => {
            const user = req.body
            const result = await usersCollection.insertOne(user)
            console.log(result)
            res.send(result)
        })



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