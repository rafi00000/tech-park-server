const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json())

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://delwar2021bd:abjqmFGOZFbsbGoR@cluster0.mn7153h.mongodb.net/?retryWrites=true&w=majority";

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

    const productCollection = client.db("shopDB").collection('products');
    const categories = client.db("shopDB").collection('Category');

    app.get('/product', async(req, res) =>{
        const cursor = await productCollection.find().toArray();
        res.send(cursor)
    })

    app.post('/product', async(req, res)=>{
        const item = req.body;
        console.log('product insert req: ', item);
        const result = await productCollection.insertOne(item);
        res.send(result);
    })

    app.get('/product/:name', async(req, res) =>{
        const name = req.params.name.toLocaleLowerCase();
        const query = { brand: name };
        const cursor = await productCollection.find(query).toArray();
        res.send(cursor);
    })



    // category post
    app.get('/category', async(req, res)=>{
      const cursor = await categories.find().toArray();
      res.send(cursor);
    })

    app.post('/category', async(req, res)=>{
      const categoryItem = req.body;
      const result = await categories.insertOne(categoryItem);
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



app.get('/', (req, res)=>{
    res.send('The server is running');
})

app.listen(port, ()=>{
    console.log('server port number: ', port);    
})