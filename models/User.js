const mongoose=require("mongoose")
const { Schema } = mongoose;

//data will save only in thus structure
const UserSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique: true
    },
    password:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now
    }
});

const User= mongoose.model('user',UserSchema);
// User.createCollection();
module.exports = User;

