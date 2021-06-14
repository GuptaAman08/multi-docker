const express = require("express")

const app = express()


app.get("/", (req, res, next) => {
    res.send("How are you doing")
})


app.listen(8080, () => {
    console.log('Listening to port 8080')
})