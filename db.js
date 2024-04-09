const { Client } = require('pg')
console.log('hello')

const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'SwiftleDB',
    user: 'postgres',
    password: '3113',
})
client.connect((err) => {
    if (err) {
        console.error('connection error', err.stack)
    } else {
        console.log('swiftle db connected')
    }
})
module.exports = client;