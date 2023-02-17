const mongoose = require('mongoose')


const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    }, 
    phone:{
        type:Number,
        required:true,
        unique:true
    },
    password:{
        type:String,
        trim:true
    },
    isDeleted:{
        type:Boolean,
        default:false
    },
    deletedAt:{
        type:Date
    }

},{ timestamps: true })

module.exports = mongoose.model("User",userSchema)