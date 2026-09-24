/**
 * SizeToolsHub Multilingual Route & Alternate Matrix
 * Supports accurate cross-referencing and hreflang resolution across all 4 supported locales:
 *   - en: English (default at root /)
 *   - pt-br: Portuguese (Brazil) (/pt-br/)
 *   - es: Spanish (/es/)
 *   - fr: French (/fr/)
 */

export interface LocaleRouteMap {
  en: string;
  'pt-br': string;
  es: string;
  fr: string;
}

export const ROUTE_MATRIX: LocaleRouteMap[] = [
  // ── Hubs / Root ──
  {
    en: '/',
    'pt-br': '/pt-br/',
    es: '/es/',
    fr: '/fr/',
  },
  {
    en: '/shoe-size/',
    'pt-br': '/pt-br/tamanho-calcado/',
    es: '/es/talla-zapatos/',
    fr: '/fr/pointure/',
  },
  {
    en: '/clothing-size/',
    'pt-br': '/pt-br/tamanho-roupa/',
    es: '/es/talla-ropa/',
    fr: '/fr/taille-vetement/',
  },

  // ── Shoe Converters (22 tools) ──
  {
    en: '/shoe-size/us-to-eu/',
    'pt-br': '/pt-br/tamanho-calcado/eua-para-europa/',
    es: '/es/talla-zapatos/eeuu-a-europa/',
    fr: '/fr/pointure/us-vers-eu/',
  },
  {
    en: '/shoe-size/eu-to-us/',
    'pt-br': '/pt-br/tamanho-calcado/europa-para-eua/',
    es: '/es/talla-zapatos/europa-a-eeuu/',
    fr: '/fr/pointure/eu-vers-us/',
  },
  {
    en: '/shoe-size/us-to-uk/',
    'pt-br': '/pt-br/tamanho-calcado/eua-para-reino-unido/',
    es: '/es/talla-zapatos/eeuu-a-reino-unido/',
    fr: '/fr/pointure/us-vers-uk/',
  },
  {
    en: '/shoe-size/uk-to-us/',
    'pt-br': '/pt-br/tamanho-calcado/reino-unido-para-eua/',
    es: '/es/talla-zapatos/reino-unido-a-eeuu/',
    fr: '/fr/pointure/uk-vers-us/',
  },
  {
    en: '/shoe-size/cm-to-shoe-size/',
    'pt-br': '/pt-br/tamanho-calcado/cm-para-tamanho-calcado/',
    es: '/es/talla-zapatos/cm-a-talla-zapato/',
    fr: '/fr/pointure/cm-en-pointure/',
  },
  {
    en: '/shoe-size/cm-to-us/',
    'pt-br': '/pt-br/tamanho-calcado/cm-para-eua/',
    es: '/es/talla-zapatos/cm-a-talla-eeuu/',
    fr: '/fr/pointure/cm-vers-us/',
  },
  {
    en: '/shoe-size/foot-length-to-shoe-size/',
    'pt-br': '/pt-br/tamanho-calcado/comprimento-do-pe-para-tamanho-calcado/',
    es: '/es/talla-zapatos/longitud-pie-a-talla-zapato/',
    fr: '/fr/pointure/longueur-pied-en-pointure/',
  },
  {
    en: '/shoe-size/mens-to-womens/',
    'pt-br': '/pt-br/tamanho-calcado/masculino-para-feminino/',
    es: '/es/talla-zapatos/hombre-a-mujer/',
    fr: '/fr/pointure/homme-vers-femme/',
  },
  {
    en: '/shoe-size/womens-to-mens/',
    'pt-br': '/pt-br/tamanho-calcado/feminino-para-masculino/',
    es: '/es/talla-zapatos/mujer-a-hombre/',
    fr: '/fr/pointure/femme-vers-homme/',
  },
  {
    en: '/shoe-size/running-shoe-size-converter/',
    'pt-br': '/pt-br/tamanho-calcado/tamanho-tenis-corrida/',
    es: '/es/talla-zapatos/talla-zapatillas-running/',
    fr: '/fr/pointure/pointure-chaussures-course/',
  },
  {
    en: '/shoe-size/kids-size-chart/',
    'pt-br': '/pt-br/tamanho-calcado/tabela-tamanhos-infantis/',
    es: '/es/talla-zapatos/tabla-tallas-ninos/',
    fr: '/fr/pointure/guide-pointures-enfants/',
  },
  {
    en: '/shoe-size/toddler-size-converter/',
    'pt-br': '/pt-br/tamanho-calcado/tamanho-calcado-primeiros-passos/',
    es: '/es/talla-zapatos/tallas-zapatos-primeros-pasos/',
    fr: '/fr/pointure/pointure-bebe-premiers-pas/',
  },
  {
    en: '/shoe-size/baby-shoe-size-chart/',
    'pt-br': '/pt-br/tamanho-calcado/tabela-calcados-bebe/',
    es: '/es/talla-zapatos/tabla-tallas-bebes/',
    fr: '/fr/pointure/guide-pointures-bebes/',
  },
  {
    en: '/shoe-size/nike-size-chart/',
    'pt-br': '/pt-br/tamanho-calcado/tabela-tamanhos-nike/',
    es: '/es/talla-zapatos/tabla-tallas-nike/',
    fr: '/fr/pointure/guide-tailles-nike/',
  },
  {
    en: '/shoe-size/adidas-size-chart/',
    'pt-br': '/pt-br/tamanho-calcado/tabela-tamanhos-adidas/',
    es: '/es/talla-zapatos/tabla-tallas-adidas/',
    fr: '/fr/pointure/guide-tailles-adidas/',
  },
  {
    en: '/shoe-size/converse-size/',
    'pt-br': '/pt-br/tamanho-calcado/tabela-tamanhos-converse-all-star/',
    es: '/es/talla-zapatos/tabla-tallas-converse/',
    fr: '/fr/pointure/guide-tailles-converse/',
  },
  {
    en: '/shoe-size/vans-size/',
    'pt-br': '/pt-br/tamanho-calcado/tabela-tamanhos-vans/',
    es: '/es/talla-zapatos/tabla-tallas-vans/',
    fr: '/fr/pointure/guide-tailles-vans/',
  },
  {
    en: '/shoe-size/new-balance-size/',
    'pt-br': '/pt-br/tamanho-calcado/tabela-tamanhos-new-balance/',
    es: '/es/talla-zapatos/tabla-tallas-new-balance/',
    fr: '/fr/pointure/guide-tailles-new-balance/',
  },
  {
    en: '/shoe-size/puma-size-chart/',
    'pt-br': '/pt-br/tamanho-calcado/tabela-tamanhos-puma/',
    es: '/es/talla-zapatos/tabla-tallas-puma/',
    fr: '/fr/pointure/guide-tailles-puma/',
  },
  {
    en: '/shoe-size/asics-size-guide/',
    'pt-br': '/pt-br/tamanho-calcado/guia-tamanhos-asics/',
    es: '/es/talla-zapatos/guia-tallas-asics/',
    fr: '/fr/pointure/guide-tailles-asics/',
  },
  {
    en: '/shoe-size/us-to-mexico/',
    'pt-br': '/pt-br/tamanho-calcado/eua-para-brasil/',
    es: '/es/talla-zapatos/eeuu-a-mexico/',
    fr: '/fr/pointure/us-vers-france/',
  },
  {
    en: '/shoe-size/us-to-japan/',
    'pt-br': '/pt-br/tamanho-calcado/brasil-para-eua/',
    es: '/es/talla-zapatos/mexico-a-eeuu/',
    fr: '/fr/pointure/france-vers-us/',
  },

  // ── Clothing Converters (12 tools) ──
  {
    en: '/clothing-size/international-clothing-sizes/',
    'pt-br': '/pt-br/tamanho-roupa/tabela-tamanhos-roupas-internacional/',
    es: '/es/talla-ropa/tabla-tallas-ropa-internacional/',
    fr: '/fr/taille-vetement/guide-tailles-vetements-international/',
  },
  {
    en: '/clothing-size/us-to-eu-womens/',
    'pt-br': '/pt-br/tamanho-roupa/eua-para-europa-feminino/',
    es: '/es/talla-ropa/eeuu-a-europa-mujer/',
    fr: '/fr/taille-vetement/us-vers-eu-femme/',
  },
  {
    en: '/clothing-size/us-to-uk/',
    'pt-br': '/pt-br/tamanho-roupa/eua-para-reino-unido/',
    es: '/es/talla-ropa/eeuu-a-reino-unido/',
    fr: '/fr/taille-vetement/us-vers-uk/',
  },
  {
    en: '/clothing-size/uk-to-us-mens/',
    'pt-br': '/pt-br/tamanho-roupa/reino-unido-para-eua-masculino/',
    es: '/es/talla-ropa/reino-unido-a-eeuu-hombre/',
    fr: '/fr/taille-vetement/uk-vers-us-homme/',
  },
  {
    en: '/clothing-size/dress-size-chart/',
    'pt-br': '/pt-br/tamanho-roupa/tabela-tamanhos-vestidos/',
    es: '/es/talla-ropa/tabla-tallas-vestidos/',
    fr: '/fr/taille-vetement/guide-tailles-robes/',
  },
  {
    en: '/clothing-size/shirt-size-converter/',
    'pt-br': '/pt-br/tamanho-roupa/tabela-camisas-masculinas/',
    es: '/es/talla-ropa/tabla-tallas-camisas-hombre/',
    fr: '/fr/taille-vetement/guide-tailles-chemises-homme/',
  },
  {
    en: '/clothing-size/jeans-size-converter/',
    'pt-br': '/pt-br/tamanho-roupa/conversor-tamanho-calca-jeans/',
    es: '/es/talla-ropa/conversor-tallas-pantalones-jeans/',
    fr: '/fr/taille-vetement/convertisseur-tailles-jeans/',
  },
  {
    en: '/clothing-size/bra-size-converter/',
    'pt-br': '/pt-br/tamanho-roupa/tabela-tamanhos-sutia/',
    es: '/es/talla-ropa/tabla-tallas-sujetador/',
    fr: '/fr/taille-vetement/guide-tailles-soutien-gorge/',
  },
  {
    en: '/clothing-size/kids-clothing-size-chart/',
    'pt-br': '/pt-br/tamanho-roupa/tabela-roupas-infantis/',
    es: '/es/talla-ropa/tabla-tallas-ropa-ninos/',
    fr: '/fr/taille-vetement/guide-tailles-vetements-enfants/',
  },
  {
    en: '/clothing-size/plus-size-converter/',
    'pt-br': '/pt-br/tamanho-roupa/tabela-tamanhos-plus-size/',
    es: '/es/talla-ropa/tabla-tallas-grandes-plus-size/',
    fr: '/fr/taille-vetement/guide-grandes-tailles-plus-size/',
  },
  {
    en: '/clothing-size/petite-size-chart/',
    'pt-br': '/pt-br/tamanho-roupa/tabela-tamanhos-petite/',
    es: '/es/talla-ropa/tabla-tallas-petite/',
    fr: '/fr/taille-vetement/guide-tailles-petite/',
  },
  {
    en: '/clothing-size/',
    'pt-br': '/pt-br/tamanho-roupa/eua-para-brasil-roupas/',
    es: '/es/talla-ropa/eeuu-a-espana-mexico-ropa/',
    fr: '/fr/taille-vetement/us-vers-france-vetements/',
  },
];

