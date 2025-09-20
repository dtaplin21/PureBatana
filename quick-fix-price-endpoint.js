#!/usr/bin/env node

// Quick fix script - updates only the price endpoint to work with current schema
// This is the fastest solution with lowest risk

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔧 Applying quick fix to price endpoint...');

// Read the current data.js file
const dataJsPath = path.join(__dirname, 'render-backend/src/routes/data.js');
let dataJs = fs.readFileSync(dataJsPath, 'utf8');

// Find the price update endpoint and replace it
const oldPriceEndpoint = `// Update product price (admin endpoint)
router.put('/products/:id/price', async (req, res) => {
  try {
    const { id } = req.params;
    const { price } = req.body;
    
    console.log(\`📝 Price update request - Product ID: \${id}, Price: \${price}\`);
    
    if (!price || isNaN(price)) {
      return res.status(400).json({
        success: false,
        error: 'Valid price is required'
      });
    }
    
    // For now, return success without actually updating the database
    // This will allow the admin panel to work while we debug the database issue
    console.log(\`✅ Price update simulated - Product \${id} price set to \${price} cents\`);
    
    res.json({
      success: true,
      data: {
        id: parseInt(id),
        price: Math.round(price),
        message: 'Price update simulated (database update temporarily disabled)'
      }
    });
    
  } catch (error) {
    console.error('Error updating product price:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update product price',
      details: error.message
    });
  }
});`;

const newPriceEndpoint = `// Update product price (admin endpoint) - Quick Fix Version
router.put('/products/:id/price', async (req, res) => {
  try {
    const { id } = req.params;
    const { price } = req.body;
    
    console.log(\`📝 Price update request - Product ID: \${id}, Price: \${price}\`);
    
    if (!price || isNaN(price)) {
      return res.status(400).json({
        success: false,
        error: 'Valid price is required'
      });
    }
    
    // Quick fix: Use raw SQL with error handling for different schema types
    try {
      // Try integer update first (cents)
      const result = await sql\`
        UPDATE products 
        SET price = \${Math.round(price)}, updated_at = NOW()
        WHERE id = \${parseInt(id)}
        RETURNING *
      \`;
      
      if (result.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Product not found'
        });
      }
      
      console.log(\`✅ Price updated successfully - Product \${id} price set to \${result[0].price}\`);
      
      res.json({
        success: true,
        data: result[0]
      });
      
    } catch (dbError) {
      console.log('⚠️  Integer update failed, trying decimal update:', dbError.message);
      
      // Fallback: Try decimal update (dollars)
      const result = await sql\`
        UPDATE products 
        SET price = \${Math.round(price) / 100}, updated_at = NOW()
        WHERE id = \${parseInt(id)}
        RETURNING *
      \`;
      
      if (result.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Product not found'
        });
      }
      
      console.log(\`✅ Price updated successfully (decimal) - Product \${id} price set to \${result[0].price}\`);
      
      res.json({
        success: true,
        data: result[0]
      });
    }
    
  } catch (error) {
    console.error('Error updating product price:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update product price',
      details: error.message
    });
  }
});`;

// Replace the endpoint
dataJs = dataJs.replace(oldPriceEndpoint, newPriceEndpoint);

// Write the updated file
fs.writeFileSync(dataJsPath, dataJs);

console.log('✅ Quick fix applied!');
console.log('📋 Changes:');
console.log('   - Added fallback logic for both integer and decimal price columns');
console.log('   - Better error handling and logging');
console.log('   - Works with current database schema');
console.log('');
console.log('🚀 Next steps:');
console.log('   1. Commit and push: git add . && git commit -m "Quick fix price endpoint" && git push');
console.log('   2. Test admin panel price updates');
console.log('   3. If still issues, use Option 1 (full schema fix)');
