# Google Play'ga chiqarish

## 1. Bir martalik tayyorgarlik
1. **Google Play Console** akkaunti: play.google.com/console (bir martalik 25$ to'lov, shaxsiy hujjat tasdiqlanadi).
2. **Imzolash kaliti (keystore)** yarating (Java o'rnatilgan kompyuterda):
   `keytool -genkeypair -v -keystore release.keystore -alias selflove -keyalg RSA -keysize 2048 -validity 10000`
   Parollarni va faylni yo'qotmang: ularsiz ilovani yangilab bo'lmaydi.
3. Kalitni base64 qiling: Mac/Linux `base64 -i release.keystore | tr -d '\n'`, Windows `[Convert]::ToBase64String([IO.File]::ReadAllBytes("release.keystore"))`.
4. GitHub repo > Settings > Secrets > Actions ga qo'shing:
   `VITE_API_URL`, `KEYSTORE_BASE64`, `KEYSTORE_PASSWORD`, `KEY_ALIAS` (selflove), `KEY_PASSWORD`.
5. `docs/privacy.html` ichidagi `SIZNING@GMAIL.COM` ni o'z emailingizga almashtiring. Repo > Settings > Pages > Branch: main, folder: /docs. Maxfiylik havolasi: `https://FOYDALANUVCHI.github.io/REPO/privacy.html`.

## 2. AAB yig'ish
Actions > **Android RELEASE** > Run workflow > Artifacts'dan `app-release.aab` ni yuklab oling.
Har ishga tushirishda versiya raqami o'zi oshadi.

## 3. Play Console'da
- Yangi ilova yarating, `app-release.aab` ni yuklang (Play App Signing'ni yoqing).
- Do'kon sahifasi: nom, qisqa/uzun tavsif, ikonka 512x512 (`docs/play-icon-512.png`), 2+ ta ekran rasmi (telefondan oling), 1024x500 banner.
- Maxfiylik siyosati havolasi, «Data safety» (email, parol, matn, rasm yig'iladi), kontent reytingi, «Ads: yo'q».
- Hisobni o'chirish talabi: Play ilovada ro'yxatdan o'tish bo'lsa, hisobni o'chirish yo'lini so'raydi (siyosatda email ko'rsatilgan).
- Yangi shaxsiy akkauntlar uchun Play odatda **yopiq sinov (kamida 12 tester, 14 kun)** talab qiladi, shundan keyin ommaviy chiqarish ochiladi. Joriy talabni Console'da tekshiring.

## 4. Rad etilish xavfi (muhim)
- **To'lov:** ilova ichida sayt paketi so'mda admin orqali (Telegram) sotiladi. Google Play ilova ichidagi raqamli mahsulotlar uchun Google Play Billing talab qiladi. Eng xavfsiz yo'l: ilovada narx va to'lovga yo'naltirish ko'rsatilmasin (limitni admin berib turadi). Hozirgi «Paketlar» oynasini Play versiyasidan olib tashlash tavsiya etiladi.
- **Foydalanuvchi kontenti:** boshqa odamga xat/rasm yuboriladi. Play shikoyat/bloklash mexanizmi so'raydi; admin ban shu vazifani bajaradi, lekin tavsifda yozing.
- Target API talabi har yil oshadi: workflow Capacitor oxirgi versiyasi bilan yig'ilishi kerak, Console ogohlantirsa `package.json` dagi `@capacitor/*` versiyasini ko'taring.
