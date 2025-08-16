import cv2
import numpy as np
from keras.models import load_model
from pathlib import Path
from dotenv import load_dotenv
import os
# os.environ['TF_ENABLE_ONEDNN_OPTS']=0

# Set the path to the trained model
model_path = "Store\CNN2\\fine_tuned_model.h5"

# Load the trained model
trained_model = load_model(model_path)

# Set the path to the new image for prediction
new_image_path = "Store\CNN2\\th (2).jpg"

# Read the new image
new_image = cv2.imread(new_image_path)

# Assuming the target size used during training is (224, 224)
target_size = (224, 224)

# Resize the image to match the target size
resized_image = cv2.resize(new_image, target_size)

# Normalize pixel values to be between 0 and 1
normalized_image = resized_image.astype("float") / 255.0

# Reshape the image to match the model input shape
input_image = np.reshape(normalized_image, (1, target_size[0], target_size[1], 3))

# Make predictions
predictions = trained_model.predict(input_image)
print(predictions)
# Get the predicted class index
predicted_class_index = np.argmax(predictions)
print(predicted_class_index)
# Define your class names based on the training order
class_names = ["vehicle", "building"]

# Get the predicted class name based on the index
predicted_class_name = class_names[predicted_class_index]

# Display the result
print(f"Predicted Class: {predicted_class_name}")
