#!/bin/bash

# Pure Batana Price Update Script
# Usage: ./update-price.sh <product-id> <new-price>
# Example: ./update-price.sh 1 34.95

if [ $# -ne 2 ]; then
    echo "Usage: $0 <product-id> <new-price>"
    echo "Example: $0 1 34.95"
    echo ""
    echo "Current products:"
    curl -s https://purebatana.onrender.com/api/products | jq '.data[] | {id: .id, name: .name, price: .price}'
    exit 1
fi

PRODUCT_ID=$1
NEW_PRICE=$2

echo "Updating product $PRODUCT_ID to price $NEW_PRICE..."

# Convert price to cents for the API
PRICE_IN_CENTS=$(echo "$NEW_PRICE * 100" | bc)

# Update the price via API
RESPONSE=$(curl -s -X PUT "https://purebatana.onrender.com/api/products/$PRODUCT_ID/price" \
  -H "Content-Type: application/json" \
  -d "{\"price\": $PRICE_IN_CENTS}")

echo "Response: $RESPONSE"

# Verify the update
echo ""
echo "Updated product:"
curl -s "https://purebatana.onrender.com/api/products/$PRODUCT_ID" | jq '.data | {id: .id, name: .name, price: .price}'
