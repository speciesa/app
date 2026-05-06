export default {
  tabs: {
    home: 'Home',
    catalog: 'Catalog',
    search: 'Search',
    favorites: 'Favorites',
    profile: 'Profile',
  },
  catalog: { title: 'Catalog', all_kingdoms: 'All kingdoms', species_count: '{{count}} species' },
  species: {
    classification: 'Classification', description: 'Description',
    habitat: 'Habitat & Range', attributes: 'Attributes', related: 'Related species',
    iucn_status: 'Conservation status', add_to_collection: 'Save', share: 'Share',
  },
  search: { placeholder: 'Search species...', no_results: 'No results found', results_for: 'Results for "{{query}}"' },
  premium: {
    title: 'Speciesa Premium', subtitle: 'The whole atlas in your pocket — offline, ad-free',
    feature_offline: 'Full catalog offline', feature_offline_sub: 'Download once, use anywhere',
    feature_no_ads: 'No ads, ever', feature_extended: 'Extended descriptions',
    feature_extended_sub: 'Full articles, ranges, classification',
    feature_collections: 'Collections & notes', feature_collections_sub: 'Save species to personal lists',
    cta: 'Subscribe for €2.99 / month', trial_note: '7 days free · Cancel anytime',
    continue_free: 'Continue for free',
  },
  auth: { login: 'Log in', register: 'Sign up', email: 'Email', password: 'Password', logout: 'Log out' },
  errors: { generic: 'Something went wrong', not_found: 'Not found', retry: 'Retry' },
  iucn: { lc: 'Least Concern', nt: 'Near Threatened', vu: 'Vulnerable', en: 'Endangered', cr: 'Critically Endangered', ew: 'Extinct in Wild', ex: 'Extinct', dd: 'Data Deficient' },
  ranks: { kingdom: 'Kingdom', phylum: 'Phylum', class: 'Class', order: 'Order', family: 'Family', genus: 'Genus', species: 'Species' },
};
