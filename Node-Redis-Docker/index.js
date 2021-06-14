const express = require("express")
const redis = require("redis")

const app = express()
const redisClient = redis.createClient({
    host: "redis-server",
    port: 6379
})


app.get("/", (req, res, next) => {
    // process.exit(0)
    redisClient.get("visits", (err, visits) => {
        let final_visits = visits ? parseInt(visits) : 0

        res.send(`Number of visitors is ${final_visits}`);
        redisClient.set('visits', final_visits + 1)
    })
})


app.listen(8081, () => {
    console.log('Listening on port 8081')
})