import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Button,
} from "@mui/material";

function ImageUploader() {
  const [images, setImages] = useState([]); // Selected images
  const [uploadStatus, setUploadStatus] = useState(""); // Status of upload
  const [isUploading, setIsUploading] = useState(false); // Uploading state
  const [isConverting, setIsConverting] = useState(false); // Converting state
  const [panoramaUrl, setPanoramaUrl] = useState(""); // URL of converted panorama

  // Handles file selection and upload
  const handleFileChange = async (event) => {
    const selectedFiles = Array.from(event.target.files); // Convert FileList to array
    setImages(selectedFiles);

    // Automatically start upload after selecting files
    setIsUploading(true);
    const formData = new FormData();
    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append("file", selectedFiles[i]);
    }

    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setUploadStatus(response.data.message);
    } catch (error) {
      setUploadStatus("Upload failed, please try again.");
      console.log("error", error);
      
    } finally {
      setIsUploading(false);
    }
  };

// Handles conversion of uploaded images into a panorama
const handleConvertImages = async () => {
  setIsConverting(true);
  try {
    const response = await axios.post("http://127.0.0.1:5000/convert"); // Change to POST request
    setPanoramaUrl(`http://127.0.0.1:5000/${response.data.panorama_image}`);
    setUploadStatus("Conversion successful!");
  } catch (error) {
    setUploadStatus("Conversion failed, please try again.");
    console.log(error);
    
  } finally {
    setIsConverting(false);
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

          {/* Image Upload Input */}
          <input
            type="file"
            multiple
            onChange={handleFileChange} // Automatically upload on file select
            style={{ display: "none" }}
            id="file-input"
          />
          <label htmlFor="file-input">
            <Box
              component="span"
              display="inline-block"
              variant="contained"
              color="primary"
              sx={{
                padding: 2,
                backgroundColor: "#1976d2",
                color: "#fff",
                borderRadius: "4px",
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: "#115293",
                },
              }}
            >
              {isUploading ? <CircularProgress size={24} /> : "Select Images"}
            </Box>
          </label>

          {uploadStatus && (
            <Typography variant="body2" color="textSecondary" mt={2}>
              {uploadStatus}
            </Typography>
          )}

          {/* Render selected images */}
          <Box mt={2} display="flex" flexWrap="wrap">
            {images.length > 0 &&
              images.map((file, index) => (
                <Box key={index} m={1}>
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Selected image ${index}`}
                    width={100}
                    height={100}
                    style={{ objectFit: "cover", borderRadius: "8px" }}
                  />
                </Box>
              ))}
          </Box>

          {/* Show Convert button after upload */}
          {images.length > 0 && uploadStatus === "Files uploaded successfully" && (
            <Button
              variant="contained"
              color="secondary"
              onClick={handleConvertImages}
              disabled={isConverting}
              sx={{ mt: 2 }}
            >
              {isConverting ? <CircularProgress size={24} /> : "Convert to Panorama"}
            </Button>
          )}

          {/* Display panorama if available */}
          {panoramaUrl && (
            <Box mt={4}>
              <Typography variant="h6">Panorama Image:</Typography>
              <img
                src={panoramaUrl}
                alt="Panorama"
                style={{ maxWidth: "100%", borderRadius: "8px" }}
              />
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}

export default ImageUploader;
