import { useState, useContext } from 'react';
import axios from '../config/axios'
import { useNavigate } from 'react-router-dom';
import { userContext } from '../context/user.context';
import { useSnackbar } from '../context/snackbar.context';
import AuthForm from '../components/AuthForm';

const Register = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();
    const { setUser } = useContext(userContext);
    const { showSnackbar } = useSnackbar();

    const handleSubmit = async ({ email, password }) => {
        try {
            setLoading(true);
            setError('');
            const response = await axios.post('/user/register', { email, password });
            if (response.status === 200) {
                localStorage.setItem('token', response.data.token);
                setUser(response.data.user);
                navigate('/');
                showSnackbar({
                    variant: 'success',
                    title: 'Success',
                    message: 'Account created successfully'
                });
            }
        } catch (err) {
            let errorMessage;
            if (err.response?.data?.message == "11000") {
                errorMessage = "User already exists with this email";
            } else {
                errorMessage = 'Registration failed';
            }
            setError(errorMessage);
            showSnackbar({
                variant: 'error',
                title: 'Error',
                message: errorMessage
            });
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