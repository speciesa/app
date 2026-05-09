export default {
  tabs: {
    home: 'Главная',
    catalog: 'Каталог',
    search: 'Поиск',
    favorites: 'Избранное',
    profile: 'Профиль',
  },

  home: {
    title: 'БиоАтлас',
    subtitle: 'Каталог живой природы',
  },

  catalog: {
    title: 'Каталог',
    all_kingdoms: 'Все царства',
    species_count: '{{count}} видов',
  },

  species: {
    classification: 'Классификация',
    description: 'Описание',
    habitat: 'Ареал и среда обитания',
    attributes: 'Характеристики',
    related: 'Похожие виды',
    iucn_status: 'Статус охраны',
    add_to_collection: 'В коллекцию',
    share: 'Поделиться',
  },

  search: {
    placeholder: 'Поиск вида или органа...',
    no_results: 'Ничего не найдено',
    results_for: 'Результаты для «{{query}}»',
  },

  favorites: {
    title: 'Избранное',
    empty_title: 'Пока пусто',
    empty_subtitle: 'Сохраняйте виды в коллекцию\n(доступно в Premium)',
  },

  profile: {
    title: 'Профиль',
    login: 'Войти в аккаунт',
    language: 'Язык',
    logout: 'Выйти',

    premium_cta: 'Получить Premium',

    subscription_active: '⭐ Premium',
    subscription_trial: '🆓 Пробный период',
    subscription_free: 'Бесплатный',
  },

  premium: {
    title: 'Биоатлас Premium',
    subtitle: 'Весь атлас в кармане — без рекламы, без интернета',

    feature_offline: 'Весь каталог офлайн',
    feature_offline_sub: 'Скачайте один раз — работает без сети',

    feature_no_ads: 'Без рекламы навсегда',

    feature_extended: 'Расширенные описания',
    feature_extended_sub: 'Полные статьи, ареалы, классификация',

    feature_collections: 'Коллекции и заметки',
    feature_collections_sub: 'Сохраняйте виды в личные списки',

    cta: 'Оформить за 2.99 € / мес',
    trial_note: 'Первые 7 дней бесплатно · Отменить можно в любой момент',
    continue_free: 'Продолжить бесплатно',
  },

  auth: {
    login: 'Войти',
    register: 'Зарегистрироваться',
    email: 'Электронная почта',
    password: 'Пароль',
    logout: 'Выйти',
    register_title: 'Создать аккаунт',
    register_sub: '7 дней Premium бесплатно после регистрации',
    password_hint: 'Пароль (минимум 8 символов)',
    have_account: 'Уже есть аккаунт? Войти',
    password_min_length: 'Пароль должен быть не менее 8 символов',
    register_failed: 'Не удалось зарегистрироваться. Попробуйте другой email.',
  },

  packs: {
    title: 'Офлайн-пакеты',
    subtitle: 'Скачайте разделы для работы без интернета',
    delete_title: 'Удалить пакет?',
    delete_desc: 'Пакет «{{name}}» будет удалён с устройства.',
    cancel: 'Отмена',
    delete: 'Удалить',
    downloaded: 'Загружено',
    download: 'Скачать',
    downloading: 'Загрузка',
    meta: '{{count}} species · ~{{size}} MB',
  },

  errors: {
    generic: 'Что-то пошло не так',
    not_found: 'Не найдено',
    retry: 'Повторить',
    invalid_credentials: 'Неверный email или пароль',
  },

  /**
   * unified naming (IMPORTANT)
   */
  iucn: {
    lc: 'Наим. угрожаемый',
    nt: 'Близко к угрозе',
    vu: 'Уязвимый',
    en: 'Под угрозой',
    cr: 'Критически',
    ew: 'Исчезнувший в природе',
    ex: 'Вымерший',
    dd: 'Недост. данных',
  },

  rank: {
    kingdom: 'Царство',
    phylum: 'Тип / Отдел',
    class: 'Класс',
    order: 'Порядок',
    family: 'Семейство',
    genus: 'Род',
    species: 'Вид',
  },
};