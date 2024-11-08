import React, { useEffect, useState } from 'react';
import {Box, Typography, List, ListItem, Divider, Button} from '@mui/material';
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
            <Typography variant="h4" gutterBottom>Shared Trips</Typography>
            <Button variant="outlined" onClick={() => navigate(-1)} sx={{marginTop: 2, marginLeft: 2}}>
                Return
            </Button>
            <List>
                {sharedTrips.map((trip) => (
                    <ListItem key={trip.id}>
                        <Box display="flex" flexDirection="column" sx={{ width: '100%' }}>
                            <Typography variant="subtitle1">{trip.destination}</Typography>
                            <Typography variant="subtitle2">{"Poster:  "+trip.poster}</Typography>
                            <Typography variant="body2">{"Start Date:  "+trip.startDate} - {"End Date:  "+trip.endDate}</Typography>
                            <Typography variant="body2"
                                        sx={{
                                            width: '80%',
                                            height: '150px',
                                            overflowY: 'auto',
                                            lineHeight: 1.5
                                        }}>
                                {trip.itinerary ? trip.itinerary : 'No itinerary available'}
                            </Typography>
                            <Divider sx={{ borderColor: 'black', borderWidth: 0.5, marginTop: 1 }} />
                        </Box>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

export default SharedTripsPage;
