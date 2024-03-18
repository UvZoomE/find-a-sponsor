// server.js

const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');
const cors = require('cors');

// Load environment variables
dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Set up Express
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

// Multer configuration for file upload
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Route for uploading images
app.post('/upload', upload.single('image'), async (req, res) => {
  try {

    if (!req.body.imageURL) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    if (!req.body.username) {
      return res.status(400).json({ message: 'Username not provided' });
    }

    const username = req.body.username;

    const { imageURL } = req.body;

    // Retrieve all resources (images) from the specified folder
    let resources = await cloudinary.api.resources({
        type: 'upload',
        prefix: `${username}/images`, // Specify the folder path
        max_results: 500 // Adjust max_results if needed
      });
  
      // Loop through each resource and delete it
      for (let resource of resources.resources) {
        await cloudinary.uploader.destroy(resource.public_id);
      }

    // Upload original image to Cloudinary in user's folder
    const result = await cloudinary.uploader.upload(imageURL, {
      folder: `${username}/images`,
      resource_type: 'auto', // auto-detects the type of the resource
      quality: 'auto:best', // set the quality to the best possible
    });

    // Transformations for 200x200
    const transformedImage2 = await cloudinary.uploader.upload(result.secure_url, {
      folder: `${username}/images`,
      width: 200,
      height: 200,
      crop: 'fill',
      quality: 'auto:best', // set the quality to the best possible
    });

    // Transformations for 100x100
    const transformedImage1 = await cloudinary.uploader.upload(result.secure_url, {
      folder: `${username}/images`,
      width: 100,
      height: 100,
      crop: 'fill',
      quality: 'auto:best', // set the quality to the best possible
    });

    res.json({
      original: result.secure_url,
      transformedImage1: transformedImage1.secure_url,
      transformedImage2: transformedImage2.secure_url
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
