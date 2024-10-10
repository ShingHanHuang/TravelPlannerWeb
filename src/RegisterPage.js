import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function RegisterPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:8080/auth/register', {
                username: username,
                password: password,
                role: 'USER',
            });

            const { success, message } = response.data;

            if (success) {
                setSuccess(message || 'Registration successful! You can now login.');
                setError(null);
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } else {
                setError(message || 'Registration failed');
                setSuccess(null);
            }
        } catch (error) {
            console.error('Registration error:', error);
            setError('An error occurred. Please try again.');
            setSuccess(null);
        }
    };


    return (
        <div>
            <h2 style={{marginLeft: '20px'}}>Register</h2>
            <form onSubmit={handleRegister}>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    style={{
                        display: 'block',
                        marginBottom: '10px',
                        width: '30%',
                        paddingLeft: '10px',
                        marginLeft: '20px',
                        boxSizing: 'border-box'
                    }}
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    style={{
                        display: 'block',
                        marginBottom: '10px',
                        width: '30%',
                        paddingLeft: '10px',
                        marginLeft: '20px',
                        boxSizing: 'border-box'
                    }}
                />
                {error && <p style={{color: 'red', marginLeft: '20px'}}>{error}</p>}
                {success && <p style={{color: 'green', marginLeft: '20px'}}>{success}</p>}
                <button type="submit" style={{marginLeft: '20px'}}>Register</button>
            </form>
        </div>


    );
}

export default RegisterPage;
