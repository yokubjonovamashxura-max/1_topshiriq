# Hospital Queue Smart Contract (Task 3)

Ushbu loyiha shifoxonada navbat olish tizimi uchun yaratilgan aqlli shartnoma (smart contract).

## 🏆 Kontrakt Xususiyatlari
- **Payable Funksiya**: `takeAppointment` orqali to'lov qabul qilinadi.
- **Xavfsizlik (Require)**: 
    - Faqat ma'lum bir ruxsat etilgan adresdan to'lov qabul qilinadi.
    - Minimal to'lov miqdorini tekshirish.
- **Mablag'larni Yo'naltirish**: To'lov qabul qilinganda u avtomatik ravishda boshqa adresga (g'aznaga) yuboriladi.
- **Mantiq (if/else)**: To'lov miqdoriga qarab navbat turi (Oddiy yoki Shoshilinch) avtomatik belgilanadi.
- **Ma'lumotlarni Saqlash**: `mapping` yordamida foydalanuvchi balanslari saqlanadi.
- **Egalik**: Faqat kontrakt egasi sozlamalarni o'zgartirishi va mablag'larni yechib olishi mumkin.
- **Logging**: `event` chiqarish orqali barcha amallar qayd etiladi.

---
*Created by Antigravity AI*
