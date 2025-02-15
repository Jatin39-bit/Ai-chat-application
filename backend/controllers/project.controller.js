import projectModel from "../models/project.model.js";
import * as projectService from '../services/project.service.js'
import { validationResult } from 'express-validator'

export const createProject = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { name } = req.body
    const userId = req.user.id
    try {
        const project = await projectService.createProject({ name, userId })
        res.status(200).json(project)
    }
    catch (err) {
        if (err.code === 11000) {
            res.status(400).json({ message: 'Project name already exists' })
        } else {
            res.status(400).json({ message: err.message })
        }
    }
}

export const getAllProjects = async (req, res) => {
    const userId = req.user.id
    try {
        const projects = await projectService.getAllProjects(userId)
        res.status(200).json(projects)
    }
    catch (err) {
        res.status(400).json({ message: err.message })
    }
}

export const addUserToProject = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { users, projectId } = req.body
    const userId = req.user.id
    try {
        const project = await projectService.addUserToProject({ users, projectId, userId })
        res.status(200).json(project)
    }
    catch (err) {
        res.status(400).json({ message: err.message })
    }
}

export const getProject = async (req, res) => {
    const projectId = req.params.projectId
    const userId = req.user.id
    try {
        const project = await projectService.getProject({ projectId, userId })
        res.status(200).json(project)
    }
    catch (err) {
        res.status(400).json({ message: err.message })
    }
}