import { newSpecPage } from '@stencil/core/testing';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { Patient } from '../../../api/mealplan';
import { RrkMealplanMealPlanEditor } from '../rrk-mealplan-mealplan-editor';

describe('rrk-mealplan-mealplan-editor', () => {
  const sampleEntry: Patient = {
    patientId: 'entry-1',
    allergens: ['nuts'],
    ingredientPreferences: ['water', 'flour', 'nuts'],
    fullName: 'Chlieb',
    age: 40,
  };

  let delay = async (miliseconds: number) =>
    await new Promise<void>(resolve => {
      setTimeout(() => resolve(), miliseconds);
    });

  let mock: MockAdapter;

  beforeAll(() => {
    mock = new MockAdapter(axios);
  });
  afterEach(() => {
    mock.reset();
  });

  it('buttons shall be of different type', async () => {
    mock.onGet().reply(200, sampleEntry);

    const page = await newSpecPage({
      components: [RrkMealplanMealPlanEditor],
      html: `<rrk-mealplan-mealplan-editor entry-id="test-entry" api-base="http://sample.test/api"></rrk-mealplan-mealplan-editor>`,
    });
    await delay(300);
    await page.waitForChanges();

    let items: any = await page.root.shadowRoot.querySelectorAll('md-filled-button');
    expect(items.length).toEqual(1);
    items = await page.root.shadowRoot.querySelectorAll('md-outlined-button');
    expect(items.length).toEqual(2);

    items = await page.root.shadowRoot.querySelectorAll('md-filled-tonal-button');
    expect(items.length).toEqual(1);
  });

  // it('first text field is mealplan date', async () => {
  //   mock.onGet(/^.*\/entries\/.+/).reply(200, sampleEntry);

  //   const page = await newSpecPage({
  //     components: [RrkMealplanMealplanEditor],
  //     html: `<rrk-mealplan-mealplan-editor entry-id="test-entry" api-base="http://sample.test/api"></rrk-mealplan-patient-editor>`,
  //   });
  //   let items: any = await page.root.shadowRoot.querySelectorAll('md-filled-text-field');

  //   await delay(300);
  //   await page.waitForChanges();

  //   expect(items.length).toBeGreaterThanOrEqual(1);
  //   expect(items[0].getAttribute('value')).toEqual(sampleEntry.fullName);
  // });
});
