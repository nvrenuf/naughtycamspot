export const LANGS = ['en', 'es', 'pt', 'ru', 'ua'];

export const normalizeLang = (value) => {
  const raw = typeof value === 'string' ? value.trim().toLowerCase() : '';
  if (raw === 'es') return 'es';
  if (raw === 'pt') return 'pt';
  if (raw === 'ru') return 'ru';
  if (raw === 'ua') return 'ua';
  return 'en';
};

export const getRequestLang = (url) => normalizeLang(url?.searchParams?.get('lang'));

const EN = {
  'lang.label': 'Language',

  'home.hero.tag': 'Mobile-first onboarding support',
  'home.hero.title': 'Get started fast with platform signup help or paid promotion.',
  'home.hero.sub':
    'Pick your path in minutes. Use signup links to start on the right platform, then add promotion packages when you want more traffic.',
  'home.hero.cta.signup': 'Platform signup help',
  'home.hero.cta.promo': 'See Promotion Packages',

  'apply.tag': 'Apply to NCS',
  'apply.title': 'Get matched to the right promo stack.',
  'apply.sub':
    'Tell us how to reach you and which platforms you want to grow. We will follow up with a launch plan, platform checklist, and next steps for automation.',
  'apply.fastlane.trust': 'No passwords. No exclusivity. You keep your accounts.',
  'apply.fastlane.telegram': 'Telegram (recommended)',
  'apply.fastlane.platform_interest': 'Platform interest',
  'apply.fastlane.consent': 'I am 18+ and I agree to receive onboarding messages from NaughtyCamSpot.',

  'packages.tag': 'Promotion packages',
  'packages.title': 'Pick the support level that fits your week.',
  'packages.cta': 'Start application',

  'platforms.title': 'Pick platforms that match your goals.',
  'platforms.cta': 'Apply'
};

const ES = {
  'lang.label': 'Idioma',
  'home.hero.tag': 'Soporte de inicio en el móvil',
  'home.hero.title': 'Empieza rápido con ayuda para registrarte en plataformas o promoción de pago.',
  'home.hero.sub':
    'Elige tu camino en minutos. Usa enlaces de registro para empezar en la plataforma correcta y luego añade paquetes de promoción cuando quieras más tráfico.',
  'home.hero.cta.signup': 'Ayuda de registro',
  'home.hero.cta.promo': 'Ver paquetes de promoción',
  'apply.tag': 'Solicitud',
  'apply.title': 'Te asignamos el plan de promoción correcto.',
  'apply.sub':
    'Dinos cómo contactarte y qué plataformas quieres crecer. Te enviaremos un plan de lanzamiento, checklist y próximos pasos.',
  'apply.fastlane.trust': 'Sin contraseñas. Sin exclusividad. Tus cuentas son tuyas.',
  'apply.fastlane.telegram': 'Telegram (recomendado)',
  'apply.fastlane.platform_interest': 'Plataformas de interés',
  'apply.fastlane.consent': 'Tengo 18+ y acepto recibir mensajes de onboarding de NaughtyCamSpot.',
  'packages.tag': 'Paquetes de promoción',
  'packages.title': 'Elige el nivel de soporte para tu semana.',
  'packages.cta': 'Empezar solicitud',
  'platforms.title': 'Elige plataformas que encajen con tus objetivos.',
  'platforms.cta': 'Solicitar'
};

