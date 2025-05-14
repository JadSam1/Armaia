#!/bin/bash

# Create directories if they don't exist
mkdir -p videos
mkdir -p images

# Download sample fashion videos from Pexels (free stock videos)
# Note: These videos might not be available in the future, so it's best to find your own

# Fashion Video 1 - Summer outfit
echo "Downloading Fashion Video 1..."
curl -L "https://www.pexels.com/download/video/4934608/" -o videos/fashion-video-1.mp4

# Fashion Video 2 - Office wear
echo "Downloading Fashion Video 2..."
curl -L "https://www.pexels.com/download/video/6519775/" -o videos/fashion-video-2.mp4

# Fashion Video 3 - Accessories
echo "Downloading Fashion Video 3..."
curl -L "https://www.pexels.com/download/video/6975551/" -o videos/fashion-video-3.mp4

# Generate thumbnails using ffmpeg (if available)
echo "Generating thumbnails..."
if command -v ffmpeg &> /dev/null; then
    ffmpeg -i videos/fashion-video-1.mp4 -ss 00:00:02 -frames:v 1 images/video-thumbnail-1.jpg
    ffmpeg -i videos/fashion-video-2.mp4 -ss 00:00:02 -frames:v 1 images/video-thumbnail-2.jpg
    ffmpeg -i videos/fashion-video-3.mp4 -ss 00:00:02 -frames:v 1 images/video-thumbnail-3.jpg
    echo "Thumbnails generated successfully."
else
    echo "FFmpeg not found. Please install FFmpeg or create thumbnails manually."
    echo "You'll need to create thumbnail images for each video named:"
    echo "  - images/video-thumbnail-1.jpg"
    echo "  - images/video-thumbnail-2.jpg"
    echo "  - images/video-thumbnail-3.jpg"
fi

echo "Done! You may need to find different videos if these URLs are no longer valid."
echo "Open for-you.html in your browser to see the videos in action." 