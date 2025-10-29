import { Page } from '@playwright/test';

export default class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigateTo(url: string): Promise<void> {
    await this.page.goto(url, { waitUntil: 'load' });
  }

  async click(selector: string): Promise<void> {
    await this.page.click(selector);
  }
}
