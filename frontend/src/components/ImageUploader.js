// import React, { useState } from 'react';
// import axios from 'axios';

// function ImageUploader() {
//     const [images, setImages] = useState([]);
//     const [uploadStatus, setUploadStatus] = useState('');

//     const handleFileChange = (event) => {
//         setImages(event.target.files); // Set the selected files in state
//     };

//     const handleUpload = async () => {
//         const formData = new FormData();
//         for (let i = 0; i < images.length; i++) {
//             formData.append('file', images[i]);
//         }

//         try {
//             const response = await axios.post('http://127.0.0.1:5000/upload', formData, {
//                 headers: {
//                     'Content-Type': 'multipart/form-data',
//                 },
//             });
//             setUploadStatus(response.data.message);
//         } catch (error) {
//             setUploadStatus('Upload failed, please try again.');
//         }
//     };

//     return (
//         <div>
//             <input type="file" multiple onChange={handleFileChange} />
//             <button onClick={handleUpload}>Upload Images</button>
//             <p>{uploadStatus}</p>
//         </div>
//     );
// }

// // Use this to export the component as a default export
// export default ImageUploader;

import React, { useState } from 'react';
import axios from 'axios';
import { Box, Button, Typography, Card, CardContent, CircularProgress } from '@mui/material';

function ImageUploader() {
    const [images, setImages] = useState([]);
    const [uploadStatus, setUploadStatus] = useState('');
    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = (event) => {
        setImages(event.target.files); // Set the selected files in state
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
            <Card sx={{ maxWidth: 500, padding: 3, boxShadow: 3 }}>
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
                </CardContent>
            </Card>
        </Box>
    );
}

export default ImageUploader;
