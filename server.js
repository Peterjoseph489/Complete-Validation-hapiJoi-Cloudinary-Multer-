require('./config/configDB')
const router = require('./routes/recipeRoute')
const express = require('express');
PORT = process.env.PORT || 1333
const app = express();

app.use(express.json());
app.use( "/uploads", express.static( "uploads" ) );

app.use('/api', router)



app.listen(PORT, ()=>{
    console.log(`This App is listening on ${PORT}`);
})
