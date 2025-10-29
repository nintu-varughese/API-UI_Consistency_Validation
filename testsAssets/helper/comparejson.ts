import fs from 'fs';
import path from 'path';

export default async function compareJsonData() {
  const testDataDir = 'testsAssets/testData';

  if (!fs.existsSync(testDataDir)) {
    throw new Error(`Test data directory not found: ${testDataDir}`);
  }

  const comparisons = [
    { ui: 'PhonesUi.json', api: 'phoneApi.json', category: 'Phones' },
    { ui: 'LaptopsUi.json', api: 'notebookApi.json', category: 'Laptops' },
    { ui: 'MonitorsUi.json', api: 'monitorApi.json', category: 'Monitors' },
  ];

  const results: any[] = [];

  for (const { ui, api, category } of comparisons) {
    const uiPath = path.join(testDataDir, ui);
    const apiPath = path.join(testDataDir, api);

    if (!fs.existsSync(uiPath) || !fs.existsSync(apiPath)) {
      console.warn(`Missing files for ${category}. Skipping comparison.`);
      continue;
    }

    const uiData = JSON.parse(fs.readFileSync(uiPath, 'utf-8'));
    const apiData = JSON.parse(fs.readFileSync(apiPath, 'utf-8'));

    const mismatches: any[] = [];

    for (const uiItem of uiData) {
      const match = apiData.find(
        (apiItem: any) =>
          apiItem.name.trim().toLowerCase() === uiItem.name.trim().toLowerCase()
      );

      if (!match) {
        mismatches.push({
          name: uiItem.name,
          issue: 'Product missing in API data',
        });
        continue;
      }

      if (uiItem.price !== match.price) {
        mismatches.push({
          name: uiItem.name,
          uiPrice: uiItem.price,
          apiPrice: match.price,
          issue: 'Price mismatch',
        });
      }
    }

    const comparisonStatus =
      mismatches.length === 0 ? 'Matched' : 'Mismatched';

    results.push({
      category,
      comparisonStatus,
      mismatches,
    });
  }

  const resultPath = path.join(testDataDir, 'compareResult.json');
  fs.writeFileSync(resultPath, JSON.stringify(results, null, 2));
}
