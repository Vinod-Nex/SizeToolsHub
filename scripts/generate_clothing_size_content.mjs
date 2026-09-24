import fs from 'fs';
import path from 'path';

const targetDir = '/Users/vinodkumar/Desktop/playground/SizeToolsHub.com/src/content/converters/clothing-size';

const entries = [
  {
    slug: 'us-to-eu-womens',
    title: "US to EU Women's Clothing Size Converter",
    primaryKeyword: "US to EU Women's Clothing Size Converter",
    metaDescription: "Convert US women's dress, top, and pant sizes to European (EU/FR/IT) sizing with bust, waist, and hip measurement charts.",
    directAnswer: "To convert US women's clothing sizes to European (EU) sizes, add 30 to 32 to your US dress size. For example, a US size 4 is an EU 36 (French 36, Italian 40), while a US 8 is an EU 40. Always check brand-specific measurements across bust, waist, and hips.",
    converterType: 'clothing-size',
    fromUnit: "US Women's",
    toUnit: "EU Women's",
    faq: [
      {
        question: "What is a US Women's size 6 in EU clothing?",
        answer: "A US Women's size 6 is typically an EU 38 in Germany/Scandinavia, a French 38, or an Italian size 42."
      },
      {
        question: "Why do Italian and French sizes differ from German EU sizes?",
        answer: "French sizing is offset by approximately 32 from US sizing (US 4 = FR 36), while Italian sizing is offset by 36 (US 4 = IT 40)."
      },
      {
        question: "What is an International Medium (M) in EU dress size?",
        answer: "An International Medium (M) corresponds to US 8-10, UK 12-14, and EU 40-42."
      }
    ]
  },
  {
    slug: 'uk-to-us-mens',
    title: "UK to US Men's Clothing Size Converter",
    primaryKeyword: "UK to US Men's Clothing Size Converter",
    metaDescription: "Convert UK men's suits, shirts, and trousers to US sizes with chest measurements in inches and centimeters.",
    directAnswer: "Men's suit and jacket sizes are identical between the UK and US, as both utilize imperial chest measurements in inches (a UK 40 jacket equals a US 40). Men's trouser waist sizes also match directly in inches, while dress shirts share identical collar circumference numbers across British and American tailoring.",
    converterType: 'clothing-size',
    fromUnit: "UK Men's",
    toUnit: "US Men's",
    faq: [
      {
        question: "Are UK and US men's suit sizes the same?",
        answer: "Yes, both UK and US men's suits and blazers are measured by chest circumference in inches (e.g., 38R, 40R, 42L)."
      },
      {
        question: "What is a UK men's size 40 jacket in European sizing?",
        answer: "A UK/US size 40 chest corresponds to a European size 50 (add 10 to UK chest size)."
      },
      {
        question: "Do UK trousers fit differently than US pants?",
        answer: "While waist measurements in inches are identical, British tailoring often features a closer, higher-rise silhouette compared to traditional American relaxed cuts."
      }
    ]
  },
  {
    slug: 'dress-size-chart',
    title: "Dress Size Chart & International Converter",
    primaryKeyword: "Dress Size Chart & International Converter",
    metaDescription: "Universal dress size conversion chart comparing US, UK, European (EU), and International Alpha (XS-3XL) dimensions with body measurements.",
    directAnswer: "To determine your ideal dress size internationally, prioritize your largest body measurement between bust, waist, and hips. A standard US dress size 6 converts to a UK 10, an EU 38, and International Small (S), accommodating an approximate 35-inch bust, 28-inch waist, and 38-inch hip circumference across woven fabrics.",
    converterType: 'clothing-size',
    fromUnit: 'US Dress Size',
    toUnit: 'International / EU Dress',
    faq: [
      {
        question: "How do I choose a dress size if my bust and hips fall into different sizes?",
        answer: "For fitted sheath dresses, size up to fit your largest measurement and tailor down the rest. For A-line or flared dresses, fit to your bust and waist."
      },
      {
        question: "What is a US size 8 dress in the UK and Australia?",
        answer: "A US size 8 dress is a UK 12 and an Australian (AU) 12."
      },
      {
        question: "Do formal evening gowns run smaller than casual dresses?",
        answer: "Yes, designer evening wear and bridal gowns often follow vintage sizing and can run 1 to 2 sizes smaller than commercial ready-to-wear dresses."
      }
    ]
  },
  {
    slug: 'jeans-size-converter',
    title: "Jeans Size Converter & Denim Waist Chart",
    primaryKeyword: "Jeans Size Converter & Denim Waist Chart",
    metaDescription: "Convert denim waist sizes (W24-W40) to standard US dress sizes, UK, and EU apparel with stretch allowance guidelines.",
    directAnswer: "Jeans sizes correspond directly to your natural waist circumference in inches. For women, subtract 22 from your denim waist size to estimate your standard US dress size (a 28-inch waist equals size W28 or US 6). For 100% rigid cotton denim, consider sizing up one inch for comfortable hip mobility.",
    converterType: 'clothing-size',
    fromUnit: 'Waist (Inches / W)',
    toUnit: 'Numeric Dress Size',
    faq: [
      {
        question: "What does W28 L32 mean on a pair of jeans?",
        answer: "'W28' indicates a 28-inch waist circumference, and 'L32' indicates a 32-inch inseam leg length from crotch to hem."
      },
      {
        question: "What size is a women's 27 in jeans?",
        answer: "A size 27 waist is typically equivalent to a US Women's dress size 4 (or Small)."
      },
      {
        question: "How does stretch denim (elastane/spandex) affect sizing?",
        answer: "Jeans containing 2% or more elastane will stretch with wear; many shoppers prefer purchasing their true waist size or sizing down half a size."
      }
    ]
  },
  {
    slug: 'bra-size-converter',
    title: "Bra Size Converter & Cup Calculator",
    primaryKeyword: "Bra Size Converter & Cup Calculator",
    metaDescription: "Convert bra band and cup sizes across US, UK, EU, and French sizing systems with step-by-step measurement formulas.",
    directAnswer: "To calculate your bra size, measure your snug underbust in inches and add 4 if even, or 5 if odd, for your band size. Next, subtract your band size from your fullest bust measurement: each 1-inch difference represents one cup letter (1 inch = A, 2 = B, 3 = C, 4 = D).",
    converterType: 'clothing-size',
    fromUnit: 'US Bra Size',
    toUnit: 'UK / EU Bra Size',
    faq: [
      {
        question: "What is the difference between US and UK bra cup sizes?",
        answer: "US and UK cups match through D and DD, but UK sizing utilizes double letters above DD (e.g. UK E, F, FF, G), whereas US sizing uses DDD, G, H."
      },
      {
        question: "What is an EU bra size equivalent to US 34C?",
        answer: "A US 34C converts to an EU size 75C (75 cm underbust with C cup)."
      },
      {
        question: "What is 'sister sizing' in bras?",
        answer: "Sister sizes share identical cup volume: if you go down one band size, go up one cup letter (e.g., 34C = 32D = 36B)."
      }
    ]
  },
  {
    slug: 'shirt-size-converter',
    title: "Men's Dress Shirt Size Converter",
    primaryKeyword: "Men's Dress Shirt Size Converter",
    metaDescription: "Convert men's dress shirt collar sizes between US/UK inches and European centimeters with sleeve length and chest fit guides.",
    directAnswer: "Men's dress shirt sizes are determined primarily by neck collar circumference. A US and UK 15.5-inch collar translates to an EU 39 or 40 centimeters, corresponding to a standard Medium (M) chest. Dress shirts also designate sleeve length (e.g., 34/35 inches) measured from the center back collar down to the wrist.",
    converterType: 'clothing-size',
    fromUnit: 'Collar (Inches)',
    toUnit: 'EU Collar (cm) / Alpha',
    faq: [
      {
        question: "How do I measure my collar size for a dress shirt?",
        answer: "Wrap a measuring tape around the base of your neck where the collar sits, placing two fingers beneath the tape for comfortable breathing allowance."
      },
      {
        question: "What collar size corresponds to a Men's Large shirt?",
        answer: "A Men's Large (L) shirt typically features a 16.0 or 16.5-inch collar (EU 41-42 cm)."
      },
      {
        question: "What is the difference between Slim Fit, Athletic Fit, and Classic Fit shirts?",
        answer: "Classic fit has fuller torso cuts; athletic fit offers broad shoulders with a tapered waist; slim fit features back darts and narrower armholes."
      }
    ]
  },
  {
    slug: 'kids-clothing-size-chart',
    title: "Kids Clothing Size Chart & Age Converter",
    primaryKeyword: "Kids Clothing Size Chart & Age Converter",
    metaDescription: "Convert children's clothing sizes across baby, toddler (2T-5T), and youth (6-16) sizing with height and weight guidelines.",
    directAnswer: "Children's clothing sizes are categorized by age but are most accurately chosen by height and weight. Toddler sizes (2T to 5T) accommodate diaper room, while kids' youth sizes (4 to 16) align with height in centimeters. When choosing between sizes for growing children, always select the larger size for extended wear.",
    converterType: 'clothing-size',
    fromUnit: "Kids US Size",
    toUnit: "EU Height (cm) / Age",
    faq: [
      {
        question: "What is the difference between 24 months and 2T clothing?",
        answer: "24-month clothing is proportioned for infants still in diapers with rounder bottoms; 2T is cut leaner for walking toddlers transitioning out of diapers."
      },
      {
        question: "How does European children's sizing work?",
        answer: "European children's clothing is sized directly by the child's height in centimeters (e.g., size 104 fits kids up to 104 cm tall, approx. 4 years old)."
      },
      {
        question: "What size is a 7-year-old child?",
        answer: "A 7-year-old typically wears a US size 7 or 8 (Small youth), corresponding to an EU size 122 or 128 cm."
      }
    ]
  },
  {
    slug: 'plus-size-converter',
    title: "Plus Size Clothing Converter & Sizing Guide",
    primaryKeyword: "Plus Size Clothing Converter & Sizing Guide",
    metaDescription: "Convert women's and men's plus sizes across US (1X-5X / 14W-28W), UK, and EU standards with proportion guides.",
    directAnswer: "Plus size clothing (designated 14W to 28W or 1X to 4X) features proportions tailored for fuller figures, including deeper armholes and wider hip-to-waist ratios compared to straight Misses sizes. A US 16W corresponds to an EU 48 and UK 20, accommodating an approximate 44-inch bust and 37-inch waist circumference.",
    converterType: 'clothing-size',
    fromUnit: "US Plus Size (W/X)",
    toUnit: "UK / EU Plus Size",
    faq: [
      {
        question: "What is the difference between size 16 and 16W?",
        answer: "Size 16 is straight Misses sizing; 16W is Women's Plus sizing, offering about 1-2 extra inches across the bust, waist, and upper arms."
      },
      {
        question: "What is a 2X in numeric sizing?",
        answer: "A 2X typically equates to women's numeric sizes 20W to 22W (bust 47-49 inches, waist 40-42 inches)."
      },
      {
        question: "How do UK plus sizes compare to US plus sizes?",
        answer: "UK plus sizes are numbered 4 sizes higher than US sizes (a US 18W is equivalent to a UK 22)."
      }
    ]
  },
  {
    slug: 'petite-size-chart',
    title: "Petite Clothing Size Chart & Fit Guide",
    primaryKeyword: "Petite Clothing Size Chart & Fit Guide",
    metaDescription: "Petite clothing size guide for women 5'4\" and under with adjusted torso lengths, sleeve lengths, and inseam measurements.",
    directAnswer: "Petite clothing sizes (labeled with a 'P' such as 4P or Small Petite) are designed for women 5 feet 4 inches (162 cm) and under. Petite garments share standard bust and waist circumferences with regular Misses sizes but feature shortened torso lengths, shorter sleeves, and shorter pant inseams by approximately 2 inches.",
    converterType: 'clothing-size',
    fromUnit: 'US Petite Size (P)',
    toUnit: 'Regular Misses / EU',
    faq: [
      {
        question: "Can someone who is not thin wear petite clothing?",
        answer: "Yes, 'petite' refers strictly to stature and vertical proportions (height under 5'4\"), not weight. Petite sizing is available from 00P up to plus-petite 22WP."
      },
      {
        question: "What is the standard inseam length for petite pants?",
        answer: "Petite inseams typically measure 27 to 29 inches, compared to 31 to 33 inches for standard regular pants."
      },
      {
        question: "Do petite jackets have shorter sleeves?",
        answer: "Yes, petite jackets and blazers feature sleeves that are approximately 1.5 to 2 inches shorter, with higher armholes and shorter shoulder-to-waist lengths."
      }
    ]
  },
  {
    slug: 'international-clothing-sizes',
    title: "International Clothing Size Converter & Chart",
    primaryKeyword: "International Clothing Size Converter & Chart",
    metaDescription: "Comprehensive global apparel conversion chart comparing US, UK, European, French, Italian, and Japanese sizing standards.",
    directAnswer: "International clothing sizing varies significantly across regional fashion markets. A US women's size 6 translates to a UK 10, French EU 38, Italian 42, and Japanese size 9. When purchasing overseas garments, using anatomical body circumference in centimeters provides the most reliable fit across differing international grading rules.",
    converterType: 'clothing-size',
    fromUnit: 'US / Global Size',
    toUnit: 'UK / EU / IT / JP',
    faq: [
      {
        question: "What is a US Women's size Small (S) internationally?",
        answer: "US Small (sizes 4-6) corresponds to UK 8-10, EU 36-38, Italian 40-42, and Japanese sizes 7-9."
      },
      {
        question: "Why do Italian clothing sizes look so large numerically?",
        answer: "Italian sizing is based on half the total chest/bust circumference in centimeters, leading to labels like 40, 42, 44, and 46."
      },
      {
        question: "What is the best way to avoid sizing errors when ordering clothes abroad?",
        answer: "Always consult the brand's metric centimeter chart for bust, waist, and hip measurements rather than relying solely on regional numeric tags."
      }
    ]
  }
];

