import fs from 'fs';
import path from 'path';

const targetDir = '/Users/vinodkumar/Desktop/playground/SizeToolsHub.com/src/content/converters/data';

const entries = [
  {
    slug: 'mb-to-gb',
    title: 'MB to GB Converter',
    primaryKeyword: 'MB to GB Converter',
    metaDescription: 'Convert Megabytes (MB) to Gigabytes (GB) with both Decimal (SI 1000) and Binary (IEC 1024) calculations.',
    directAnswer: "To convert Megabytes (MB) to Gigabytes (GB), divide by 1,000 using the decimal SI standard (1,000 MB = 1 GB), or divide by 1,024 using the binary IEC standard (1,024 MiB = 1 GiB). For example, 5,000 MB equals 5 GB in decimal, or approximately 4.88 GiB in binary.",
    converterType: 'data',
    fromUnit: 'Megabytes (MB)',
    toUnit: 'Gigabytes (GB)',
    faq: [
      {
        question: "How many MB are in 1 GB?",
        answer: "In the decimal system (SI) used by disk makers and macOS, there are exactly 1,000 MB in 1 GB. In the binary system (IEC) used by Windows, there are 1,024 MiB in 1 GiB."
      },
      {
        question: "What is 2048 MB in GB?",
        answer: "2,048 MB in binary is exactly 2.0 GiB (or 2.048 GB in decimal)."
      },
      {
        question: "Why does Windows show less GB than my phone or Mac?",
        answer: "Windows divides by 1,024³ (binary GiB) while labeling it 'GB', whereas modern macOS and Android divide by 1,000³ (decimal GB)."
      }
    ]
  },
  {
    slug: 'gb-to-mb',
    title: 'GB to MB Converter',
    primaryKeyword: 'GB to MB Converter',
    metaDescription: 'Convert Gigabytes (GB) to Megabytes (MB) across decimal and binary standards with exact byte calculations.',
    directAnswer: "To convert Gigabytes (GB) to Megabytes (MB), multiply by 1,000 in decimal SI notation (1 GB = 1,000 MB), or multiply by 1,024 in binary IEC notation (1 GiB = 1,024 MiB). For example, a 16 GB flash drive holds 16,000 MB in decimal, or 16,384 MiB in binary.",
    converterType: 'data',
    fromUnit: 'Gigabytes (GB)',
    toUnit: 'Megabytes (MB)',
    faq: [
      {
        question: "How many MB is a 4 GB file?",
        answer: "A 4 GB file equals 4,000 MB in decimal SI, or 4,096 MiB in binary IEC."
      },
      {
        question: "How many high-res photos fit in 1 GB?",
        answer: "At an average size of 4 MB per photo, 1 GB of storage holds approximately 250 high-resolution images."
      },
      {
        question: "What is 32 GB in MB?",
        answer: "32 GB equals 32,000 MB in decimal, or 32,768 MiB in binary."
      }
    ]
  },
  {
    slug: 'kb-to-mb',
    title: 'KB to MB Converter',
    primaryKeyword: 'KB to MB Converter',
    metaDescription: 'Convert Kilobytes (KB) to Megabytes (MB) with decimal (1000) and binary (1024 KiB) conversion formulas.',
    directAnswer: "To convert Kilobytes (KB) to Megabytes (MB), divide by 1,000 under the decimal SI standard (1,000 KB = 1 MB), or divide by 1,024 under the binary IEC standard (1,024 KiB = 1 MiB). For example, a 2,500 KB document equals 2.5 MB decimal, or 2.44 MiB in binary.",
    converterType: 'data',
    fromUnit: 'Kilobytes (KB)',
    toUnit: 'Megabytes (MB)',
    faq: [
      {
        question: "How many KB make 1 MB?",
        answer: "1 MB equals 1,000 KB in the decimal system, and 1 MiB equals 1,024 KiB in the binary system."
      },
      {
        question: "What is 500 KB in MB?",
        answer: "500 KB equals 0.5 MB decimal, or 0.488 MiB binary."
      },
      {
        question: "Why do image files often measure in KB while videos measure in MB?",
        answer: "Single web images and icons typically take between 50 to 500 KB of data, whereas complex multimedia video streams require millions of bytes (MB or GB)."
      }
    ]
  },
  {
    slug: 'tb-to-gb',
    title: 'TB to GB Converter',
    primaryKeyword: 'TB to GB Converter',
    metaDescription: 'Convert Terabytes (TB) to Gigabytes (GB) for hard drives, SSDs, and cloud storage with Windows usable space analysis.',
    directAnswer: "To convert Terabytes (TB) to Gigabytes (GB), multiply by 1,000 for decimal storage drives (1 TB = 1,000 GB), or multiply by 1,024 for binary operating systems (1 TiB = 1,024 GiB). A 2 TB drive contains 2,000 GB in manufacturer decimal capacity, which Windows reports as approximately 1,862.6 GiB.",
    converterType: 'data',
    fromUnit: 'Terabytes (TB)',
    toUnit: 'Gigabytes (GB)',
    faq: [
      {
        question: "How many GB are in 1 TB?",
        answer: "There are 1,000 GB in 1 TB according to drive makers, and 1,024 GiB in 1 TiB according to binary memory systems."
      },
      {
        question: "Why does my 2TB drive only have 1,862 GB of space in Windows?",
        answer: "Drive manufacturers provide 2,000,000,000,000 bytes. Windows divides this by 1,024³ (1,073,741,824) to calculate Gibibytes, displaying 1,862.6 GiB."
      },
      {
        question: "What is 4 TB in GB?",
        answer: "4 TB equals 4,000 GB decimal, or 4,096 GiB binary (yielding ~3,725 GiB usable in Windows)."
      }
    ]
  },
  {
    slug: 'bytes-converter',
    title: 'Bytes Converter (B, KB, MB, GB, TB)',
    primaryKeyword: 'Bytes Converter',
    metaDescription: 'Convert raw computer bytes to bits, KB, MB, GB, TB, and PB across binary and decimal computer standards.',
    directAnswer: "A byte is the fundamental digital unit of data storage composed of 8 bits. To convert raw bytes into larger units, divide by 1,000 for decimal kilobytes (KB) or 1,024 for binary kibibytes (KiB). One billion bytes equals 1 Gigabyte (GB) in decimal, or 0.931 Gibibytes (GiB) in binary.",
    converterType: 'data',
    fromUnit: 'Raw Bytes (B)',
    toUnit: 'KB / MB / GB / TB',
    faq: [
      {
        question: "How many bits are in one byte?",
        answer: "There are exactly 8 bits in 1 byte. Each bit represents a binary zero (0) or one (1)."
      },
      {
        question: "How many bytes are in a Gigabyte?",
        answer: "In the decimal system, 1 GB equals 1,000,000,000 bytes (1 billion). In the binary system, 1 GiB equals 1,073,741,824 bytes."
      },
      {
        question: "What is the difference between a kilobit (Kb) and a kilobyte (KB)?",
        answer: "A lowercase 'b' denotes bits, while an uppercase 'B' denotes bytes. 1 Kilobyte (KB) = 8 Kilobits (Kb)."
      }
    ]
  },
  {
    slug: 'file-size-converter',
    title: 'File Size Converter & Multi-Unit Calculator',
    primaryKeyword: 'File Size Converter',
    metaDescription: 'Calculate and convert file sizes across bytes, kilobytes, megabytes, gigabytes, and terabytes with storage approximations.',
    directAnswer: "File sizes scale progressively from bytes to kilobytes, megabytes, gigabytes, and terabytes. A typical photograph measures 3 to 5 MB, a 4K movie measures 15 to 25 GB, and a modern computer game requires 50 to 100 GB. Sizing depends on whether your operating system uses base-1000 or base-1024.",
    converterType: 'data',
    fromUnit: 'File Size Unit',
    toUnit: 'All Digital Scales',
    faq: [
      {
        question: "How big is an average MP3 song?",
        answer: "An average 3-minute MP3 audio track encoded at 320 kbps occupies between 7 and 10 MB of storage."
      },
      {
        question: "How many GB is a 2-hour 4K movie?",
        answer: "A compressed 4K streaming movie is approximately 14 to 20 GB; an uncompressed 4K Blu-ray file can exceed 50 to 80 GB."
      },
      {
        question: "What causes file size on disk to be larger than actual file size?",
        answer: "Filesystems allocate storage in fixed clusters (usually 4 KB). A 1 KB file still consumes one full 4 KB cluster on disk."
      }
    ]
  },
  {
    slug: 'download-time-calculator',
    title: 'Download Time Calculator & Bandwidth Speed Estimator',
    primaryKeyword: 'Download Time Calculator',
    metaDescription: 'Calculate how long files take to download based on file size and internet connection speed in Mbps and Gbps.',
    directAnswer: "To calculate download time, divide total file size in bits by your internet speed in Megabits per second (Mbps). Because 1 byte equals 8 bits, an internet connection rated at 100 Mbps transfers data at a maximum speed of 12.5 MB/s, meaning a 10 GB file will download in approximately 13.5 minutes.",
    converterType: 'data',
    fromUnit: 'File Size & Speed (Mbps)',
    toUnit: 'Estimated Transfer Time',
    faq: [
      {
        question: "Why doesn't a 100 Mbps internet connection download at 100 MB per second?",
        answer: "Internet speed is measured in Megabits (Mb), while file sizes are measured in Megabytes (MB). Because 8 bits equal 1 byte, a 100 Mbps connection has a peak transfer rate of 12.5 MB/s."
      },
      {
        question: "How long does a 50 GB game take to download on a 300 Mbps fiber line?",
        answer: "At 300 Mbps (37.5 MB/s), a 50 GB file takes approximately 22 minutes and 45 seconds under ideal network conditions."
      },
      {
        question: "Does Wi-Fi reduce download speeds compared to an Ethernet cable?",
        answer: "Yes, Wi-Fi introduces radio interference, latency, and packet loss, typically delivering 20% to 50% slower real-world download throughput than direct Ethernet cables."
      }
    ]
  },
  {
    slug: 'gb-to-tb',
    title: 'GB to TB Converter',
    primaryKeyword: 'GB to TB Converter',
    metaDescription: 'Convert Gigabytes (GB) to Terabytes (TB) for SSDs, HDDs, and cloud backup systems with decimal and binary options.',
    directAnswer: "To convert Gigabytes (GB) to Terabytes (TB), divide by 1,000 in the decimal SI system used by storage drive manufacturers (1,000 GB = 1 TB), or divide by 1,024 in binary IEC architecture (1,024 GiB = 1 TiB). A 500 GB drive equals 0.5 TB decimal, or 0.488 TiB binary.",
    converterType: 'data',
    fromUnit: 'Gigabytes (GB)',
    toUnit: 'Terabytes (TB)',
    faq: [
      {
        question: "How many GB make 1 TB?",
        answer: "1 TB equals 1,000 GB in the decimal system, and 1 TiB equals 1,024 GiB in the binary system."
      },
      {
        question: "What is 500 GB in TB?",
        answer: "500 GB is exactly 0.5 TB decimal, or approximately 0.488 TiB binary."
      },
      {
        question: "Is 1 TB enough storage for a modern PC?",
        answer: "For general productivity, 1 TB is plenty. For gaming or 4K video editing, 2 TB to 4 TB is recommended due to modern games exceeding 100 GB each."
      }
    ]
  }
];

function countWords(str) {
  return str.trim().split(/\s+/).length;
}

console.log(`Processing ${entries.length} data storage entries...`);

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

console.log('Successfully wrote all data storage content entries!');
