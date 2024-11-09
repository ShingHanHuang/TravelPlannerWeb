import React, {useEffect, useState} from 'react';
import {Box, Typography, List, ListItem, Divider, Button} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from 'axios';
import {useNavigate} from "react-router-dom";

const SharedTripsPage = () => {
    const [sharedTrips, setSharedTrips] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        fetchSharedTrips();
    }, []);
    const fetchSharedTrips = async () => {
        const token = localStorage.getItem('token');

        axios.get('http://localhost:8080/api/trip/shared', {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        })
            .then(response => {
                const {success, data, message} = response.data;
                console.debug("success" + success);
                if (success) {
                    console.debug("data" + data);
                    setSharedTrips(data);
                } else {
                    console.error('Error fetching shared trips:', message);
                }
            })
            .catch(err => {
                console.error('Error fetching shared trips:', err);
            });
    };

    return (
        <Box p={3}>
            <Box display="flex" alignItems="center" marginBottom={2}>
                <Button
                    variant="outlined"
                    onClick={() => navigate(-1)}
                    sx={{ marginRight: 2 }}
                    startIcon={<ArrowBackIcon />}
                    size="large"
                >
                </Button>
                <Typography variant="h4">
                    Shared Trips
                </Typography>
            </Box>
            <List>
                {sharedTrips.map((trip) => (
                    <ListItem key={trip.id} sx={{
                        backgroundColor: '#f9f9f9',
                        borderRadius: 2,
                        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                        padding: 2,
                        marginBottom: 2,
                        '&:hover': {
                            backgroundColor: '#f1f1f1',
                        }
                    }}>
                        <Box display="flex" flexDirection="column" sx={{width: '100%'}}>
                            <Typography variant="subtitle1"
                                        sx={{fontWeight: 'bold', color: '#333'}}>{trip.destination}</Typography>
                            <Typography variant="subtitle2"
                                        sx={{color: '#777', marginBottom: 1}}>{"Poster: " + trip.poster}</Typography>
                            <Typography variant="body2" sx={{color: '#555'}}>
                                {"Start Date: " + trip.startDate} - {"End Date: " + trip.endDate}
                            </Typography>
                            <Typography variant="h6" sx={{marginTop: 1}}>Itinerary:</Typography>
                            <Typography
                                variant="body2"
                                sx={{
                                    width: '80%',
                                    height: '150px',
                                    overflowY: 'auto',
                                    lineHeight: 1.5,
                                    marginTop: 1,
                                    backgroundColor: '#fff',
                                    padding: 1,
                                    borderRadius: 1,
                                    border: '1px solid #ddd',
                                }}
                            >
                                {trip.itinerary
                                    ? trip.itinerary.split('\n').map((paragraph, index) => (
                                        <span key={index}>{paragraph}<br/></span>
                                    ))
                                    : 'No itinerary available'}
                            </Typography>
                            <Divider sx={{borderColor: 'black', borderWidth: 0.5, marginTop: 2}}/>
                        </Box>
                    </ListItem>
                ))}
            </List>
        </Box>
    );

};

export default SharedTripsPage;
