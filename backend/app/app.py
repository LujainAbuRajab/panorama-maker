from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import cv2  # OpenCV for image processing
import numpy as np

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

# Directories for image uploads and results
UPLOAD_FOLDER = 'uploads'
PANORAMA_FOLDER = 'panoramas'
EDGES_FOLDER = 'edges'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['PANORAMA_FOLDER'] = PANORAMA_FOLDER
app.config['EDGES_FOLDER'] = EDGES_FOLDER

# Ensure all directories exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(PANORAMA_FOLDER, exist_ok=True)
os.makedirs(EDGES_FOLDER, exist_ok=True)

# List to store the paths of the two uploaded images
uploaded_images = []

@app.route('/upload', methods=['POST'])
def upload_images():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part in the request'}), 400

    files = request.files.getlist('file')
    if not files or len(files) != 2:
        return jsonify({'error': 'Please upload exactly two images.'}), 400

    uploaded_file_paths = []

    for file in files:
        if file.filename == '':
            return jsonify({'error': 'One of the selected files has no filename'}), 400

        if file:
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
            file.save(file_path)
            uploaded_file_paths.append(file_path)
            uploaded_images.append(file_path)

    return jsonify({
        'message': 'Two images uploaded successfully',
        'file_paths': uploaded_file_paths,
        'uploaded_images': uploaded_images
    }), 200

@app.route('/convert', methods=['POST'])
def convert_to_panorama():
    if len(uploaded_images) != 2:
        return jsonify({'error': 'Please upload exactly two images to create a panorama.'}), 400

    try:
        panorama_path = create_panorama(uploaded_images)
        return jsonify({
            'message': 'Panorama created successfully',
            'panorama_image': os.path.basename(panorama_path)
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def create_panorama(image_paths):
    img1 = cv2.imread(image_paths[0])
    img2 = cv2.imread(image_paths[1])

    if img1 is None or img2 is None:
        raise Exception("Error reading one or both images for stitching.")

    stitcher = cv2.Stitcher_create()
    (status, stitched) = stitcher.stitch([img1, img2])

    if status != 0:
        raise Exception("Image stitching failed.")

    panorama_path = os.path.join(app.config['PANORAMA_FOLDER'], 'panorama.jpg')
    cv2.imwrite(panorama_path, stitched)
    return panorama_path

@app.route('/edge-detection/canny', methods=['POST'])
def canny_edge_detection():
    panorama_image_path = os.path.join(app.config['PANORAMA_FOLDER'], 'panorama.jpg')

    if not os.path.exists(panorama_image_path):
        return jsonify({'error': 'Panorama image not found. Please create a panorama first.'}), 400

    image = cv2.imread(panorama_image_path, cv2.IMREAD_GRAYSCALE)
    edges = cv2.Canny(image, 100, 200)

    edge_image_path = os.path.join(app.config['EDGES_FOLDER'], 'canny_edges.jpg')
    cv2.imwrite(edge_image_path, edges)

    return jsonify({'message': 'Canny Edge Detection applied successfully', 'edge_image': os.path.basename(edge_image_path)}), 200

@app.route('/edge-detection/dog', methods=['POST'])
def dog_edge_detection():
    panorama_image_path = os.path.join(app.config['PANORAMA_FOLDER'], 'panorama.jpg')

    if not os.path.exists(panorama_image_path):
        return jsonify({'error': 'Panorama image not found. Please create a panorama first.'}), 400

    # Get the kernel size from the request, default to 5 if not provided
    kernel_size = int(request.json.get('kernel_size', 5))

    image = cv2.imread(panorama_image_path, cv2.IMREAD_GRAYSCALE)
    blur1 = cv2.GaussianBlur(image, (kernel_size, kernel_size), 0)
    blur2 = cv2.GaussianBlur(image, (kernel_size + 2, kernel_size + 2), 0)
    dog = cv2.subtract(blur1, blur2)

    # Apply morphological operations
    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (3, 3))
    dog_cleaned = cv2.morphologyEx(dog, cv2.MORPH_CLOSE, kernel)

    dog_image_path = os.path.join(app.config['EDGES_FOLDER'], 'dog_edges.jpg')
    cv2.imwrite(dog_image_path, dog_cleaned)

    return jsonify({'message': 'DoG Edge Detection applied successfully', 'edge_image': os.path.basename(dog_image_path)}), 200

# Serve the stitched panorama image
@app.route('/panorama/<filename>')
def send_panorama(filename):
    return send_from_directory(app.config['PANORAMA_FOLDER'], filename)

# Serve the edge-detected image
@app.route('/edges/<filename>')
def send_edge_image(filename):
    return send_from_directory(app.config['EDGES_FOLDER'], filename)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
