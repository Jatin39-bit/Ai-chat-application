/* eslint-disable no-unused-vars */

import { useContext, useState, useEffect } from "react"
import { userContext } from "../context/user.context"
import axios from "../config/axios"
import { useNavigate } from 'react-router-dom'
import Button from "../components/Button"
import Modal from "../components/Modal"
import Input from "../components/Input"
import ProjectCard from "../components/ProjectCard"

const Home = () => {
    const { user } = useContext(userContext)
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
        console.error(err)
        setError(err.response?.data?.message || 'Failed to load projects')
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
        }
      } catch (err) {
        console.error(err)
        setError(err.response?.data?.message || 'Failed to create project')
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
            <svg className="animate-spin h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
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
          {error && (
            <div className="mb-4 rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">{error}</h3>
                </div>
              </div>
            </div>
          )}
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