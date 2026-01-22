# Admin Panel - Architecture Overview

## 🏗️ File Structure

```
src/
├── components/
│   ├── AdminPanel.jsx       ← Main admin dashboard
│   ├── AdminLogin.jsx       ← Login page with password
│   ├── ProductForm.jsx      ← Form for add/edit products
│   ├── HomePage.jsx         ← Updated to use dynamic products
│   ├── ProductList.jsx      ← Updated to use dynamic products
│   └── ProductDetail.jsx    ← Updated to use dynamic products
│
├── contexts/
│   ├── ProductContext.jsx   ← NEW: Product state management
│   └── CartContext.jsx      ← Existing cart context
│
├── hooks/
│   └── useProducts.js       ← NEW: Product CRUD operations
│
└── data/
    └── products.js          ← Default/initial products

Root Files:
├── ADMIN_GUIDE.md           ← Full documentation
└── ADMIN_QUICKSTART.md      ← Quick reference
```

## 🔄 Data Flow

```
┌─────────────────────────────────────────────────┐
│           Browser localStorage                   │
│         'rawae_products': [...]                  │
└────────────┬────────────────────┬────────────────┘
             │                    │
             ↓                    ↑
    ┌────────────────┐   ┌────────────────┐
    │  useProducts   │   │  ProductForm   │
    │     Hook       │   │   (Add/Edit)   │
    └────────┬───────┘   └────────┬───────┘
             │                    │
             ↓                    ↑
    ┌────────────────────────────────────┐
    │       ProductContext               │
    │  - products[]                      │
    │  - addProduct()                    │
    │  - updateProduct()                 │
    │  - deleteProduct()                 │
    │  - exportProducts()                │
    │  - importProducts()                │
    └────────┬───────────────────────────┘
             │
             ├──→ HomePage (displays products)
             ├──→ ProductList (filters products)
             ├──→ ProductDetail (shows details)
             └──→ AdminPanel (manages products)
```

## 🚪 Route Logic

```
User visits site
     ↓
Is path = "/admin"?
     │
     ├─ NO → Regular Site
     │        ├─ HomePage
     │        ├─ Category Pages
     │        └─ Product Pages
     │
     └─ YES → Admin Mode
              ↓
         Is logged in?
              │
              ├─ NO → AdminLogin
              │        (check password)
              │
              └─ YES → AdminPanel
                       ├─ Product List
                       ├─ Add Product
                       ├─ Edit Product
                       ├─ Export/Import
                       └─ Stats Dashboard
```

## 🔐 Authentication Flow

```
┌──────────────┐
│ Visit /admin │
└──────┬───────┘
       ↓
┌─────────────────────────┐
│ Check localStorage:      │
│ 'rawae_admin_auth'       │
└─────┬──────────────┬────┘
      │              │
   Found?         Not Found?
      │              │
      ↓              ↓
┌──────────┐   ┌──────────────┐
│  Admin   │   │ AdminLogin   │
│  Panel   │   │ Show password│
└──────────┘   └──────┬───────┘
                      │
                Password = 'rawae2026'?
                      │
                    YES → Set localStorage
                      │   → Show AdminPanel
                      │
                     NO → Show error
```

## 💾 Data Persistence Strategy

### Initial Load

1. App starts → ProductProvider loads
2. Check localStorage for 'rawae_products'
3. If found → Use stored products
4. If not found → Use defaults from `products.js` → Save to localStorage

### Product Changes (Add/Edit/Delete)

1. User makes change in AdminPanel
2. ProductForm validates data
3. useProducts hook updates state
4. State saved to localStorage
5. All components re-render with new data

### Data Backup/Restore

- **Export:** Read from localStorage → Download as JSON
- **Import:** Upload JSON → Validate → Save to localStorage
- **Reset:** Load defaults from `products.js` → Save to localStorage

## 🎨 Component Responsibilities

### AdminPanel.jsx

- Main dashboard layout
- Product list table with stats
- Action buttons (Add, Export, Import, Reset)
- Search and filter functionality
- Navigation between views (list/add/edit)

### AdminLogin.jsx

- Password input form
- Authentication check
- localStorage auth token management
- Error handling

### ProductForm.jsx

- Reusable form for Add/Edit
- All product field inputs
- Dynamic category/subcategory dropdowns
- Image upload (file or URL)
- Features list management
- Form validation

### ProductContext.jsx

- Provides products to all components
- Wraps App with provider
- Makes CRUD methods available

### useProducts.js (Hook)

- Manages localStorage operations
- CRUD functions (Create, Read, Update, Delete)
- Import/Export functionality
- Default product initialization

## 📱 Admin Panel Features

### Dashboard Stats

- Total Products count
- In Stock count
- On Sale count (discount > 0)
- Featured count

### Product Table Columns

- Image preview
- Product name & brand
- Category
- Price
- Discount badge
- Status badges (Stock/New/Featured)
- Action buttons (Edit/Delete)

### Form Fields

- Text: Name, Brand, Description
- Dropdowns: Category, Subcategory
- Numbers: Base Price, Discount %, Sold Count
- Dynamic List: Features (add/remove)
- File/URL: Product Image
- Text: Gift Name, Gift Image
- Checkboxes: In Stock, New, Featured

## 🔍 Product Filtering Logic

### Homepage Sections

```javascript
Special Offers  = products.filter(p => p.discount > 0)
Best Sellers    = products.filter(p => p.soldCount > 50).sort(by soldCount)
New Arrivals    = products.filter(p => p.isNew)
Featured        = products.filter(p => p.isFeatured)
```

### Search

- Searches in: Product name, Brand name
- Case-insensitive
- Real-time filtering

## 🚀 Deployment Checklist

Before deploying:

- [ ] Change default password in AdminLogin.jsx
- [ ] Export current products as backup
- [ ] Test all CRUD operations
- [ ] Verify image URLs are accessible
- [ ] Test on production domain
- [ ] Document password in secure location

## 🔧 Customization Options

### Change Password

Edit `src/components/AdminLogin.jsx`:

```javascript
const ADMIN_PASSWORD = "your-secret-password";
```

### Change Admin Route

Edit `src/App.jsx`:

```javascript
if (path === '/your-custom-admin-path')
```

### Change Storage Key

Edit `src/hooks/useProducts.js`:

```javascript
const STORAGE_KEY = "your_custom_key";
```

### Styling

All components use Tailwind CSS classes - easy to customize colors and layout.
