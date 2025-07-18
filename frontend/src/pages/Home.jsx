/* eslint-disable no-unused-vars */

import { useContext, useState, useEffect, useCallback, useMemo } from "react"
import { userContext } from "../context/user.context"
import { useSnackbar } from "../context/snackbar.context"
import axios from "../config/axios"
import { useNavigate } from 'react-router-dom'
import Button from "../components/Button"
import Modal from "../components/Modal"
import Input from "../components/Input"
import ProjectCard from "../components/ProjectCard"
import Loader from "../components/Loader"

// Constants
const API_ENDPOINTS = {
  GET_PROJECTS: '/project/all',
  CREATE_PROJECT: '/project/create'
}

const MESSAGES = {
  ERRORS: {
    FETCH_PROJECTS: 'Failed to load projects',
    CREATE_PROJECT: 'Failed to create project',
    UNAUTHORIZED: 'Session expired. Please log in again.'
  },
  SUCCESS: {
    PROJECT_CREATED: 'Project created successfully'
  },
  PLACEHOLDERS: {
    NO_PROJECTS_TITLE: 'No projects',
    NO_PROJECTS_DESCRIPTION: 'Get started by creating a new project.',
    PROJECT_NAME: 'Enter project name'
  }
}

// Custom hooks
const useProjects = () => {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(false)
  const { showSnackbar } = useSnackbar()
  const navigate = useNavigate()

  const getAuthHeaders = useCallback(() => ({
    Authorization: `Bearer ${localStorage.getItem('token')}`
  }), [])

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true)
      const response = await axios.get(API_ENDPOINTS.GET_PROJECTS, {
        headers: getAuthHeaders()
      })
      setProjects(response.data)
    } catch (err) {
      const errorMessage = err.response?.data?.message || MESSAGES.ERRORS.FETCH_PROJECTS
      
      showSnackbar({
        variant: 'error',
        title: 'Error',
        message: errorMessage
      })
      
      if (err.response?.status === 401) {
        showSnackbar({
          variant: 'warning',
          title: 'Session Expired',
          message: MESSAGES.ERRORS.UNAUTHORIZED
        })
        navigate('/login')
      }
    } finally {
      setLoading(false)
    }
  }, [getAuthHeaders, showSnackbar, navigate])

  const createProject = useCallback(async (projectName) => {
    if (!projectName?.trim()) {
      showSnackbar({
        variant: 'warning',
        title: 'Validation Error',
        message: 'Project name is required'
      })
      return false
    }

    try {
      setLoading(true)
      const response = await axios.post(
        API_ENDPOINTS.CREATE_PROJECT,
        { name: projectName.trim() },
        { headers: getAuthHeaders() }
      )

      if (response.status === 200) {
        await fetchProjects()
        showSnackbar({
          variant: 'success',
          title: 'Success',
          message: MESSAGES.SUCCESS.PROJECT_CREATED
        })
        return true
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || MESSAGES.ERRORS.CREATE_PROJECT
      showSnackbar({
        variant: 'error',
        title: 'Error',
        message: errorMessage
      })
    } finally {
      setLoading(false)
    }
    return false
  }, [getAuthHeaders, showSnackbar, fetchProjects])

  return {
    projects,
    loading,
    fetchProjects,
    createProject
  }
}

// Components
const PlusIcon = ({ className = "h-5 w-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
  </svg>
)

const DocumentIcon = ({ className = "mx-auto h-12 w-12 text-gray-400" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
)

const EmptyState = ({ onCreateProject }) => (
  <div className="text-center py-20">
    <DocumentIcon />
    <h3 className="mt-2 text-sm font-medium text-gray-900">
      {MESSAGES.PLACEHOLDERS.NO_PROJECTS_TITLE}
    </h3>
    <p className="mt-1 text-sm text-gray-500">
      {MESSAGES.PLACEHOLDERS.NO_PROJECTS_DESCRIPTION}
    </p>
    <div className="mt-6">
      <Button
        onClick={onCreateProject}
        icon={<PlusIcon />}
      >
        New Project
      </Button>
    </div>
  </div>
)

const ProjectGrid = ({ projects }) => (
  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
    {projects.map((project) => (
      <ProjectCard key={project._id} project={project} />
    ))}
  </div>
)

const LoadingState = () => (
  <div className="flex justify-center items-center py-20">
    <Loader size="lg" />
  </div>
)

const CreateProjectModal = ({ isOpen, onClose, onSubmit, loading }) => {
  const [projectName, setProjectName] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    const success = await onSubmit(projectName)
    if (success) {
      setProjectName('')
      onClose()
    }
  }

  const handleClose = () => {
    setProjectName('')
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create New Project"
      footer={
        <>
          <Button 
            variant="primary" 
            type="submit"
            form="create-project-form"
            isLoading={loading}
          >
            Create Project
          </Button>
          <Button 
            variant="secondary" 
            onClick={handleClose}
            className="mt-3 sm:mt-0 sm:ml-3"
            disabled={loading}
          >
            Cancel
          </Button>
        </>
      }
    >
      <form id="create-project-form" onSubmit={handleSubmit}>
        <Input
          id="projectName"
          label="Project Name"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          placeholder={MESSAGES.PLACEHOLDERS.PROJECT_NAME}
          required
          autoFocus
        />
      </form>
    </Modal>
  )
}

// Main Component
const Home = () => {
  const { user } = useContext(userContext)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { projects, loading, fetchProjects, createProject } = useProjects()

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  const handleOpenModal = useCallback(() => {
    setIsModalOpen(true)
  }, [])

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false)
  }, [])

  const renderContent = useMemo(() => {
    if (loading && projects.length === 0) {
      return <LoadingState />
    }
    
    if (projects.length === 0) {
      return <EmptyState onCreateProject={handleOpenModal} />
    }
    
    return <ProjectGrid projects={projects} />
  }, [loading, projects.length, projects, handleOpenModal])

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Your Projects</h1>
        <Button 
          onClick={handleOpenModal}
          icon={<PlusIcon />}
        >
          New Project
        </Button>
      </div>

      {renderContent}

      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={createProject}
        loading={loading}
      />
    </main>
  )
}

export default Home