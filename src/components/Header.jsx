import React, { useEffect, useRef, useState } from 'react';
import { Container, Grid, Button, TextField, InputLabel, MenuItem, FormControl, Box, Select } from '@mui/material';
import Auth from './Auth';
import Body from './Body';

const Header = ({ sendDataToResponse }) => {
    const [requestType, setRequestType] = useState('');
    const [inputAuthType, setInputAuthType] = useState('');
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [requestData, setRequestData] = useState(null);
    const [credentials, setCredentials] = useState();

    const timeoutId = useRef(null);
    const fetchData = async () => {
        const controller = new AbortController();
        const timeout = 10000; // 10 seconds timeout

        const requestOptions = {
            method: requestType,
            headers: {
                'Content-Type': 'application/json',
                ...(credentials && { Authorization: credentials })
            },
            body: requestData ? JSON.stringify(requestData) : undefined,
            signal: controller.signal
        };

        // Set up the timeout
        timeoutId.current = setTimeout(() => {
            controller.abort();
        }, timeout);

        try {
            setLoading(true);

            const response = await fetch(url, requestOptions);

            if (!response.ok) {
                let errorMessage = `Error: ${response.status} ${response.statusText}`;
                if (response.status === 401) {
                    errorMessage = "Unauthorized: Please check your credentials.";
                } else if (response.status === 404) {
                    errorMessage = "Not Found: The requested resource could not be found.";
                } else if (response.status === 500) {
                    errorMessage = "Internal Server Error: Please try again later.";
                }
                throw new Error(errorMessage);
            }

            const data = await response.json();
            sendDataToResponse(data);
        } catch (err) {
            if (err.name === 'AbortError') {
                console.error("Request timeout: The request took too long to complete.");
            } else {
                console.error("Fetch Error:", err.message);
            }
            sendDataToResponse({ error: err.message });
        } finally {
            clearTimeout(timeoutId.current);
            setLoading(false);
        }
    };



    const handleChange = (event) => {
        const { name, value } = event.target;
        if (name === 'requestType') {
            setRequestType(value);
        }
        if (name === 'fethData') {
            setLoading(true);
            sendDataToResponse(null);
            setRequestData(null)
            fetchData();
        }
    };

    const handleCredentialsUpdate = (type, newCredentials) => {
        setInputAuthType(type);
        setCredentials(newCredentials);
    };

    const handleFormSubmit = (data) => {
        setRequestData(data);
    };

    // Optional: You can use `useEffect` to clean up on component unmount
    useEffect(() => {
        return () => {
            clearTimeout(timeoutId.current); // Clean up the timeout on unmount
        };
    }, []);

    return (
        <Container >
            <Grid container spacing={1} className="headerGrid">
                <Grid item xs={2}>
                    <FormControl fullWidth size="small">
                        <InputLabel id="demo-simple-select-label">Request</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="requestType"
                            value={requestType}
                            name="requestType"
                            label="requestType"
                            onChange={handleChange}
                        >
                            <MenuItem value="GET">GET</MenuItem>
                            <MenuItem value="PUT">PUT</MenuItem>
                            <MenuItem value="POST">POST</MenuItem>
                            <MenuItem value="DELETE">DELETE</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        id="outlined-basic"
                        name="url"
                        label="URL"
                        variant="outlined"
                        size="small"
                        style={{ width: '100%' }}
                        onChange={(e) => setUrl(e.target.value)}
                    >
                        {url}
                    </TextField>
                </Grid>
                <Grid item xs={2}>
                    <Auth
                        requestType={requestType}
                        url={url}
                        onCredentialsChange={handleCredentialsUpdate}
                    />
                </Grid>
                <Grid item xs="auto">
                    <Button variant={url && requestType ? "contained" : "outlined"} name="fethData" size="medium" onClick={handleChange}>
                        Send
                    </Button>
                </Grid>
            </Grid>
            <Box sx={{ p: 2 }}>
                {requestType !== 'GET' && requestType !== 'DELETE' && (
                    <div>
                        <Body onSubmit={handleFormSubmit} />
                    </div>
                )}
            </Box>
            <hr className="horizontalLine" />
            <h4>Response</h4>
            {loading ? <p>Loading...</p> : null}
        </Container>
    );
};

export default Header;
