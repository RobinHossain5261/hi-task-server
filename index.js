const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;

const app = express();

//middlware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nbqc6.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        const taskOptionCollection = client.db('Hi-task').collection('taskCollection');
        const mediaTasksCollection = client.db('Hi-task').collection('mediaTasks');


        app.post('/mediaTasks', async (req, res) => {
            const mediaTask = req.body;
            const result = await mediaTasksCollection.insertOne(mediaTask);
            res.send(result)
        })

        app.get('/mediaTasks', async (req, res) => {
            const query = {};
            const tasks = await mediaTasksCollection.find(query).toArray();
            res.send(tasks);
        })

    }
    finally {

    }
}
run().catch(console.log)




app.get('/', async (req, res) => {
    res.send('Hi-tast server is running');
})

app.listen(port, () => console.log(`Hi-task running on ${port}`));