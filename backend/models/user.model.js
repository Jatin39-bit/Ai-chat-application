import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true,
        unique: true,
        trim:true,
        lowercase: true,
        minLenght:[6, 'Email is too short'],
        maxLength: [64, 'Email is too long']
    },
    password:{
        type: String,
        required: true,
        select:false,
        minLenght:[6, 'Password is too short'],
    }
})


userSchema.statics.hashPassword = async function(password){
    return await bcrypt.hash(password, 10)
}

userSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateToken = function(){
    return jwt.sign({id: this._id}, process.env.JWT_SECRET, {expiresIn: '2d'})
}

const User = mongoose.model('User', userSchema)

export default User