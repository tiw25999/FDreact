# E-Tech Store Frontend

Frontend e-commerce ที่ทันสมัยและตอบสนอง สร้างด้วย React, TypeScript, Vite และ Tailwind CSS

## 🚀 ฟีเจอร์

- **UI/UX ที่ทันสมัย**: การออกแบบที่สะอาดและตอบสนองด้วย Tailwind CSS
- **แคตาล็อกสินค้า**: เรียกดูสินค้าพร้อมการค้นหาและกรอง
- **ตะกร้าสินค้า**: เพิ่มลงตะกร้า, อัปเดตจำนวน และชำระเงิน
- **การยืนยันตัวตนผู้ใช้**: เข้าสู่ระบบ, ลงทะเบียน และจัดการโปรไฟล์
- **การจัดการคำสั่งซื้อ**: ดูประวัติคำสั่งซื้อและติดตามคำสั่งซื้อ
- **แดชบอร์ดแอดมิน**: แผงควบคุมแอดมินที่สมบูรณ์สำหรับการจัดการร้าน
- **การออกแบบที่ตอบสนอง**: แนวทาง mobile-first
- **การจัดการ State**: Zustand สำหรับการจัดการ state ที่มีประสิทธิภาพ
- **Type Safety**: รองรับ TypeScript อย่างเต็มรูปแบบ

## 📋 ข้อกำหนดเบื้องต้น

