# Self Love 💌 · Android ilova (React + Capacitor)

Ilova botingizning **o'zida** xat yaratadi. Havola haqiqiy: `PUBLIC_URL/c/kod`. Uni istalgan odamga yuborsangiz, bot saytining o'zi ochiladi.
Natija botdagidek chiqadi (ism, ko'rinish, rang, matn, savol, imzo, havola). Javoblar «Saytlarim» bo'limida ko'rinadi.
Ilova faqat telefon ko'rinishida (kompyuterda ham telefon kengligida chiqadi).

## 1) Botni yangilang (bir marta)
`bot-yangilanish` papkasidagi `bot.py` ni o'zingizning `bot.py` o'rniga qo'ying va `.env` ga ikki qator qo'shing:
```
APP_ADMIN_PASSWORD=53101241
APP_ADMIN_EMAIL=sizning@gmail.com
```
Botni hostingda qayta ishga tushiring. `PUBLIC_URL` **https** bo'lishi shart (Render/Railway beradi).
Ilova bazadagi `sevgi.db` bilan ishlaydi: limit, ban, statistika botdagi bilan umumiy.

## 2) Ilova (APK)
`.env.example` ni `.env` ga nusxalab, `VITE_API_URL` ga bot manzilini yozing (yoki ilovaning kirish oynasidagi «Server» maydoniga yozasiz).

**Variant A: Android Studio**
```
npm install
npm run build
npx cap add android
npx cap sync android
npx cap open android      # Build > Build APK(s)
```
**Variant B: GitHub (kompyuterga hech narsa o'rnatmasdan)**
Loyihani GitHub'ga yuklang, Settings > Secrets > Actions ga `VITE_API_URL` qo'shing, Actions > «Android APK» > Run workflow. Tayyor `app-debug.apk` Artifacts'da chiqadi.

Brauzerda sinash: `npm run dev`.

## Kirish
- Sayt ochilishi bilan ro'yxatdan o'tish oynasi chiqadi (faqat Gmail).
- `APP_ADMIN_PASSWORD` bilan (53101241) kirgan Gmail admin panelni ochadi. `APP_ADMIN_EMAIL` yozilsa, faqat o'sha Gmail admin bo'ladi.
- Oddiy foydalanuvchida limit botdagidek 0 dan boshlanadi: admin ilovadagi admin paneldan ➕1/3/5/10 beradi. Admin cheksiz yasaydi.

## Muhim
- Ilova bilan yaratilgan xat egasi Telegramda yo'q, shuning uchun «ochdi / javob berdi / uchrashuv» xabarlari adminga botda (📱 email belgisi bilan) boradi, egasiga esa ilovada ko'rinadi.
- Admin paroli serverda (`.env`) turadi, ilova ichida emas.

## Google Play uchun
Batafsil qadamlar: `PLAY-QOLLANMA.md`. Release AAB: `.github/workflows/android-release.yml`.
