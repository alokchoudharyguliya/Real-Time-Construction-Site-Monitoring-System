// components/VideoStream.js
import { useEffect, useRef, useState } from 'react';
// import axios from 'axios';

const VideoStream = () => {
  const videoRef = useRef(null);
  const [isStreaming, setIsStreaming] = useState(true);
  const streamUrl = 'http://localhost:8000/video/video_feed';

  useEffect(() => {
    // Set up video element to display stream
    if (videoRef.current) {
      videoRef.current.src = streamUrl;
    }
  }, []);

  const startStream = async () => {
    try {
      setIsStreaming(true);
      // Additional logic if needed
    } catch (error) {
      console.error('Error starting stream:', error);
    }
  };

  const stopStream = () => {
    setIsStreaming(false);
    // Additional cleanup if needed
  };

  return (
    // <div>
      // {/* <h1>Webcam Stream</h1>
      // <div>
      //   <button onClick={startStream} disabled={isStreaming}>
      //     Start Stream
      //   </button>
      //   <button onClick={stopStream} disabled={!isStreaming}>
      //     Stop Stream
      //   </button>
      // </div> */}
      <div style={{display:'flex',justifyContent:'space-around',alignItems:'center'}} className='h-full'>
        {isStreaming ? (
          <img
            ref={videoRef}
            src={streamUrl}
            alt="Video Stream"
            style={{ alignSelf:'center', height: '100%' }}
          />
        ) : (
          <p>Stream not started</p>
        )}
      </div>
    // </div>
  );
};

export default VideoStream;