- Node.js (v18 หรือสูงกว่า)
- npm หรือ yarn
- Backend API ที่ทำงานอยู่ (ดู [Backend Repository](https://github.com/tiw25999/BDnode))

## 🛠️ การติดตั้ง

1. **Clone repository**
   ```bash
   git clone https://github.com/tiw25999/FDreact.git
   cd FDreact
   ```

2. **ติดตั้ง dependencies**
   ```bash
   npm install
   ```

3. **ตั้งค่า Environment**
   ```bash
   cp env.example .env
   ```
   
   กรอกข้อมูล environment variables ใน `.env`:
   ```env
   VITE_API_BASE_URL=https://etech-backend.onrender.com/api
   ```

4. **เริ่มเซิร์ฟเวอร์ development**
   ```bash
   npm run dev
   ```

แอปพลิเคชันจะพร้อมใช้งานที่ `http://localhost:3000`

## 🚀 การรันแอปพลิเคชัน

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

## 📁 โครงสร้างโปรเจค

```
FDreact/
├── public/                 # ไฟล์ static
├── src/
│   ├── components/        # Components ที่ใช้ซ้ำได้
│   │   ├── AuthLayout.tsx
│   │   ├── CategoryChips.tsx
│   │   ├── CustomSelect.tsx
│   │   ├── EmptyState.tsx
│   │   ├── HeroBanner.tsx
│   │   ├── Navbar.tsx
│   │   ├── ProductCard.tsx
│   │   ├── SkeletonCard.tsx
│   │   └── Toast.tsx
│   ├── pages/            # หน้า components
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
│   ├── store/            # การจัดการ state
│   │   ├── admin.ts
│   │   ├── auth.ts
│   │   ├── cart.ts
│   │   ├── orders.ts
│   │   └── products.ts
│   ├── utils/            # ฟังก์ชัน utility
│   │   ├── apiClient.ts
│   │   └── categoryTranslator.ts
│   ├── config/           # การกำหนดค่า
│   │   └── env.ts
│   ├── App.tsx           # ตัว component หลักของแอป
│   ├── main.tsx          # จุดเริ่มต้น
│   └── index.css         # สไตล์ global
├── docs/                 # เอกสาร
├── server.js            # Express server สำหรับ production
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

## 🎨 UI Components

### Components หลัก

#### Navbar
- แถบนำทางที่ตอบสนอง
- ฟังก์ชันการค้นหา
- สถานะการยืนยันตัวตนผู้ใช้
- ตัวบ่งชี้ตะกร้าสินค้า

#### ProductCard
- การแสดงรูปภาพสินค้า
- ข้อมูลสินค้า
- ฟังก์ชันเพิ่มลงตะกร้า
- การแสดงราคาพร้อมการจัดรูปแบบ

#### CustomSelect
- ตัวเลือก dropdown แบบกำหนดเอง
- ฟังก์ชันการค้นหา
- การนำทางด้วยคีย์บอร์ด
- การจัดสไตล์แบบกำหนดเอง

#### HeroBanner
- ส่วน hero ของหน้าแรก
- ปุ่ม call-to-action
- การออกแบบที่ตอบสนอง

### หน้า Components

#### Search
- การค้นหาและกรองสินค้า
- ตัวกรองหมวดหมู่และแบรนด์
- ตัวกรองช่วงราคา
- ตัวเลือกการเรียงลำดับ
- เลย์เอาต์กริดที่ตอบสนอง

#### ProductDetail
- แกลเลอรี่รูปภาพสินค้า
- ข้อมูลสินค้า
- ฟังก์ชันเพิ่มลงตะกร้า
- สินค้าที่เกี่ยวข้อง

#### Cart
- รายการสินค้าในตะกร้าสินค้า
- การอัปเดตจำนวน
- การลบรายการ
- การคำนวณราคา
- ปุ่มชำระเงิน

#### Checkout
- สรุปคำสั่งซื้อ
- ฟอร์มที่อยู่จัดส่ง
- การเลือกวิธีการชำระเงิน
- การยืนยันคำสั่งซื้อ

#### Admin Dashboard
- สถิติร้าน
- การจัดการคำสั่งซื้อ
- การจัดการสินค้า
- การจัดการผู้ใช้
- รายงานและการวิเคราะห์

## 🔧 การจัดการ State

### Zustand Stores

#### Auth Store (`auth.ts`)
- สถานะการยืนยันตัวตนผู้ใช้
- ฟังก์ชันเข้าสู่ระบบ/ออกจากระบบ
- การจัดการโปรไฟล์
- การจัดการ token

#### Products Store (`products.ts`)
- การจัดการข้อมูลสินค้า
- การค้นหาและกรอง
- ข้อมูลหมวดหมู่และแบรนด์
- การแคช

#### Cart Store (`cart.ts`)
- สถานะตะกร้าสินค้า
- เพิ่ม/ลบรายการ
- การอัปเดตจำนวน
- การคำนวณราคา

#### Orders Store (`orders.ts`)
- ประวัติคำสั่งซื้อ
- รายละเอียดคำสั่งซื้อ
- การติดตามสถานะคำสั่งซื้อ

#### Admin Store (`admin.ts`)
- ข้อมูลแดชบอร์ดแอดมิน
- การจัดการผู้ใช้
- การจัดการคำสั่งซื้อ
- การวิเคราะห์

## 🎨 การจัดสไตล์

### Tailwind CSS
- CSS framework แบบ utility-first
- การออกแบบที่ตอบสนอง
- แพเลตสีแบบกำหนดเอง
- การจัดสไตล์แบบ component

### สไตล์แบบกำหนดเอง
- สไตล์ global ใน `index.css`
- สไตล์เฉพาะ component
- จุดพัก responsive
- รองรับโหมดมืด

## 🔌 การเชื่อมต่อ API

### API Client (`utils/apiClient.ts`)
- HTTP client แบบ Axios
- Request/response interceptors
- การจัดการข้อผิดพลาด
- การจัดการ token

### Endpoints
- Authentication: `/api/auth/*`
- Products: `/api/products/*`
- Cart: `/api/cart/*`
- Orders: `/api/orders/*`
- Admin: `/api/admin/*`

## 📱 การออกแบบที่ตอบสนอง

### จุดพัก
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

### ฟีเจอร์ Mobile
- อินเทอร์เฟซที่เหมาะสำหรับการสัมผัส
- การใช้ท่าทาง swipe
- ฟอร์มที่ปรับให้เหมาะกับมือถือ
- การนำทางที่ตอบสนอง

## 🚀 การ Deploy

### Render (แนะนำ)

1. เชื่อมต่อ GitHub repository กับ Render
2. สร้าง Web Service ใหม่
3. ตั้งค่า build command: `npm install && npm run build:prod`
4. ตั้งค่า start command: `npm start`
5. เพิ่ม environment variables
6. Deploy!

### แพลตฟอร์มอื่น

- **Vercel**: การ deploy static site
- **Netlify**: การ deploy static site
- **Heroku**: การ deploy web service

## 🔧 การกำหนดค่า

### Environment Variables

| ตัวแปร | คำอธิบาย | ค่าเริ่มต้น |
|--------|----------|------------|
| `VITE_API_BASE_URL` | URL Backend API | http://localhost:5001/api |

### การกำหนดค่า Build

#### Vite Config
- รองรับ TypeScript
- React plugin
- Path aliases
- Environment variables

#### Tailwind Config
- แพเลตสีแบบกำหนดเอง
- จุดพัก responsive
- Component classes
- รองรับโหมดมืด

## 🧪 การทดสอบ

```bash
# รันการทดสอบ (หากกำหนดค่าไว้)
npm test

# รันการทดสอบพร้อม coverage
npm run test:coverage

# รันการทดสอบแบบ watch mode
npm run test:watch
```

## 📦 Scripts

- `npm run dev` - เริ่มเซิร์ฟเวอร์ development
- `npm run build` - Build สำหรับ production
- `npm run build:prod` - Build สำหรับ production พร้อม API URL
- `npm run preview` - ดูตัวอย่าง production build
- `npm start` - เริ่มเซิร์ฟเวอร์ production
- `npm run deploy` - Deploy ไปยัง production

## 🔒 ฟีเจอร์ความปลอดภัย

- **CORS**: กำหนดค่าสำหรับการสื่อสารกับ backend
- **Input Validation**: การตรวจสอบและทำความสะอาดฟอร์ม
- **XSS Protection**: Content Security Policy
- **CSRF Protection**: การป้องกันแบบ token
- **Secure Headers**: การกำหนดค่า security headers

## 📊 ประสิทธิภาพ

### ฟีเจอร์การปรับปรุง
- **Code Splitting**: การโหลด component แบบ lazy
- **Image Optimization**: การโหลดรูปภาพที่ปรับปรุงแล้ว
- **Bundle Optimization**: Tree shaking และ minification
- **Caching**: การแคชการตอบสนอง API
- **Lazy Loading**: การโหลด component แบบ lazy

### ตัวชี้วัดประสิทธิภาพ
- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Cumulative Layout Shift (CLS)
- First Input Delay (FID)

## 🌐 การรองรับหลายภาษา

### รองรับหลายภาษา
- ภาษาอังกฤษ (ค่าเริ่มต้น)
- รองรับภาษาไทย
- การแปลหมวดหมู่
- เนื้อหาที่แปลแล้ว

## 🤝 การมีส่วนร่วม

1. Fork repository
2. สร้าง feature branch
3. ทำการเปลี่ยนแปลง
4. เพิ่มการทดสอบ
5. ส่ง pull request

## 📄 ใบอนุญาต

โปรเจคนี้ได้รับอนุญาตภายใต้ MIT License - ดูไฟล์ [LICENSE](LICENSE) สำหรับรายละเอียด

## 🆘 การสนับสนุน

สำหรับการสนับสนุน ส่งอีเมลไปที่ support@etech.com หรือสร้าง issue ใน repository

## 🔗 ลิงก์

- [Backend Repository](https://github.com/tiw25999/BDnode)
- [Live Demo](https://etech-store.onrender.com)
- [API Documentation](https://etech-backend.onrender.com/api/docs)

---

**E-Tech Store Frontend** - สร้างด้วย ❤️ โดยทีม E-Tech
