from flask import Flask, render_template, request, redirect, url_for
from utils import process_image, get_prediction
from keras.models import load_model
app = Flask(__name__)

# Set the path to the trained model
model_path = "models/fine_tuned_model.h5"

# Load the trained model
trained_model = None  # Initialize as None, load on first request

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    global trained_model
    if trained_model is None:
        # Load the model on the first request
        trained_model = load_model(model_path)

    # Get the uploaded image file
    uploaded_file = request.files['file']



    # Process the image and make predictions
    result = get_prediction(uploaded_file, trained_model)
    print(result)
    # Redirect to the result page with the predicted class name
    return redirect(url_for('result', prediction=result))

@app.route('/result/<prediction>')
def result(prediction):
    return render_template('result.html', prediction=prediction)

if __name__ == '__main__':
    app.run(debug=True)
