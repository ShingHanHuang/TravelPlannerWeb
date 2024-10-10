import React, {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import axios from 'axios';
import {GoogleOAuthProvider, GoogleLogin} from '@react-oauth/google';

function LoginPage() {
    // State hooks to handle form data
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const navigate = useNavigate();

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent page reload
        setError(null);
        setSuccessMessage(null);
        // Send a POST request to your backend API
        await axios.post('http://localhost:8080/auth/login', {
            username: username,
            password: password,
        }, {
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true
        }).then(response => {
            const {success, data, message} = response.data;
            if (success) {
                localStorage.setItem('username', data.username);
                localStorage.setItem('token', data.jwt);
                setSuccessMessage(message);
                navigate('/trip_generator');
            } else {
                setError(message);
            }
        }).catch(error => {
            console.error('Login failed', error.response ? error.response.data : error.message);
            setError('An error occurred. Please try again.');
        });
    }

    const handleGoogleLoginSuccess = async (credentialResponse) => {
        try {
            const response = await axios.post('http://localhost:8080/auth/google-login', {
                token: credentialResponse.credential,
            });
            const {success, data, message} = response.data;

            if (success) {
                const {jwt, username} = data;

                localStorage.setItem('username', username);
                localStorage.setItem('token', jwt);

                setSuccessMessage('Login successful!');
                navigate('/trip_generator');
            } else {
                setError(message || 'Google login failed, please try again.');
            }
        } catch (err) {
            console.error('Google login failed', err);
            setError('An error occurred with Google login. Please try again.');
        }
    };


    const handleGoogleLoginError = () => {
        setError('Google login was unsuccessful. Please try again.');
    };
    return (
        <GoogleOAuthProvider
            clientId="492203649703-fi1v07imcqku4jlnu5fcmo0s9p5bsm02.apps.googleusercontent.com">
            <div style={{padding: '20px', maxWidth: '400px', margin: 'auto'}}>
                <h2>Login</h2>
                <form onSubmit={handleSubmit}>
                    <div style={{marginBottom: '10px'}}>
                        <label htmlFor="username">Username:</label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            style={{width: '100%', padding: '8px', boxSizing: 'border-box'}}
                        />
                    </div>
                    <div style={{marginBottom: '10px'}}>
                        <label htmlFor="password">Password:</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{width: '100%', padding: '8px', boxSizing: 'border-box'}}
                        />
                    </div>
                    {error && <p style={{color: 'red'}}>{error}</p>}
                    {successMessage && <p style={{color: 'green'}}>{successMessage}</p>}
                    <button type="submit" style={{padding: '10px', width: '100%'}}>
                        Login
                    </button>
                    <p>Don't have an account? <Link to="/register">Register here</Link></p>
                </form>

                <div style={{marginTop: '20px', textAlign: 'center'}}>
                    <GoogleLogin
                        onSuccess={handleGoogleLoginSuccess}
                        onError={handleGoogleLoginError}
                    />
                </div>
            </div>
        </GoogleOAuthProvider>
    );
}

export default LoginPage;

