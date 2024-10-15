// Importing the useState hook from React to manage state in the component
import { useState } from 'react';

// A custom hook named 'useMultiImageUpload' that handles multiple image uploads
function useMultiImageUpload() {
    // State to store the uploaded image files as an array
    const [images, setImages] = useState([]);
    
    // State to store any error that might occur during the upload process
    const [uploadError, setUploadError] = useState(null);
    
    // State to track whether the image upload process is currently in progress
    const [isUploading, setIsUploading] = useState(false);

    // Function to handle the image upload process for multiple images
    const handleImageUpload = async (files) => {
        // Set the uploading state to true to indicate that the upload process has started
        setIsUploading(true);

        try {
            // Convert the FileList to an array and set it as the images state
            const fileArray = Array.from(files);

            // Placeholder for logic to upload the image files to the server or process them
            // This is where you would typically make an API call to send the files to the server
            setImages((prevImages) => [...prevImages, ...fileArray]); // Add the new images to the existing state
        } catch (error) {
            // If an error occurs during the upload process, update the uploadError state
            setUploadError('Failed to upload one or more images');
        } finally {
            // Once the upload process is complete (whether it succeeded or failed), set isUploading to false
            setIsUploading(false);
        }
    };

    // Return the state variables and the handleImageUpload function so they can be used in the component
    return { images, uploadError, isUploading, handleImageUpload };
}

// Export the custom hook to be used in other components
export default useMultiImageUpload;
