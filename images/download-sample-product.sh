#!/bin/bash

# Create directory if it doesn't exist
mkdir -p images

# Download a sample summer dress image from Unsplash or similar sources
echo "Downloading sample product image..."
curl -L "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=600" -o images/product-1.jpg

echo "Sample product image downloaded to images/product-1.jpg"
echo "This will be shown when clicking the Shop button on the first video." 