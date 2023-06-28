const cloudinary = require('cloudinary').v2;

cloudinary.config({ 
    cloud_name: 'do2cowrhb', 
    api_key: '464854743285312', 
    api_secret: '1rx6s8OfwsSMY-5Q0T32__qXz0M' 
});

module.exports = cloudinary