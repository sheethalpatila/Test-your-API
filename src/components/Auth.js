import React, { useState } from 'react';
import {
    Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField,
    Box, FormControl, InputLabel, MenuItem, Select, Tooltip, Typography
} from '@mui/material';

const Auth = ({ requestType, url, onCredentialsChange }) => {
    const [open, setOpen] = useState(false);
    const [inputAuthType, setInputAuthType] = useState('');
    const [bearerToken, setBearerToken] = useState('');
    const [hovered, setHovered] = useState(false);

    // Initialize the credentials state
    const [credentials, setCredentials] = useState({
        username: '',
        password: ''
    });

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleChange = (event) => {
        if (event.target.name === 'requestType') {
            setInputAuthType(event.target.value);
        }
        if (event.target.name === 'bearer') {
            setBearerToken(event.target.value);
        }
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setCredentials((prevCredentials) => ({
            ...prevCredentials,
            [name]: value,
        }));
    };

    const handleSubmit = () => {
        if (inputAuthType === 'Basic-Auth') {
            const encodedCredentials = btoa(`${credentials.username}:${credentials.password}`);
            const newCredentials = `Basic ${encodedCredentials}`;
            onCredentialsChange(inputAuthType, newCredentials);
        } else if (inputAuthType === 'Bearer') {
            const newCredentials = `Bearer ${bearerToken}`.trim(); // Ensure to add 'Bearer ' prefix
            onCredentialsChange(inputAuthType, newCredentials);
        }
        handleClose(); // Close the dialog after submission
    };

    return (
        <div>
            <Tooltip
                title="Please fill out both fields!"
                open={hovered}
                arrow
                onMouseEnter={() => !requestType || !url || hovered ? setHovered(true) : null}
                onMouseLeave={() => setHovered(false)}
            >
                <span>
                    <Button variant={requestType && url ? "contained" : "outlined"} onClick={requestType && url ? handleClickOpen : null} >
                        {inputAuthType ? inputAuthType : "Auth - Token"}
                    </Button>
                </span>
            </Tooltip>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Enter Your Authorization Information</DialogTitle>
                <DialogContent >
                    <Box sx={{ padding: '16px' }}>
                        <FormControl fullWidth size='small'>
                            <InputLabel id="demo-simple-select-label">Auth - Type</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="requestType"
                                value={inputAuthType}
                                name='requestType'
                                label="requestType"
                                onChange={handleChange}
                            >
                                <MenuItem value='Basic-Auth'>Basic Authentication</MenuItem>
                                <MenuItem value='Bearer'>Bearer token</MenuItem>
                            </Select>
                        </FormControl>

                        {inputAuthType === 'Bearer' && (
                            <TextField sx={{ marginTop: '20px' }}
                                size='small'
                                margin="dense"
                                id="bearer"
                                label="Bearer Token"
                                name='bearer'
                                placeholder='Paste your token here'
                                type="text"
                                fullWidth
                                variant="outlined"
                                value={bearerToken}
                                onChange={handleChange}
                            />
                        )}

                        {inputAuthType === "Basic-Auth" && (
                            <Box>
                                <TextField
                                    sx={{ marginTop: '20px' }}
                                    size='small'
                                    label="Username"
                                    name="username"
                                    variant="outlined"
                                    fullWidth
                                    value={credentials.username || ''}
                                    onChange={handleInputChange}
                                    margin="normal"
                                />
                                <TextField
                                    sx={{ marginTop: '20px' }}
                                    size='small'
                                    label="Password"
                                    name="password"
                                    variant="outlined"
                                    fullWidth
                                    type="password"
                                    value={credentials.password || ''}
                                    onChange={handleInputChange}
                                    margin="normal"
                                />
                            </Box>
                        )}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} color="primary">
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default Auth;
