# Quick Start - Admin Panel

## 🚀 Access Admin Panel

1. Start your development server:

   ```bash
   npm run dev
   ```

2. Open your browser and go to:

   ```
   http://localhost:5173/admin
   ```

3. Enter password: `rawae2026`

## 📝 Quick Actions

### Add New Product

1. Click "**+ Add Product**" button
2. Fill in product details
3. Upload image or paste image URL
4. Click "**Add Product**"

### Edit Product

1. Find product in list
2. Click "**Edit**" button
3. Update fields
4. Click "**Update Product**"

### Delete Product

1. Click "**Delete**" button next to product
2. Confirm deletion

### Add Discount

1. Edit product
2. Set "**Discount**" percentage (e.g., 25 for 25% off)
3. Save product
4. Product appears in Special Offers automatically

### Upload Images

**Option 1: File Upload**

- Click "Choose File" under "Product Image"
- Select image from computer
- Image is stored as base64

**Option 2: Image URL**

- Paste URL in "Or enter image URL" field
- Use Imgur, Cloudinary, or similar

## 💾 Backup Your Data

### Export (Backup)

Click "**📥 Export Data**" to download JSON backup

### Import (Restore)

1. Click "**📤 Import Data**"
2. Select your JSON backup file
3. Products are restored

## 🎯 Product Badges

- **In Stock** - Check "In Stock" checkbox
- **NEW** - Check "New Product" checkbox
- **Featured** - Check "Featured" checkbox
- **Discount Badge** - Set discount percentage > 0

## 📊 Homepage Sections

Products automatically appear in sections:

- **Special Offers** → Products with discount > 0
- **Best Sellers** → Products with soldCount > 50
- **New Arrivals** → Products marked as "New"
- **Featured** → Products marked as "Featured"

## 🔐 Change Password

Edit `src/components/AdminLogin.jsx` line 4:

```javascript
const ADMIN_PASSWORD = "your-new-password";
```

## ⚠️ Important Notes

- Data stored in **browser localStorage** only
- **Export regularly** to backup your products
- Clearing browser data will delete products
- Each browser/device has separate data

## 🆘 Need Help?

See full documentation in **ADMIN_GUIDE.md**
