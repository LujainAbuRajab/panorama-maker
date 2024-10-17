# from flask import Flask, request, jsonify
# from flask_cors import CORS
# import cv2
# import numpy as np
# import os

# app = Flask(__name__)
# CORS(app)  # Allow cross-origin requests

# # Directory where uploaded images will be saved
# UPLOAD_FOLDER = 'uploads'
# app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# # Ensure the upload folder exists
# if not os.path.exists(UPLOAD_FOLDER):
#     os.makedirs(UPLOAD_FOLDER)

# @app.route('/upload', methods=['GET','POST'])
# def upload_image():
    
#     if 'file' not in request.files:
#         return jsonify({'error': 'No file part in the request'}), 400

#     file = request.files['file']

#     if file.filename == '':
#         return jsonify({'error': 'No selected file'}), 400

#     if file:
#         file_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
#         file.save(file_path)
#         return jsonify({'message': 'File uploaded successfully', 'file_path': file_path}), 200

#     return jsonify({'error': 'File upload failed'}), 500

# if __name__ == '__main__':
#     app.run(host='0.0.0.0', port=5000, debug=True)

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
    # Check if 'file' is part of the request
    if 'file' not in request.files:
        return jsonify({'error': 'No file part in the request'}), 400

    files = request.files.getlist('file')  # Get the list of files
    if not files or len(files) == 0:
        return jsonify({'error': 'No files selected'}), 400

    uploaded_file_paths = []  # List to store the paths of uploaded files

    for file in files:
        if file.filename == '':
            return jsonify({'error': 'One of the selected files has no filename'}), 400

        if file:
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
            file.save(file_path)
            uploaded_file_paths.append(file_path)
            uploaded_images.append(file_path)

    return jsonify({
        'message': 'Files uploaded successfully',
        'file_paths': uploaded_file_paths,
        'uploaded_images': uploaded_images
    }), 200

@app.route('/convert', methods=['POST'])
def convert_to_panorama():
    if not uploaded_images:
        return jsonify({'error': 'No images uploaded to create a panorama.'}), 400

    try:
        panorama_path = create_panorama(uploaded_images)
        return jsonify({
            'message': 'Panorama created successfully',
            'panorama_image': os.path.basename(panorama_path)  # Return the filename
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def create_panorama(image_paths):
    images = [cv2.imread(img) for img in image_paths]

    # Create a Stitcher object (OpenCV 4.x)
    stitcher = cv2.Stitcher_create()
    (status, stitched) = stitcher.stitch(images)

    if status != 0:
        raise Exception("Image stitching failed.")

    panorama_path = os.path.join(app.config['PANORAMA_FOLDER'], 'panorama.jpg')
    cv2.imwrite(panorama_path, stitched)  # Save the panorama image
    return panorama_path  # Return the path of the panorama

# Serve the stitched panorama image
@app.route('/panorama/<filename>')
def send_panorama(filename):
    return send_from_directory(app.config['PANORAMA_FOLDER'], filename)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