// Helper to normalize paths with leading & trailing slash
function normalizePath(p: string): string {
  let clean = p.trim();
  if (!clean.startsWith('/')) clean = '/' + clean;
  if (!clean.endsWith('/')) clean = clean + '/';
  // Deduplicate accidental double slashes
  clean = clean.replace(/\/+/g, '/');
  return clean;
}

/**
 * Returns exact alternate URLs for all 4 supported locales and x-default.
 */
export function getAlternateHreflangs(
  pathname: string,
  siteOrigin: string = 'https://sizetoolshub.com'
): {
  en: string;
  'pt-br': string;
  es: string;
  fr: string;
  'x-default': string;
  canonical: string;
  currentLocale: 'en' | 'pt-br' | 'es' | 'fr';
} {
  const normalized = normalizePath(pathname);

  // 1. Detect current locale
  let currentLocale: 'en' | 'pt-br' | 'es' | 'fr' = 'en';
  if (normalized.startsWith('/pt-br/')) currentLocale = 'pt-br';
  else if (normalized.startsWith('/es/')) currentLocale = 'es';
  else if (normalized.startsWith('/fr/')) currentLocale = 'fr';

  // 2. Search in matrix
  const match = ROUTE_MATRIX.find(
    (row) =>
      normalizePath(row.en) === normalized ||
      normalizePath(row['pt-br']) === normalized ||
      normalizePath(row.es) === normalized ||
      normalizePath(row.fr) === normalized
  );

  if (match) {
    const enUrl = new URL(match.en, siteOrigin).href;
    const ptBrUrl = new URL(match['pt-br'], siteOrigin).href;
    const esUrl = new URL(match.es, siteOrigin).href;
    const frUrl = new URL(match.fr, siteOrigin).href;

    let canonical = enUrl;
    if (currentLocale === 'pt-br') canonical = ptBrUrl;
    else if (currentLocale === 'es') canonical = esUrl;
    else if (currentLocale === 'fr') canonical = frUrl;

    return {
      en: enUrl,
      'pt-br': ptBrUrl,
      es: esUrl,
      fr: frUrl,
      'x-default': enUrl,
      canonical,
      currentLocale,
    };
  }

  // 3. Fallback for unmapped or other categories (e.g. /ring-size/, /cooking/, etc.)
  let basePath = normalized;
  if (currentLocale !== 'en') {
    basePath = normalized.slice(`/${currentLocale}`.length);
    if (!basePath.startsWith('/')) basePath = '/' + basePath;
  }

  const enUrl = new URL(basePath, siteOrigin).href;
  const ptBrUrl = new URL(`/pt-br${basePath === '/' ? '/' : basePath}`, siteOrigin).href;
  const esUrl = new URL(`/es${basePath === '/' ? '/' : basePath}`, siteOrigin).href;
  const frUrl = new URL(`/fr${basePath === '/' ? '/' : basePath}`, siteOrigin).href;

  let canonical = enUrl;
  if (currentLocale === 'pt-br') canonical = ptBrUrl;
  else if (currentLocale === 'es') canonical = esUrl;
  else if (currentLocale === 'fr') canonical = frUrl;

  return {
    en: enUrl,
    'pt-br': ptBrUrl,
    es: esUrl,
    fr: frUrl,
    'x-default': enUrl,
    canonical,
    currentLocale,
  };
}
