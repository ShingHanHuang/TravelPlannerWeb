import React, {useEffect, useState} from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import {TextField, Button, Drawer, List, ListItem, Typography, Divider, Box, Grid2, IconButton} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ShareIcon from '@mui/icons-material/Share'
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns';
import MenuIcon from '@mui/icons-material/Menu';
import {useNavigate} from "react-router-dom";

function TripGenerator() {
    const [destination, setDestination] = useState('');
    const [preferences, setPreferences] = useState('');
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [travelCompanions, setTravelCompanions] = useState('');
    const [accommodationType, setAccommodationType] = useState('');
    const [itinerary, setItinerary] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [trips, setTrips] = useState([]);
    const userId = localStorage.getItem('username');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        fetchTrips();
    }, []);
    const handleTripClick = (tripId) => {
        navigate(`/trip/${tripId}`);
    };
    const fetchTrips = async () => {
        const token = localStorage.getItem('token');

        axios.get('http://localhost:8080/api/trip/list', {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            params: {
                userId: userId,
            }
        })
            .then(response => {
                const {success, data, message} = response.data;
                console.debug("success" + success);
                if (success) {
                    console.debug("dataSize" + data.size);
                    console.debug("data" + data.destination);
                    setTrips(data);
                } else {
                    console.error('Error fetching trips:', message);
                }
            })
            .catch(err => {
                console.error('Error fetching trips:', err);
            });
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        const token = localStorage.getItem('token');
        const formattedStartDate = startDate ? startDate.toISOString().split('T')[0] : '';
        const formattedEndDate = endDate ? endDate.toISOString().split('T')[0] : '';
        const requestBody = {
            destination: destination,
            preferences: preferences.split(',').map(pref => pref.trim()),
            travelStartDates: formattedStartDate,
            travelEndDates: formattedEndDate,
            travelCompanions: travelCompanions,
            accommodationType: accommodationType,
        };

        axios.post('http://localhost:8080/api/trip/generate', requestBody, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            withCredentials: true,
        })
            .then(response => {
                const {success, data, message} = response.data;
                if (success) {
                    setItinerary(data);
                    setError(null);
                } else {
                    setError(message || 'Failed to generate itinerary. Please try again.');
                    setItinerary(null);
                }
            })
            .catch(err => {
                console.error('Error generating itinerary:', err);
                setError('Failed to generate itinerary. Please try again.');
                setItinerary(null);
            })
            .finally(() => {
                setLoading(false);
            });
    };


    const handleSave = () => {
        if (!itinerary) return;

        const token = localStorage.getItem('token');
        const formattedStartDate = startDate ? startDate.toISOString().split('T')[0] : '';
        const formattedEndDate = endDate ? endDate.toISOString().split('T')[0] : '';
        const requestBody = {
            destination: destination,
            preferences: preferences.split(',').map(pref => pref.trim()),
            itinerary: itinerary,
            travelStartDates: formattedStartDate,
            travelEndDates: formattedEndDate,
        };

        axios.post('http://localhost:8080/api/trip/save', requestBody, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            withCredentials: true,
            params: {
                userId: userId,
            }
        })
            .then(response => {
                const {success, data, message} = response.data;
                if (success) {
                    alert("Save successful!");
                    fetchTrips();
                } else {
                    setError(message || 'Failed to save trip. Please try again.');
                }
            })
            .catch(err => {
                console.error('Error saving trip:', err);
                setError('Failed to save trip.');
            });
    };
    const handleShareTrip = async(tripId) => {
        const token = localStorage.getItem('token');
        console.log("tripId"+tripId)
        console.log("token"+token)
        axios.get(`http://localhost:8080/api/trip/share/${tripId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            withCredentials: true,
            params: {
                userId: userId,
            }
        }).then(response => {
                const {success, data, message} = response.data;
                console.log("message"+message);
                if (success) {
                    alert("Trip shared successfully!");
                } else {
                    alert('Error sharing the trip. Please try again.');
                }
            })
            .catch(err => {
                console.error("Error sharing the trip:", error);
                alert('Error sharing the trip. Please try again.');
            });
    };
    const handleDeleteTrip = (tripId) => {
        const token = localStorage.getItem('token');

        axios.delete(`http://localhost:8080/api/trip/delete/${tripId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            params: {
                userId: userId,
            }
        })
            .then(response => {
                const {success, data, message} = response.data;
                if (success) {
                    alert('Trip deleted successfully');
                    fetchTrips();
                } else {
                    alert('Failed to delete trip. Please try again.');
                }
            })
            .catch(err => {
                console.error('Error deleting trip:', err);
                alert('Failed to delete trip. Please try again.');
            });
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <Box display="flex" position="relative">
            <Drawer
                anchor="left"
                open={isSidebarOpen}
                onClose={toggleSidebar}
                sx={{width: 300}}
            >
                <Box sx={{width: 250, padding: 2}}>
                    <Typography variant="h6">Saved Trips</Typography>
                    <Divider/>
                    {trips.length > 0 ? (
                        <List>
                            {trips.map((trip) => (
                                <ListItem key={trip.id} onClick={() => handleTripClick(trip.id)}>
                                    <Box display="flex" flexDirection="column" sx={{ width: '100%' }}>
                                        <Typography variant="subtitle1" gutterBottom>{trip.destination}</Typography>
                                        <Typography variant="body2" gutterBottom>{trip.startDate} - {trip.endDate}</Typography>
                                        <Typography variant="body2" gutterBottom>
                                            {trip.itinerary ? (trip.itinerary.length > 50 ? trip.itinerary.substring(0, 50) + '...' : trip.itinerary) : 'No itinerary available'}
                                        </Typography>

                                        <Box display="flex" justifyContent="center" sx={{ marginTop: 1 }}>
                                            <IconButton aria-label="delete" onClick={(event) => {
                                                event.stopPropagation();
                                                handleDeleteTrip(trip.id);
                                            }}>
                                                <DeleteIcon />
                                            </IconButton>
                                            <IconButton aria-label="share" onClick={(event) => {
                                                event.stopPropagation();
                                                handleShareTrip(trip.id);
                                            }}>
                                                <ShareIcon />
                                            </IconButton>
                                        </Box>
                                        <Divider sx={{ borderColor: 'black', borderWidth: 0.5, marginTop: 1 }} />
                                    </Box>
                                </ListItem>
                            ))}
                        </List>
                    ) : (
                        <Typography>No trips saved.</Typography>
                    )}
                </Box>
            </Drawer>
            <Button
                variant="contained"
                onClick={toggleSidebar}
                sx={{
                    height: '40px',
                    width: '40px',
                    margin: 2,
                    minWidth: '40px',
                    padding: 0,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
                <MenuIcon/>
            </Button>
            {loading && (
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    position="absolute"
                    top="50%"
                    left="50%"
                    transform="translate(-50%, -50%)"
                    bgcolor="rgba(255, 255, 255, 0.8)"
                    padding={2}
                    borderRadius={1}
                    zIndex={10}
                >
                    <div className="loader"></div>
                    <Typography sx={{marginLeft: 1}}>Generating itinerary...</Typography>
                </Box>
            )}
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Box flex={1} padding={3}>
                    <Typography variant="h4" gutterBottom>Generate Travel Itinerary</Typography>
                    <form onSubmit={handleSubmit}>
                        <Grid2 container spacing={2} direction="column">
                            <Grid2 item xs={12}>
                                <TextField
                                    label="Destination"
                                    value={destination}
                                    size="medium"
                                    onChange={(e) => setDestination(e.target.value)}
                                    fullWidth
                                    margin="normal"
                                    required
                                    variant="outlined"
                                    sx={
                                        {
                                            width: '300px',
                                            '& .MuiInputBase-root': {height: 40},
                                            '& .MuiInputLabel-root': {lineHeight: '20px'}
                                        }}
                                />
                            </Grid2>
                            <Grid2 item xs={12}>
                                <TextField
                                    label="Preferences (comma separated)"
                                    value={preferences}
                                    size="medium"
                                    onChange={(e) => setPreferences(e.target.value)}
                                    fullWidth
                                    margin="normal"
                                    required
                                    variant="outlined"
                                    sx={{
                                        width: '300px',
                                        '& .MuiInputBase-root': {height: 40},
                                        '& .MuiInputLabel-root': {lineHeight: '20px'}
                                    }}
                                />
                            </Grid2>
                            <Grid2 item xs={12}>
                                <Typography>Travel Dates:</Typography>
                                <Box display="flex" justifyContent="flex-start" alignItems="center" gap={10}>
                                    <DatePicker
                                        label="Start Date"
                                        value={startDate}
                                        onChange={(newValue) => setStartDate(newValue)}
                                        renderInput={(params) => <TextField {...params} sx={{width: '140px'}}/>}
                                    />
                                    <DatePicker
                                        label="End Date"
                                        value={endDate}
                                        onChange={(newValue) => setEndDate(newValue)}
                                        minDate={startDate}
                                        renderInput={(params) => <TextField {...params} sx={{width: '140px'}}/>}
                                    />
                                </Box>
                            </Grid2>
                            <Grid2 item xs={12}>
                                <TextField
                                    label="Travel Companions"
                                    value={travelCompanions}
                                    onChange={(e) => setTravelCompanions(e.target.value)}
                                    fullWidth
                                    margin="normal"
                                    required
                                    variant="outlined"
                                    sx={{
                                        width: '300px',
                                        '& .MuiInputBase-root': {height: 40},
                                        '& .MuiInputLabel-root': {lineHeight: '20px'}
                                    }}
                                />
                            </Grid2>
                            <Grid2 item xs={12}>
                                <TextField
                                    label="Accommodation Type"
                                    value={accommodationType}
                                    onChange={(e) => setAccommodationType(e.target.value)}
                                    fullWidth
                                    margin="normal"
                                    required
                                    variant="outlined"
                                    sx={{
                                        width: '300px',
                                        '& .MuiInputBase-root': {height: 40},
                                        '& .MuiInputLabel-root': {lineHeight: '20px'}
                                    }}
                                />
                            </Grid2>
                        </Grid2>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={loading}
                            sx={{marginTop: 2}}
                        >
                            Generate Itinerary
                        </Button>
                    </form>
                    {error && <Typography color="error">{error}</Typography>}
                    {itinerary && (
                        <Box>
                            <Typography variant="h6">Generated Itinerary:</Typography>
                            {itinerary.split('\n').map((paragraph, index) => (
                                <Typography key={index} sx={{marginBottom: 1}}>
                                    {paragraph}
                                </Typography>
                            ))}
                            <Button variant="contained" onClick={handleSave} sx={{marginY: 2}}>
                                Save Itinerary
                            </Button>
                        </Box>
                    )}
                </Box>
            </LocalizationProvider>
        </Box>
    );
}

export default TripGenerator;

