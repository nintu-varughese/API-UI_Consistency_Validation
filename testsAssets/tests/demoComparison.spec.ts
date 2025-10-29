import { test, expect } from '../fixtures/demoblazeFixtures';

test.describe.serial('Demoblaze Product Extraction and Comparison', () => {

  test('Extract product data from UI for Phones, Laptops, and Monitors', async ({ demoblazeUI }) => {
    await test.step('Navigate to Home', async () => {
      await demoblazeUI.navigateToHome();
       await expect(demoblazeUI.homeNavbar).toBeVisible();
    });

    await test.step('Extract Phones Data', async () => {
      await demoblazeUI.goToCategory('Phones');
      const phones = await demoblazeUI.extractProductData('Phones');
      expect(phones.length, 'No phone data extracted from UI').toBe(7);
    });

    await test.step('Extract Laptops Data', async () => {
      await demoblazeUI.goToCategory('Laptops');
      const laptops = await demoblazeUI.extractProductData('Laptops');
      expect(laptops.length, 'No laptop data extracted from UI').toBe(6);
    });

    await test.step('Extract Monitors Data', async () => {
      await demoblazeUI.goToCategory('Monitors');
      const monitors = await demoblazeUI.extractProductData('Monitors');
      expect(monitors.length, 'No monitor data extracted from UI').toBe(2);
    });
  });

  test('Extract product data from API for Phones, Laptops, and Monitors', async ({ demoblazeAPI }) => {
    await test.step('Extract Phones Data from API', async () => {
      const phones = await demoblazeAPI.extractProductData('phone');
      expect(phones.length, 'No phone data extracted from API').toBe(7);
    });

    await test.step('Extract Laptops Data from API', async () => {
      const laptops = await demoblazeAPI.extractProductData('notebook');
      expect(laptops.length, 'No laptop data extracted from API').toBe(6);
    });

    await test.step('Extract Monitors Data from API', async () => {
      const monitors = await demoblazeAPI.extractProductData('monitor');
      expect(monitors.length, 'No monitor data extracted from API').toBe(2);
    });
  });

  test('Compare API and UI JSON data', async ({ compareJsonData, fs, path }) => {
    const resultPath = path.resolve('testsAssets/testData/compareResult.json');

    await test.step('Run JSON comparison', async () => {
      await compareJsonData();
    });

    await test.step('Validate comparison results', async () => {
      expect(fs.existsSync(resultPath), 'Comparison result file not found').toBeTruthy();

      const results = JSON.parse(fs.readFileSync(resultPath, 'utf-8'));
      const allMatched = results.every((r: any) => r.comparisonStatus === 'Matched');

      expect(allMatched, 'Some mismatches detected in comparison result').toBeTruthy();
    });
  });

});
