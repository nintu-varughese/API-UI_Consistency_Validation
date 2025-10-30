import { Page, Locator, expect } from "@playwright/test";
import BasePage from "./basePage";
import fs from "fs";
import path from "path";

export default class DemoblazeUIPage extends BasePage {
  private readonly phonesTab: Locator;
  private readonly laptopsTab: Locator;
  private readonly monitorsTab: Locator;
  private readonly productCards: Locator;
  private readonly oldLaptopItem: Locator;
  public readonly homeNavbar: Locator;

  /**
   * Initializes all locators used in the Demoblaze UI.
   * @param {Page} page - Playwright Page instance for the current browser context.
   */
  constructor(page: Page) {
    super(page);

    this.homeNavbar = page.locator('//a[text()="Home "]');
    this.phonesTab = page.locator('//a[text()="Phones"]');
    this.laptopsTab = page.locator('//a[text()="Laptops"]');
    this.monitorsTab = page.locator('//a[text()="Monitors"]');
    this.productCards = page.locator("#tbodyid .col-lg-4");
    this.oldLaptopItem = page.locator('//a[text()="Sony vaio i5"]');
  }

  /**
   * Navigates to the Demoblaze homepage.
   * @returns {Promise<void>} Resolves when navigation completes.
   */
  async navigateToHome(): Promise<void> {
    await this.navigateTo("https://www.demoblaze.com/");
  }

  /**
   * Navigates to the given product category (Phones, Laptops, or Monitors)
   * and waits until the correct number of products are loaded.
   *
   * @param {'Phones' | 'Laptops' | 'Monitors'} category - The category to open.
   * @returns {Promise<void>} Resolves once the category content is fully loaded.
   */
  async goToCategory(
    category: "Phones" | "Laptops" | "Monitors"
  ): Promise<void> {
    let categoryTab: Locator;
    let expectedCount: number;

    switch (category) {
      case "Phones":
        categoryTab = this.phonesTab;
        expectedCount = 7;
        break;
      case "Laptops":
        categoryTab = this.laptopsTab;
        expectedCount = 6;
        break;
      case "Monitors":
        categoryTab = this.monitorsTab;
        expectedCount = 2;
        break;
    }
    
    await categoryTab.click();
    await this.page.waitForFunction(
      (expected) =>
        document.querySelectorAll("#tbodyid .col-lg-4").length === expected,
      expectedCount,
      { timeout: 10000 }
    );

  }

  /**
   * Extracts all product names and prices from the current category view.
   * Saves the extracted data as a JSON file under `testsAssets/testData/{category}Ui.json`.
   *
   * @param {'Phones' | 'Laptops' | 'Monitors'} category - The category currently open.
   * @returns {Promise<{ name: string; price: string }[]>} List of extracted product objects.
   */
  async extractProductData(
    category: "Phones" | "Laptops" | "Monitors"
  ): Promise<{ name: string; price: string }[]> {
    const cardsCount = await this.productCards.count();
    const data: { name: string; price: string }[] = [];

    for (let i = 0; i < cardsCount; i++) {
      const card = this.productCards.nth(i);
      const name = await card.locator("h4 a").textContent();
      const price = await card.locator("h5").textContent();

      if (name && price) {
        data.push({
          name: name.trim(),
          price: price.trim(),
        });
      }
    }
    
    const testDataDir = "testsAssets/testData";
    if (!fs.existsSync(testDataDir)) {
      fs.mkdirSync(testDataDir);
    }

    const fileName = `${category.toLowerCase()}Ui.json`;
    const filePath = path.join(testDataDir, fileName);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return data;
  }
}
