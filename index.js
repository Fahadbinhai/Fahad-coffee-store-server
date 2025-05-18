const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 3000;

// middleware 
app.use(cors());
app.use(express.json());

// fahad-coffee-store
// kABztz2vXgBakaAc


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.COFFEE_DB_USER_FAHAD}:${process.env.DB_PASS_PASS}@cluster0.3cytdpf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
        await client.connect();


        const fahad_coffee_store_database = client.db("fahad_store_DB");
        const coffeeCollection = fahad_coffee_store_database.collection("coffee_Data");

        // add coffees one by one
        app.post('/coffees', async (req, res) => {
            const newCoffee = req.body;

            const result = await coffeeCollection.insertOne(newCoffee)
            res.send(result)
        })

        // get all coffee data
        app.get('/coffees', async (req, res) => {

            // const cursor = coffeeCollection.find();
            // const result = await cursor.toArray();

            const result = await coffeeCollection.find().toArray();
            res.send(result);
        })

        // find data one by one

        app.get('/coffees/:id', async(req,res)=>{
            const id = req.params.id;

            query = {_id: new ObjectId(id)}

            const result = await coffeeCollection.findOne(query)

            res.send(result)
        })






        // Edit coffee data

        app.put('/coffees/:id', async(req, res) => {
            const id = req.params.id;

            filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const editCoffee = req.body;



            const updateDoc = {
                $set: editCoffee
            }

             const result = await coffeeCollection.updateOne(filter, updateDoc, options);
             res.send(result)
        })




        // delete coffee data

        app.delete('/coffees/:id', async (req, res) => {
            const deleteID = req.params.id;

            const query = { _id: new ObjectId(deleteID) }
            const result = await coffeeCollection.deleteOne(query);

            res.send(result)
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
    res.send("Fahad Coffee Store Server")
})


app.listen(port, () => {
    console.log(`server is running at port ${port}`)
})