// Helper to count words
function countWords(str) {
  return str.trim().split(/\s+/).length;
}

console.log(`Processing ${entries.length} clothing-size entries...`);

for (const entry of entries) {
  const wordCount = countWords(entry.directAnswer);
  if (wordCount < 40 || wordCount > 60) {
    console.warn(`WARNING: ${entry.slug} directAnswer word count is ${wordCount} (must be 40-60)!`);
  } else {
    console.log(`✓ ${entry.slug}: ${wordCount} words`);
  }

  const filePath = path.join(targetDir, `${entry.slug}.json`);
  const content = {
    title: entry.title,
    primaryKeyword: entry.primaryKeyword,
    metaDescription: entry.metaDescription,
    directAnswer: entry.directAnswer,
    converterType: entry.converterType,
    fromUnit: entry.fromUnit,
    toUnit: entry.toUnit,
    faq: entry.faq,
  };

  fs.writeFileSync(filePath, JSON.stringify(content, null, 2) + '\n', 'utf8');
}

// Also update existing us-to-uk.json to have directAnswer and 3 FAQs if present
const existingUkPath = path.join(targetDir, 'us-to-uk.json');
if (fs.existsSync(existingUkPath)) {
  const existing = JSON.parse(fs.readFileSync(existingUkPath, 'utf8'));
  existing.directAnswer = "To convert US clothing sizes to UK sizing, women add 4 to their US dress size (a US 6 equals a UK 10; a US 8 equals a UK 12). Men's suit jackets and pants share identical chest and waist measurements in inches across both British and American fashion standards.";
  if (!existing.faq || existing.faq.length < 3) {
    existing.faq = [
      {
        question: "What is a US Women's size 6 in UK clothing?",
        answer: "A US Women's size 6 is a UK size 10."
      },
      {
        question: "Do UK clothes fit smaller than US clothes?",
        answer: "Yes, beyond the 4-number numerical offset, UK clothing is often cut slightly narrower through the shoulders and waist compared to American relaxed cuts."
      },
      {
        question: "Are men's clothing sizes different between the US and UK?",
        answer: "No, men's chest sizes for blazers and waist sizes for trousers match identically in inches between the US and UK."
      }
    ];
  }
  fs.writeFileSync(existingUkPath, JSON.stringify(existing, null, 2) + '\n', 'utf8');
  console.log('✓ updated existing us-to-uk.json with directAnswer and FAQs');
}

console.log('Successfully wrote all clothing-size content entries!');
