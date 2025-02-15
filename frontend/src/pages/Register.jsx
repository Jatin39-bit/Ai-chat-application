import {useState, useContext} from 'react';
import axios from '../config/axios'
import { Link, useNavigate } from 'react-router-dom';
import { userContext } from '../context/user.context';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate= useNavigate();
    const {setUser}=useContext(userContext)

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            const response = await axios.post('/user/register', {email, password});
            if(response.status === 200){
                localStorage.setItem('token', response.data.token);
                setUser(response.data.user)
                navigate('/');
            }
        }catch(err){
            console.log(err);
            if(err.response.data.message == "11000"){
              alert("User already exists with this email")
            }
            else{
              alert('Registration failed');
            }
        }
        setEmail('');
        setPassword('');
    }


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-white mb-6">Register</h2>
        <form onSubmit={(e)=>handleSubmit(e)}>
          <div className="mb-4">
            <label className="block text-gray-400 mb-2" htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              onChange={(e)=>setEmail(e.target.value)}
              value={email}
              className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-400 mb-2" htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
                onChange={(e)=>setPassword(e.target.value)}
                value={password}
              className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-200"
          >
            Register
          </button>
        </form>
        <p className="text-gray-400 mt-4">
          Already have an account? <Link to="/login" className="text-blue-500 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;