import { newE2EPage } from '@stencil/core/testing';

describe('rrk-mealplan-mealplan-editor', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<rrk-mealplan-mealplan-editor></rrk-mealplan-mealplan-editor>');

    const element = await page.find('rrk-mealplan-mealplan-editor');
    expect(element).toHaveClass('hydrated');
  });
});
