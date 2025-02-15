
/* eslint-disable no-unused-vars */

import { useEffect, useState, useContext } from "react"
import { useLocation } from "react-router-dom"
import axios from "../config/axios"
import { initializeSocket, receiveMessage, sendMessage } from "../config/socket.js"
import { userContext } from "../context/user.context"
import Markdown from 'markdown-to-jsx'

const Project = () => {
    const [isPanelOpen, setIsPanelOpen] = useState(false)
    const [selectedUserId, setSelectedUserId] = useState([])
    const [addUserModal, setAddUserModal] = useState(false)
    const [members, setMembers] = useState([])
    const location = useLocation()
    const [project, setProject] = useState(location.state.project)
    const [message, setMessage] = useState('')
    const { user } = useContext(userContext)
    const [messages, setMessages] = useState([])
    const [fileTree, setFileTree] = useState({})

    const [currentFile, setCurrentFile] = useState(null)


    async function getMembers() {
        try {
            const response = await axios.get(`/user/all`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            if (response.status === 200) {
                setMembers(response.data)
            }
        } catch (err) {
            alert(err.response.data.message)
        }
    }

    async function addMembers() {
        try {
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
            }
        } catch (err) {
            alert(err.response.data.message)
        }
    }

    function sendMsg() {
        const newMessage = {
            message,
            sender: user._id,
            projectId: project._id
        };
        sendMessage('project-msg', newMessage);
        setMessages(prevMessages => {
            const updatedMessages = [...prevMessages, newMessage];
            scrollToBottom();
            return updatedMessages;
        });
        setMessage('');
    }


    function WriteAiMessgae(message) {
        const messageObject= JSON.parse(message)
        return ((
            <Markdown className="text-sm max-w-72 overflow-auto bg-gray-700 p-2 rounded-lg text-wrap text-white scrollbar-hide" >{messageObject.text}</Markdown>
    ))
    }

    useEffect(() => {
        const socket = initializeSocket(project._id);

        receiveMessage('project-msg', (data) => {
            setMessages(prevMessages => {
                const updatedMessages = [...prevMessages, data];
                scrollToBottom();
                console.log(data)
                return updatedMessages;
            });
            try {
                const dataa=JSON.parse(data.message)
                setFileTree(dataa.fileTree)
            } catch (error) {
                return
            }
        });

        return () => {
            socket.disconnect();
        };
    }, [project._id]);

    function scrollToBottom() {
        const chat = document.querySelector('.message-box');
        if (chat) {
            chat.scrollTop = chat.scrollHeight - (chat.clientHeight-584);
        }
    }

    return (
        <main className="h-screen w-screen flex overflow-x-hidden">
            <section className="left h-full min-w-80 bg-slate-100 flex flex-col relative">
                <header className="flex justify-between items-center p-2 px-4 w-full">
                    <button className="w-fit flex gap-1 justify-center items-center bg-gray-700 text-white px-2 rounded-md"
                        onClick={() => { getMembers(); setAddUserModal(true) }}
                    ><i className="ri-add-fill text-xl"></i><p>Add Member</p></button>
                    <button className="text-xl"
                        onClick={() => setIsPanelOpen(!isPanelOpen)}
                    >
                        <i className="ri-group-fill"></i>
                    </button>
                </header>

                <div className="conversation-area flex-grow flex flex-col bg-slate-200 h-[93%] relative scrollbar-hide">
                    <div className="message-box flex flex-col px-1 py-2 overflow-auto scrollbar-hide min-h-[93%]">
                        {messages.map((msg, index) => (
                            <div key={index} className={`message flex flex-col p-2 bg-white w-fit rounded-md mt-1 ${msg.sender === "AI" ? "max-w-76":"max-w-56"} ${msg.sender === user._id ? 'ml-auto' : ''}`}>
                                <small className="opacity-65 text-xs">{msg.sender === 'AI' ? 'AI' : project.users.find(u => u._id === msg.sender)?.email || 'Unknown'}</small>
                                {msg.sender === 'AI' ? 
                                WriteAiMessgae(msg.message) : (
                                    <p className="text-sm">{msg.message}</p>
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="inputField w-full flex">
                        <input type="text" onChange={(e) => setMessage(e.target.value)} value={message} className="p-2 px-4 border-none outline-none flex flex-1" placeholder="Enter message" />
                        <button onClick={() => sendMsg()} className="p-2 px-3 bg-white"><i className="ri-send-plane-fill"></i></button>
                    </div>
                </div>

                {/* Users in project */}
                                <div className={`sidePanel w-full h-full bg-slate-200 absolute transition-all ${isPanelOpen ? 'translate-x-0' : "-translate-x-full"} flex flex-col gap-2  top-0`}>
                                    <header className="flex justify-between items-center p-2 px-4 bg-slate-100">
                                        <h1 className="text-xl font-semibold">Members</h1>
                                        <button
                                            onClick={() => setIsPanelOpen(false)}
                                        >
                                            <i className="ri-close-fill text-2xl"></i>
                                        </button>
                                    </header>

                                    <div className="users flex flex-col gap-2 items-center">
                                        {project.users.map((user) => (
                                            <div key={user._id} className="user flex items-center p-2 bg-white rounded-md w-[95%] hover:bg-slate-100">
                                                <img src="https://picsum.photos/200" alt="user" className="w-8 h-8 rounded-full" />
                                                <span className="ml-2">{user.email}</span>
                                            </div>))}
                                    </div>
                                </div>

                            </section>


                        <section className="right bg-red-50 flex flex-grow h-full">
                            <div className="explorer h-full min-w-56">
                                <div className="file-tree bg-red-200 h-full w-full">
                                    {fileTree && Object.keys(fileTree).length > 0 ? (
                                        Object.keys(fileTree).map((file) => (
                                            <div key={file} 
                                            onClick={() => setCurrentFile(file)}
                                            className="file flex items-center p-2 bg-white w-full hover:bg-slate-100 cursor-pointer">
                                                <span className="ml-2">{file}</span>
                                            </div>
                                        ))
                                    ) : (
                                        ""
                                    )}
                                </div>
                            </div>
                                {currentFile && fileTree && fileTree[currentFile] && (
                            <div className="code-editor flex flex-grow flex-col">
                                <div className="top border-b-2 ">
                                    <header className="flex justify-between items-center p-2 px-4 bg-white">
                                        <h1 className="text-xl font-semibold cursor-default">{currentFile}</h1>
                                        <button
                                            onClick={() => setCurrentFile(null)}
                                        >
                                            <i className="ri-close-fill text-2xl"></i>
                                        </button>
                                    </header>
                                </div>
                                    <div className="bottom bg-white flex flex-grow w-full">
                                        <textarea
                                            className="w-full h-full p-2 outline-none"
                                            value={fileTree[currentFile].content}
                                            onChange={(e) => setFileTree({ ...fileTree, [currentFile]: { content: e.target.value } })}  
                                        ></textarea>
                                    </div>
                            </div>
                                )}
                        </section>


                            {/* Modal for adding user */}
            {addUserModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-4 rounded-md w-11/12 max-w-md">
                        <header className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">Select User</h2>
                            <button onClick={() => setAddUserModal(false)}>
                                <i className="ri-close-fill text-2xl"></i>
                            </button>
                        </header>
                        <div className="users-list flex flex-col gap-2 max-h-96 overflow-y-auto">
                            {members.map((user) => (
                                <div
                                    key={user._id}
                                    className={`user-tile flex items-center p-2  rounded-md cursor-pointer ${selectedUserId.indexOf(user._id) !== -1 ? 'bg-gray-300' : ''}`}
                                    onClick={() => {
                                        if (selectedUserId.indexOf(user._id) === -1) {
                                            setSelectedUserId([...selectedUserId, user._id]);
                                        } else {
                                            setSelectedUserId(selectedUserId.filter((id) => id !== user._id));
                                        }
                                    }}
                                >
                                    <img src="https://picsum.photos/200" alt="user" className="w-8 h-8 rounded-full" />
                                    <span className="ml-2">{user.email}</span>
                                </div>
                            ))}
                            <button
                                className="mt-4 bg-blue-500 text-white p-2 rounded-md"
                                onClick={() => addMembers()}
                            >
                                Add Members
                            </button>
                        </div>
                    </div>
                </div>
            )}


        </main>
    )
}

export default Project