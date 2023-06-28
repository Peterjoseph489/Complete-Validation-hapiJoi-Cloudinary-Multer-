require('dotenv').config();
const mongoose = require('mongoose');
// const db = process.env.DATABASE
const USERNAME = process.env.DB_USERNAME
const PASSWORD = process.env.DB_PASSWORD
const db = `mongodb+srv://${USERNAME}:${PASSWORD}@cluster0.gmrssgn.mongodb.net/`

mongoose.connect(db).then(()=>{
    console.log('Successfully connected to Database')
}).catch((error)=>{
    console.log(error.message);
})
