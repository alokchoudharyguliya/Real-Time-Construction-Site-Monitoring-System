# video_stream/views.py
from django.http import StreamingHttpResponse, JsonResponse
from django.views.decorators import gzip
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from .services import VideoCamera, gen
import json

import cv2
import time
# Initialize camera
import numpy as np
camera = VideoCamera()

@gzip.gzip_page
def video_feed(request):
    try:
        return StreamingHttpResponse(gen(camera), 
                        content_type="multipart/x-mixed-replace;boundary=frame")
    except Exception as e:
        print(e)

@csrf_exempt
@api_view(['POST'])
def process_frame(request):
    # For future processing if needed
    data = json.loads(request.body)
    # Process data here if needed
    return JsonResponse({'status': 'processed'})