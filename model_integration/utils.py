# import cv2
# import numpy as np
# from pathlib import Path
# from flask import flash

# # Assuming the target size used during training is (224, 224)
# target_size = (224, 224)


# def process_image(file):
#     try:
#         # Read the uploaded image
#         image = cv2.imdecode(np.frombuffer(file.read(), np.uint8), cv2.IMREAD_UNCHANGED)

#         # Resize the image to match the target size
#         resized_image = cv2.resize(image, target_size)

#         # Normalize pixel values to be between 0 and 1
#         normalized_image = resized_image.astype("float") / 255.0

#         # Reshape the image to match the model input shape
#         input_image = np.reshape(normalized_image, (1, target_size[0], target_size[1], 3))

#         return input_image

#     except Exception as e:
#         print(str(e))
#         flash("Error processing the image. Please try again.", "error")
#         return None


# def get_prediction(uploaded_file, model):
#     # Process the uploaded image
#     input_image = process_image(uploaded_file)

#     if input_image is not None:
#         # Make predictions
#         predictions = model.predict(input_image)

#         # Get the predicted class index
#         predicted_class_index = np.argmax(predictions)

#         # Define your class names based on the training order
#         class_names = ["vehicle", "building"]

#         # Get the predicted class name based on the index
#         predicted_class_name = class_names[predicted_class_index]

#         return predicted_class_name

#     return None



