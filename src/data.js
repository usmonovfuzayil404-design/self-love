// Botdagi qadamlar, ranglar va matnlar (bot.py dan olingan)
export const THEMES = [
  { key: "atirgul", emoji: "🌹", uz: "Atirgul", ru: "Роза", bg1: "#1a0710", bg2: "#3d0e24", accent: "#ff4d7d", accent2: "#ffb3c7", paper: "#c4153f", ink: "#fff4f7", onAccent: "#2a0512" },
  { key: "tun", emoji: "🌌", uz: "Tun", ru: "Ночь", bg1: "#080b22", bg2: "#1c2152", accent: "#f2c46d", accent2: "#8c9bff", paper: "#9a7420", ink: "#f6f4ff", onAccent: "#241a02" },
  { key: "bahor", emoji: "🌿", uz: "Bahor", ru: "Весна", bg1: "#07201a", bg2: "#10463a", accent: "#6fe3b0", accent2: "#ffd1a6", paper: "#1f8a64", ink: "#f1fff9", onAccent: "#04251a" },
  { key: "shafaq", emoji: "🌅", uz: "Shafaq", ru: "Закат", bg1: "#1c0b2e", bg2: "#531757", accent: "#ff8a4c", accent2: "#d28bff", paper: "#c9501a", ink: "#fff5ee", onAccent: "#2c1002" },
  { key: "gulbahor", emoji: "🌸", uz: "Gulbahor", ru: "Сакура", bg1: "#fff0ec", bg2: "#ffd2cc", accent: "#e0245e", accent2: "#ff8fab", paper: "#c4153f", ink: "#3a0f20", onAccent: "#ffffff" },
  { key: "astro", emoji: "🪐", uz: "Astro", ru: "Астро", bg1: "#02030d", bg2: "#171046", accent: "#a98bff", accent2: "#5fe3ff", paper: "#5b3fd1", ink: "#f1f0ff", onAccent: "#0b0626" },
];
export const themeOf = (k) => THEMES.find((t) => t.key === k) || THEMES[5];
export const themeVars = (k) => {
  const t = themeOf(k);
  return {
    "--bg1": t.bg1, "--bg2": t.bg2, "--accent": t.accent, "--accent2": t.accent2,
    "--paper": t.paper, "--ink": t.ink, "--on-accent": t.onAccent,
  };
};

export const WORDS = [
  "Seni sevaman", "Я тебя люблю", "I love you", "Je t'aime", "Te amo", "Ich liebe dich", "Ti amo",
  "Seni seviyorum", "我爱你", "愛してる", "사랑해", "أحبك", "Σ' αγαπώ", "Jag älskar dig", "Ik hou van je",
  "Kocham cię", "Я тебе кохаю", "Mahal kita", "Aku cinta kamu", "Tôi yêu bạn", "Te iubesc", "Szeretlek",
  "Rakastan sinua", "Jeg elsker deg", "Miluji tě", "Volim te", "Обичам те", "Мен сені сүйемін",
  "Ana behibak", "Mi amas vin", "Ya tebya lyublyu", "Mən səni sevirəm",
];

export const DEFAULT_Q = { uz: "Mening sevgilim bo'lasanmi?", ru: "Будем вместе?" };
export const QUESTION_PRESETS = {
  uz: ["Mening sevgilim bo'lasanmi?", "Meni sevasanmi?", "Mening yuragimga ega bo'lasanmi?"],
  ru: ["Будем вместе?", "Ты меня любишь?", "Станешь моей?"],
};

// Qabul qiluvchi saytdagi matnlar
export const T = {
  uz: {
    tapSeal: "Muhrni bosing", tapCard: "Otkritkani bosing", cont: "Davom etish", read: "Xatni o'qish",
    yes: "Ha 💖", no: "Yo'q", dear: "Aziz", meetQ: "Qayerdadur ko'rishamizmi?",
    places: { walk: "Aylanamiz 🚶", cinema: "Kino 🎬", cafe: "Kafe ☕", park: "Park 🌳" },
    day: "Kun", hour: "Soat", minute: "Daqiqa", confirm: "Tasdiqlash", cartoonQ: "Multfilm ko'ramizmi? 🍿",
    watch: "Ko'ramiz", thanks: "Rahmat! Javobingiz yuborildi 💌", noThanks: "Javobingiz uchun rahmat 🤍",
    sent: "Uchrashuv belgilandi", mute: "Musiqa",
  },
  ru: {
    tapSeal: "Нажмите на печать", tapCard: "Нажмите на открытку", cont: "Продолжить", read: "Читать письмо",
    yes: "Да 💖", no: "Нет", dear: "Дорогая", meetQ: "Может, где-нибудь встретимся?",
    places: { walk: "Гуляем 🚶", cinema: "Кино 🎬", cafe: "Кафе ☕", park: "Парк 🌳" },
    day: "День", hour: "Час", minute: "Минуты", confirm: "Подтвердить", cartoonQ: "Посмотрим мультфильм? 🍿",
    watch: "Смотрим", thanks: "Спасибо! Ваш ответ отправлен 💌", noThanks: "Спасибо за ответ 🤍",
    sent: "Встреча назначена", mute: "Музыка",
  },
};

// Botdagi 11 qadam. hint = botdagi savol matni
export const STEPS = [
  { id: "slang", n: 1, title: "Sayt tili", hint: "Sayt qaysi tilda bo'lsin? Xatni qabul qiluvchi shu tilda ko'radi." },
  { id: "name", n: 2, title: "Ism", hint: "Sevgan insoningizning ismini yozing." },
  { id: "style", n: 3, title: "Ko'rinish", hint: "Xat qanday ko'rinishda bo'lsin: konvert yoki otkritka?" },
  { id: "theme", n: 4, title: "Rang va fon", hint: "Rangni tanlang. Har bir rang o'z animatsion fon bilan keladi." },
  { id: "shape", n: 5, title: "So'zlar shakli", hint: "Xatdan oldin «sevaman» so'zlari qanday shaklda chiqsin?" },
  { id: "photo", n: 6, title: "Rasm", hint: "Rasm xat matnidan oldin, polaroid ramkada chiqadi. Ixtiyoriy." },
  { id: "body", n: 7, title: "Xat matni", hint: "Yuragingizdagi gapni o'z so'zlaringiz bilan yozing (10–700 belgi)." },
  { id: "question", n: 8, title: "Savol", hint: "Xat oxiridagi savol. Ha / Yo'q tugmalari shu savolga javob bo'ladi." },
  { id: "after", n: 9, title: "«Ha»dan keyin", hint: "Qiz «Ha» bossa, sayt keyin nima qilsin?" },
  { id: "photo2", n: 10, title: "Oxirgi rasm", hint: "Saytning oxirida ham rasm chiqishi mumkin. Ixtiyoriy." },
  { id: "sig", n: 11, title: "Imzo", hint: "Xat oxirida qaysi ismingiz yozilsin?" },
];

export const DEFAULT_DRAFT = {
  slang: "uz", name: "", style: "envelope", theme: "astro", shape: "heart",
  photo: null, body: "", question: "", after: "meet", photo2: null, sig: "",
};

export const SAMPLE_BODY = {
  uz: "Sen bilan o'tgan har bir kun mening eng yaxshi xotiram.\nKulgingni eshitganimda dunyo yorishib ketadi.\nBugun yuragimdagi gapni aytmoqchiman.",
  ru: "Каждый день с тобой — моё самое тёплое воспоминание.\nКогда я слышу твой смех, мир становится светлее.\nСегодня я хочу сказать то, что у меня на сердце.",
};
