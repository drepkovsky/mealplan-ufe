import { newSpecPage } from '@stencil/core/testing';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { Condition, WaitingListEntry } from '../../../api/mealplan';
import { RrkMealplanMealEditor } from '../rrk-mealplan-meal-editor';

describe('rrk-mealplan-meal-editor', () => {
  const sampleEntry: WaitingListEntry = {
    id: 'entry-1',
    patientId: 'p-1',
    name: 'Juraj Prvý',
    waitingSince: '20240203T12:00',
    estimatedDurationMinutes: 20,
    condition: {
      value: 'Nevoľnosť',
      code: 'nausea',
      reference: 'https://zdravoteka.sk/priznaky/nevolnost/',
    },
  };

  const sampleConditions: Condition[] = [
    {
      value: 'Teploty',
      code: 'subfebrilia',
      reference: 'https://zdravoteka.sk/priznaky/zvysena-telesna-teplota/',
      typicalDurationMinutes: 20,
    },
    {
      value: 'Nevoľnosť',
      code: 'nausea',
      reference: 'https://zdravoteka.sk/priznaky/nevolnost/',
      typicalDurationMinutes: 45,
    },
  ];

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
    mock.onGet(/^.*\/entries\/.+/).reply(200, sampleEntry);
    mock.onGet(/^.*\/condition$/).reply(200, sampleConditions);

    const page = await newSpecPage({
      components: [RrkMealplanMealEditor],
      html: `<rrk-mealplan-meal-editor entry-id="test-entry"
      ambulance-id="test-ambulance" api-base="http://sample.test/api"></rrk-mealplan-meal-editor>`,
    });
    await delay(300);
    await page.waitForChanges();

    let items: any = await page.root.shadowRoot.querySelectorAll('md-filled-button');
    expect(items.length).toEqual(1);
    items = await page.root.shadowRoot.querySelectorAll('md-outlined-button');
    expect(items.length).toEqual(1);

    items = await page.root.shadowRoot.querySelectorAll('md-filled-tonal-button');
    expect(items.length).toEqual(1);
  });

  it('first text field is patient name', async () => {
    mock.onGet(/^.*\/entries\/.+/).reply(200, sampleEntry);
    mock.onGet(/^.*\/condition$/).reply(200, sampleConditions);

    const page = await newSpecPage({
      components: [RrkMealplanMealEditor],
      html: `<rrk-mealplan-meal-editor entry-id="test-entry" ambulance-id="test-ambulance" api-base="http://sample.test/api"></rrk-mealplan-meal-editor>`,
    });
    let items: any = await page.root.shadowRoot.querySelectorAll('md-filled-text-field');

    await delay(300);
    await page.waitForChanges();

    expect(items.length).toBeGreaterThanOrEqual(1);
    expect(items[0].getAttribute('value')).toEqual(sampleEntry.name);
  });
});
