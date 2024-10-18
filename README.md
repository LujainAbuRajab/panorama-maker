# AI-Enhanced Image Stitching and Edge Detection

## Project Idea

This project is focused on developing a web application that allows users to upload multiple images, stitch them together into a panoramic image, and apply various edge detection techniques to the stitched image. The techniques include Canny Edge Detection, Difference of Gaussians (DoG) with a morphological operation, and an AI-based edge detection model specifically tuned to recognize human figures with a confidence level above 50%. The application offers an interactive user interface to adjust parameters and visually compare the results of different edge detection techniques.

## Techniques Used

1. **Image Stitching**:
   - Combine multiple images into a panoramic view.

2. **Edge Detection**:
   - **Canny Edge Detection**: Identifies the edges in the stitched image.
   - **Difference of Gaussians (DoG)**: Highlights differences in pixel intensities, followed by morphological operations to clean the output.
   - Adjustable kernel size for morphological operation through a UI slider.

3. **AI-Based Human Detection**:
   - Uses a pre-trained AI model (e.g., YOLO or SSD) to detect human figures within the stitched image.
   - Filters detections to show only those with confidence levels above 50%.

## Frameworks and Libraries

- **Frontend (React)**:
  - ReactJS for the user interface.
  - React components for image uploads, sliders, and displaying processed results.

- **Backend (Flask)**:
  - Flask for backend API to handle image processing and edge detection.
  - OpenCV for image stitching and edge detection algorithms.
  - PyTorch/TensorFlow for AI-based human detection using a pre-trained model.
  
- **Libraries**:
  - OpenCV for image processing.
  - PyTorch or TensorFlow for AI model integration.

## How to Run the Project Locally

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-repo/ai-image-stitching-edge-detection.git

2. **Backend Setup**:

   Navigate to the backend directory and install the required dependencies:
   
   ```bash
   pip install -r requirements.txt
   
   Run the Flask server:
   
   ```bash
   python app.py

3. **Frontend Setup**:

   Navigate to the frontend directory and install the dependencies:
   
   ```bash
   npm install

   Run the React app:
   
   ```bash
   npm start

4. **Access the Web Application:**

   Open your browser and go to ```http://localhost:3000``` to start using the application.

   
