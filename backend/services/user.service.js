import userModel from '../models/user.model.js';

export const createUser = async (email, password) => {
    console.log(email, password)
    if (!email || !password) return res.status(400).json({ message: 'Please fill in all fields' });

    const hashedPassword= await userModel.hashPassword(password)

    const user= await userModel.create({
        email,
        password: hashedPassword
    })
    if(!user){
        return null
    }
    return user
}


export const login = async (email, password) => {
    if (!email || !password) return res.status(400).json({ message: 'Please fill in all fields' });

    const user = await userModel.findOne({email:email}).select('+password')
    if(!user){
        return ('User not found with this email')
    }
    const isMatch= await user.comparePassword(password)
    if(!isMatch){
        return ('Wrong Password')
    }
    user.password=''
    return user
}

export const all = async ({userId}) => {
    if (!userId) throw new Error('UserId is required')

    const users = await userModel.find({ _id: { $ne: userId } })
    return users
}
