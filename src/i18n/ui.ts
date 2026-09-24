/**
 * SizeToolsHub UI Internationalization Dictionaries
 * Supported Locales:
 *  - en: English (Default at root /)
 *  - pt-br: Português do Brasil (/pt-br/)
 *  - es: Español (/es/)
 *  - fr: Français (/fr/)
 */

export const languages = {
  en: 'English',
  'pt-br': 'Português (BR)',
  es: 'Español',
  fr: 'Français',
} as const;

export type SupportedLocale = keyof typeof languages;
export const defaultLang: SupportedLocale = 'en';

export const ui = {
  en: {
    // Brand & Meta
    'site.title': 'SizeToolsHub',
    'site.tagline': 'Precision Sizing & Dimension Conversion Intelligence',
    'site.description': 'Zero-lag international sizing charts, brand fit converters, and dimension tools for apparel, shoes, rings, luggage, and mattresses.',
    
    // Navigation
    'nav.home': 'Home',
    'nav.clothing': 'Clothing',
    'nav.shoes': 'Shoes',
    'nav.rings': 'Rings & Jewelry',
    'nav.luggage': 'Luggage & Airlines',
    'nav.bedding': 'Bed & Mattress',
    'nav.sizeCard': 'My Size Card',
    'nav.allTools': 'All Calculators',

    // Hero & Search
    'hero.badge': '2026 International Fit Standards',
    'hero.title': 'Never guess your size again.',
    'hero.subtitle': 'Instant, exact international size conversions across 450+ global brands, apparel lines, footwear standards, jewelry, and travel baggage dimensions.',
    'hero.searchPlaceholder': 'Search sizes, brands (e.g., Nike, Zara, Ring size, Carry-on)...',
    'hero.cta': 'Explore Converters',
    'hero.quickConvert': 'Quick Convert',

    // Common Buttons & Actions
    'btn.convert': 'Convert Size',
    'btn.switchUnits': 'Switch Units',
    'btn.cm': 'Centimeters (cm)',
    'btn.in': 'Inches (in)',
    'btn.copy': 'Copy Result',
    'btn.copied': 'Copied to Clipboard!',
    'btn.saveCard': 'Save to My Size Card',
    'btn.saved': 'Saved!',
    'btn.print': 'Print 1:1 Scale Guide',
    'btn.reset': 'Reset',
    'btn.share': 'Share Guide',
    'btn.explore': 'Explore Tool ↗',
    'btn.popular': 'Popular',
    'btn.filter': 'Filter',

    // Categories
    'cat.apparel': 'Apparel & Clothing',
    'cat.footwear': 'Shoes & Footwear',
    'cat.jewelry': 'Rings & Jewelry',
    'cat.travel': 'Airlines & Baggage',
    'cat.home': 'Bed & Mattress',
    'cat.print': 'Paper & Frame Dimensions',

    // Standards & Regions
    'region.us': 'United States (US)',
    'region.uk': 'United Kingdom (UK)',
    'region.eu': 'Europe (EU)',
    'region.jp': 'Japan (JP / cm)',
    'region.cn': 'China (CN)',
    'region.kr': 'Korea (KR / mm)',
    'region.intl': 'International',

    // Sizing Attributes
    'attr.gender': 'Gender / Category',
    'attr.men': 'Men',
    'attr.women': 'Women',
    'attr.kids': 'Kids',
    'attr.unisex': 'Unisex',
    'attr.chest': 'Chest / Bust',
    'attr.waist': 'Waist',
    'attr.hips': 'Hips',
    'attr.footLength': 'Foot Length',
    'attr.fingerDiameter': 'Inner Diameter',

    // Footer
    'footer.tagline': 'Engineered for shoppers, global travelers, and e-commerce merchants who demand exact measurements.',
    'footer.disclaimer': 'Size specifications and standards are derived from ISO, ASTM, and official manufacturer standards. Brand manufacturing variances may occur.',
    'footer.categories': 'Categories',
    'footer.tools': 'Popular Tools',
    'footer.resources': 'Resources',
    'footer.legal': 'Legal',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms of Use',
    'footer.rights': 'All rights reserved.',
  },
  'pt-br': {
    // Brand & Meta
    'site.title': 'SizeToolsHub',
    'site.tagline': 'Inteligência de Conversão de Medidas e Tamanhos',
    'site.description': 'Tabelas internacionais de medidas sem demora, conversores de tamanhos de marcas e ferramentas para roupas, calçados, anéis e bagagens.',
    
    // Navigation
    'nav.home': 'Início',
    'nav.clothing': 'Roupas',
    'nav.shoes': 'Calçados',
    'nav.rings': 'Anéis e Joias',
    'nav.luggage': 'Malas e Companhias Aéreas',
    'nav.bedding': 'Camas e Colchões',
    'nav.sizeCard': 'Meu Cartão de Medidas',
    'nav.allTools': 'Todas as Calculadoras',

    // Hero & Search
    'hero.badge': 'Padrões Internacionais de Medidas 2026',
    'hero.title': 'Nunca mais erre o seu tamanho.',
    'hero.subtitle': 'Conversões internacionais imediatas e precisas entre mais de 450 marcas globais, padrões de roupas, calçados, anéis e dimensões de bagagem de mão.',
    'hero.searchPlaceholder': 'Buscar tamanhos, marcas (ex: Nike, Zara, Anel, Mala de mão)...',
    'hero.cta': 'Explorar Conversores',
    'hero.quickConvert': 'Conversão Rápida',

    // Common Buttons & Actions
    'btn.convert': 'Converter Medida',
    'btn.switchUnits': 'Alternar Unidade',
    'btn.cm': 'Centímetros (cm)',
    'btn.in': 'Polegadas (in)',
    'btn.copy': 'Copiar Resultado',
    'btn.copied': 'Copiado para a Área de Transferência!',
    'btn.saveCard': 'Salvar no Meu Cartão',
    'btn.saved': 'Salvo!',
    'btn.print': 'Imprimir Guia em Escala 1:1',
    'btn.reset': 'Limpar',
    'btn.share': 'Compartilhar',
    'btn.explore': 'Explorar Ferramenta ↗',
    'btn.popular': 'Popular',
    'btn.filter': 'Filtrar',

    // Categories
    'cat.apparel': 'Roupas e Vestuário',
    'cat.footwear': 'Sapatos e Calçados',
    'cat.jewelry': 'Anéis e Joias',
    'cat.travel': 'Bagagem e Voos',
    'cat.home': 'Camas e Colchões',
    'cat.print': 'Papel e Dimensões de Quadros',

    // Standards & Regions
    'region.us': 'Estados Unidos (US)',
    'region.uk': 'Reino Unido (UK)',
    'region.eu': 'Europa (EU / BR)',
    'region.jp': 'Japão (JP / cm)',
    'region.cn': 'China (CN)',
    'region.kr': 'Coreia (KR / mm)',
    'region.intl': 'Internacional',

    // Sizing Attributes
    'attr.gender': 'Gênero / Categoria',
    'attr.men': 'Masculino',
    'attr.women': 'Feminino',
    'attr.kids': 'Infantil',
    'attr.unisex': 'Unissex',
    'attr.chest': 'Tórax / Busto',
    'attr.waist': 'Cintura',
    'attr.hips': 'Quadril',
    'attr.footLength': 'Comprimento do Pé',
    'attr.fingerDiameter': 'Diâmetro Interno',

    // Footer
    'footer.tagline': 'Desenvolvido para compradores online, viajantes internacionais e vendedores do e-commerce que exigem precisão.',
    'footer.disclaimer': 'As medidas são baseadas em diretrizes da ISO, ASTM e tabelas oficiais de fabricantes. Variações de confecção podem ocorrer.',
    'footer.categories': 'Categorias',
    'footer.tools': 'Ferramentas Populares',
    'footer.resources': 'Recursos',
    'footer.legal': 'Jurídico',
    'footer.privacy': 'Política de Privacidade',
    'footer.terms': 'Termos de Uso',
    'footer.rights': 'Todos os direitos reservados.',
  },
  es: {
    // Brand & Meta
    'site.title': 'SizeToolsHub',
    'site.tagline': 'Inteligencia de Conversión de Tallas y Medidas',
    'site.description': 'Tablas de tallas internacionales instantáneas, calculadoras de ajuste para marcas y herramientas de medidas para ropa, calzado, anillos y equipaje.',
    
    // Navigation
    'nav.home': 'Inicio',
    'nav.clothing': 'Ropa',
    'nav.shoes': 'Calzado',
    'nav.rings': 'Anillos y Joyería',
    'nav.luggage': 'Equipaje y Vuelos',
    'nav.bedding': 'Camas y Colchones',
    'nav.sizeCard': 'Mi Tarjeta de Tallas',
    'nav.allTools': 'Todas las Calculadoras',

    // Hero & Search
    'hero.badge': 'Estándares Internacionales de Tallas 2026',
    'hero.title': 'Nunca más dudes de tu talla.',
    'hero.subtitle': 'Conversiones internacionales exactas e instantáneas en más de 450 marcas globales, ropa, calzado, joyería y medidas de equipaje de mano.',
    'hero.searchPlaceholder': 'Buscar tallas, marcas (ej. Nike, Zara, Talla de anillo, Equipaje)...',
    'hero.cta': 'Explorar Conversores',
    'hero.quickConvert': 'Conversión Rápida',

    // Common Buttons & Actions
    'btn.convert': 'Convertir Talla',
    'btn.switchUnits': 'Cambiar Unidades',
    'btn.cm': 'Centímetros (cm)',
    'btn.in': 'Pulgadas (in)',
    'btn.copy': 'Copiar Resultado',
    'btn.copied': '¡Copiado al Portapapeles!',
    'btn.saveCard': 'Guardar en Mi Tarjeta',
    'btn.saved': '¡Guardado!',
    'btn.print': 'Imprimir Guía a Escala 1:1',
    'btn.reset': 'Restablecer',
    'btn.share': 'Compartir Guía',
    'btn.explore': 'Explorar Herramienta ↗',
    'btn.popular': 'Popular',
    'btn.filter': 'Filtrar',

    // Categories
    'cat.apparel': 'Ropa y Vestimenta',
    'cat.footwear': 'Zapatos y Calzado',
    'cat.jewelry': 'Anillos y Joyería',
    'cat.travel': 'Equipaje y Aerolíneas',
    'cat.home': 'Camas y Colchones',
    'cat.print': 'Papel y Cuadros',

    // Standards & Regions
    'region.us': 'Estados Unidos (US)',
    'region.uk': 'Reino Unido (UK)',
    'region.eu': 'Europa (EU)',
    'region.jp': 'Japón (JP / cm)',
    'region.cn': 'China (CN)',
    'region.kr': 'Corea (KR / mm)',
    'region.intl': 'Internacional',

    // Sizing Attributes
    'attr.gender': 'Género / Categoría',
    'attr.men': 'Hombres',
    'attr.women': 'Mujeres',
    'attr.kids': 'Niños',
    'attr.unisex': 'Unisex',
    'attr.chest': 'Pecho / Busto',
    'attr.waist': 'Cintura',
    'attr.hips': 'Cadera',
    'attr.footLength': 'Largo del Pie',
    'attr.fingerDiameter': 'Diámetro Interior',

    // Footer
    'footer.tagline': 'Diseñado para compradores globales, viajeros y vendedores de comercio electrónico que necesitan medidas exactas.',
    'footer.disclaimer': 'Las tablas se basan en normas ISO, ASTM y especificaciones oficiales de los fabricantes. Pueden existir variaciones.',
    'footer.categories': 'Categorías',
    'footer.tools': 'Herramientas Populares',
    'footer.resources': 'Recursos',
    'footer.legal': 'Legal',
    'footer.privacy': 'Política de Privacidad',
    'footer.terms': 'Términos de Servicio',
    'footer.rights': 'Todos los derechos reservados.',
  },
  fr: {
    // Brand & Meta
    'site.title': 'SizeToolsHub',
    'site.tagline': 'Intelligence de Conversion de Tailles et Dimensions',
    'site.description': 'Tableaux de conversion internationaux instantanés, calculateurs de correspondance de marques pour vêtements, chaussures, bagages et matelas.',
    
    // Navigation
    'nav.home': 'Accueil',
    'nav.clothing': 'Vêtements',
    'nav.shoes': 'Chaussures',
    'nav.rings': 'Bagues & Bijoux',
    'nav.luggage': 'Bagages & Compagnies',
    'nav.bedding': 'Lits & Matelas',
    'nav.sizeCard': 'Ma Fiche de Tailles',
    'nav.allTools': 'Tous les Outils',

    // Hero & Search
    'hero.badge': 'Normes Internationales de Tailles 2026',
    'hero.title': 'Ne doutez plus jamais de votre taille.',
    'hero.subtitle': 'Conversions internationales exactes et instantanées sur plus de 450 marques mondiales, vêtements, souliers, joaillerie et gabarits de bagages.',
    'hero.searchPlaceholder': 'Rechercher une taille, marque (ex: Nike, Zara, Bague, Bagage cabine)...',
    'hero.cta': 'Découvrir les Outils',
    'hero.quickConvert': 'Conversion Rapide',

    // Common Buttons & Actions
    'btn.convert': 'Convertir la Taille',
    'btn.switchUnits': 'Changer d’Unité',
    'btn.cm': 'Centimètres (cm)',
    'btn.in': 'Pouces (in)',
    'btn.copy': 'Copier le Résultat',
    'btn.copied': 'Copié dans le Presse-papiers !',
    'btn.saveCard': 'Enregistrer ma Fiche',
    'btn.saved': 'Enregistré !',
    'btn.print': 'Imprimer le Guide Échelle 1:1',
    'btn.reset': 'Réinitialiser',
    'btn.share': 'Partager',
    'btn.explore': 'Explorer l’Outil ↗',
    'btn.popular': 'Populaire',
    'btn.filter': 'Filtrer',

    // Categories
    'cat.apparel': 'Vêtements & Mode',
    'cat.footwear': 'Chaussures & Souliers',
    'cat.jewelry': 'Bagues & Joaillerie',
    'cat.travel': 'Bagages & Compagnies Aériennes',
    'cat.home': 'Lits & Literie',
    'cat.print': 'Formats Papier & Cadres',

    // Standards & Regions
    'region.us': 'États-Unis (US)',
    'region.uk': 'Royaume-Uni (UK)',
    'region.eu': 'Europe (EU / FR)',
    'region.jp': 'Japon (JP / cm)',
    'region.cn': 'Chine (CN)',
    'region.kr': 'Corée (KR / mm)',
    'region.intl': 'International',

    // Sizing Attributes
    'attr.gender': 'Genre / Catégorie',
    'attr.men': 'Hommes',
    'attr.women': 'Femmes',
    'attr.kids': 'Enfants',
    'attr.unisex': 'Unisexe',
    'attr.chest': 'Poitrine / Tour de Buste',
    'attr.waist': 'Tour de Taille',
    'attr.hips': 'Tour de Bassin',
    'attr.footLength': 'Longueur du Pied',
    'attr.fingerDiameter': 'Diamètre Intérieur',

    // Footer
    'footer.tagline': 'Conçu pour les acheteurs internationaux, les voyageurs et les commerçants exigeant une précision absolue.',
    'footer.disclaimer': 'Les correspondances sont basées sur les normes ISO, ASTM et les guides officiels. Des tolérances de fabrication peuvent exister.',
    'footer.categories': 'Catégories',
    'footer.tools': 'Outils Populaires',
    'footer.resources': 'Ressources',
    'footer.legal': 'Mentions Légales',
    'footer.privacy': 'Politique de Confidentialité',
    'footer.terms': 'Conditions d’Utilisation',
    'footer.rights': 'Tous droits réservés.',
  },
} as const;

/**
 * Returns a translation function `t(key)` for the given locale.
 * Automatically falls back to English if the key is missing in the target locale.
 */
export function useTranslations(lang: SupportedLocale) {
  return function t(key: keyof (typeof ui)[typeof defaultLang]): string {
    const localeDict = ui[lang];
    if (localeDict && key in localeDict) {
      return (localeDict as Record<string, string>)[key];
    }
    return ui[defaultLang][key] || key;
  };
}

/**
 * Extracts the current locale from a URL pathname.
 * Defaults to 'en' when at root / or unmatched prefix.
 */
export function getLangFromUrl(url: URL): SupportedLocale {
  const segments = url.pathname.split('/').filter(Boolean);
  const candidate = segments[0] as SupportedLocale;
  if (candidate && candidate in ui) {
    return candidate;
  }
  return defaultLang;
}

/**
 * Generates localized path for internal links
 */
export function getLocalizedPath(path: string, lang: SupportedLocale): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  if (lang === defaultLang) {
    return cleanPath;
  }
  return `/${lang}${cleanPath === '/' ? '' : cleanPath}`;
}
