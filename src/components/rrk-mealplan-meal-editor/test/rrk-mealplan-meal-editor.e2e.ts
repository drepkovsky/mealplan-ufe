import { newE2EPage } from '@stencil/core/testing';

describe('rrk-mealplan-meal-editor', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<rrk-mealplan-meal-editor></rrk-mealplan-meal-editor>');

    const element = await page.find('rrk-mealplan-meal-editor');
    expect(element).toHaveClass('hydrated');
  });
});
