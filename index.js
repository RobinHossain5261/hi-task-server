const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;

const app = express();

//middlware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nbqc6.mongodb.net/?retryWrites=true&w=majority`;

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
            const email = req.query.email;
            const query = { email: email };
            const tasks = await mediaTasksCollection.find(query).toArray();
            res.send(tasks);
        })

        app.post('/myTasks', async (req, res) => {
            const myTask = req.body;
            const result = await taskOptionCollection.insertOne(myTask);
            res.send(result)
        })

        app.get('/myTasks', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const tasks = await taskOptionCollection.find(query).toArray();
            res.send(tasks);
        })

        app.get('/myTasks/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const task = await taskOptionCollection.findOne(query);
            res.send(task);
        })

        app.put('/myTasks/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) }
            const task = req.body;
            const option = { upsert: true };
            const updateTask = {
                $set: {
                    task: task.task
                }
            }
            const result = await taskOptionCollection.updateOne(filter, updateTask, option);
            res.send(result);
        })

        app.delete('/myTasks/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await taskOptionCollection.deleteOne(query);
            res.send(result);
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