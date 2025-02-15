/* eslint-disable no-unused-vars */

import { useContext } from "react"
import { userContext } from "../context/user.context"
import { useState, useEffect } from "react"
import axios from "../config/axios"
import {useNavigate} from 'react-router-dom'


const Home = () => {
    const {user}=useContext(userContext)
    const [ismodalOpen,setIsModalOpen]=useState(false)
    const [projectName,setProjectName]=useState('')
    const [projects,setProjects]=useState([])

    const navigate=useNavigate()

    const fetchProjects=async()=>{
      try{
        const response= await axios.get('/project/all',{headers:{Authorization:`Bearer ${localStorage.getItem('token')}`}})
        setProjects(response.data)
      }catch(err){
        alert(err.response.data.message)
        navigate('/login')
      }
    }
    
    useEffect(()=>{
      fetchProjects()
    },[])

  async function createProject(e){
    e.preventDefault();
    try{
      const response= await axios.post('/project/create',{name:projectName},{headers:{Authorization:`Bearer ${localStorage.getItem('token')}`}})
      if(response.status===200){
        console.log(response.data)
        setIsModalOpen(false)
        setProjectName('')
      }
    }catch(err){
        alert(err.response.data.message)
        setProjectName('')
    }
  }

  return (
    <main className="p-4">
      <div className="projects flex gap-4 flex-wrap">
        <button onClick={()=>setIsModalOpen(true)} className="project p-4 border border-slate-300 rounded-md">
          <span>Create Project </span>
          <i className="ri-link"></i>
        </button>
        {projects.map((project) => (
          <div key={project._id}
          onClick={()=>{
            navigate(`/project`,{
              state:{project}
            })
          }}
           className="project p-4 border border-slate-300 rounded-md cursor-pointer flex flex-col gap-2 min-w-52 hover:bg-slate-200">
            <span className="font-semibold">{project.name}</span>
            <span className="text-sm text-gray-500 flex  items-center"><i className="ri-user-line pr-1"></i><p className="text-gray-800 pr-1">{project.users.length } </p> {project.users.length > 1 ? " members": "member"}</span>
          </div>
        ))}
      </div>
      {ismodalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-md shadow-md w-[22%]">
            <h2 className="text-xl mb-4">Create Project</h2>
            <form onSubmit={(e) => {createProject(e) 
              fetchProjects()
            }}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Project Name</label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="flex justify-center gap-8 pt-4">
                <button
                  type="button"
                  className="mr-2 px-6 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-800 "
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  )
}

export default Home