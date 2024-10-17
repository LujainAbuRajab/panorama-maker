import React from 'react';
import { Box, Typography, Card, CardMedia } from '@mui/material';

const ImagePanorama = ({ panoramaUrl }) => {
  return (
    <Box mt={4}>
      {panoramaUrl ? (
        <Card>
          <Typography variant="h6" gutterBottom>
            Panorama Image:
          </Typography>
          <CardMedia
            component="img"
            image={panoramaUrl}
            alt="Panorama"
            sx={{ maxHeight: 400, objectFit: 'contain' }}
          />
        </Card>
      ) : (
        <Typography variant="body2" color="textSecondary">
          No panorama image available. Please upload images to create a panorama.
        </Typography>
      )}
    </Box>
  );
};

export default ImagePanorama;
