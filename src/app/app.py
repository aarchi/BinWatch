from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import uuid
import json

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Get the current directory of the Flask app
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Path to save uploaded files
UPLOAD_FOLDER = os.path.join(BASE_DIR, 'E:/Study/Version1/hackathon/bin-watch/src/assets/uploads')
# Path to store workers.json file
WORKERS_FILE = os.path.join(BASE_DIR, 'E:/Study/Version1/hackathon/bin-watch/src/assets/workers.json')
# Path to store reports.json file
REPORTS_FILE = os.path.join(BASE_DIR, 'E:/Study/Version1/hackathon/bin-watch/src/assets/reports.json')

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

bins = []

@app.route('/workers', methods=['PUT'])
def update_workers():
    # Get the new workers data from the request
    workers_data = request.get_json()

    # Load existing data from workers.json
    with open(WORKERS_FILE, 'r') as file:
        existing_workers_data = json.load(file)

    # Update the existing data with the new data
    existing_workers_data = workers_data['workers']

    # Write the updated data back to workers.json
    with open(WORKERS_FILE, 'w') as file:
        json.dump(existing_workers_data, file, indent=4)

    return jsonify({"message": "Workers updated successfully"}), 200

@app.route('/updateReport', methods=['PUT'])
def update_report():
    # Get the updated report data from the request
    report_data = request.get_json()

    # Check if the report data is formatted correctly
    if not isinstance(report_data, dict) or 'id' not in report_data:
        return jsonify({"error": "Invalid report data format"}), 400

    # Load existing reports data from reports.json
    with open(REPORTS_FILE, 'r') as file:
        reports_data = json.load(file)

    # Find the report to update in the existing data
    for report in reports_data:
        if isinstance(report, dict) and 'id' in report and report['id'] == report_data['id']:
            if 'status' in report_data:
                # Update the status
                report['status'] = report_data['status']
            if 'assignedTo' in report_data:
                # Update the assignedTo field with the assigned worker name
                report['assignedTo'] = report_data['assignedTo']
                # Update the status to 'Assigned'
                report['status'] = 'Assigned'
            break
    else:
        return jsonify({"error": "Report not found"}), 404

    # Write the updated data back to reports.json
    with open(REPORTS_FILE, 'w') as file:
        json.dump(reports_data, file, indent=4)

    return jsonify({"message": "Report updated successfully"}), 200

@app.route('/uploads/<path:filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

@app.route('/bins', methods=['POST'])
def manage_bins():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    # Generate a unique file name to avoid overwriting
    filename = str(uuid.uuid4()) + os.path.splitext(file.filename)[1]
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(file_path)

    new_bin = {
        "id": len(bins) + 1,
        "imageUrl": f"http://localhost:4201/uploads/{filename}",
        "status": "Pending",
        "location": request.form.get("location"),
        "submittedBy": request.form.get("submittedBy"),
        "assignedTo": "",
        "completedImageUrl": ""
    }
    bins.append(new_bin)

    # Load existing data from reports.json
    try:
        with open(REPORTS_FILE, 'r') as file:
            reports_data = json.load(file)
    except json.decoder.JSONDecodeError as e:
        # Handle the case when the file is empty or not properly formatted
        reports_data = []

    # Add the new record to the loaded data
    reports_data.append(new_bin)

    # Write the updated data back to reports.json
    with open(REPORTS_FILE, 'w') as file:
        json.dump(reports_data, file, indent=4)

    return jsonify({"message": "Bin added successfully", "imageUrl": new_bin["imageUrl"]}), 201

@app.route('/bins', methods=['GET'])
def get_bins():
    return jsonify({"bins": bins})

if __name__ == '__main__':
    app.run(port=4201)
