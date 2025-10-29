import { APIRequestContext, request } from '@playwright/test';
import fs from 'fs';
import path from 'path';

/**
 * Page Object Model for interacting with Demoblaze API.
 * Handles category-wise product extraction using API requests.
 */
export default class DemoblazeAPIPage  {
  private readonly baseUrl: string;
  private readonly apiEndpoint: string;
  private readonly requestContext: APIRequestContext;

  /**
   * Initializes the API context and base endpoint.
   */
  constructor(requestContext: APIRequestContext) {
    this.baseUrl = 'https://api.demoblaze.com';
    this.apiEndpoint = '/bycat';
    this.requestContext = requestContext;
  }

  /**
   * Sends a POST request to the API for a specific category and extracts name and price.
   * Saves results as JSON in testsAssets/testData.
   *
   * @param {'phone' | 'notebook' | 'monitor'} category - The API category to request.
   * @returns {Promise<{ name: string; price: string }[]>} - Extracted product data.
   */
  async extractProductData(category: 'phone' | 'notebook' | 'monitor'): Promise<{ name: string; price: string }[]> {
    const response = await this.requestContext.post(`${this.baseUrl}${this.apiEndpoint}`, {
      data: { cat: category },
    });

    if (!response.ok()) {
      throw new Error(`Failed to fetch data for ${category}. Status: ${response.status()}`);
    }

    const responseBody = await response.json();
    const items = responseBody.Items || [];

    const data = items.map((item: any) => ({
      name: item.title,
      price: `$${item.price}`,
    }));

    const testDataDir = 'testsAssets/testData';
    if (!fs.existsSync(testDataDir)) {
      fs.mkdirSync(testDataDir, { recursive: true });
    }

    const fileName = `${category}Api.json`;
    const filePath = path.join(testDataDir, fileName);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return data;
  }
}
