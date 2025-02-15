import express from 'express'
import {body} from 'express-validator'
import * as userController from '../controllers/user.controller.js'
import * as authMiddelware from '../middleware/auth.middleware.js'

const router=express.Router()

router.post('/register',[
    body('email').isEmail().isLength({min:6}).withMessage('Email must be at least 6 characters long'),
    body('password').isLength({min:6}).withMessage('Password must be at least 6 characters long')
],userController.createUser)

router.post('/login',[
    body('email').isEmail().isLength({min:6}).withMessage('Email must be at least 6 characters long'),
    body('password').isLength({min:6}).withMessage('Password must be at least 6 characters long')
],userController.login)

router.get('/profile',authMiddelware.authUser,userController.profile)

router.get('/all',authMiddelware.authUser,userController.all)

router.post('/logout',authMiddelware.authUser,userController.logout)

export default router