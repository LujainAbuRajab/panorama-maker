from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import cv2  # OpenCV for image stitching
import numpy as np

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

# Directory where uploaded images will be saved
UPLOAD_FOLDER = 'uploads'
PANORAMA_FOLDER = 'panoramas'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['PANORAMA_FOLDER'] = PANORAMA_FOLDER

# Ensure the upload and panorama folders exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(PANORAMA_FOLDER, exist_ok=True)

# List to store the paths of uploaded images
uploaded_images = []

@app.route('/upload', methods=['POST'])
def upload_images():
    try:
        # Check if 'file' is part of the request
        if 'file' not in request.files:
            return jsonify({'error': 'No file part in the request'}), 400

        files = request.files.getlist('file')  # Get the list of files
        if not files or len(files) == 0:
            return jsonify({'error': 'No files selected'}), 400

        uploaded_file_paths = []  # List to store the paths of uploaded files

        # Save each file and log any potential errors
        for file in files:
            if file.filename == '':
                return jsonify({'error': 'One of the selected files has no filename'}), 400

            file_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
            file.save(file_path)  # Save the file
            uploaded_file_paths.append(file_path)
            uploaded_images.append(file_path)

        # After uploading, create a panorama
        try:
            panorama_path = create_panorama(uploaded_file_paths)
        except Exception as e:
            # Catch and log any panorama creation errors
            return jsonify({'error': 'Error creating panorama: ' + str(e)}), 500

        return jsonify({
            'message': 'Files uploaded successfully',
            'uploaded_images': uploaded_file_paths,
            'panorama_image': os.path.basename(panorama_path)  # Return the filename
        }), 200

    except Exception as e:
        # Catch any general errors
        return jsonify({'error': 'An error occurred: ' + str(e)}), 500

def create_panorama(image_paths):
    try:
        # Read images for stitching
        images = [cv2.imread(img) for img in image_paths]

        # Check if images were successfully loaded
        if any(img is None for img in images):
            raise ValueError("One or more images could not be read. Ensure valid image files.")

        stitcher = cv2.Stitcher_create()
        (status, stitched) = stitcher.stitch(images)

        # Handle stitching errors
        if status != 0:
            raise Exception(f"Image stitching failed with status {status}.")

        panorama_path = os.path.join(app.config['PANORAMA_FOLDER'], 'panorama.jpg')
        cv2.imwrite(panorama_path, stitched)  
        return panorama_path  

    except Exception as e:
        # Log any errors in the stitching process
        raise Exception(f"Panorama creation error: {str(e)}")

# Serve the stitched panorama image
@app.route('/panorama/<filename>')
def send_panorama(filename):
    return send_from_directory(app.config['PANORAMA_FOLDER'], filename)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
