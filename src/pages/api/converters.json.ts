export async function GET() {
  const categories = [
    { id: "shoe-size", name: "Shoe Size Converter", defaultUnit: "US" },
    { id: "clothing-size", name: "Clothing Size Converter", defaultUnit: "US" },
    { id: "ring-size", name: "Ring Size Converter", defaultUnit: "US" },
    { id: "cooking", name: "Cooking Measurement Converter", defaultUnit: "Cups" },
    { id: "data", name: "Data Storage Converter", defaultUnit: "MB" },
    { id: "fuel", name: "Fuel Economy Calculator", defaultUnit: "MPG" },
    { id: "paper-size", name: "Paper Size Dimensions", defaultUnit: "mm" }
  ];

  return new Response(
    JSON.stringify({
      categories,
      count: categories.length,
      status: "success"
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    }
  );
}
