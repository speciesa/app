export default {
  tabs: {
    home: 'Home',
    catalog: 'Catalog',
    search: 'Search',
    favorites: 'Favorites',
    profile: 'Profile',
  },

  home: {
    title: 'BioAtlas',
    subtitle: 'Catalog of living nature',
  },

  catalog: {
    title: 'Catalog',
    all_kingdoms: 'All kingdoms',
    species_count: '{{count}} species',
  },

  species: {
    classification: 'Classification',
    description: 'Description',
    habitat: 'Habitat & Range',
    attributes: 'Attributes',
    related: 'Related species',
    iucn_status: 'Conservation status',
    add_to_collection: 'Save',
    share: 'Share',
  },

  search: {
    placeholder: 'Search species...',
    no_results: 'No results found',
    results_for: 'Results for "{{query}}"',
  },

  favorites: {
    title: 'Favorites',
    empty_title: 'No favorites yet',
    empty_subtitle: 'Save species to your collection\n(available in Premium)',
  },

  profile: {
    title: 'Profile',
    login: 'Log in to your account',
    language: 'Language',
    logout: 'Log out',

    premium_cta: 'Get Premium',

    subscription_active: '⭐ Premium',
    subscription_trial: '🆓 Trial period',
    subscription_free: 'Free',
  },

  premium: {
    title: 'Speciesa Premium',
    subtitle: 'The whole atlas in your pocket — offline, ad-free',

    feature_offline: 'Full catalog offline',
    feature_offline_sub: 'Download once, use anywhere',

    feature_no_ads: 'No ads, ever',

    feature_extended: 'Extended descriptions',
    feature_extended_sub: 'Full articles, ranges, classification',

    feature_collections: 'Collections & notes',
    feature_collections_sub: 'Save species to personal lists',

    cta: 'Subscribe for €2.99 / month',
    trial_note: '7 days free · Cancel anytime',
    continue_free: 'Continue for free',
  },

  auth: {
    login: 'Log in',
    register: 'Sign up',
    email: 'Email',
    password: 'Password',
    logout: 'Log out',
    register_title: 'Create account',
    register_sub: '7 days of Premium for free after registration',
    password_hint: 'Password (min 8 characters)',
    have_account: 'Already have an account? Log in',
    password_min_length: 'Password must be at least 8 characters',
    register_failed: 'Registration failed. Try a different email.',
  },

  packs: {
    title: 'Offline packs',
    subtitle: 'Download sections for offline use',
    delete_title: 'Delete pack?',
    delete_desc: 'Pack "{{name}}" will be removed from device.',
    cancel: 'Cancel',
    delete: 'Delete',
    downloaded: 'Downloaded',
    download: 'Download',
    downloading: 'Downloading',
    meta: '{{count}} species · ~{{size}} MB',
  },

  errors: {
    generic: 'Something went wrong',
    not_found: 'Not found',
    retry: 'Retry',
    invalid_credentials: 'Invalid email or password',
  },

  /**
   * IMPORTANT: unified naming (matches helpers)
   */
  iucn: {
    lc: 'Least Concern',
    nt: 'Near Threatened',
    vu: 'Vulnerable',
    en: 'Endangered',
    cr: 'Critically Endangered',
    ew: 'Extinct in Wild',
    ex: 'Extinct',
    dd: 'Data Deficient',
  },

  rank: {
    kingdom: 'Kingdom',
    phylum: 'Phylum',
    class: 'Class',
    order: 'Order',
    family: 'Family',
    genus: 'Genus',
    species: 'Species',
  },
};