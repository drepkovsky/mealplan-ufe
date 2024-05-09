import { newE2EPage } from '@stencil/core/testing';

describe('rrk-mealplan-patient-editor', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<rrk-mealplan-patient-editor></rrk-mealplan-patient-editor>');

    const element = await page.find('rrk-mealplan-patient-editor');
    expect(element).toHaveClass('hydrated');
  });
});
