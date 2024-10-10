import React, {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import axios from 'axios';
import {GoogleOAuthProvider, GoogleLogin} from '@react-oauth/google';
import { TextField, Button, Box, Typography, Container, Divider } from '@mui/material';

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
            <Container maxWidth="xs">
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 2,
                        marginTop: 5,
                        padding: 3,
                        boxShadow: 3,
                        borderRadius: 2,
                        bgcolor: 'background.paper'
                    }}
                >
                    <Typography variant="h4" gutterBottom>
                        Login
                    </Typography>
                    <TextField
                        label="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        fullWidth
                        required
                    />
                    <TextField
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        fullWidth
                        required
                    />
                    {error && <Typography color="error">{error}</Typography>}
                    {successMessage && <Typography color="success.main">{successMessage}</Typography>}
                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        size="large"
                    >
                        Login
                    </Button>
                    <Typography>
                        Don't have an account? <Link to="/register">Register here</Link>
                    </Typography>
                </Box>

                <Divider sx={{ my: 3 }}>OR</Divider>

                <Box display="flex" justifyContent="center" marginTop={2}>
                    <GoogleLogin
                        onSuccess={handleGoogleLoginSuccess}
                        onError={handleGoogleLoginError}
                    />
                </Box>
            </Container>
        </GoogleOAuthProvider>
    );
}

export default LoginPage;

