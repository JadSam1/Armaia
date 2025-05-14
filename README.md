# ARMAIA Fashion App Homepage

This is an exact 1:1 replica of the ARMAIA fashion app homepage, a luxurious fashion shopping application designed for seamless instant purchases directly inspired by social media.

## Features

- Responsive design that adjusts to different screen sizes
- Modern, elegant UI with a focus on luxury fashion
- Carefully crafted with exact color palette and typography matching the design specifications
- Interactive elements with subtle hover effects
- Feature cards highlighting the app's key benefits
- Animated dropdown menus for navigation items
- TikTok-inspired "For You" page with interactive video content
  - Toggle between Grid and Phone views for different browsing experiences
  - Integrated shopping experience through the "Shop" button

## Setup Instructions

1. Clone or download this repository
2. Save the attached hero image as "hero-image.jpg" in the "images" folder
3. For the "For You" page, add the required thumbnail and profile images (see images/placeholder-info.txt)
4. To add real videos to the "For You" page:
   - Option 1: Run the provided script `videos/download-videos.sh` to download sample videos
   - Option 2: Manually add your own videos (see videos/README.txt for detailed instructions)
5. Open the `index.html` file in a web browser to view the homepage

## Design Specifications

### Color Palette
- Background: #F7F1E8 (Soft off-white)
- Dark navy text/logo: #1A2533
- Dark gray button: #3D3A38
- White card backgrounds: #FFFFFF
- Like button active color: #FF2E55 (red)
- Various pastel purples/pinks/lavenders for the hero image

### Typography
- Clean, elegant sans-serif fonts (Inter)
- Various font weights for hierarchy and emphasis

### Page Sections
- Header with navigation and sign-up button
  - Animated dropdown menu for "Discover" with "For You" and "AI Stylist" options
- Hero section with headline, description, buttons, and feature image
- Features grid showcasing the app's key benefits:
  - AI-Powered Fashion Guidance
  - Seamless Shopping Experience
  - User-Friendly Interface
  - Protected Purchases
- "For You" page:
  - View toggle (Grid/Phone) for different browsing experiences
  - Grid view: 3 videos per row in desktop view
  - Phone view: Full-width videos in TikTok-style scrolling feed
  - Interactive elements (like, comment, share, shop)
  - Creator information beneath each video
  - Shop button that opens product details modal

### Interactive Elements
- Dropdown menus with smooth animation
- Hover effects on buttons and navigation items
- Subtle card hover animations in the features section
- On "For You" page:
  - View toggle buttons (Grid/Phone)
  - Videos autoplay when in view
  - Tap to enable/disable sound
  - Like button with animation and counter
  - Share functionality
  - Shop button that displays product information in a modal
  - Product modal with Buy Now and Add to Cart options

## Project Structure
- `index.html` - Main homepage HTML
- `for-you.html` - TikTok-inspired "For You" page
- `styles.css` - Core styles for the website
- `for-you.css` - Styles specific to the "For You" page
- `for-you.js` - JavaScript for the "For You" page functionality
- `images/` - Directory for images
  - `favicon.svg` - Browser tab icon
  - `hero-image.jpg` - The main hero image
  - Video thumbnails and profile pictures (you need to add these)

## Target Audience

Sophisticated, style-conscious individuals interested in luxury and contemporary fashion. 