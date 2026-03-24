const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
const langButtons = document.querySelectorAll(".lang-btn");
const sliderContainers = Array.from(document.querySelectorAll(".slider"));
const yearSpan = document.getElementById("year");

const translations = {
  en: {
    "nav.problem": "Problem",
    "nav.features": "Features",
    "nav.how": "How it works",
    "nav.achievements": "Achievements",
    "nav.contact": "Contact",
    "hero.eyebrow": "Predictive transplant intelligence",
    "hero.title": "Predicting organ compatibility with precision.",
    "hero.description":
      "Cortex AI uses biomathematics, CKD-EPI metrics, and AI-driven analysis to calculate a donor–recipient compatibility index and provide clear medical explanations, risk hypotheses, and transplant recommendations.",
    "hero.mission": "Our mission is simple: reduce rejection, save organs, save lives.",
    "hero.coreTitle": "Core advantages",
    "hero.adv1": "Unique CKD-EPI + AI predictive formula",
    "hero.adv2": "Analysis of 25+ genetic, immunologic, and metabolic markers",
    "hero.adv3": "AI forecast of compatibility and rejection risk",
    "hero.adv4": "API integration with clinics and biobanks",
    "hero.ctaPrimary": "Request a demo",
    "hero.ctaSecondary": "See how it works",
    "hero.cardTitle": "Real-time compatibility gauge",
    "hero.cardValue": "Projected compatibility",
    "hero.cardGenes": "Markers tracked",
    "hero.cardRefresh": "Model refresh",
    "hero.panel1.tag": "CKD-EPI",
    "hero.panel1.title": "Creatinine trend stabilized • 1.02 mg/dL",
    "hero.panel1.body": "Automatic normalization and confidence trace.",
    "hero.panel2.tag": "Immune",
    "hero.panel2.title": "HLA-B*08 signal calm",
    "hero.panel2.body": "Adaptive immune score sits below alert threshold.",
    "problem.eyebrow": "Why it matters",
    "problem.heading": "Every year, thousands of organs are lost due to imperfect donor–recipient matching.",
    "problem.copy1":
      "24,000 organs are lost annually due to incorrect compatibility assessment. 280,000 transplant surgeries are performed worldwide, and up to 33.8% face immune rejection. Current compatibility methods rely on manual evaluation or outdated formulas that ignore thousands of hidden biological factors.",
    "problem.copy2":
      "As a result, doctors often receive incomplete data, and rejection becomes visible only when damage has already started. Cortex AI changes this — by calculating compatibility through genetics, metabolism, CKD-EPI, and AI.",
    "problem.stat1.value": "24,000",
    "problem.stat1.label": "Organs lost annually due to incorrect compatibility assessment.",
    "problem.stat2.value": "280,000",
    "problem.stat2.label": "Transplant surgeries performed worldwide every year.",
    "problem.stat3.value": "33.8%",
    "problem.stat3.label": "Face immune rejection without earlier insights.",
    "problem.stat4.value": "4 data layers",
    "problem.stat4.label": "Genetics, immunology, metabolism, and clinical CKD-EPI in one model.",
    "features.eyebrow": "Recognition",
    "features.heading": "Trusted by global innovation arenas.",
    "features.card1.label": "Finalists",
    "features.card1.title": "Startup World Cup 2025",
    "features.card2.label": "Champions",
    "features.card2.title": "Enactus Kazakhstan National Cup ES 2025",
    "features.card3.label": "Finalist",
    "features.card3.title": "Entrepreneurship World Cup 2025",
    "features.card4.label": "AI Sana",
    "features.card4.title": "Best BioMedical Startup",
    "features.card5.label": "Finalists",
    "features.card5.title": "Hult Prize 2025 Regional",
    "how.eyebrow": "Pipeline",
    "how.heading": "Cortex.AI analyzes 25+ biological parameters and transforms them into a compatibility forecast.",
    "how.copy":
      "From raw omics to clinician-ready insights, the system orchestrates models that stay transparent, self-learning, and easy to integrate.",
    "how.step1.title": "Compatibility formula",
    "how.step1.body":
      "A biomathematical model that uses DNA data, HLA-typing, metabolic markers, and blood group parameters to calculate the donor–recipient match index.",
    "how.step2.title": "AI agent",
    "how.step2.body": "The AI module delivers risk analysis, compatibility hypotheses, and structured recommendations for the clinician.",
    "how.step3.title": "Self-learning engine",
    "how.step3.body": "The system continuously trains on real transplant history, making every new prediction more accurate.",
    "achievements.eyebrow": "Impact indicators",
    "achievements.heading": "From pilot wards to national registries.",
    "achievements.slide1.tag": "Kidney cohort",
    "achievements.slide1.title": "24-day earlier compatibility clarity",
    "achievements.slide1.body": "Multi-center pilots show Cortex AI surfaces rejection risk almost a month before invasive biopsies.",
    "achievements.slide2.tag": "Clinician UX",
    "achievements.slide2.title": "98% trust in generated explanations",
    "achievements.slide2.body": "Narrative insights shorten tumor board reviews and satisfy regulatory evidence requests.",
    "achievements.slide3.tag": "Data ops",
    "achievements.slide3.title": "API-ready for biobanks and EHRs",
    "achievements.slide3.body": "Standardized endpoints connect to CKD-EPI labs, HLA labs, and transplant registries in days.",
    "achievements.slide4.tag": "Risk",
    "achievements.slide4.title": "False alarm rate below 3%",
    "achievements.slide4.body": "Human-in-the-loop calibration keeps alerts precise, saving staff from fatigue.",
    "contact.eyebrow": "Contact",
    "contact.heading": "Ready for a pilot?",
    "contact.emailLabel": "Email:",
    "contact.address": "HQ: EXPO, C1, Astana, Kazakhstan",
    "contact.press": "Press: press@cortexai.bio",
    "contact.policyTitle": "Policies",
    "contact.license": "License",
    "contact.privacy": "Privacy policy",
    "contact.terms": "Terms of service",
    "contact.cookies": "Cookie policy",
    "contact.statusTitle": "Status",
    "contact.statusBody": "Cortex AI is in limited release with select transplant centers. Reach out to join the early access cohort.",
    "contact.backToTop": "Back to top",
    "contact.footnote": "Cortex AI. Built with empathy, espresso, and a dash of innovation."
  },
  ru: {
    "nav.problem": "Проблема",
    "nav.features": "Достижения",
    "nav.how": "Как работает",
    "nav.achievements": "Результаты",
    "nav.contact": "Контакты",
    "hero.eyebrow": "Интеллект для трансплантации",
    "hero.title": "Точность в прогнозе совместимости органов.",
    "hero.description":
      "Cortex AI сочетает биоматематику, формулу CKD-EPI и ИИ-анализ для вычисления индекса совместимости донора и пациента. Система формирует медицинские пояснения, гипотезы о возможных рисках и рекомендации для врача.",
    "hero.mission": "Наша цель — уменьшить количество отторжений, сохранить органы и спасти жизни.",
    "hero.coreTitle": "Ключевые преимущества",
    "hero.adv1": "Уникальная формула CKD-EPI + AI",
    "hero.adv2": "Анализ 25+ генетических, иммунных и метаболических параметров",
    "hero.adv3": "AI-прогноз совместимости и риска отторжения",
    "hero.adv4": "API-интеграция с клиниками и биобанками",
    "hero.ctaPrimary": "Запросить демо",
    "hero.ctaSecondary": "Как это работает",
    "hero.cardTitle": "Онлайн-датчик совместимости",
    "hero.cardValue": "Прогноз совместимости",
    "hero.cardGenes": "Отслеживаемые маркеры",
    "hero.cardRefresh": "Обновление модели",
    "hero.panel1.tag": "CKD-EPI",
    "hero.panel1.title": "Креатинин стабилен • 1.02 мг/дл",
    "hero.panel1.body": "Автоматическая нормализация и контроль доверия.",
    "hero.panel2.tag": "Иммунитет",
    "hero.panel2.title": "Сигнал HLA-B*08 спокоен",
    "hero.panel2.body": "Иммунный индекс ниже порога тревоги.",
    "problem.eyebrow": "Почему это важно",
    "problem.heading": "Каждый год тысячи органов теряются из-за неправильного подбора донора и пациента.",
    "problem.copy1":
      "24 000 органов ежегодно теряются из-за ошибочного подбора. 280 000 операций по трансплантации проводится в мире, и до 33.8% сталкиваются с иммунным отторжением. Текущие методы опираются на ручную оценку или устаревшие формулы, игнорирующие тысячи скрытых факторов.",
    "problem.copy2":
      "Поэтому отторжение выявляют поздно — когда повреждение уже началось. Cortex AI решает эту проблему с помощью анализа генетики, метаболики, CKD-EPI и ИИ.",
    "problem.stat1.value": "24 000",
    "problem.stat1.label": "Органов в год теряется из-за неверной оценки совместимости.",
    "problem.stat2.value": "280 000",
    "problem.stat2.label": "Трансплантаций проводится ежегодно во всём мире.",
    "problem.stat3.value": "33,8%",
    "problem.stat3.label": "Столкнулись с иммунным отторжением.",
    "problem.stat4.value": "4 уровня данных",
    "problem.stat4.label": "Генетика, иммунология, метаболизм и CKD-EPI в одной модели.",
    "features.eyebrow": "Признание",
    "features.heading": "Нас отмечают ведущие конкурсы инноваций.",
    "features.card1.label": "Финалисты",
    "features.card1.title": "Startup World Cup 2025",
    "features.card2.label": "Чемпионы",
    "features.card2.title": "Enactus Kazakhstan National Cup ES 2025",
    "features.card3.label": "Финалист",
    "features.card3.title": "Entrepreneurship World Cup 2025",
    "features.card4.label": "AI Sana",
    "features.card4.title": "Лучший биомедицинский стартап",
    "features.card5.label": "Финалисты",
    "features.card5.title": "Hult Prize 2025 Regional",
    "how.eyebrow": "Пайплайн",
    "how.heading": "Cortex.AI анализирует более 25 биологических параметров и формирует прогноз совместимости.",
    "how.copy":
      "От сырых данных до отчёта для врача — система остаётся прозрачной, самообучающейся и готовой к интеграции.",
    "how.step1.title": "Формула совместимости",
    "how.step1.body":
      "Биоматематическая модель использует ДНК-данные, HLA-типирование, метаболические маркеры и параметры крови для расчёта индекса соответствия.",
    "how.step2.title": "AI-агент",
    "how.step2.body": "ИИ формирует анализ возможных рисков, гипотезы по совместимости и рекомендации для врача.",
    "how.step3.title": "Модуль самообучения",
    "how.step3.body": "Система обучается на истории трансплантаций, постоянно повышая точность прогнозов.",
    "achievements.eyebrow": "Показатели влияния",
    "achievements.heading": "От пилотных отделений до национальных регистров.",
    "achievements.slide1.tag": "Почки",
    "achievements.slide1.title": "Прозрачность за 24 дня до биопсии",
    "achievements.slide1.body":
      "Многоцентровые пилоты показывают, что Cortex AI предсказывает риск отторжения почти за месяц до инвазивных процедур.",
    "achievements.slide2.tag": "UX врачей",
    "achievements.slide2.title": "98% доверия к объяснениям ИИ",
    "achievements.slide2.body": "Нарративные инсайты сокращают время консилиумов и ускоряют одобрение регуляторов.",
    "achievements.slide3.tag": "Интеграции",
    "achievements.slide3.title": "Готовность API для биобанков и EHR",
    "achievements.slide3.body": "Стандартизированные эндпоинты подключают лаборатории CKD-EPI и регистры за дни.",
    "achievements.slide4.tag": "Риски",
    "achievements.slide4.title": "Ложные тревоги < 3%",
    "achievements.slide4.body": "Калибровка с участием врачей сохраняет точность и снижает усталость персонала.",
    "contact.eyebrow": "Контакты",
    "contact.heading": "Готовы к пилоту?",
    "contact.emailLabel": "Почта:",
    "contact.address": "HQ: EXPO, блок C1, Астана, Казахстан",
    "contact.press": "Пресс-служба: press@cortexai.bio",
    "contact.policyTitle": "Политики",
    "contact.license": "Лицензия",
    "contact.privacy": "Политика конфиденциальности",
    "contact.terms": "Условия использования",
    "contact.cookies": "Cookie-политика",
    "contact.statusTitle": "Статус",
    "contact.statusBody": "Cortex AI доступен в пилотных центрах трансплантации. Напишите нам, чтобы присоединиться.",
    "contact.backToTop": "Наверх",
    "contact.footnote": "Cortex AI. Создано с заботой, смелостью и щепоткой инновации."
  }
};

