const express = require('express')
const connectDB = require('./src/config/database')
const dotenv = require('dotenv')

dotenv.config()

const app = express()

connectDB()

app.listen(3000, () => {
    console.log('Server is started');
})