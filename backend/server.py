import io
import base64
import logging
import traceback
import numpy as np
import cv2
from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import torch
from transformers import TrOCRProcessor, VisionEncoderDecoderModel

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s: %(message)s")
app = Flask(__name__)
CORS(app)

# Load TrOCR Model (Optimized for Handwriting)
trocr_processor = TrOCRProcessor.from_pretrained("microsoft/trocr-base-handwritten")
trocr_model = VisionEncoderDecoderModel.from_pretrained("microsoft/trocr-base-handwritten")

def preprocess_image(image):
    try:
        image = np.array(image)
        gray = cv2.cvtColor(image, cv2.COLOR_RGB2GRAY)  # Convert to grayscale
        blurred = cv2.GaussianBlur(gray, (3, 3), 0)  # Reduce noise
        thresh = cv2.adaptiveThreshold(blurred, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
                                       cv2.THRESH_BINARY, 31, 2)  # Apply thresholding
        
        h, w = thresh.shape
        scaling_factor = 500 / w
        new_size = (500, int(h * scaling_factor))
        processed_image = cv2.resize(thresh, new_size, interpolation=cv2.INTER_AREA)
        
        return Image.fromarray(processed_image)

    except Exception as e:
        logging.error(f"Image Preprocessing Error: {e}")
        return image

def perform_ocr(image):
    """
    Perform OCR using TrOCR after preprocessing.
    """
    try:
        processed_image = preprocess_image(image)
        if processed_image.mode != "RGB":
            processed_image = processed_image.convert("RGB")

        pixel_values = trocr_processor(processed_image, return_tensors="pt").pixel_values

        generated_ids = trocr_model.generate(pixel_values)
        extracted_text = trocr_processor.batch_decode(generated_ids, skip_special_tokens=True)[0]

        return extracted_text.strip()

    except Exception as e:
        logging.error(f"OCR Error: {e}")
        raise

@app.route('/api/ocr', methods=['POST'])
def ocr_image():
    """
    OCR API endpoint for extracting text from images.
    """
    try:
        if not request.json or "images" not in request.json:
            return jsonify({"error": "Invalid request: No image data provided"}), 400

        images_data = request.json["images"]
        extracted_lines = []
        print(images_data)
        for image_data in images_data:
            image_bytes = base64.b64decode(image_data.split(",")[1])  # Remove prefix
            image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
            text = perform_ocr(image)
            extracted_lines.append(" " + text)

        final_text = " ".join(extracted_lines)
        logging.info(f"Final Extracted Text: {final_text}")

        return jsonify({"text": final_text})

    except Exception as e:
        error_message = traceback.format_exc()
        logging.error(f"Full Error Traceback:\n{error_message}")

        return jsonify({
            "error": "OCR processing failed",
            "details": str(e)
        }), 500

@app.errorhandler(Exception)
def handle_global_exception(e):
    """
    Global error handler for unhandled exceptions.
    """
    logging.error(f"Unhandled Exception: {e}")
    return jsonify({"error": "Internal server error", "message": str(e)}), 500

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=8000, debug=False)
