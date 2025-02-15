import userModel from '../models/user.model.js';
import BlacklistedToken from '../models/blacklistedtoken.js';
import jwt from 'jsonwebtoken';

export const authUser = async (req, res, next) => {
    const token = req.cookies?.token || req.headers.authorization?.split(' ')[1]
    if (!token) {
        return res.status(400).json({ message: 'You are not authorized' })
    }
    const isBlacklisted = await BlacklistedToken.findOne({ token: token })
    if (isBlacklisted) {
        res.clearCookie('token')
        return res.status(400).json({ message: 'You are not authorized' })
    }
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        return res.status(400).json({ message: 'You are not authorized' });
    }

    if (!decodedToken) {
        return res.status(400).json({ message: 'You are not authorized' })
    }
    const user = await userModel.findById(decodedToken.id)
    if (!user) {
        return res.status(400).json({ message: 'You are not authorized' })
    }
    delete user._doc.password
    req.user = user
    next()
}