const PT = {
  'lang.label': 'Idioma',
  'home.hero.tag': 'Suporte no celular',
  'home.hero.title': 'Comece rápido com ajuda de cadastro em plataformas ou promoção paga.',
  'home.hero.sub':
    'Escolha seu caminho em minutos. Use links de cadastro para começar na plataforma certa e depois adicione pacotes de promoção quando quiser mais tráfego.',
  'home.hero.cta.signup': 'Ajuda de cadastro',
  'home.hero.cta.promo': 'Ver pacotes de promoção',
  'apply.tag': 'Aplicar',
  'apply.title': 'Vamos te encaixar no pacote certo.',
  'apply.sub':
    'Diga como falar com você e quais plataformas você quer crescer. Vamos enviar um plano de lançamento e próximos passos.',
  'apply.fastlane.trust': 'Sem senhas. Sem exclusividade. Suas contas são suas.',
  'apply.fastlane.telegram': 'Telegram (recomendado)',
  'apply.fastlane.platform_interest': 'Plataformas de interesse',
  'apply.fastlane.consent': 'Tenho 18+ e aceito receber mensagens de onboarding da NaughtyCamSpot.',
  'packages.tag': 'Pacotes de promoção',
  'packages.title': 'Escolha o nivel de suporte para sua semana.',
  'packages.cta': 'Iniciar aplicação',
  'platforms.title': 'Escolha plataformas que combinam com seus objetivos.',
  'platforms.cta': 'Aplicar'
};

const RU = {
  'lang.label': 'Язык',
  'home.hero.tag': 'Поддержка с телефона',
  'home.hero.title': 'Быстрый старт: помощь с регистрацией или платная промо-поддержка.',
  'home.hero.sub':
    'Выберите путь за пару минут. Используйте ссылки для регистрации на подходящей платформе, а потом добавьте продвижение, когда захотите больше трафика.',
  'home.hero.cta.signup': 'Помощь с регистрацией',
  'home.hero.cta.promo': 'Пакеты продвижения',
  'apply.tag': 'Заявка',
  'apply.title': 'Подберём подходящий пакет.',
  'apply.sub':
    'Напишите, как с вами связаться и какие платформы вам интересны. Мы отправим план старта и следующие шаги.',
  'apply.fastlane.trust': 'Без паролей. Без эксклюзива. Аккаунты ваши.',
  'apply.fastlane.telegram': 'Telegram (рекомендуем)',
  'apply.fastlane.platform_interest': 'Платформы интереса',
  'apply.fastlane.consent': 'Мне 18+ и я согласен(на) получать сообщения от NaughtyCamSpot.',
  'packages.tag': 'Пакеты продвижения',
  'packages.title': 'Выберите уровень поддержки на неделю.',
  'packages.cta': 'Начать заявку',
  'platforms.title': 'Выберите платформы под ваши цели.',
  'platforms.cta': 'Подать заявку'
};

const UA = {
  'lang.label': 'Мова',
  'home.hero.tag': 'Підтримка з телефону',
  'home.hero.title': 'Швидкий старт: допомога з реєстрацією або платне просування.',
  'home.hero.sub':
    'Оберіть шлях за кілька хвилин. Використовуйте посилання для реєстрації на потрібній платформі, а потім додавайте просування, коли захочете більше трафіку.',
  'home.hero.cta.signup': 'Допомога з реєстрацією',
  'home.hero.cta.promo': 'Пакети просування',
  'apply.tag': 'Заявка',
  'apply.title': 'Підберемо правильний пакет.',
  'apply.sub':
    'Скажіть, як з вами зв’язатися, і які платформи вам цікаві. Ми надішлемо план старту та наступні кроки.',
  'apply.fastlane.trust': 'Без паролів. Без ексклюзиву. Акаунти ваші.',
  'apply.fastlane.telegram': 'Telegram (рекомендуємо)',
  'apply.fastlane.platform_interest': 'Платформи інтересу',
  'apply.fastlane.consent': 'Мені 18+ і я згоден(на) отримувати повідомлення від NaughtyCamSpot.',
  'packages.tag': 'Пакети просування',
  'packages.title': 'Оберіть рівень підтримки на тиждень.',
  'packages.cta': 'Почати заявку',
  'platforms.title': 'Оберіть платформи під ваші цілі.',
  'platforms.cta': 'Подати заявку'
};

const DICTS = {
  en: EN,
  es: ES,
  pt: PT,
  ru: RU,
  ua: UA
};

export const t = (lang, key) => {
  const l = normalizeLang(lang);
  const dict = DICTS[l] || EN;
  return dict[key] ?? EN[key] ?? key;
};
