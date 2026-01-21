# Quick Start Guide - Lynos Sweets

## 🚀 Get Running in 5 Minutes

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Set Up Database
```bash
# Generate Prisma client
npm run db:generate

# Create database tables
npm run db:migrate
```

### Step 3: Create Admin User (Choose One Method)

**Method A: Using Prisma Studio (Easiest)**
```bash
npx prisma studio
```
- Opens a web interface at http://localhost:5555
- Go to "User" table
- Click "Add record"
- Fill in:
  - email: `admin@lynossweets.com`
  - name: `Admin User`
  - passwordHash: Use an online bcrypt generator to hash `admin123` (or your preferred password)
    - Visit: https://bcrypt-generator.com/
    - Enter password: `admin123`
    - Copy the hash (starts with $2a$ or $2b$)
  - role: Select `ADMIN`
  - isActive: Check the box
- Click "Save 1 change"

**Method B: Using SQL (Advanced)**
```bash
# Install bcryptjs globally or use online tool
# Then run SQL:
sqlite3 prisma/dev.db "INSERT INTO User (email, name, \"passwordHash\", role, \"isActive\", \"createdAt\", \"updatedAt\") VALUES ('admin@lynossweets.com', 'Admin User', '<bcrypt-hash-here>', 'ADMIN', 1, datetime('now'), datetime('now'));"
```

### Step 4: Start Development Server
```bash
npm run dev
```

### Step 5: Access the Application
- **Public Website**: http://localhost:3000
- **Admin Login**: http://localhost:3000/admin/login
  - Email: `admin@lynossweets.com`
  - Password: `admin123` (or whatever you set)

## 🎯 What You Can Do Now

### Public Website
- View the beautiful homepage showcasing cookies
- See product listings (add products via admin panel)

### Admin Panel Features
1. **Dashboard** (`/admin`)
   - View statistics (products, sales, revenue, margins)
   - See top-selling products
   - Quick access to all sections

2. **Manage Products** (`/admin/products`)
   - Add new cookies/bakery items
   - Edit existing products
   - Delete products
   - Set featured products

3. **Manage Users** (`/admin/users`)
   - View all users and admins
   - Add new users/admins
   - Edit user details
   - Activate/deactivate accounts

4. **Track Sales** (`/admin/sales`)
   - Record new sales
   - View sales history
   - See revenue, cost, and margin calculations

## 📝 Adding Sample Products

After logging in as admin:
1. Go to `/admin/products`
2. Click "+ Add Product"
3. Fill in product details:
   - Name: Chocolate Chip Cookies
   - Description: Classic chocolate chip cookies
   - Price: 8.99
   - Cost: 3.50
   - Category: Cookies
   - Check "Featured" if you want it on homepage
4. Click "Save"

Repeat for more products!

## 🐛 Troubleshooting

**Database not found?**
```bash
npm run db:migrate
```

**Can't login?**
- Make sure you created the admin user correctly
- Check that role is set to `ADMIN`
- Verify passwordHash is a valid bcrypt hash

**Port already in use?**
```bash
PORT=3001 npm run dev
```

## 🚢 Ready to Deploy?

See the main README.md for deployment instructions to Vercel, Railway, or your own server!
