# E-Tech Store Frontend

A modern, responsive e-commerce frontend built with React, TypeScript, Vite, and Tailwind CSS.

## 🚀 Features

- **Modern UI/UX**: Clean, responsive design with Tailwind CSS
- **Product Catalog**: Browse products with search and filtering
- **Shopping Cart**: Add to cart, update quantities, and checkout
- **User Authentication**: Login, register, and profile management
- **Order Management**: View order history and track orders
- **Admin Dashboard**: Complete admin panel for store management
- **Responsive Design**: Mobile-first approach
- **State Management**: Zustand for efficient state management
- **Type Safety**: Full TypeScript support

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Backend API running (see [Backend Repository](https://github.com/tiw25999/BDnode))

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/tiw25999/FDreact.git
   cd FDreact
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp env.example .env
   ```
   
   Fill in your environment variables in `.env`:
   ```env
   VITE_API_BASE_URL=https://etech-backend.onrender.com/api
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:3000`

## 🚀 Running the Application

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm run preview
```

### Production Server
```bash
npm run build:prod
npm start
```

## 📁 Project Structure

```
FDreact/
├── public/                 # Static assets
├── src/
│   ├── components/        # Reusable components
│   │   ├── AuthLayout.tsx
│   │   ├── CategoryChips.tsx
│   │   ├── CustomSelect.tsx
│   │   ├── EmptyState.tsx
│   │   ├── HeroBanner.tsx
│   │   ├── Navbar.tsx
│   │   ├── ProductCard.tsx
│   │   ├── SkeletonCard.tsx
│   │   └── Toast.tsx
│   ├── pages/            # Page components
│   │   ├── Addresses.tsx
│   │   ├── AdminDashboard.tsx
│   │   ├── AdminOrders.tsx
│   │   ├── AdminReports.tsx
│   │   ├── AdminUsers.tsx
│   │   ├── Cart.tsx
│   │   ├── Checkout.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Login.tsx
│   │   ├── OrderDetail.tsx
│   │   ├── Orders.tsx
│   │   ├── ProductDetail.tsx
│   │   ├── ProductsAdmin.tsx
│   │   ├── Profile.tsx
│   │   ├── Register.tsx
│   │   └── Search.tsx
│   ├── store/            # State management
│   │   ├── admin.ts
│   │   ├── auth.ts
│   │   ├── cart.ts
│   │   ├── orders.ts
│   │   └── products.ts
│   ├── utils/            # Utility functions
│   │   ├── apiClient.ts
│   │   └── categoryTranslator.ts
│   ├── config/           # Configuration
│   │   └── env.ts
│   ├── App.tsx           # Main app component
│   ├── main.tsx          # Entry point
│   └── index.css         # Global styles
├── docs/                 # Documentation
├── server.js            # Express server for production
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

## 🎨 UI Components

### Core Components

#### Navbar
- Responsive navigation bar
- Search functionality
- User authentication status
- Shopping cart indicator

#### ProductCard
- Product image display
- Product information
- Add to cart functionality
- Price display with formatting

#### CustomSelect
- Custom dropdown component
- Search functionality
- Keyboard navigation
- Custom styling

#### HeroBanner
- Homepage hero section
- Call-to-action buttons
- Responsive design

### Page Components

#### Search
- Product search and filtering
- Category and brand filters
- Price range filters
- Sort options
- Responsive grid layout

#### ProductDetail
- Product image gallery
- Product information
- Add to cart functionality
- Related products

#### Cart
- Shopping cart items
- Quantity updates
- Remove items
- Price calculations
- Checkout button

#### Checkout
- Order summary
- Shipping address form
- Payment method selection
- Order confirmation

#### Admin Dashboard
- Store statistics
- Order management
- Product management
- User management
- Reports and analytics

## 🔧 State Management

### Zustand Stores

#### Auth Store (`auth.ts`)
- User authentication state
- Login/logout functionality
- Profile management
- Token management

#### Products Store (`products.ts`)
- Product data management
- Search and filtering
- Category and brand data
- Caching

#### Cart Store (`cart.ts`)
- Shopping cart state
- Add/remove items
- Quantity updates
- Price calculations

#### Orders Store (`orders.ts`)
- Order history
- Order details
- Order status tracking

#### Admin Store (`admin.ts`)
- Admin dashboard data
- User management
- Order management
- Analytics

## 🎨 Styling

### Tailwind CSS
- Utility-first CSS framework
- Responsive design
- Custom color palette
- Component-based styling

### Custom Styles
- Global styles in `index.css`
- Component-specific styles
- Responsive breakpoints
- Dark mode support

## 🔌 API Integration

### API Client (`utils/apiClient.ts`)
- Axios-based HTTP client
- Request/response interceptors
- Error handling
- Token management

### Endpoints
- Authentication: `/api/auth/*`
- Products: `/api/products/*`
- Cart: `/api/cart/*`
- Orders: `/api/orders/*`
- Admin: `/api/admin/*`

## 📱 Responsive Design

### Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

### Mobile Features
- Touch-friendly interface
- Swipe gestures
- Mobile-optimized forms
- Responsive navigation

## 🚀 Deployment

### Render (Recommended)

1. Connect your GitHub repository to Render
2. Create a new Web Service
3. Set build command: `npm install && npm run build:prod`
4. Set start command: `npm start`
5. Add environment variables
6. Deploy!

### Other Platforms

- **Vercel**: Static site deployment
- **Netlify**: Static site deployment
- **Heroku**: Web service deployment

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API URL | http://localhost:5001/api |

### Build Configuration

#### Vite Config
- TypeScript support
- React plugin
- Path aliases
- Environment variables

#### Tailwind Config
- Custom color palette
- Responsive breakpoints
- Component classes
- Dark mode support

## 🧪 Testing

```bash
# Run tests (if configured)
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## 📦 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:prod` - Build for production with API URL
- `npm run preview` - Preview production build
- `npm start` - Start production server
- `npm run deploy` - Deploy to production

## 🔒 Security Features

- **CORS**: Configured for backend communication
- **Input Validation**: Form validation and sanitization
- **XSS Protection**: Content Security Policy
- **CSRF Protection**: Token-based protection
- **Secure Headers**: Security headers configuration

## 📊 Performance

### Optimization Features
- **Code Splitting**: Lazy loading of components
- **Image Optimization**: Optimized image loading
- **Bundle Optimization**: Tree shaking and minification
- **Caching**: API response caching
- **Lazy Loading**: Component lazy loading

### Performance Metrics
- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Cumulative Layout Shift (CLS)
- First Input Delay (FID)

## 🌐 Internationalization

### Multi-language Support
- English (default)
- Thai language support
- Category translation
- Localized content

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@etech.com or create an issue in the repository.

## 🔗 Links

- [Backend Repository](https://github.com/tiw25999/BDnode)
- [Live Demo](https://etech-store.onrender.com)
- [API Documentation](https://etech-backend.onrender.com/api/docs)

---

**E-Tech Store Frontend** - Built with ❤️ by the E-Tech Team