import { newE2EPage } from '@stencil/core/testing';

describe('rrk-mealplan-patient-list', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<rrk-mealplan-patient-list></rrk-mealplan-patient-list>');

    const element = await page.find('rrk-mealplan-patient-list');
    expect(element).toHaveClass('hydrated');
  });
});
