import fs from 'fs';
import path from 'path';

const targetDir = '/Users/vinodkumar/Desktop/playground/SizeToolsHub.com/src/content/converters/cooking';

const entries = [
  {
    slug: 'cups-to-grams',
    title: 'Cups to Grams Converter',
    primaryKeyword: 'Cups to Grams Converter',
    metaDescription: 'Convert US cups to grams for flour, sugar, butter, rice, and liquids with ingredient density precision.',
    directAnswer: "Converting cups to grams requires knowing your ingredient's density, because volume does not translate directly to weight. For all-purpose flour, 1 cup equals 125 grams. For granulated white sugar, 1 cup equals 200 grams. For butter, 1 cup equals 227 grams, while 1 cup of white rice equals 185 grams.",
    converterType: 'cooking',
    fromUnit: 'US Cups',
    toUnit: 'Grams (g)',
    faq: [
      {
        question: "How many grams are in 1 cup of all-purpose flour?",
        answer: "One level cup of all-purpose flour scooped using the spoon-and-level method weighs approximately 125 grams (4.4 oz)."
      },
      {
        question: "Why do flour and sugar weigh different amounts in the same cup?",
        answer: "Sugar crystals pack closely together, giving granulated sugar a high density (200g/cup), whereas flour contains trapped air pockets, resulting in a lighter density (125g/cup)."
      },
      {
        question: "How many grams is 1 cup of butter?",
        answer: "One cup of butter (two standard US sticks) weighs exactly 226.8 grams (8 ounces)."
      }
    ]
  },
  {
    slug: 'grams-to-cups',
    title: 'Grams to Cups Converter',
    primaryKeyword: 'Grams to Cups Converter',
    metaDescription: 'Convert metric grams to US cups for baking and cooking ingredients with exact density adjustments.',
    directAnswer: "To convert grams to cups accurately, divide the weight in grams by the ingredient's density per cup. For all-purpose flour, divide by 125 (250g equals 2 cups). For granulated white sugar, divide by 200 (200g equals 1 cup). For packed brown sugar, divide by 220 (110g equals half a cup).",
    converterType: 'cooking',
    fromUnit: 'Grams (g)',
    toUnit: 'US Cups',
    faq: [
      {
        question: "How many cups is 100 grams of flour?",
        answer: "100 grams of all-purpose flour equals approximately 0.8 cups (about 3/4 cup plus 1 tablespoon)."
      },
      {
        question: "What is 250 grams of butter in cups?",
        answer: "250 grams of butter is approximately 1.1 cups (or 2.2 US sticks of butter)."
      },
      {
        question: "Is measuring in grams more accurate than measuring in cups?",
        answer: "Yes, weighing in grams on a digital kitchen scale is the gold standard for baking because it eliminates volume variations caused by humidity and compaction."
      }
    ]
  },
  {
    slug: 'tablespoons-to-ml',
    title: 'Tablespoons to ML Converter',
    primaryKeyword: 'Tablespoons to ML Converter',
    metaDescription: 'Convert tablespoons to milliliters (ml) across US, UK, and Australian culinary standards with fluid ounce conversions.',
    directAnswer: "One US tablespoon contains exactly 14.79 milliliters (commonly rounded to 15 ml in culinary recipes). One UK and Canadian tablespoon also equals 15 ml, while an Australian tablespoon uniquely equals 20 ml (4 teaspoons). For liquid seasonings and oils, using a standard 15 ml measuring spoon ensures consistent recipe proportions.",
    converterType: 'cooking',
    fromUnit: 'Tablespoons (tbsp)',
    toUnit: 'Milliliters (ml)',
    faq: [
      {
        question: "How many ml are in a US tablespoon?",
        answer: "A US tablespoon contains 14.787 ml, which is universally rounded to 15 ml on culinary measuring tools."
      },
      {
        question: "Why is an Australian tablespoon 20 ml?",
        answer: "Australia defines a tablespoon as 4 metric teaspoons (20 ml), whereas the US, UK, and Canada define a tablespoon as 3 teaspoons (15 ml)."
      },
      {
        question: "How many tablespoons are in 100 ml?",
        answer: "100 milliliters equals approximately 6.67 US tablespoons (6 tablespoons plus 2 teaspoons)."
      }
    ]
  },
  {
    slug: 'teaspoons-to-grams',
    title: 'Teaspoons to Grams Converter',
    primaryKeyword: 'Teaspoons to Grams Converter',
    metaDescription: 'Convert teaspoons to grams for baking powder, baking soda, salt, yeast, spices, and sugar with density accuracy.',
    directAnswer: "Converting teaspoons to grams depends strictly on ingredient density. For baking powder or salt, 1 teaspoon weighs approximately 5 to 6 grams. For granulated white sugar, 1 teaspoon equals 4.2 grams, while 1 teaspoon of all-purpose flour weighs approximately 2.6 grams. Three level teaspoons equal one standard tablespoon.",
    converterType: 'cooking',
    fromUnit: 'Teaspoons (tsp)',
    toUnit: 'Grams (g)',
    faq: [
      {
        question: "How many grams is 1 teaspoon of salt?",
        answer: "One level teaspoon of fine table salt weighs approximately 5.7 to 6.0 grams."
      },
      {
        question: "How many grams is 1 teaspoon of baking powder?",
        answer: "One level teaspoon of baking powder or baking soda weighs approximately 4.8 to 5.0 grams."
      },
      {
        question: "How many teaspoons make 10 grams of active dry yeast?",
        answer: "One standard 7g sachet of yeast is about 2.25 teaspoons, so 10 grams equals approximately 3.2 teaspoons."
      }
    ]
  },
  {
    slug: 'butter-converter',
    title: 'Butter Converter (Sticks, Cups, Grams, Tbsp)',
    primaryKeyword: 'Butter Converter',
    metaDescription: 'Convert butter measurements between US sticks, cups, tablespoons, grams, and ounces with international butter block conversions.',
    directAnswer: "In US baking, 1 stick of butter equals one-half cup, 8 tablespoons, 4 ounces, or 113.4 grams. Two sticks equal 1 full cup (226.8 grams). European butter blocks typically weigh 250 grams, which corresponds to approximately 1.1 cups or 2.2 US butter sticks with higher milkfat content.",
    converterType: 'cooking',
    fromUnit: 'Butter Sticks',
    toUnit: 'Grams / Cups',
    faq: [
      {
        question: "How much is 1 stick of butter in grams?",
        answer: "1 US stick of butter equals 113.4 grams (1/2 cup or 8 tablespoons)."
      },
      {
        question: "How do I substitute European butter for American butter?",
        answer: "European butter (like Kerrygold or President) has 82%+ butterfat compared to American 80%. You can substitute 1:1 by weight (grams) for richer pastries."
      },
      {
        question: "How many tablespoons of butter is 100 grams?",
        answer: "100 grams of butter equals approximately 7 tablespoons (or 0.88 US sticks)."
      }
    ]
  },
  {
    slug: 'flour-converter',
    title: 'Flour Converter (All-Purpose, Bread, Cake, Whole Wheat)',
    primaryKeyword: 'Flour Converter',
    metaDescription: 'Convert flour cups to grams across all-purpose, bread, cake, and whole wheat flours with density calibration.',
    directAnswer: "Flour density varies significantly by type and packing method. One cup of sifted all-purpose flour weighs 125 grams, bread flour weighs 127 grams, cake flour weighs 114 grams, and whole wheat flour weighs 130 grams. Always spoon flour into your measuring cup and level off flat to avoid excess density.",
    converterType: 'cooking',
    fromUnit: 'Flour Cups',
    toUnit: 'Flour Grams',
    faq: [
      {
        question: "Why does 1 cup of flour weigh different amounts in different recipes?",
        answer: "King Arthur Baking uses 120g/cup, while USDA and many traditional cookbooks use 125g to 128g/cup. Scooping directly can pack up to 150g into a single cup."
      },
      {
        question: "What is 500 grams of flour in cups?",
        answer: "500 grams of all-purpose flour equals exactly 4 level cups (at 125g per cup)."
      },
      {
        question: "Can I substitute cake flour for all-purpose flour by cup volume?",
        answer: "Cake flour is lighter (114g/cup vs 125g/cup). To substitute by volume, add 2 extra tablespoons of cake flour for every cup of all-purpose flour, or weigh equal grams."
      }
    ]
  },
  {
    slug: 'sugar-converter',
    title: 'Sugar Converter (Granulated, Brown, Powdered)',
    primaryKeyword: 'Sugar Converter',
    metaDescription: 'Convert cups to grams for granulated white sugar, packed brown sugar, and powdered confectioners sugar.',
    directAnswer: "Sugar types have very different weights per cup. One cup of granulated white sugar weighs 200 grams (7.1 oz). One cup of firmly packed brown sugar weighs 220 grams (7.8 oz) due to added molasses moisture, while one cup of unsifted confectioners or powdered sugar weighs only 120 grams.",
    converterType: 'cooking',
    fromUnit: 'Sugar Cups',
    toUnit: 'Sugar Grams',
    faq: [
      {
        question: "Why must brown sugar be packed when measuring by volume?",
        answer: "Packing brown sugar removes large air pockets created by moist molasses coating the crystals, ensuring consistent density (220g per packed cup)."
      },
      {
        question: "What is 1 cup of powdered sugar in grams?",
        answer: "One cup of powdered sugar (confectioners / icing sugar) weighs approximately 120 grams unsifted, or 100 grams if sifted before measuring."
      },
      {
        question: "How many grams is 1/2 cup of granulated sugar?",
        answer: "1/2 cup of granulated white sugar equals exactly 100 grams."
      }
    ]
  },
  {
    slug: 'oven-temperature-converter',
    title: 'Oven Temperature Converter (°F, °C, Gas Mark, Fan)',
    primaryKeyword: 'Oven Temperature Converter',
    metaDescription: 'Convert baking temperatures between Fahrenheit (°F), Celsius (°C), fan-forced convection ovens, and British Gas Marks.',
    directAnswer: "To convert oven temperatures between Fahrenheit and Celsius, use the formula (F - 32) × 5/9 = C. A moderate baking temperature of 350°F equals 177°C (rounded to 180°C), Fan 160°C, and British Gas Mark 4. For convection fan-forced ovens, always reduce the standard temperature by 20°C (25°F).",
    converterType: 'cooking',
    fromUnit: 'Oven °F',
    toUnit: 'Oven °C / Gas Mark',
    faq: [
      {
        question: "What is 350°F in Celsius and Gas Mark?",
        answer: "350°F equals 177°C (commonly rounded to 180°C for conventional ovens), 160°C for fan-forced ovens, and Gas Mark 4."
      },
      {
        question: "Why do convection (fan) ovens require temperature reduction?",
        answer: "Convection fans circulate hot air continuously, transferring thermal energy more rapidly to food and causing outer edges to brown before interiors bake if not reduced by 20°C."
      },
      {
        question: "What is Gas Mark 6 in Fahrenheit and Celsius?",
        answer: "Gas Mark 6 is 400°F (200°C conventional, or 180°C fan-forced), commonly used for roasting meats and baking pastries."
      }
    ]
  },
  {
    slug: 'fahrenheit-to-celsius-oven',
    title: 'Fahrenheit to Celsius Oven Converter',
    primaryKeyword: 'Fahrenheit to Celsius Oven Converter',
    metaDescription: 'Quickly convert American recipe oven temperatures (°F) to European metric Celsius (°C) and convection fan temperatures.',
    directAnswer: "Converting oven temperatures from Fahrenheit to Celsius is essential when baking international recipes. Common conversions include 325°F (165°C / Gas Mark 3), 350°F (177°C / Gas Mark 4), 375°F (190°C / Gas Mark 5), 400°F (200°C / Gas Mark 6), and 425°F (220°C / Gas Mark 7). Convection ovens require reducing heat by 20°C.",
    converterType: 'cooking',
    fromUnit: 'Fahrenheit (°F)',
    toUnit: 'Celsius (°C)',
    faq: [
      {
        question: "What is 375°F in Celsius?",
        answer: "375°F equals 190°C conventional (170°C fan-forced / Gas Mark 5)."
      },
      {
        question: "What is 425°F in Celsius for roasting vegetables?",
        answer: "425°F equals 218°C (rounded to 220°C conventional, or 200°C fan-forced / Gas Mark 7)."
      },
      {
        question: "Is 180°C the same as 350°F?",
        answer: "Yes, 180°C is the universal European kitchen equivalent for American 350°F baking recipes (exact mathematical value is 176.7°C)."
      }
    ]
  }
];

function countWords(str) {
  return str.trim().split(/\s+/).length;
}

console.log(`Processing ${entries.length} cooking entries...`);

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

console.log('Successfully wrote all cooking content entries!');
