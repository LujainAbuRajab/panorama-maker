// // Importing the useState hook from React to manage state in the component
// import { useState } from 'react';

// // A custom hook named 'useMultiImageUpload' that handles multiple image uploads
// function useMultiImageUpload() {
//     // State to store the uploaded image files as an array
//     const [images, setImages] = useState([]);
    
//     // State to store any error that might occur during the upload process
//     const [uploadError, setUploadError] = useState(null);
    
//     // State to track whether the image upload process is currently in progress
//     const [isUploading, setIsUploading] = useState(false);

//     // Function to handle the image upload process for multiple images
//     const handleImageUpload = async (files) => {
//         // Set the uploading state to true to indicate that the upload process has started
//         setIsUploading(true);

//         try {
//             // Convert the FileList to an array and set it as the images state
//             const fileArray = Array.from(files);

//             // Placeholder for logic to upload the image files to the server or process them
//             // This is where you would typically make an API call to send the files to the server
//             setImages((prevImages) => [...prevImages, ...fileArray]); // Add the new images to the existing state
//         } catch (error) {
//             // If an error occurs during the upload process, update the uploadError state
//             setUploadError('Failed to upload one or more images');
//         } finally {
//             // Once the upload process is complete (whether it succeeded or failed), set isUploading to false
//             setIsUploading(false);
//         }
//     };

//     // Return the state variables and the handleImageUpload function so they can be used in the component
//     return { images, uploadError, isUploading, handleImageUpload };
// }

// // Export the custom hook to be used in other components
// export default useMultiImageUpload;

import React, { useState } from 'react';
import axios from 'axios';
import {
    Box,
    Button,
    Typography,
    Card,
    CardContent,
    CircularProgress,
    Grid,
    CardMedia,
} from '@mui/material';

function ImageUploader() {
    const [images, setImages] = useState([]);
    const [uploadStatus, setUploadStatus] = useState('');
    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = (event) => {
        setImages(Array.from(event.target.files)); // Convert FileList to an array and set the state
    };

    const handleUpload = async () => {
        setIsUploading(true); // Show loading indicator while uploading
        const formData = new FormData();
        for (let i = 0; i < images.length; i++) {
            formData.append('file', images[i]);
        }

        try {
            const response = await axios.post('http://127.0.0.1:5000/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setUploadStatus(response.data.message);
        } catch (error) {
            setUploadStatus('Upload failed, please try again.');
        } finally {
            setIsUploading(false); // Hide loading indicator when done
        }
    };

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
            bgcolor="#f0f2f5"
        >
            <Card sx={{ maxWidth: 600, padding: 3, boxShadow: 3 }}>
                <CardContent>
                    <Typography variant="h5" gutterBottom>
                        Upload Your Images
                    </Typography>
                    <input
                        type="file"
                        multiple
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                        id="file-input"
                    />
                    <label htmlFor="file-input">
                        <Button
                            variant="contained"
                            component="span"
                            color="primary"
                            sx={{ margin: 2 }}
                        >
                            Select Images
                        </Button>
                    </label>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={handleUpload}
                        disabled={isUploading || images.length === 0}
                    >
                        {isUploading ? <CircularProgress size={24} /> : 'Upload Images'}
                    </Button>
                    {uploadStatus && (
                        <Typography variant="body2" color="textSecondary" mt={2}>
                            {uploadStatus}
                        </Typography>
                    )}
                    {/* Display thumbnails of selected images */}
                    <Grid container spacing={2} mt={2}>
                        {images.length > 0 &&
                            images.map((image, index) => (
                                <Grid item xs={4} key={index}>
                                    <CardMedia
                                        component="img"
                                        height="100"
                                        image={URL.createObjectURL(image)}
                                        alt={`uploaded image ${index + 1}`}
                                        sx={{ borderRadius: 1, boxShadow: 1 }}
                                    />
                                </Grid>
                            ))}
                    </Grid>
                </CardContent>
            </Card>
        </Box>
    );
}

export default ImageUploader;
