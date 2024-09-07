import React, { useState } from 'react';
import { TextField, Button, Box, Typography, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const Body = ({ onSubmit }) => {
  const [bodyData, setBodyData] = useState('');
  const [submittedData, setSubmittedData] = useState(null);
  const [isEditMode, setIsEditMode] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (event) => {
    setBodyData(event.target.value);
    setError(null); // Reset error when user starts typing
  };

  const handleSubmit = () => {
    try {
      const parsedData = JSON.parse(bodyData);
      setSubmittedData(parsedData);
      onSubmit(parsedData);
      setIsEditMode(false); // Switch to view mode after submit
      setIsCollapsed(false);
      setError(null); // Reset error on successful submission
    } catch (error) {
      setError(error.message); // Set the error message
    }
  };

  const handleEditClick = () => {
    setIsEditMode(true); // Switch to edit mode
  };

  const handleCollapseClick = () => {
    setIsCollapsed(!isCollapsed); // Toggle collapse
  };

  // Function to fix common JSON issues
  const validateAndCorrectJSON = (jsonString) => {
    try {
      // Attempt to parse the JSON directly
      const parsedData = JSON.parse(jsonString);
      return { valid: true, correctedJSON: JSON.stringify(parsedData, null, 2) };
    } catch (error) {
      let correctedJSON = jsonString;

      // Replace single quotes with double quotes
      correctedJSON = correctedJSON.replace(/'/g, '"');

      // Ensure keys are quoted
      correctedJSON = correctedJSON.replace(/([{,]\s*)([a-zA-Z0-9_]+)(\s*:)/g, '$1"$2"$3');

      // Add missing commas between objects or arrays
      correctedJSON = correctedJSON.replace(/}\s*{/g, '},{').replace(/]\s*\[/g, '],[');

      // Ensure proper trailing commas and brackets
      correctedJSON = correctedJSON.replace(/,(\s*[}\]])/g, '$1');

      // Attempt to parse the corrected JSON
      try {
        const parsedData = JSON.parse(correctedJSON);
        return { valid: true, correctedJSON: JSON.stringify(parsedData, null, 2) };
      } catch (finalError) {
        return { valid: false, error: finalError.message };
      }
    }
  };

  const handleValidate = () => {
    const { valid, correctedJSON, error } = validateAndCorrectJSON(bodyData);
    if (valid) {
      setBodyData(correctedJSON);
      setError(null);
    } else {
      setError(error);
    }
  };

  return (
    <Box>
      {isEditMode ? (
        <Box>
          <Typography variant="caption">Enter Body Data (JSON format)</Typography>
          <TextField
            label="Request Body"
            multiline
            rows={10}
            variant="outlined"
            fullWidth
            value={bodyData}
            onChange={handleChange}
            error={!!error} // Highlight the TextField if there's an error
            helperText={error && "Invalid JSON format"} // Show a simple error message below the field
          />
          <Box mt={2}>
            <Button variant="outlined" color="secondary" onClick={handleValidate}>
              Validate
            </Button>
            <Button
              variant={submittedData ? "contained" : "outlined"}
              color="primary"
              onClick={handleSubmit}
              disabled={!!error} // Disable submit if there's an error
              sx={{ ml: 2 }}
            >
              Submit
            </Button>
          </Box>
          {error && (
            <Typography color="error" variant="body2" sx={{ mt: 2 }}>
              {`Error: ${error}`}
            </Typography>
          )}
        </Box>
      ) : (
        <Box>
          <Typography variant="caption" sx={{ mb: 2 }}>
            Submitted Data
            <IconButton onClick={handleEditClick}>
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton onClick={handleCollapseClick}>
              {isCollapsed ? <ExpandMoreIcon fontSize="small" /> : <ExpandLessIcon fontSize="small" />}
            </IconButton>
          </Typography>
          {!isCollapsed && (
            <Box
              component="pre"
              sx={{
                maxHeight: '250px',
                overflow: 'auto',
                border: '1px solid #ccc',
                padding: '10px',
                backgroundColor: '#f5f5f5',
                marginTop: '0px',
              }}
            >
              {JSON.stringify(submittedData, null, 2)}
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default Body;
