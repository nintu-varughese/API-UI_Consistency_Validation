import { test as base, expect, request } from '@playwright/test';
import DemoblazeUIPage from '../pages/demoBlazeUiPage';
import DemoblazeAPIPage from '../pages/demoblazeAPI';
import compareJsonData  from '../helper/comparejson';
import fs from 'fs';
import path from 'path';

type Fixtures = {
  demoblazeUI: DemoblazeUIPage;
  demoblazeAPI: DemoblazeAPIPage;
  compareJsonData: () => Promise<void>;
  fs: typeof fs;
  path: typeof path;
};

export const test = base.extend<Fixtures>({
  
  demoblazeUI: async ({ page }, use) => {
    const uiPage = new DemoblazeUIPage(page);
    await use(uiPage);
  },

  demoblazeAPI: async ({}, use) => {
    const apiContext = await request.newContext();
    const apiPage = new DemoblazeAPIPage(apiContext);
    await use(apiPage);
    await apiContext.dispose();
  },

  compareJsonData: async ({}, use) => {
    await use(compareJsonData);
  },

  fs: async ({}, use) => {
    await use(fs);
  },

  path: async ({}, use) => {
    await use(path);
  },
});

export { expect };
