# Admin Panel Guide - Rawae Cosmatics

## Accessing the Admin Panel

To access the admin panel, navigate to:

```
http://localhost:5173/admin
```

**Default Login Password:** `rawae2026`

⚠️ **Important:** Change the password in `src/components/AdminLogin.jsx` before deploying!

## Features

### 1. Product Management

- **Add Products** - Create new products with all details
- **Edit Products** - Update existing product information
- **Delete Products** - Remove products from the catalog
- **Search Products** - Quickly find products by name or brand

### 2. Product Fields

When adding/editing products, you can manage:

- **Basic Info:** Name, Brand, Description
- **Category:** Select category and subcategory
- **Pricing:** Base price and discount percentage
- **Images:** Upload images or use image URLs
- **Features:** Add multiple product features (bullet points)
- **Inventory:** Track sold count and stock status
- **Badges:** Mark products as New, Featured, or In Stock
- **Gift:** Add optional gift items with images

### 3. Data Management

#### Export Products

- Click **Export Data** to download all products as JSON
- Backup file is saved as `rawae-products-[timestamp].json`
- Use this for backups or to edit bulk data

#### Import Products

- Click **Import Data** to upload a JSON file
- Must be valid JSON array of products
- Useful for restoring backups or bulk updates

#### Reset to Default

- Click **Reset to Default** to restore original products
- ⚠️ This will delete all custom products!

## How It Works

### Data Storage

- All product data is stored in **browser localStorage**
- Data persists across page refreshes
- Data is local to each browser/device
- No backend or database required

### Image Uploads

You have two options for product images:

1. **File Upload:** Upload image files directly (stored as base64)
2. **URL:** Paste image URL from any hosting service

Recommended: Use image hosting services like:

- Imgur
- Cloudinary
- Your own web hosting

### Discount System

- Enter discount as percentage (0-100)
- Discounted price is automatically calculated
- Products with discount > 0 show discount badge
- Appear in "Special Offers" section on homepage

### Product Visibility

- **Best Sellers:** Products with soldCount > 50
- **New Arrivals:** Products with isNew = true
- **Featured:** Products with isFeatured = true
- **Special Offers:** Products with discount > 0

## Managing Discounts

1. Edit any product
2. Set the **Discount** field (e.g., 20 for 20% off)
3. Save the product
4. Product will automatically appear in Special Offers section

## Tips

### Organizing Products

- Use clear, descriptive names
- Keep brand names consistent
- Add detailed features for better customer information
- Use high-quality images

### Pricing Strategy

- Set competitive base prices
- Use discounts strategically for promotions
- Track sold count to identify best sellers

### Stock Management

- Uncheck "In Stock" for out-of-stock items
- Customers can register interest for out-of-stock products
- Update stock status regularly

## Troubleshooting

### Lost Data?

- Data is stored in browser localStorage
- Clearing browser data will delete products
- Always keep recent JSON exports as backups

### Can't Login?

- Default password: `rawae2026`
- Check browser console for errors
- Clear localStorage if needed: `localStorage.removeItem('rawae_admin_auth')`

### Products Not Showing?

- Check that products are marked "In Stock"
- Verify category/subcategory selections
- Refresh the main page

## Security Notes

### For Production:

1. **Change the default password** in `src/components/AdminLogin.jsx`
2. Consider adding proper authentication (e.g., Firebase Auth)
3. Regular backups using Export function
4. Protect the `/admin` route with server-side authentication

### Password Change:

Edit `src/components/AdminLogin.jsx` line 4:

```javascript
const ADMIN_PASSWORD = "YOUR_NEW_PASSWORD_HERE";
```

## Data Backup Schedule

Recommended backup routine:

- **Daily:** If adding/editing many products
- **Weekly:** For active catalogs
- **Before bulk changes:** Always export before import/reset

## Support

For issues or questions:

- Check browser console for error messages
- Verify all required fields are filled
- Test in latest Chrome/Firefox
- Keep JSON exports for data recovery
