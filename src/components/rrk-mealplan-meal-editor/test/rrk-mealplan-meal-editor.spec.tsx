import { newSpecPage } from '@stencil/core/testing';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { Meal } from '../../../api/mealplan';
import { RrkMealplanMealEditor } from '../rrk-mealplan-meal-editor';

describe('rrk-mealplan-meal-editor', () => {
  const sampleEntry: Meal = {
    id: 'entry-1',
    allergens: ['nuts'],
    ingredients: ['water', 'flour', 'nuts'],
    name: 'Chlieb',
    portionSize: '200',
    nutrients: {
      calories: 100,
      carbohydrates: 10,
      fats: 5,
      proteins: 1,
    },
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
      components: [RrkMealplanMealEditor],
      html: `<rrk-mealplan-meal-editor entry-id="test-entry" api-base="http://sample.test/api"></rrk-mealplan-meal-editor>`,
    });
    await delay(300);
    await page.waitForChanges();

    let items: any = page.root.shadowRoot.querySelectorAll('md-filled-button');
    expect(items.length).toEqual(1);
    items = page.root.shadowRoot.querySelectorAll('md-outlined-button');
    expect(items.length).toEqual(1);

    items = page.root.shadowRoot.querySelectorAll('md-filled-tonal-button');
    expect(items.length).toEqual(1);
  });

  it('first text field is a meal name', async () => {
    mock.onGet().reply(200, sampleEntry);

    const page = await newSpecPage({
      components: [RrkMealplanMealEditor],
      html: `<rrk-mealplan-meal-editor entry-id="test-entry" api-base="http://sample.test/api"></rrk-mealplan-meal-editor>`,
    });
    let items: any = await page.root.shadowRoot.querySelectorAll('md-filled-text-field');

    await delay(300);
    await page.waitForChanges();

    expect(items.length).toBeGreaterThanOrEqual(1);
    expect(items[0].getAttribute('value')).toEqual(sampleEntry.name);
  });
});
