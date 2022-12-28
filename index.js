const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// midleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.n3a0m.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const addTaskCollections = client.db('task-management-todo').collection('addTask');

        app.get('/taskManagement', async (req, res) => {
            const query = {};
            const cursor = await addTaskCollections.find(query).toArray();
            res.send(cursor)
        });

        app.get('/taskManagement/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const users = await addTaskCollections.findOne(query);
            res.send(users)
        })

        app.get('/taskManagementComplated', async (req, res) => {
            const query = {taskCondision: 'complated'};
            const result = await addTaskCollections.find(query).toArray();
            res.send(result);
        })

        app.post('/taskManagement', async (req, res) => {
            const addTask = req.body;
            const result = await addTaskCollections.insertOne(addTask);
            res.send(result)
        });

        app.put('/taskManagement/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const updatedTask = req.body;
            const option = { upsert: true };
            const updatedUser = {
                $set: {
                    taskTitle: updatedTask.taskTitle,
                    taskWork: updatedTask.taskWork,
                    startDate: updatedTask.startDate,
                    endDate: updatedTask.endDate,
                    email: updatedTask.email,
                    taskDescription: updatedTask.taskDescription
                }
            }
            const result = await addTaskCollections.updateOne(filter, updatedUser, option);
            res.send(result)
        })

        app.put('/taskManagement/complated/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const updatedTask = req.body;
            const option = { upsert: true };
            const updatedUser = {
                $set: {
                    taskCondision: 'complated'
                }
            }
            const result = await addTaskCollections.updateOne(filter, updatedUser, option);
            res.send(result)
        })


        app.put('/taskManagement/notComplated/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const updatedTask = req.body;
            const option = { upsert: true };
            const updatedUser = {
                $set: {
                    taskCondision: 'notComplated'
                }
            }
            const result = await addTaskCollections.updateOne(filter, updatedUser, option);
            res.send(result)
        })

        app.put('/taskManagement/comment/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const updatedTask = req.body;
            console.log(updatedTask);
            const option = { upsert: true };
            const updatedUser = {
                $set: {
                    comment: updatedTask.comment
                }
            }
            const result = await addTaskCollections.updateOne(filter, updatedUser, option);
            res.send(result)
        })

        app.delete('/taskManagement/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const result = await addTaskCollections.deleteOne(filter);
            res.send(result)
        })
    }
    finally {

    }
}
run().catch(error => console.log(error))

app.get('/', (req, res) => {
    res.send('Task Management App Server is Running');
})

app.listen(port, () => {
    console.log(`Task Managment on Port ${port}`);
})