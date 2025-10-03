# 📚 เอกสาร API

## Store APIs

### Authentication Store (`useAuthStore`)

#### State
```typescript
interface AuthState {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  logoutAndRedirect: () => void;
}
```

#### Methods
- **`login(user)`** - เข้าสู่ระบบผู้ใช้และบันทึกลง localStorage
- **`logout()`** - ล้างเซสชันผู้ใช้
- **`updateUser(updates)`** - อัปเดตข้อมูลโปรไฟล์ผู้ใช้
- **`logoutAndRedirect()`** - ออกจากระบบและเปลี่ยนเส้นทางไปหน้าแรก

### Cart Store (`useCartStore`)

#### State
```typescript
interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  reloadForUser: (email: string | null) => void;
}
```

#### Methods
- **`addItem(product, quantity)`** - เพิ่มสินค้าลงตะกร้า
- **`removeItem(productId)`** - ลบสินค้าออกจากตะกร้า
- **`updateQuantity(productId, quantity)`** - อัปเดตจำนวนสินค้า
- **`clearCart()`** - ล้างตะกร้า
- **`reloadForUser(email)`** - โหลดตะกร้าสำหรับผู้ใช้เฉพาะ

### Products Store (`useProducts`)

#### State
```typescript
interface ProductsState {
  products: Product[];
  filteredProducts: Product[];
  query: string;
  filters: ProductFilters;
  categories: string[];
  brands: string[];
  setQuery: (query: string) => void;
  setFilters: (filters: Partial<ProductFilters>) => void;
  addProduct: (product: AddProductPayload) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  removeProduct: (id: string) => void;
  getCategories: () => string[];
  getBrands: () => string[];
  reloadProducts: () => void;
}
```

#### Methods
- **`setQuery(query)`** - ตั้งค่าคำค้นหา
- **`setFilters(filters)`** - ใช้ตัวกรองสินค้า
- **`addProduct(product)`** - เพิ่มสินค้าใหม่ (แอดมิน)
- **`updateProduct(id, updates)`** - อัปเดตสินค้า (แอดมิน)
- **`removeProduct(id)`** - ลบสินค้า (แอดมิน)
- **`getCategories()`** - รับหมวดหมู่ที่มีอยู่
- **`getBrands()`** - รับแบรนด์ที่มีอยู่
- **`reloadProducts()`** - โหลดสินค้าใหม่จาก localStorage

### Orders Store (`useOrdersStore`)

#### State
```typescript
interface OrdersState {
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'createdAt'>) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  reloadForUser: (email: string | null) => void;
}
```

#### Methods
- **`addOrder(order)`** - สร้างคำสั่งซื้อใหม่
- **`updateOrderStatus(orderId, status)`** - อัปเดตสถานะคำสั่งซื้อ
- **`reloadForUser(email)`** - โหลดคำสั่งซื้อสำหรับผู้ใช้เฉพาะ

## ประเภทข้อมูล

### User
```typescript
interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: 'user' | 'admin';
  avatarUrl?: string;
  addresses: Address[];
  defaultAddressIndex?: number;
}
```

### Product
```typescript
interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
  brand: string;
  rating: number;
  isNew: boolean;
  isSale: boolean;
}
```

### CartItem
```typescript
interface CartItem {
  product: Product;
  quantity: number;
}
```

### Order
```typescript
interface Order {
  id: string;
  items: CartItem[];
  address: Address;
  paymentMethod: PaymentMethod;
  subtotal: number;
  vat: number;
  shipping: number;
  grandTotal: number;
  status: OrderStatus;
  createdAt: string;
}
```

### Address
```typescript
interface Address {
  firstName: string;
  lastName: string;
  address: string;
  subDistrict: string;
  district: string;
  province: string;
  postalCode: string;
  phone: string;
}
```

## คีย์ Local Storage

- **`etech_profiles`** - ข้อมูลโปรไฟล์ผู้ใช้
- **`etech_cart_{email}`** - ข้อมูลตะกร้าสำหรับผู้ใช้เฉพาะ
- **`etech_orders_{email}`** - ข้อมูลคำสั่งซื้อสำหรับผู้ใช้เฉพาะ
- **`etech_products`** - แคตตาล็อกสินค้าทั่วโลก
- **`etech_user`** - เซสชันผู้ใช้ปัจจุบัน

## Props คอมโพเนนต์

### CustomSelect
```typescript
interface CustomSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}
```

### ProductCard
```typescript
interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}
```

### Toast
```typescript
interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  duration?: number;
}
```

## การจัดการข้อผิดพลาด

แอปพลิเคชันมีการจัดการข้อผิดพลาดที่ครอบคลุม:
- **ข้อผิดพลาดเครือข่าย** - การสำรองข้อมูลที่สง่างาม
- **ข้อผิดพลาดการตรวจสอบ** - ข้อความที่เป็นมิตรกับผู้ใช้
- **ข้อผิดพลาดการจัดเก็บ** - การสำรองข้อมูลเป็นค่าเริ่มต้น
- **ข้อผิดพลาดการยืนยันตัวตน** - เปลี่ยนเส้นทางไปหน้าเข้าสู่ระบบ

## การปรับปรุงประสิทธิภาพ

- **Memoization** - React.memo สำหรับคอมโพเนนต์ที่แพง
- **Lazy loading** - การแยกโค้ดสำหรับหน้าแอดมิน
- **การปรับปรุงรูปภาพ** - รูปภาพที่ตอบสนอง
- **การแยก Bundle** - แยก vendor chunks แยกกัน