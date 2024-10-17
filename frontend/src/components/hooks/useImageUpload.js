import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Grid2,
  CardMedia,
} from "@mui/material";

function ImageUploader() {
  const [images, setImages] = useState([]);
  const [uploadStatus, setUploadStatus] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (event) => {
    setImages(Array.from(event.target.files)); // Convert FileList to an array and set the state
  };

  const handleUpload = async () => {
    setIsUploading(true); // Show loading indicator while uploading
    const formData = new FormData();
    for (let i = 0; i < images.length; i++) {
      formData.append("file", images[i]);
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
    } finally {
      setIsUploading(false); // Hide loading indicator when done
    }
  };

  return (
    <div>
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
              style={{ display: "none" }}
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
              {isUploading ? <CircularProgress size={24} /> : "Upload Images"}
            </Button>
            {uploadStatus && (
              <Typography variant="body2" color="textSecondary" mt={2}>
                {uploadStatus}
              </Typography>
            )}
            {/* Display thumbnails of selected images */}
            <Grid2 container spacing={2} mt={2}>
              {images.length > 0 &&
                images.map((image, index) => (
                  <Grid2 item xs={4} key={index}>
                    <CardMedia
                      component="img"
                      height="100"
                      image={URL.createObjectURL(image)}
                      alt={`uploaded image ${index + 1}`}
                      sx={{ borderRadius: 1, boxShadow: 1 }}
                    />
                  </Grid2>
                ))}
            </Grid2>
          </CardContent>
        </Card>
      </Box>
    </div>
  );
}

export default ImageUploader;
