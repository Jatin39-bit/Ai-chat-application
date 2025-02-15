import BlacklistedToken from '../models/blacklistedtoken.js';
import * as userService from '../services/user.service.js';
import { validationResult } from 'express-validator';


export const createUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array() });
    }

    const { email, password } = req.body;
    try {
        const user = await userService.createUser(email, password);
        if (user) {
            const token = user.generateToken();
            delete user._doc.password;
            res.status(200).json({ message: 'User created successfully', token, user });
        } else {
            res.status(400).json({ message: 'User already exists with this email' });
        }
    } catch (error) {
        res.status(500).json({ message: error.code });   
    }
}

export const login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array() });
    }

    const { email, password } = req.body;
    const user = await userService.login(email, password);
    if (user === 'User not found with this email') {
        res.status(400).json({ message: 'User not found with this email' })
    } else if (user === 'Wrong Password') {
        res.status(400).json({ message: 'Wrong Password' })
    } else {
        delete user._doc.password
        const token = user.generateToken();
        res.status(200).json({ message: 'User logged in successfully', token,user })
    }
}

export const profile=async (req,res)=>{
    res.status(200).json({user:req.user})
}

export const all=async (req,res)=>{
    const userId=req.user.id;
    try{
        const users=await userService.all({userId});
        res.status(200).json(users)
    }catch(err){
        res.status(400).json({message:err.message})
    }
}

export const logout = async (req, res) => {
    const token = req.cookies?.token || req.headers.authorization.split(' ')[1]
    await BlacklistedToken.create({ token });
    res.status(200).json({ message: 'User logged out successfully' })
}
