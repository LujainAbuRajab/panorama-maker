import React, { useState } from 'react';
import axios from 'axios';

function ImageUploader() {
    const [images, setImages] = useState([]);
    const [uploadStatus, setUploadStatus] = useState('');

    const handleFileChange = (event) => {
        setImages(event.target.files); // Set the selected files in state
    };

    const handleUpload = async () => {
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
        }
    };

    return (
        <div>
            <input type="file" multiple onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload Images</button>
            <p>{uploadStatus}</p>
        </div>
    );
}

// Use this to export the component as a default export
export default ImageUploader;
