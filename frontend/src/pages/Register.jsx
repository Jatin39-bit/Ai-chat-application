import { useState, useContext } from 'react';
import axios from '../config/axios'
import { useNavigate } from 'react-router-dom';
import { userContext } from '../context/user.context';
import AuthForm from '../components/AuthForm';

const Register = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();
    const { setUser } = useContext(userContext);

    const handleSubmit = async ({ email, password }) => {
        try {
            setLoading(true);
            setError('');
            const response = await axios.post('/user/register', { email, password });
            if (response.status === 200) {
                localStorage.setItem('token', response.data.token);
                setUser(response.data.user);
                navigate('/');
            }
        } catch (err) {
            console.log(err);
            if (err.response?.data?.message == "11000") {
                setError("User already exists with this email");
            } else {
                setError('Registration failed');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthForm 
            type="register"
            onSubmit={handleSubmit}
            loading={loading}
            error={error}
        />
    );
};

export default Register;