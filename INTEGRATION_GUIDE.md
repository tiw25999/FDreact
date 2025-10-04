# Frontend-Backend Integration Guide

## การเชื่อมต่อ Frontend และ Backend

### 1. Environment Variables

สร้างไฟล์ `.env.local` ในโฟลเดอร์ `Freact`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### 2. การรันแอปพลิเคชัน

#### รัน Backend:
```bash
cd Bnodejs
npm run dev
```

#### รัน Frontend:
```bash
cd Freact
npm run dev
```

### 3. การทำงาน

- Frontend จะเชื่อมต่อกับ Backend ผ่าน API ที่ `http://localhost:5000/api`
- Authentication ใช้ JWT tokens
- ข้อมูลจะถูกเก็บใน PostgreSQL database ผ่าน Supabase
- Frontend จะโหลดข้อมูลจาก API แทน localStorage

### 4. Features ที่เชื่อมต่อแล้ว

- ✅ User Authentication (Login/Register)
- ✅ Products Management
- ✅ Shopping Cart
- ✅ Orders Management
- ✅ Admin Dashboard

### 5. การทดสอบ

1. เปิด `http://localhost:5173` (Frontend)
2. เปิด `http://localhost:5000` (Backend)
3. ทดสอบการสมัครสมาชิกและเข้าสู่ระบบ
4. ทดสอบการเพิ่มสินค้าลงตะกร้า
5. ทดสอบการสั่งซื้อ

### 6. Troubleshooting

- ตรวจสอบว่า Backend ทำงานอยู่ที่ port 5000
- ตรวจสอบ CORS settings ใน Backend
- ตรวจสอบ environment variables
- ดู console logs สำหรับ error messages