function applyTranslations(lang) {
  document.documentElement.lang = lang;
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    const text = translations[lang][key];
    if (typeof text === "string") {
      el.textContent = text;
    }
  });
}

function setLanguage(lang) {
  if (!translations[lang]) return;
  langButtons.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.lang === lang);
  });
  localStorage.setItem("genoLang", lang);
  applyTranslations(lang);
}

const storedLang = localStorage.getItem("genoLang") || "en";
setLanguage(storedLang);

langButtons.forEach((btn) => {
  btn.addEventListener("click", () => setLanguage(btn.dataset.lang));
});

if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    navLinks.classList.toggle("open");
  });

  navLinks.addEventListener("click", (evt) => {
    if (evt.target.tagName === "A") {
      navLinks.classList.remove("open");
    }
  });
}

const scrollElements = document.querySelectorAll("[data-scroll]");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 }
);

scrollElements.forEach((el) => observer.observe(el));

sliderContainers.forEach((slider) => {
  const track = slider.querySelector(".slider-track");
  const slides = Array.from(slider.querySelectorAll(".slide"));
  if (!track || !slides.length) return;

  const prev = slider.querySelector(".slider-control.prev");
  const next = slider.querySelector(".slider-control.next");
  let slideIndex = 0;

  const slideWidth = () => {
    const base = slides[0]?.offsetWidth || 0;
    const gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap || "0");
    return base + gap;
  };

  const updateSlider = (direction = 1) => {
    slideIndex = (slideIndex + direction + slides.length) % slides.length;
    track.scrollTo({
      left: slideWidth() * slideIndex,
      behavior: "smooth"
    });
  };

  prev?.addEventListener("click", () => updateSlider(-1));
  next?.addEventListener("click", () => updateSlider(1));

  const autoplay = slider.dataset.autoplay === "true";
  const interval = Number(slider.dataset.interval) || 6000;
  if (autoplay) {
    let timer = setInterval(() => updateSlider(1), interval);
    slider.addEventListener("mouseenter", () => clearInterval(timer));
    slider.addEventListener("mouseleave", () => {
      clearInterval(timer);
      timer = setInterval(() => updateSlider(1), interval);
    });
  }

  window.addEventListener("resize", () => {
    track.scrollTo({
      left: slideWidth() * slideIndex
    });
  });
});


