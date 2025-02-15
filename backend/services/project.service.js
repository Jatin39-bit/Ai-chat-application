import mongoose from 'mongoose'
import projectModel from '../models/project.model.js'


export const createProject = async ({ name, userId }) => {
    if (!name || !userId) throw new Error('Name and userId are required')

    const project = await projectModel.create({ name, users: [userId] })
    return project
}

export const getAllProjects = async (userId) => {
    if (!userId) throw new Error('UserId is required')

    const projects = await projectModel.find({ users: userId }).populate('users')
    return projects
}

export const addUserToProject = async ({ users, projectId,userId }) => {
    if (!users || !projectId) throw new Error('Email and projectId are required')

    if(!Array.isArray(users) || users.some((userId) => !mongoose.Types.ObjectId.isValid(userId)))
        { throw new Error('Users must be an array of valid user idss')}

    if(!mongoose.Types.ObjectId.isValid(userId))
        { throw new Error('userId is not valid')}


    const project = await projectModel.findOne({ _id: projectId, users:userId })
    if (!project) throw new Error('Project not found')

    const updatedProject = await projectModel.findOneAndUpdate(
        { _id: projectId },
        { $addToSet: { users: { $each: users } } },
        { new: true }
    ).populate('users')
    return updatedProject
}

export const getProject = async ({ projectId, userId }) => {
    if (!projectId || !userId) throw new Error('ProjectId and userId are required')

        if(!mongoose.Types.ObjectId.isValid(projectId))
        { throw new Error('projectId is not valid')}

    const project = await projectModel.findOne({ _id: projectId, users: userId }).populate('users')
    if (!project) throw new Error('Project not found')

    return project
}