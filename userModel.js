const mongoose = require("mongoose")
const userSchema =new  mongoose.Schema({
    name: String,
    password:String
},
    { collection: 'user' }
)

const userModel = mongoose.model('user',userSchema)
module.exports = userModel

















