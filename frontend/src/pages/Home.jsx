/* eslint-disable no-unused-vars */

import { useContext, useState, useEffect } from "react"
import { userContext } from "../context/user.context"
import { useSnackbar } from "../context/snackbar.context"
import axios from "../config/axios"
import { useNavigate } from 'react-router-dom'
import Button from "../components/Button"
import Modal from "../components/Modal"
import Input from "../components/Input"
import ProjectCard from "../components/ProjectCard"
import Loader from "../components/Loader"

const Home = () => {
    const { user } = useContext(userContext)
    const { showSnackbar } = useSnackbar()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [projectName, setProjectName] = useState('')
    const [projects, setProjects] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const navigate = useNavigate()

    const fetchProjects = async () => {
      try {
        setLoading(true)
        const response = await axios.get('/project/all', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        setProjects(response.data)
      } catch (err) {
        const errorMessage = err.response?.data?.message || 'Failed to load projects'
        setError(errorMessage)
        showSnackbar({
          variant: 'error',
          title: 'Error',
          message: errorMessage
        })
        if (err.response?.status === 401) {
          navigate('/login')
        }
      } finally {
        setLoading(false)
      }
    }
    
    useEffect(() => {
      fetchProjects()
    }, [])

    async function createProject(e) {
      e.preventDefault()
      if (!projectName.trim()) return
      
      try {
        setLoading(true)
        setError('')
        const response = await axios.post('/project/create', 
          { name: projectName },
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        )
        
        if (response.status === 200) {
          setIsModalOpen(false)
          setProjectName('')
          await fetchProjects()
          showSnackbar({
            variant: 'success',
            title: 'Success',
            message: 'Project created successfully'
          })
        }
      } catch (err) {
        const errorMessage = err.response?.data?.message || 'Failed to create project'
        setError(errorMessage)
        showSnackbar({
          variant: 'error',
          title: 'Error',
          message: errorMessage
        })
      } finally {
        setLoading(false)
      }
    }

    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Your Projects</h1>
          <Button 
            onClick={() => setIsModalOpen(true)}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
            }
          >
            New Project
          </Button>
        </div>

        {loading && projects.length === 0 ? (
          <div className="flex justify-center items-center py-20">
            <Loader size="lg" />
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-20">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No projects</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new project.</p>
            <div className="mt-6">
              <Button
                onClick={() => setIsModalOpen(true)}
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                }
              >
                New Project
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        )}

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
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
                onClick={() => setIsModalOpen(false)}
                className="mt-3 sm:mt-0 sm:ml-3"
                disabled={loading}
              >
                Cancel
              </Button>
            </>
          }
        >
          {/* Errors are now shown via snackbar */}
          <form id="create-project-form" onSubmit={createProject}>
            <Input
              id="projectName"
              label="Project Name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Enter project name"
              required
            />
          </form>
        </Modal>
      </main>
    )
}

export default Home