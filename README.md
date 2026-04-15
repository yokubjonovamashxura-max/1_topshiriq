# JS Blockchain Simulyatsiyasi (Task 5)

Ushbu loyiha JavaScript (Node.js) yordamida yaratilgan oddiy blokcheyn simulyatsiyasi. Loyiha bloklarni shifrlash (SHA-256), ularni bir-biriga bog'lash va "Zanjir Validatsiyasi" (Chain Validation) mantiqlarini namoyish etadi.

## 🚀 Xususiyatlari
- **SHA-256 Hashing**: Node.js `crypto` moduli orqali har bir blok uchun takrorlanmas hash hisoblanadi.
- **Genesis Block**: Zanjirning birinchi bloki avtomatik yaratiladi.
- **Proof-of-Work (Mining)**: Blok qo'shish uchun ma'lum bir qiyinchilik darajasida (Difficulty) mining jarayoni bajariladi.
- **Chain Integrity**: Zanjirning butunligini tekshirish funksiyasi mavjud. Agar biron bir blok ma'lumoti o'zgartirilsa, tizim buni darhol aniqlaydi.

## 🛠 Ishga tushirish
Loyihani ishga tushirish uchun kompyuteringizda Node.js o'rnatilgan bo'lishi kerak.
Terminalda quyidagi buyruqni bering:
```bash
node blockchain.js
```

## 🏗 Arxitektura
- `Block` klassi: Blok ma'lumotlarini va hash hisoblash funksiyasini saqlaydi.
- `Blockchain` klassi: Butun zanjirni boshqaradi (blok qo'shish, mining qilish va validatsiya).

---
*Created by Antigravity AI*
