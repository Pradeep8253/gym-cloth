const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env' });

// Define paths
const sourceDir = 'C:\\Users\\prade\\.gemini\\antigravity-ide\\brain\\867547c1-2513-400a-b187-14bc958fbb8e';
const targetDir = path.join(__dirname, '..', 'public', 'images', 'products');

// Create target directory if it doesn't exist
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// Image mapping based on product names
const productImages = {
  "Men Gym T-Shirt": "tshirt_men_1790164731976.jpg",
  "Women Running Shorts": "shorts_women_1790164747528.jpg",
  "Unisex Football Hoodie": "hoodie_football_1790165043098.jpg",
  "Men Basketball Joggers": "joggers_basketball_1790165057651.jpg",
  "Women Tennis Accessories": "tennis_accessories_1790165070636.jpg",
  "Pro Training T-Shirt": "pro_tshirt_1790165083825.jpg"
};

// Mongoose Schema
const productSchema = new mongoose.Schema({
  name: String,
  image: String
}, { strict: false });

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

async function updateImages() {
  try {
    console.log('Connecting to MongoDB...');
    const opts = { dbName: process.env.MONGODB_DB_NAME || 'gym-cloth' };
    await mongoose.connect(process.env.MONGODB_URI, opts);
    console.log('Connected to MongoDB');

    for (const [productName, fileName] of Object.entries(productImages)) {
      const sourcePath = path.join(sourceDir, fileName);
      // Clean filename for the public directory (remove timestamp)
      const cleanFileName = fileName.replace(/_\d+\.jpg$/, '.jpg');
      const targetPath = path.join(targetDir, cleanFileName);

      // Copy file
      if (fs.existsSync(sourcePath)) {
        fs.copyFileSync(sourcePath, targetPath);
        console.log(`Copied ${fileName} to ${targetPath}`);
        
        // Update Database
        const product = await Product.findOne({ name: productName });
        if (product) {
          product.image = `/images/products/${cleanFileName}`;
          await product.save();
          console.log(`Updated DB for ${productName} with image /images/products/${cleanFileName}`);
        } else {
          console.log(`Product ${productName} not found in DB`);
        }
      } else {
        console.error(`Source file not found: ${sourcePath}`);
      }
    }

    console.log('Update complete!');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

updateImages();
