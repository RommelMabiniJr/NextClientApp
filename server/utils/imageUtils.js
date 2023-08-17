const fs = require('fs');
const path = require('path');
const db = require('../db');

const sendImage = (res, filename) => {
    const imagePath = path.join(__dirname, 'assets', filename);

    if (!fs.existsSync(imagePath)) {
        return res.status(404).json({ message: 'Image not found' });
    }

    res.setHeader('Content-Type', "image/jpeg");

    const fileStream = fs.createReadStream(imagePath);
    fileStream.pipe(res);
};

// Define a function to retrieve the image path
async function getImagePath(userId) {
    const imageUrl = await db.getProfileURL(userId);
    
    if (!imageUrl) {
      throw new Error('Profile image not found 1');
    }
    
    const imagePath = path.join(path.resolve(__dirname, '..', 'assets'), imageUrl);
    console.log(imagePath);
    
    if (!fs.existsSync(imagePath)) {
      throw new Error('Profile image not found 2');
    }
    
    return imagePath;
  }
  

module.exports = {
    sendImage,
    getImagePath
};