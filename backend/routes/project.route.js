import express from 'express'
import {body} from 'express-validator'
import * as projectController from '../controllers/project.controller.js'
import * as authMiddleware from '../middleware/auth.middleware.js'

const router=express.Router()

router.post('/create',authMiddleware.authUser,[
    body('name').isString().withMessage('Name is required')
],projectController.createProject)

router.get('/all',authMiddleware.authUser,projectController.getAllProjects)

router.put('/add-user',authMiddleware.authUser,[
    body('users').isArray({min:1}).withMessage('Users are required').bail().custom((users)=>users.every(user=>typeof user ==='string')).withMessage('Users must be an array of strings'),
    body('projectId').isMongoId().withMessage('ProjectId is required')
],projectController.addUserToProject)

router.get('/project/:projectId',authMiddleware.authUser,projectController.getProject)

export default router