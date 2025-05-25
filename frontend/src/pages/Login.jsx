/* eslint-disable react/no-unescaped-entities */
import { useNavigate } from 'react-router-dom';
import axios from '../config/axios';
import { useState, useContext } from 'react';
import { userContext } from '../context/user.context';
import AuthForm from '../components/AuthForm';

const Login = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    const navigate = useNavigate();
    const { setUser } = useContext(userContext);

    const handleSubmit = async ({ email, password }) => {
        try {
            setLoading(true);
            setError('');
            const response = await axios.post('/user/login', { email, password });
            if (response.status === 200) {
                localStorage.setItem('token', response.data.token);
                setUser(response.data.user);
                navigate('/');
            }
        } catch (err) {
            console.log(err);
            setError(err.response?.data?.message || 'Invalid email or password');
        } finally {
            setLoading(false);
        }
    }

    return (
        <AuthForm 
            type="login"
            onSubmit={handleSubmit}
            loading={loading}
            error={error}
        />
    );
};

export default Login;