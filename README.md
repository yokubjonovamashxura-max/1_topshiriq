# Web3 Premium DApp - Smart Kontrakt Integratsiyasi

Ushbu loyiha Web3.js kutubxonasi yordamida smart-kontraktlar bilan muloqot qilish uchun yaratilgan zamonaviy (premium) interfeysdir. Loyiha orqali MetaMask hamyonini ulash, kontraktdan ma'lumot o'qish va tranzaksiya yuborish imkoniyatlari mavjud.

## 🚀 Xususiyatlari
- **MetaMask Integratsiyasi**: Hamyonni xavfsiz ulash va tarmoqni aniqlash.
- **Smart Kontrakt bilan Muloqot**:
    - `view` funksiyasi orqali ma'lumot o'qish (`get` metodi).
    - `send` funksiyasi orqali tranzaksiya yuborish (`set` metodi).
- **Kengaytirilgan Sozlamalar**: Gas Limit va Gas Price parametrlarini qo'lda sozlash.
- **Xatolarni Boshqarish**: Foydalanuvchi uchun tushunarli log paneli va error handling.
- **Premium Dizayn**: Dark mode, Glassmorphism va responsive interfeys.

## 🛠 O'rnatish va Ishga tushirish
1. Loyihani yuklab oling yoki klon qiling.
2. `index.html` faylini brauzerda oching (yoki Live Server yordamida ishga tushiring).
3. MetaMask hamyonini o'rnating.

## 🌐 Localhost (Hardhat/Ganache) ulanishi
Agar siz local tarmoqda test qilmoqchi bo'lsangiz:
1. MetaMask-ni oching.
2. Tarmoqlar ro'yxatidan **"Add Network"** -> **"Add a network manually"** tanlang.
3. Quyidagi ma'lumotlarni kiriting:
   - **Network Name**: Localhost 8545
   - **New RPC URL**: http://127.0.0.1:8545
   - **Chain ID**: 31337 (Hardhat) yoki 1337 (Ganache)
   - **Currency Symbol**: ETH

## 📂 Loyiha Tuzilmasi
- `index.html` - UI va kutubxonalar (Web3.js CDN).
- `style.css` - Zamonaviy dizayn va animatsiyalar.
- `app.js` - Web3 mantiqiy qismi (ABI va Address shu yerda sozlanadi).

## 🚀 GitHub Pages-ga joylash
1. Yangi GitHub repository yarating.
2. Fayllarni yuklang: `git push origin main`.
3. Repository sozlamalaridan (**Settings**) -> **Pages** bo'limiga o'ting.
4. **Branch: main** va **Folder: / (root)** tanlab, `Save` tugmasini bosing.
5. Bir necha daqiqadan so'ng loyihangiz internetda jonli bo'ladi!

---
*Created by Antigravity AI*
