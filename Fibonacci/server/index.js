const keys = require('./keys');

// express app setup
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express()
app.use(cors());
app.use(bodyParser.json());


// Postgres setup
const { Pool } = require('pg');
const pgClient = new Pool({
    user: keys.pgUser,
    host: keys.pgHost,
    password: keys.pgPwd,
    database: keys.pgDBName,
    port: keys.pgPort
});

pgClient.on("connect", (client) => {
    client
        .query("CREATE TABLE IF NOT EXISTS values (number INT)")
        .catch((err) => console.error(err));
});


// Redis Setup
const redis = require('redis');
const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort
});

// Creating duplicate redis connection instance since once the connection is put on subscribtion mode
// we can run only redis commands related to subcruption only.
const redisPublisher = redisClient.duplicate();



// Express Routes Set up
app.get('/', (req, res) => {
    res.send({"status": 200, "message": "Server is running"});
});

app.get('/values/all', async (req, res) => {
    const vals = await pgClient.query("SELECT * FROM values");
    res.send(vals.rows);
});

app.get('/values/current', async (req, res) => {
    redisClient.hgetall('values', (err, data) => {
        res.send(data);
    })
});

app.post('/values', (req, res) => {
    const index = req.body.index;

    if (index > 30){
        res.status(422).send('Index too high')
    }

    redisClient.hset("values", index, `placeholder for Fib value of ${index}`);
    redisPublisher.publish('insert', index);
    pgClient.query('INSERT INTO values(number) VALUES($1)', [index]);

    res.status(204).send({message: "success"})
});

app.all('*', (req, res) => {
    res.status(404).send({'message': "Page not found"})
})

app.listen(5000, err => {
    console.log("Listening on port 5000")
})