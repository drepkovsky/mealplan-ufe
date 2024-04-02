import { newE2EPage } from '@stencil/core/testing';

describe('rrk-mealplan-meal-list', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<rrk-mealplan-meal-list></rrk-mealplan-meal-list>');

    const element = await page.find('rrk-mealplan-meal-list');
    expect(element).toHaveClass('hydrated');
  });
});
