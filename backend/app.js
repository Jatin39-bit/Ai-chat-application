import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import connectDB from './db/db.js'
import userRoute from './routes/user.route.js'
import projectRoute from './routes/project.route.js'
import aiRoute from './routes/ai.route.js'


connectDB()


const app = express()

app.use(morgan('dev'))
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

app.use('/user', userRoute)
app.use('/project',projectRoute)
app.use('/ai',aiRoute)



app.get('*', (req, res) => {
    res.send('Wrong Route Buddy')
})

export default app