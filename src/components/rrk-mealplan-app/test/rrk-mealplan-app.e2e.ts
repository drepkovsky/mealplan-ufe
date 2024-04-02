import { newE2EPage } from '@stencil/core/testing';

describe('rrk-mealplan-app', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<rrk-mealplan-app></rrk-mealplan-app>');

    const element = await page.find('rrk-mealplan-app');
    expect(element).toHaveClass('hydrated');
  });
});
