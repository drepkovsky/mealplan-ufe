import { newSpecPage } from '@stencil/core/testing';
import { RrkMealplanApp } from '../rrk-mealplan-app';

describe('rrk-mealplan-app', () => {
  it('renders editor', async () => {
    const page = await newSpecPage({
      url: `http://localhost/entry/@new`,
      components: [RrkMealplanApp],
      html: `<rrk-mealplan-app base-path="/"></rrk-mealplan-app>`,
    });
    page.win.navigation = new EventTarget();
    const child = await page.root.shadowRoot.firstElementChild;
    expect(child.tagName.toLocaleLowerCase()).toEqual('rrk-mealplan-meal-editor');
  });

  it('renders list', async () => {
    const page = await newSpecPage({
      url: `http://localhost/ambulance-wl/`,
      components: [RrkMealplanApp],
      html: `<rrk-mealplan-app base-path="/ambulance-wl/"></rrk-mealplan-app>`,
    });
    page.win.navigation = new EventTarget();
    const child = await page.root.shadowRoot.firstElementChild;
    expect(child.tagName.toLocaleLowerCase()).toEqual('rrk-mealplan-meal-list');
  });
});
