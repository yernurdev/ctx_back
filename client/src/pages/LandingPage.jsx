import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// i18n strings
const I18N = {
  en: {
    nav: { problem: 'Problem', features: 'Features', how: 'How it works', achievements: 'Achievements', contact: 'Contact', login: 'Login' },
    hero: {
      eyebrow: 'Predictive transplant intelligence',
      title: 'Predicting organ compatibility with precision.',
      description: 'Cortex AI uses biomathematics, CKD-EPI metrics, and AI-driven analysis to calculate a donor–recipient compatibility index and provide clear medical explanations, risk hypotheses, and transplant recommendations.',
      mission: 'Our mission is simple: reduce rejection, save organs, save lives.',
      coreTitle: 'Core advantages',
      adv1: 'Unique CKD-EPI + AI predictive formula',
      adv2: 'Analysis of 25+ genetic, immunologic, and metabolic markers',
      adv3: 'AI forecast of compatibility and rejection risk',
      adv4: 'API integration with clinics and biobanks',
      ctaPrimary: 'Request a demo', ctaSecondary: 'See how it works',
      cardTitle: 'Real-time compatibility gauge', cardValue: 'Projected compatibility',
      cardGenes: 'Markers tracked', cardRefresh: 'Model refresh',
      panel1: { tag: 'CKD-EPI', title: 'Creatinine trend stabilized • 1.02 mg/dL', body: 'Automatic normalization and confidence trace.' },
      panel2: { tag: 'Immune', title: 'HLA-B*08 signal calm', body: 'Adaptive immune score sits below alert threshold.' },
    },
    problem: {
      eyebrow: 'Why it matters',
      heading: 'Every year, thousands of organs are lost due to imperfect donor–recipient matching.',
      copy1: '24,000 organs are lost annually due to incorrect compatibility assessment. 280,000 transplant surgeries are performed worldwide, and up to 33.8% face immune rejection. Current compatibility methods rely on manual evaluation or outdated formulas that ignore thousands of hidden biological factors.',
      copy2: 'As a result, doctors often receive incomplete data, and rejection becomes visible only when damage has already started. Cortex AI changes this — by calculating compatibility through genetics, metabolism, CKD-EPI, and AI.',
      stat1: { value: '24,000', label: 'Organs lost annually due to incorrect compatibility assessment.' },
      stat2: { value: '280,000', label: 'Transplant surgeries performed worldwide every year.' },
      stat3: { value: '33.8%', label: 'Face immune rejection without earlier insights.' },
      stat4: { value: '4 data layers', label: 'Genetics, immunology, metabolism, and clinical CKD-EPI in one model.' },
    },
    features: {
      eyebrow: 'Recognition', heading: 'Trusted by global innovation arenas.',
      card1: { label: 'Finalists', title: 'Startup World Cup 2025' },
      card2: { label: 'Champions', title: 'Enactus Kazakhstan National Cup ES 2025' },
      card3: { label: 'Finalist', title: 'Entrepreneurship World Cup 2025' },
      card4: { label: 'AI Sana', title: 'Best BioMedical Startup' },
      card5: { label: 'Finalists', title: 'Hult Prize 2025 Regional' },
    },
    how: {
      eyebrow: 'Pipeline',
      heading: 'Cortex AI analyzes 25+ biological parameters and transforms them into a compatibility forecast.',
      copy: 'From raw omics to clinician-ready insights, the system orchestrates models that stay transparent, self-learning, and easy to integrate.',
      step1: { title: 'Compatibility formula', body: 'A biomathematical model that uses DNA data, HLA-typing, metabolic markers, and blood group parameters to calculate the donor–recipient match index.' },
      step2: { title: 'AI agent', body: 'The AI module delivers risk analysis, compatibility hypotheses, and structured recommendations for the clinician.' },
      step3: { title: 'Self-learning engine', body: 'The system continuously trains on real transplant history, making every new prediction more accurate.' },
    },
    achievements: {
      eyebrow: 'Impact indicators', heading: 'From pilot wards to national registries.',
      slide1: { tag: 'Kidney cohort', title: '24-day earlier compatibility clarity', body: 'Multi-center pilots show Genoplexity surfaces rejection risk almost a month before invasive biopsies.' },
      slide2: { tag: 'Clinician UX', title: '98% trust in generated explanations', body: 'Narrative insights shorten tumor board reviews and satisfy regulatory evidence requests.' },
      slide3: { tag: 'Data ops', title: 'API-ready for biobanks and EHRs', body: 'Standardized endpoints connect to CKD-EPI labs, HLA labs, and transplant registries in days.' },
      slide4: { tag: 'Risk', title: 'False alarm rate below 3%', body: 'Human-in-the-loop calibration keeps alerts precise, saving staff from fatigue.' },
    },
    contact: {
      eyebrow: 'Contact', heading: 'Ready for a pilot?',
      emailLabel: 'Email:', address: 'HQ: Astana, Kazakhstan', press: 'Press: press@cortexai.bio',
      policyTitle: 'Policies', license: 'License', privacy: 'Privacy policy', terms: 'Terms of service', cookies: 'Cookie policy',
      statusTitle: 'Status', statusBody: 'Cortex AI is in limited release with select transplant centers. Reach out to join the early access cohort.',
      backToTop: 'Back to top', footnote: 'Cortex AI. Built with empathy, espresso, and a dash of innovation.',
    },
  },
  ru: {
    nav: { problem: 'Проблема', features: 'Достижения', how: 'Как это работает', achievements: 'Результаты', contact: 'Контакты', login: 'Войти' },
    hero: {
      eyebrow: 'Предиктивный интеллект трансплантации',
      title: 'Точное прогнозирование совместимости органов.',
      description: 'Cortex AI использует биоматематику, метрики CKD-EPI и анализ на основе ИИ.',
      mission: 'Наша миссия: снизить отторжение, сохранить органы, сохранить жизни.',
      coreTitle: 'Ключевые преимущества',
      adv1: 'Уникальная формула CKD-EPI + ИИ',
      adv2: 'Анализ 25+ генетических, иммунологических и метаболических маркеров',
      adv3: 'ИИ-прогноз совместимости и риска отторжения',
      adv4: 'API-интеграция с клиниками и биобанками',
      ctaPrimary: 'Запросить демо', ctaSecondary: 'Как это работает',
      cardTitle: 'Датчик совместимости в реальном времени', cardValue: 'Прогнозируемая совместимость',
      cardGenes: 'Маркеров', cardRefresh: 'Обновление модели',
      panel1: { tag: 'CKD-EPI', title: 'Тренд креатинина стабилизировался • 1.02 мг/дл', body: 'Автоматическая нормализация.' },
      panel2: { tag: 'Иммунный', title: 'Сигнал HLA-B*08 в норме', body: 'Адаптивный иммунный балл ниже порога.' },
    },
    problem: {
      eyebrow: 'Почему это важно',
      heading: 'Каждый год тысячи органов теряются из-за несовершенного подбора пар.',
      copy1: '24 000 органов теряются ежегодно. 280 000 трансплантаций проводится в мире, и до 33,8% из них сопровождаются иммунным отторжением.',
      copy2: 'Cortex AI меняет это — рассчитывая совместимость через генетику, метаболизм, CKD-EPI и ИИ.',
      stat1: { value: '24 000', label: 'Органов теряется ежегодно.' },
      stat2: { value: '280 000', label: 'Трансплантаций в год.' },
      stat3: { value: '33.8%', label: 'Сталкиваются с отторжением.' },
      stat4: { value: '4 слоя данных', label: 'Генетика, иммунология, метаболизм, CKD-EPI.' },
    },
    features: {
      eyebrow: 'Признание', heading: 'Доверие мировых инновационных площадок.',
      card1: { label: 'Финалисты', title: 'Startup World Cup 2025' },
      card2: { label: 'Чемпионы', title: 'Enactus Kazakhstan ES 2025' },
      card3: { label: 'Финалист', title: 'Entrepreneurship World Cup 2025' },
      card4: { label: 'AI Sana', title: 'Лучший биомедицинский стартап' },
      card5: { label: 'Финалисты', title: 'Hult Prize 2025 Regional' },
    },
    how: {
      eyebrow: 'Пайплайн',
      heading: 'Cortex AI анализирует 25+ биологических параметров и преобразует их в прогноз совместимости.',
      copy: 'От сырых данных до клинических выводов — система прозрачна и самообучается.',
      step1: { title: 'Формула совместимости', body: 'Биоматематическая модель: ДНК, HLA-типирование, метаболические маркеры, группа крови.' },
      step2: { title: 'ИИ-агент', body: 'Анализ рисков, гипотезы о совместимости, структурированные рекомендации.' },
      step3: { title: 'Самообучающийся движок', body: 'Постоянно обучается на реальной истории трансплантаций.' },
    },
    achievements: {
      eyebrow: 'Показатели воздействия', heading: 'От пилотных отделений до национальных реестров.',
      slide1: { tag: 'Когорта почек', title: 'На 24 дня раньше — ясность совместимости', body: 'Риск отторжения выявляется почти за месяц до биопсии.' },
      slide2: { tag: 'UX для врачей', title: '98% доверия к объяснениям', body: 'Нарративные выводы сокращают опухолевые комитеты.' },
      slide3: { tag: 'Данные', title: 'API-готовность для биобанков', body: 'Подключение к лабораториям за дни.' },
      slide4: { tag: 'Риск', title: 'Ложные срабатывания ниже 3%', body: 'Человек в петле калибрует оповещения.' },
    },
    contact: {
      eyebrow: 'Контакты', heading: 'Готовы к пилоту?',
      emailLabel: 'Email:', address: 'Штаб-квартира: Астана, Казахстан', press: 'Пресса: press@cortexai.bio',
      policyTitle: 'Политики', license: 'Лицензия', privacy: 'Конфиденциальность', terms: 'Условия использования', cookies: 'Cookie',
      statusTitle: 'Статус', statusBody: 'Cortex AI в ограниченном выпуске. Свяжитесь с нами.',
      backToTop: 'Наверх', footnote: 'Cortex AI. Создано с эмпатией и инновациями.',
    },
  },
};

