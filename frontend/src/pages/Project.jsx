/* eslint-disable no-unused-vars */

import { useEffect, useState, useContext, useRef } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import axios from "../config/axios"
import { initializeSocket, receiveMessage, sendMessage } from "../config/socket.js"
import { userContext } from "../context/user.context"
import { useSnackbar } from "../context/snackbar.context"
import Markdown from 'markdown-to-jsx'
import Avatar from "../components/Avatar"
import Button from "../components/Button"
import Badge from "../components/Badge"
import Modal from "../components/Modal"
import Loader from "../components/Loader"

const Project = () => {
    const [isPanelOpen, setIsPanelOpen] = useState(false)
    const [selectedUserId, setSelectedUserId] = useState([])
    const [addUserModal, setAddUserModal] = useState(false)
    const [members, setMembers] = useState([])
    const location = useLocation()
    const navigate = useNavigate()
    const [project, setProject] = useState(location.state?.project)
    const [message, setMessage] = useState('')
    const { user } = useContext(userContext)
    const [messages, setMessages] = useState([])
    const [fileTree, setFileTree] = useState({})
    const [currentFile, setCurrentFile] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [isSendingMessage, setIsSendingMessage] = useState(false)
    const [error, setError] = useState('')
    const messageEndRef = useRef(null)
    const chatContainerRef = useRef(null)
    const { showSnackbar } = useSnackbar()

    useEffect(() => {
        if (!project) {
            navigate('/')
            return
        }
    }, [project, navigate])

    async function getMembers() {
        try {
            setIsLoading(true)
            const response = await axios.get(`/user/all`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            if (response.status === 200) {
                setMembers(response.data)
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to load members'
            setError(errorMessage)
            showSnackbar({
                variant: 'error',
                title: 'Error',
                message: errorMessage
            })
        } finally {
            setIsLoading(false)
        }
    }

    async function addMembers() {
        if (selectedUserId.length === 0) {
            showSnackbar({
                variant: 'warning',
                title: 'Warning',
                message: 'Please select at least one member to add'
            })
            return
        }
        
        try {
            setIsLoading(true)
            const response = await axios.put(`/project/add-user`, {
                users: selectedUserId,
                projectId: project._id
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            if (response.status === 200) {
                setProject(response.data)
                setSelectedUserId([])
                setAddUserModal(false)
                showSnackbar({
                    variant: 'success',
                    title: 'Success',
                    message: 'Members added successfully'
                })
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to add members'
            setError(errorMessage)
            showSnackbar({
                variant: 'error',
                title: 'Error',
                message: errorMessage
            })
        } finally {
            setIsLoading(false)
        }
    }

    async function sendMsg() {
        if (!message.trim()) return
        
        try {
            setIsSendingMessage(true)
            
        const newMessage = {
            message,
            sender: user._id,
            projectId: project._id
            }
            
            sendMessage('project-msg', newMessage)
            setMessages(prevMessages => [...prevMessages, newMessage])
            setMessage('')
        } catch (err) {
            showSnackbar({
                variant: 'error',
                title: 'Error',
                message: 'Failed to send message'
            })
        } finally {
            setIsSendingMessage(false)
        }
    }

    function renderAiMessage(message) {
        try {
            const messageObject = JSON.parse(message)
            return (
                <Markdown 
                    className="prose prose-sm max-w-none overflow-auto bg-indigo-50  rounded-lg text-gray-800 scrollbar-hide"
                >
                    {messageObject.text}
                </Markdown>
            )
        } catch (error) {
            return <p className="text-sm">{message}</p>
        }
    }

    useEffect(() => {
        if (!project) return
        
        const socket = initializeSocket(project._id)

        receiveMessage('project-msg', (data) => {
            setMessages(prevMessages => [...prevMessages, data])
            
            try {
                const parsedData = JSON.parse(data.message)
                if (parsedData.fileTree) {
                    setFileTree(parsedData.fileTree)
                }
            } catch (error) {
                // Not a JSON message or doesn't have fileTree property
            }
        })

        return () => {
            socket.disconnect()
        }
    }, [project?._id])

    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            sendMsg()
        }
    }

    if (!project) return <Loader fullScreen size="xl" />

    return (
        <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
            <header className="bg-white shadow-sm px-4 py-2 flex justify-between items-center border-b border-gray-200">
                <div className="flex items-center">
                    <h1 className="text-lg font-semibold text-gray-900 truncate max-w-xs">{project.name}</h1>
                    <Badge variant="primary" className="ml-2">
                        {project.users.length} {project.users.length === 1 ? 'member' : 'members'}
                    </Badge>
                </div>
                <div className="flex space-x-2">
                    <Button
                        size="sm"
                        variant="primary"
                        onClick={() => { getMembers(); setAddUserModal(true) }}
                        icon={
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                            </svg>
                        }
                    >
                        Add Member
                    </Button>
                    <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setIsPanelOpen(!isPanelOpen)}
                        icon={
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                            </svg>
                        }
                    >
                        Members
                    </Button>
                </div>
                </header>

            <div className="flex flex-1 overflow-hidden">
                <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
                    <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                        <h2 className="text-sm font-medium text-gray-900">Files</h2>
                        {isLoading && <Loader size="xs" />}
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {fileTree && Object.keys(fileTree).length > 0 ? (
                            <ul className="divide-y divide-gray-200">
                                {Object.keys(fileTree).map((file) => (
                                    <li 
                                        key={file}
                                        className={`group hover:bg-gray-50 cursor-pointer ${currentFile === file ? 'bg-indigo-50' : ''}`}
                                    >
                                        <button
                                            className="w-full px-4 py-2 flex items-center text-left text-sm"
                                            onClick={() => setCurrentFile(file)}
                                        >
                                            <svg 
                                                xmlns="http://www.w3.org/2000/svg" 
                                                className={`h-5 w-5 mr-2 ${currentFile === file ? 'text-indigo-500' : 'text-gray-400'}`} 
                                                viewBox="0 0 20 20" 
                                                fill="currentColor"
                                            >
                                                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                                            </svg>
                                            <span className="truncate">{file}</span>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="px-4 py-12 text-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                                </svg>
                                <h3 className="mt-2 text-sm font-medium text-gray-900">No files</h3>
                                <p className="mt-1 text-sm text-gray-500">Start chatting with AI to create files</p>
                            </div>
                        )}
                                    </div>
                                </div>

                <div className="flex-1 flex">
                    {currentFile && fileTree && fileTree[currentFile] ? (
                        <div className="flex-1 flex flex-col">
                            <div className="border-b border-gray-200 px-4 py-3 flex justify-between items-center bg-white">
                                <div className="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                                    </svg>
                                    <h2 className="text-sm font-medium text-gray-900">{currentFile}</h2>
                                </div>
                                        <button
                                    className="text-gray-400 hover:text-gray-500"
                                            onClick={() => setCurrentFile(null)}
                                        >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                        </button>
                                </div>
                            
                            <div className="flex-1 overflow-auto">
                                        <textarea
                                    className="w-full h-full p-4 font-mono text-sm resize-none bg-gray-50 focus:outline-none"
                                            value={fileTree[currentFile].content}
                                            onChange={(e) => setFileTree({ ...fileTree, [currentFile]: { content: e.target.value } })}  
                                    spellCheck="false"
                                        ></textarea>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col relative">
                            <div 
                                ref={chatContainerRef}
                                className="flex-1 p-4 overflow-y-auto bg-white"
                            >
                                {messages.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-center px-4">
                                        <div className="rounded-full bg-indigo-100 p-3 mb-4">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-lg font-medium text-gray-900">Welcome to {project.name}</h3>
                                        <p className="mt-1 text-sm text-gray-500 max-w-sm">
                                            Start a conversation with the AI assistant to collaborate on code. Ask questions or request to create files.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {messages.map((msg, index) => (
                                            <div 
                                                key={index}
                                                className={`flex ${msg.sender === user._id ? 'justify-end' : 'justify-start'}`}
                                            >
                                                <div className="flex items-start max-w-2xl">
                                                    {msg.sender !== user._id && (
                                                        <div className="flex-shrink-0 mr-3">
                                                            {msg.sender === 'AI' ? (
                                                                <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                                                                        <path fillRule="evenodd" d="M9.99 11.245c.031-.093.061-.189.091-.286A7.963 7.963 0 0010 10c0-4.42-3.58-8-8-8s-8 3.58-8 8 3.58 8 8 8c.939 0 1.836-.167 2.666-.47a.967.967 0 00-.748-1.785A5.987 5.987 0 012 10a6 6 0 016-6c1.44 0 2.755.504 3.793 1.343-.427.091-.835.223-1.215.395a.967.967 0 00.715 1.797 3.017 3.017 0 013.705 4.422c.072.222.156.435.25.637a4.986 4.986 0 00-.258-5.298c.228-.078.47-.121.734-.121 1.36 0 2.458 1.096 2.458 2.454 0 .796-.33 1.504-.84 1.993.143.118.291.232.447.33.554-.554.924-1.28.924-2.132 0-1.071-.554-2.019-1.414-2.578.651-1.933-.371-3.843-1.898-4.503C11.478.75 10.1.25 8.661.25c-4.05 0-7.414 3.371-7.414 7.416a7.41 7.41 0 003.066 6.008c1.054.712 1.846 1.136 2.739 1.136 1.398 0 2.497-.848 2.955-2.004-.092-.36-.147-.735-.147-1.13 0-1.864 1.148-3.457 2.788-4.08-.026.192-.04.386-.04.585 0 1.044.293 2.02.8 2.85.205.33.43.64.678.928a3.443 3.443 0 01-.401.326 3.474 3.474 0 01-1.963.59c-.251 0-.484-.032-.715-.082z" clipRule="evenodd" />
                                                                    </svg>
                                                                </div>
                                                            ) : (
                                                                <Avatar 
                                                                    name={project.users.find(u => u._id === msg.sender)?.email || 'Unknown'}
                                                                    size="sm"
                                                                />
                                                            )}
                                                        </div>
                                                    )}
                                                    
                                                    <div className={`rounded-lg px-4 py-2 shadow-sm ${
                                                        msg.sender === user._id 
                                                            ? 'bg-indigo-600 text-white' 
                                                            : msg.sender === 'AI' 
                                                                ? 'bg-gray-50 border border-gray-200' 
                                                                : 'bg-white border border-gray-200'
                                                    }`}>
                                                        <div className="text-xs mb-1 font-medium">
                                                            {msg.sender === 'AI' 
                                                                ? 'AI Assistant' 
                                                                : msg.sender === user._id 
                                                                    ? 'You' 
                                                                    : project.users.find(u => u._id === msg.sender)?.email || 'Unknown'}
                                                        </div>
                                                        <div className={msg.sender === 'AI' ? '' : 'text-sm whitespace-pre-wrap'}>
                                                            {msg.sender === 'AI' 
                                                                ? renderAiMessage(msg.message) 
                                                                : msg.message}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        <div ref={messageEndRef} />
                            </div>
                                )}
                            </div>
                            
                            <div className="border-t border-gray-200 p-4 bg-white">
                                <div className="flex rounded-md shadow-sm">
                                    <textarea
                                        rows="3"
                                        className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        placeholder="Type your message here..."
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        onKeyDown={handleKeyPress}
                                    ></textarea>
                                                            <Button
                            onClick={sendMsg}
                            variant="primary"
                            className="ml-3"
                            disabled={!message.trim()}
                            isLoading={isSendingMessage}
                            icon={
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                                </svg>
                            }
                        />
                        
                                </div>
                                <p className="mt-2 text-xs text-gray-600 flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Press <kbd className="px-1 py-0.5 text-xs font-semibold bg-gray-100 border border-gray-300 rounded">Enter</kbd> to send, <kbd className="px-1 py-0.5 text-xs font-semibold bg-gray-100 border border-gray-300 rounded">Shift+Enter</kbd> for new line
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div 
                className={`fixed inset-y-0 right-0 w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-10 ${
                    isPanelOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                <div className="h-full flex flex-col">
                    <div className="border-b border-gray-200 px-4 py-3 flex justify-between items-center">
                        <h2 className="text-lg font-medium text-gray-900">Project Members</h2>
                            <button
                            className="text-gray-400 hover:text-gray-500"
                            onClick={() => setIsPanelOpen(false)}
                            >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            </button>
                        </div>
                    
                    <div className="flex-1 overflow-y-auto p-4">
                        <ul className="divide-y divide-gray-200">
                            {project.users.map((member) => (
                                <li key={member._id} className="py-4 flex items-center">
                                    <Avatar name={member.email} size="md" />
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-gray-900">{member.email}</p>
                                        <p className="text-xs text-gray-500">
                                            {member._id === project.users[0]?._id ? 'Owner' : 'Member'}
                                        </p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            <Modal
                isOpen={addUserModal}
                onClose={() => setAddUserModal(false)}
                title="Add Members to Project"
                maxWidth="md"
                footer={
                    <>
                        <Button
                            variant="primary"
                            onClick={addMembers}
                            disabled={selectedUserId.length === 0 || isLoading}
                            isLoading={isLoading}
                        >
                            Add Selected Members
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={() => setAddUserModal(false)}
                            disabled={isLoading}
                            className="ml-3"
                        >
                            Cancel
                        </Button>
                    </>
                }
            >
                <div className="mb-4 bg-gray-50 rounded-md p-3">
                    <p className="text-sm text-gray-500">
                        Select users to add to this project. They will have access to all project files and messages.
                    </p>
                </div>

                {/* Errors are now shown via snackbar */}

                {isLoading && members.length === 0 ? (
                    <div className="flex justify-center my-8">
                        <Loader size="lg" />
                    </div>
                ) : (
                    <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-md">
                        {members.length === 0 ? (
                            <div className="p-4 text-center text-sm text-gray-500">
                                No users available to add
                            </div>
                        ) : (
                            <ul className="divide-y divide-gray-200">
                                {members.map((member) => {
                                    const isInProject = project.users.some(u => u._id === member._id)
                                    
                                    return (
                                        <li key={member._id} className="p-3">
                                            <div className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    id={`user-${member._id}`}
                                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                                    checked={selectedUserId.includes(member._id)}
                                                    disabled={isInProject}
                                                    onChange={() => {
                                                        if (isInProject) return
                                                        
                                                        if (selectedUserId.includes(member._id)) {
                                                            setSelectedUserId(selectedUserId.filter(id => id !== member._id))
                                                        } else {
                                                            setSelectedUserId([...selectedUserId, member._id])
                                                        }
                                                    }}
                                                />
                                                <div className="ml-3 flex items-center flex-1">
                                                    <Avatar name={member.email} size="sm" />
                                                    <label 
                                                        htmlFor={`user-${member._id}`} 
                                                        className={`ml-3 block text-sm ${isInProject ? 'text-gray-400' : 'text-gray-700'}`}
                                                    >
                                                        {member.email}
                                                        {isInProject && <span className="ml-2 text-xs text-gray-400">(Already a member)</span>}
                                                    </label>
                                                </div>
                                            </div>
                                        </li>
                                    )
                                })}
                            </ul>
                        )}
                    </div>
                )}
            </Modal>
        </div>
    )
}

export default Project