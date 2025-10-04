# E-Tech Store Component Guide

Complete guide to all components in the E-Tech Store Frontend.

## Table of Contents

- [Core Components](#core-components)
- [Page Components](#page-components)
- [State Management](#state-management)
- [Styling Guide](#styling-guide)
- [Usage Examples](#usage-examples)

## Core Components

### Navbar

The main navigation component with search functionality and user authentication status.

**Props:**
- None (uses global state)

**Features:**
- Responsive design
- Search input with real-time filtering
- User authentication status
- Shopping cart indicator
- Mobile menu toggle

**Usage:**
```tsx
import Navbar from './components/Navbar';

function App() {
  return (
    <div>
      <Navbar />
      {/* Your content */}
    </div>
  );
}
```

### ProductCard

Displays product information in a card format.

**Props:**
```tsx
interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
    category: string;
    brand: string;
    stockQuantity: number;
    isActive: boolean;
  };
  onAddToCart?: (productId: string, quantity: number) => void;
  showAddButton?: boolean;
}
```

**Usage:**
```tsx
import ProductCard from './components/ProductCard';

function ProductList() {
  const products = useProducts(state => state.products);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map(product => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={(id, qty) => addToCart(id, qty)}
        />
      ))}
    </div>
  );
}
```

### CustomSelect

A custom dropdown component with search functionality.

**Props:**
```tsx
interface CustomSelectProps {
  options: Array<{ value: string; label: string }>;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  allowCustomInput?: boolean;
}
```

**Usage:**
```tsx
import CustomSelect from './components/CustomSelect';

function FilterComponent() {
  const [selectedCategory, setSelectedCategory] = useState('');
  
  const categoryOptions = [
    { value: '', label: 'All Categories' },
    { value: 'mobile', label: 'Mobile' },
    { value: 'laptop', label: 'Laptop' }
  ];
  
  return (
    <CustomSelect
      options={categoryOptions}
      value={selectedCategory}
      onChange={setSelectedCategory}
      placeholder="Select category..."
    />
  );
}
```

### HeroBanner

The main hero section for the homepage.

**Props:**
- None (static content)

**Features:**
- Responsive design
- Call-to-action buttons
- Gradient background
- Animated elements

**Usage:**
```tsx
import HeroBanner from './components/HeroBanner';

function HomePage() {
  return (
    <div>
      <HeroBanner />
      {/* Other content */}
    </div>
  );
}
```

### EmptyState

Displays when there's no content to show.

**Props:**
```tsx
interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
}
```

**Usage:**
```tsx
import EmptyState from './components/EmptyState';

function EmptyCart() {
  return (
    <EmptyState
      title="Your cart is empty"
      description="Add some products to get started"
      action={{
        label: "Start Shopping",
        onClick: () => navigate('/search')
      }}
    />
  );
}
```

### SkeletonCard

Loading placeholder for product cards.

**Props:**
```tsx
interface SkeletonCardProps {
  count?: number;
}
```

**Usage:**
```tsx
import SkeletonCard from './components/SkeletonCard';

function LoadingProducts() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <SkeletonCard count={6} />
    </div>
  );
}
```

### Toast

Notification component for user feedback.

**Props:**
```tsx
interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onClose?: () => void;
}
```

**Usage:**
```tsx
import { useToast } from './store/toast';

function MyComponent() {
  const { showToast } = useToast();
  
  const handleSuccess = () => {
    showToast('Product added to cart!', 'success');
  };
  
  return (
    <button onClick={handleSuccess}>
      Add to Cart
    </button>
  );
}
```

## Page Components

### Search

Product search and filtering page.

**Features:**
- Search input with real-time filtering
- Category and brand filters
- Price range filters
- Sort options
- Responsive grid layout
- Mobile drawer for filters

**State Management:**
- Uses `useProducts` store for product data
- Uses `useSearchParams` for URL state management

### ProductDetail

Individual product detail page.

**Features:**
- Product image gallery
- Product information display
- Add to cart functionality
- Related products
- Product reviews (if implemented)

**State Management:**
- Uses `useProducts` store for product data
- Uses `useCart` store for cart operations

### Cart

Shopping cart page.

**Features:**
- Cart items display
- Quantity updates
- Remove items
- Price calculations
- Checkout button
- Empty state

**State Management:**
- Uses `useCart` store for cart data
- Uses `useAuth` store for user authentication

### Checkout

Order checkout page.

**Features:**
- Order summary
- Shipping address form
- Payment method selection
- Order confirmation
- Form validation

**State Management:**
- Uses `useCart` store for cart data
- Uses `useOrders` store for order creation
- Uses `useAuth` store for user data

### Profile

User profile management page.

**Features:**
- Profile information display
- Profile editing
- Avatar upload
- Address management
- Password change

**State Management:**
- Uses `useAuth` store for user data
- Uses `useAuth` store for profile updates

### AdminDashboard

Admin dashboard for store management.

**Features:**
- Store statistics
- Order management
- Product management
- User management
- Reports and analytics

**State Management:**
- Uses `useAdmin` store for admin data
- Uses `useAuth` store for authentication

## State Management

### Auth Store (`store/auth.ts`)

Manages user authentication and profile data.

**State:**
```tsx
interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}
```

**Actions:**
- `login(email, password)`
- `register(userData)`
- `logout()`
- `updateUser(userData)`
- `loadUser()`

### Products Store (`store/products.ts`)

Manages product data and filtering.

**State:**
```tsx
interface ProductsState {
  products: Product[];
  loading: boolean;
  error: string | null;
  query: string;
  filters: FilterState;
  categories: string[];
  brands: string[];
}
```

**Actions:**
- `fetchProducts()`
- `setQuery(query)`
- `setFilters(filters)`
- `clearAllFilters()`
- `fetchCategories()`
- `fetchBrands()`

### Cart Store (`store/cart.ts`)

Manages shopping cart state.

**State:**
```tsx
interface CartState {
  items: CartItem[];
  loading: boolean;
  error: string | null;
}
```

**Actions:**
- `addToCart(productId, quantity)`
- `updateQuantity(itemId, quantity)`
- `removeFromCart(itemId)`
- `clearCart()`
- `fetchCart()`

### Orders Store (`store/orders.ts`)

Manages order data and operations.

**State:**
```tsx
interface OrdersState {
  orders: Order[];
  loading: boolean;
  error: string | null;
}
```

**Actions:**
- `fetchOrders()`
- `createOrder(orderData)`
- `updateOrderStatus(orderId, status)`
- `fetchOrderById(orderId)`

## Styling Guide

### Tailwind CSS Classes

#### Layout
```tsx
// Container
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

// Grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

// Flexbox
<div className="flex items-center justify-between">
```

#### Colors
```tsx
// Primary colors
<div className="bg-blue-600 text-white">
<div className="text-blue-600">
<div className="border-blue-200">

// Status colors
<div className="bg-green-100 text-green-800"> // Success
<div className="bg-red-100 text-red-800">     // Error
<div className="bg-yellow-100 text-yellow-800"> // Warning
```

#### Typography
```tsx
// Headings
<h1 className="text-4xl font-bold text-gray-900">
<h2 className="text-2xl font-semibold text-gray-800">
<h3 className="text-lg font-medium text-gray-700">

// Body text
<p className="text-base text-gray-600">
<p className="text-sm text-gray-500">
```

#### Spacing
```tsx
// Padding
<div className="p-4">        // 16px
<div className="px-6 py-4">  // 24px horizontal, 16px vertical

// Margin
<div className="mt-4 mb-2">  // 16px top, 8px bottom
<div className="mx-auto">    // Center horizontally
```

#### Responsive Design
```tsx
// Mobile first
<div className="w-full md:w-1/2 lg:w-1/3">

// Hide/show on different screens
<div className="hidden md:block">  // Hidden on mobile, visible on tablet+
<div className="md:hidden">        // Visible on mobile, hidden on tablet+
```

### Custom CSS Classes

#### Component-specific styles
```css
/* Product card hover effect */
.product-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

/* Custom button styles */
.btn-primary {
  @apply bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors;
}

/* Loading animation */
.loading-spinner {
  @apply animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600;
}
```

## Usage Examples

### Creating a New Page

```tsx
import { useState, useEffect } from 'react';
import { useProducts } from '../store/products';
import ProductCard from '../components/ProductCard';
import CustomSelect from '../components/CustomSelect';

function NewPage() {
  const { products, fetchProducts, setFilters } = useProducts();
  const [selectedCategory, setSelectedCategory] = useState('');
  
  useEffect(() => {
    fetchProducts();
  }, []);
  
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setFilters({ category: category || undefined });
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">New Page</h1>
      
      <div className="mb-6">
        <CustomSelect
          options={[
            { value: '', label: 'All Categories' },
            { value: 'mobile', label: 'Mobile' }
          ]}
          value={selectedCategory}
          onChange={handleCategoryChange}
          placeholder="Select category..."
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(product => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}
      </div>
    </div>
  );
}

export default NewPage;
```

### Creating a Custom Component

```tsx
import { useState } from 'react';

interface CustomButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

function CustomButton({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'md',
  disabled = false 
}: CustomButtonProps) {
  const baseClasses = 'font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500'
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };
  
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';
  
  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export default CustomButton;
```

This component guide provides comprehensive information about all components in the E-Tech Store Frontend. Use it as a reference when developing new features or modifying existing ones.
