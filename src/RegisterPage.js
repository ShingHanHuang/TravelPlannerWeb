import React, {useState} from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import {TextField, Button, Box, Typography, Container} from '@mui/material';

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

            const {success, message} = response.data;

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
        <Container maxWidth="xs">
            <Box
                component="form"
                onSubmit={handleRegister}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 2,
                    marginTop: 5,
                    padding: 3,
                    boxShadow: 3,
                    borderRadius: 2,
                    bgcolor: 'background.paper',
                }}
            >
                <Typography variant="h4" gutterBottom>
                    Register
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
                {success && <Typography color="success.main">{success}</Typography>}
                <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    size="large"
                    sx={{ mt: 2 }}
                >
                    Register
                </Button>
            </Box>
        </Container>
    );
}

export default RegisterPage;
