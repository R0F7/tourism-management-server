const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wezoknx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
// console.log(uri);

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        client.connect();

        const tourismCollection = client.db('tourismDB').collection('spot');
        const tourismCountry = client.db('tourismDB').collection('country');

        app.get('/tourists-spot', async (req, res) => {
            const cursor = tourismCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })

        app.get('/tourists-spot/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await tourismCollection.findOne(query);
            res.send(result)
        })

        app.get('/tourists-spot/email/:email', async (req, res) => {
            const email = req.params.email;
            const query = { userEmail: email };
            const cursor = tourismCollection.find(query);
            const result = await cursor.toArray()
            res.send(result)
        })

        app.get('/tourists-country', async (req, res) => {
            const cursor = tourismCountry.find();
            const result = await cursor.toArray();
            res.send(result)
        })

        app.post('/tourists-spot', async (req, res) => {
            const info = req.body;
            console.log(info);
            const result = await tourismCollection.insertOne(info);
            res.send(result)
        })

        app.put('/tourists-spot/:id', async (req, res) => {
            const id = req.params.id;
            const updateInfo = req.body;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    imageURL: updateInfo.imageURL,
                    tourists_spot_name: updateInfo.tourists_spot_name,
                    country_Name: updateInfo.country_Name,
                    location: updateInfo.location,
                    short_description: updateInfo.short_description,
                    average_cost: updateInfo.average_cost,
                    seasonality: updateInfo.seasonality,
                    travel_time: updateInfo.travel_time,
                    totalVisitorsPerYear: updateInfo.totalVisitorsPerYear,
                }
            };
            const result = await tourismCollection.updateOne(filter, updateDoc, options);
            res.send(result)
        })

        app.delete('/tourists-spot/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await tourismCollection.deleteOne(query);
            res.send(result);
        })


        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Tourism Management Server is running');
})

app.listen(port, () => {
    console.log(`This server running port:${port}`);
})