import React, {useState, useEffect} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import axios from 'axios';
import {TextField, Button, Typography, Box} from '@mui/material';
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns';

function TripDetail() {
    const {tripId} = useParams();
    const userId = localStorage.getItem('username');
    const [trip, setTrip] = useState(null);
    const [destination, setDestination] = useState('');
    const [preferences, setPreferences] = useState(null);
    const [itinerary, setItinerary] = useState('');
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchTripDetails();
    }, [tripId]);

    const fetchTripDetails = async () => {

        const token = localStorage.getItem('token');
        axios.get(`http://localhost:8080/api/trip/${tripId}`, {
            headers: {'Authorization': `Bearer ${token}`},
            params: {
                userId: userId,
                tripId: tripId
            }
        }).then(response => {
            const {success, data, message} = response.data;
            console.debug("success" + success);
            if (success) {
                const tripData = data;
                setTrip(tripData);
                setDestination(tripData.destination);
                setPreferences(tripData.preferences.toString());
                setItinerary(tripData.itinerary);
                setStartDate(new Date(tripData.startDate));
                setEndDate(new Date(tripData.endDate));
            } else {
                console.error('Error fetching trip details:', message);
                setError('Failed to load trip details.');
            }
        })
            .catch(err => {
                console.error('Error fetching trip details:', err);
                setError('Failed to load trip details.');
            });
    };

    const handleSaveChanges = async () => {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('username');
        const formattedStartDate = startDate ? startDate.toISOString().split('T')[0] : '';
        const formattedEndDate = endDate ? endDate.toISOString().split('T')[0] : '';
        const updatedTrip = {
            destination,
            preferences: preferences.split(',').map(pref => pref.trim()),
            itinerary,
            travelStartDates: formattedStartDate,
            travelEndDates: formattedEndDate
        };

        axios.put(`http://localhost:8080/api/trip/update/${tripId}`, updatedTrip, {
            headers: {'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json'},
            params: {userId: userId}
        }).then(response => {
            const {success, data, message} = response.data;
            console.debug("success" + success);
            if (success) {
                alert('Trip details updated successfully!');
                navigate(-1);
            } else {
                console.error('Error updating trip details:', message);
                setError('Failed to update trip details.');
            }
        })
            .catch(err => {
                console.error('Error updating trip details:', err);
                setError('Failed to update trip details.');
            });

    };

    return trip ? (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box>
                <Typography variant="h4" gutterBottom>Edit Trip Details</Typography>
                <TextField
                    label="Destination"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Preferences (comma separated)"
                    value={preferences}
                    onChange={(e) => setPreferences(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <DatePicker
                    label="Start Date"
                    value={startDate}
                    onChange={(newValue) => setStartDate(newValue)}
                    renderInput={(params) => <TextField {...params} fullWidth margin="normal"/>}
                />
                <DatePicker
                    label="End Date"
                    value={endDate}
                    onChange={(newValue) => setEndDate(newValue)}
                    renderInput={(params) => <TextField {...params} fullWidth margin="normal"/>}
                />
                <TextField
                    label="Itinerary"
                    value={itinerary}
                    onChange={(e) => setItinerary(e.target.value)}
                    fullWidth
                    margin="normal"
                    multiline
                    minRows={10}
                />
                <Button variant="contained" color="primary" onClick={handleSaveChanges} sx={{marginTop: 2}}>
                    Save Changes
                </Button>
                <Button variant="outlined" onClick={() => navigate(-1)} sx={{marginTop: 2, marginLeft: 2}}>
                    Cancel
                </Button>
                {error && <Typography color="error">{error}</Typography>}
            </Box>
        </LocalizationProvider>
    ) : (
        <Typography>{error || 'Loading trip details...'}</Typography>
    );
}

export default TripDetail;