const AWARDS = [
  { icon: '🏆', k: 'card1' }, { icon: '🥇', k: 'card2' }, { icon: '🚀', k: 'card3' },
  { icon: '🧬', k: 'card4' }, { icon: '🌍', k: 'card5' },
];
const STEPS = ['step1', 'step2', 'step3'];
const SLIDES = ['slide1', 'slide2', 'slide3', 'slide4'];
const STATS = ['stat1', 'stat2', 'stat3', 'stat4'];

export default function LandingPage() {
  const [lang, setLang] = useState('en');
  const [navOpen, setNavOpen] = useState(false);

  const t = (path) => {
    const keys = path.split('.');
    let obj = I18N[lang];
    for (const k of keys) obj = obj?.[k];
    return obj ?? path;
  };

  // Slider logic per slider instance
  const makeSlider = (id) => ({
    prev: () => {
      const track = document.querySelector(`#${id} .slider-track`);
      if (!track) return;
      const cards = Array.from(track.children);
      const idx = Math.max(0, Math.floor(track.scrollLeft / (cards[0]?.offsetWidth + 16)) - 1);
      track.scrollLeft = (cards[idx]?.offsetLeft ?? 0) - track.offsetLeft;
    },
    next: () => {
      const track = document.querySelector(`#${id} .slider-track`);
      if (!track) return;
      const cards = Array.from(track.children);
      const idx = Math.min(cards.length - 1, Math.floor(track.scrollLeft / (cards[0]?.offsetWidth + 16)) + 1);
      track.scrollLeft = (cards[idx]?.offsetLeft ?? 0) - track.offsetLeft;
    },
  });

  useEffect(() => {
    // Scroll animation
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => e.target.classList.toggle('visible', e.isIntersecting)),
      { threshold: 0.15 }
    );
    document.querySelectorAll('[data-scroll]').forEach(el => observer.observe(el));

    // Year
    const yr = document.getElementById('year');
    if (yr) yr.textContent = new Date().getFullYear();

    // Autoplay for achievements slider
    const achieveTrack = document.querySelector('#slider-achievements .slider-track');
    if (achieveTrack) {
      let idx = 0;
      const timer = setInterval(() => {
        const cards = Array.from(achieveTrack.children);
        idx = (idx + 1) % cards.length;
        achieveTrack.scrollLeft = (cards[idx]?.offsetLeft ?? 0) - achieveTrack.offsetLeft;
      }, 7000);
      return () => { clearInterval(timer); observer.disconnect(); };
    }
    return () => observer.disconnect();
  }, [lang]);

  const awards = makeSlider('slider-awards');
  const achievements = makeSlider('slider-achievements');

  return (
    <>
      <div className="entry-label">Entry</div>
      <header className="hero" id="hero">
        <nav className="navbar">
          <a className="logo" href="#hero"><img src="/logo.png" alt="Cortex AI" width={50} /></a>
          <div className="nav-main">
            <button className="nav-toggle" aria-label="Toggle navigation" onClick={() => setNavOpen(o => !o)}>
              <span /><span /><span />
            </button>
            <ul className={`nav-links${navOpen ? ' open' : ''}`}>
              <li><a href="#problem" onClick={() => setNavOpen(false)}>{t('nav.problem')}</a></li>
              <li><a href="#features" onClick={() => setNavOpen(false)}>{t('nav.features')}</a></li>
              <li><a href="#how-it-works" onClick={() => setNavOpen(false)}>{t('nav.how')}</a></li>
              <li><a href="#achievements" onClick={() => setNavOpen(false)}>{t('nav.achievements')}</a></li>
              <li><a href="#contact" onClick={() => setNavOpen(false)}>{t('nav.contact')}</a></li>
              <li><a href="/login" className="btn small ghost">{t('nav.login')}</a></li>
            </ul>
            <div className="lang-switch" role="group" aria-label="Language toggle">
              <button className={`lang-btn${lang === 'en' ? ' active' : ''}`} onClick={() => setLang('en')}>EN</button>
              <button className={`lang-btn${lang === 'ru' ? ' active' : ''}`} onClick={() => setLang('ru')}>RU</button>
            </div>
          </div>
        </nav>

        <div className="hero-grid">
          <div className="hero-text" data-scroll>
            <p className="eyebrow">{t('hero.eyebrow')}</p>
            <h1>{t('hero.title')}</h1>
            <p className="hero-copy">{t('hero.description')}</p>
            <p className="hero-mission">{t('hero.mission')}</p>
            <div className="core-advantages">
              <h4>{t('hero.coreTitle')}</h4>
              <ul>
                <li><span className="icon-badge">Σ</span><span>{t('hero.adv1')}</span></li>
                <li><span className="icon-badge">⚗️</span><span>{t('hero.adv2')}</span></li>
                <li><span className="icon-badge">⏱</span><span>{t('hero.adv3')}</span></li>
                <li><span className="icon-badge">API</span><span>{t('hero.adv4')}</span></li>
              </ul>
            </div>
            <div className="hero-actions">
              <Link className="btn primary" to="/demo">{t('hero.ctaPrimary')}</Link>
              <a className="btn ghost" href="#how-it-works">{t('hero.ctaSecondary')}</a>
            </div>
          </div>

          <div className="hero-visual" data-scroll aria-label="Compatibility forecast preview">
            <div className="compatibility-card">
              <p className="meta-label">{t('hero.cardTitle')}</p>
              <div className="gauge">
                <svg viewBox="0 0 120 60" role="img" aria-label="compatibility gauge">
                  <path d="M10 55 Q60 5 110 55" className="gauge-arc" />
                  <circle className="gauge-indicator" cx={60} cy={55} r={6} />
                </svg>
                <div className="gauge-value">
                  <strong>87%</strong>
                  <span>{t('hero.cardValue')}</span>
                </div>
              </div>
              <div className="sparkline" aria-hidden="true">
                {[45,65,75,60,85,72].map((h,i) => <span key={i} style={{ '--h': `${h}%` }} />)}
              </div>
              <div className="card-foot">
                <div><p className="meta-label">{t('hero.cardGenes')}</p><strong>25+</strong></div>
                <div><p className="meta-label">{t('hero.cardRefresh')}</p><strong>Hourly</strong></div>
              </div>
            </div>
            <div className="mini-panels">
              <article>
                <span className="tag">{t('hero.panel1.tag')}</span>
                <h4>{t('hero.panel1.title')}</h4>
                <p>{t('hero.panel1.body')}</p>
              </article>
              <article>
                <span className="tag">{t('hero.panel2.tag')}</span>
                <h4>{t('hero.panel2.title')}</h4>
                <p>{t('hero.panel2.body')}</p>
              </article>
            </div>
          </div>
        </div>
        <div className="hero-gradient" aria-hidden="true" />
        <div className="hero-gif-overlay" aria-hidden="true" />
      </header>

      <main>
        {/* Problem */}
        <section id="problem" className="section light">
          <div className="section-header" data-scroll>
            <p className="eyebrow">{t('problem.eyebrow')}</p>
            <h2>{t('problem.heading')}</h2>
            <p>{t('problem.copy1')}</p>
            <p>{t('problem.copy2')}</p>
          </div>
          <div className="stat-grid" data-scroll>
            {STATS.map(k => (
              <article key={k}>
                <span className="stat-value">{t(`problem.${k}.value`)}</span>
                <p>{t(`problem.${k}.label`)}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Awards */}
        <section id="features" className="section">
          <div className="section-header" data-scroll>
            <p className="eyebrow">{t('features.eyebrow')}</p>
            <h2>{t('features.heading')}</h2>
          </div>
          <div id="slider-awards" className="slider awards" data-scroll>
            <button className="slider-control prev" aria-label="Previous recognition" onClick={awards.prev}>←</button>
            <div className="slider-track">
              {AWARDS.map(({ icon, k }) => (
                <article key={k} className="slide award-card">
                  <span className="award-icon">{icon}</span>
                  <p className="award-label">{t(`features.${k}.label`)}</p>
                  <h3>{t(`features.${k}.title`)}</h3>
                </article>
              ))}
            </div>
            <button className="slider-control next" aria-label="Next recognition" onClick={awards.next}>→</button>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="section light">
          <div className="section-header" data-scroll>
            <p className="eyebrow">{t('how.eyebrow')}</p>
            <h2>{t('how.heading')}</h2>
            <p>{t('how.copy')}</p>
          </div>
          <div className="steps" data-scroll>
            {STEPS.map((k, i) => (
              <article key={k}>
                <span className="step-index">0{i+1}</span>
                <h3>{t(`how.${k}.title`)}</h3>
                <p>{t(`how.${k}.body`)}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Achievements */}
        <section id="achievements" className="section">
          <div className="section-header" data-scroll>
            <p className="eyebrow">{t('achievements.eyebrow')}</p>
            <h2>{t('achievements.heading')}</h2>
          </div>
          <div id="slider-achievements" className="slider" data-scroll>
            <button className="slider-control prev" aria-label="Previous slide" onClick={achievements.prev}>←</button>
            <div className="slider-track">
              {SLIDES.map(k => (
                <article className="slide" key={k}>
                  <span className="tag">{t(`achievements.${k}.tag`)}</span>
                  <h3>{t(`achievements.${k}.title`)}</h3>
                  <p>{t(`achievements.${k}.body`)}</p>
                </article>
              ))}
            </div>
            <button className="slider-control next" aria-label="Next slide" onClick={achievements.next}>→</button>
          </div>
        </section>
      </main>

      <footer id="contact" className="footer">
        <div className="exit-label">Exit</div>
        <div className="footer-grid">
          <div>
            <p className="eyebrow">{t('contact.eyebrow')}</p>
            <h3>{t('contact.heading')}</h3>
            <ul className="contact-list">
              <li><span>{t('contact.emailLabel')}</span> <a href="mailto:contact@cortex.ai">contact@cortex.ai</a></li>
              <li>{t('contact.address')}</li>
              <li>{t('contact.press')}</li>
            </ul>
          </div>
          <div>
            <p className="eyebrow">{t('contact.policyTitle')}</p>
            <ul className="policy-list">
              <li><a href="#">{t('contact.license')}</a></li>
              <li><a href="#">{t('contact.privacy')}</a></li>
              <li><a href="#">{t('contact.terms')}</a></li>
              <li><a href="#">{t('contact.cookies')}</a></li>
            </ul>
          </div>
          <div>
            <p className="eyebrow">{t('contact.statusTitle')}</p>
            <p>{t('contact.statusBody')}</p>
            <a className="btn small" href="#hero">{t('contact.backToTop')}</a>
          </div>
        </div>
        <p className="footnote">© <span id="year" /> {t('contact.footnote')}</p>
      </footer>
    </>
  );
}
