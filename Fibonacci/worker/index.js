const redis = require('redis');
const keys = require('./keys');

const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort
});

// Creating duplicate redis connection instance since once the connection is put on subscribtion mode
// we can run only redis commands related to subcruption only.
const sub = redisClient.duplicate();


function fib(num){
    if (num < 2){
        return 1
    }
    return fib(num-1) + fib(num-2)
}

sub.on('message', (channel, message) => {
    console.log("New Value Inserted into REDIS")
    console.log("Channel Name", channel)
    redisClient.hset("hvalues", message, fib(parseInt(message)))
});

sub.subscribe('insert');