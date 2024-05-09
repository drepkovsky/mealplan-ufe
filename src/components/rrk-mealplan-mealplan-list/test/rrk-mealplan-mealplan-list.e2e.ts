import { newE2EPage } from '@stencil/core/testing';

describe('rrk-mealplan-mealplan-list', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<rrk-mealplan-mealplan-list></rrk-mealplan-mealplan-list>');

    const element = await page.find('rrk-mealplan-mealplan-list');
    expect(element).toHaveClass('hydrated');
  });
});
