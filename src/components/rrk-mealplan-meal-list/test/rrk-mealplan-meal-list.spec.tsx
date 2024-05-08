import { newSpecPage } from '@stencil/core/testing';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { RrkMealplanMealList } from '../rrk-mealplan-meal-list';
import { Meal } from '../../../api/mealplan';

describe('rrk-mealplan-meal-list', () => {
  const sampleEntries: Meal[] = [
    {
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
    },
    {
      id: 'entry-2',
      allergens: ['milk'],
      ingredients: ['water', 'flour', 'milk'],
      name: 'Vajca s maslom',
      portionSize: '300',
      nutrients: {
        calories: 200,
        carbohydrates: 20,
        fats: 10,
        proteins: 2,
      },
    },
  ];

  let mock: MockAdapter;

  beforeAll(() => {
    mock = new MockAdapter(axios);
  });
  afterEach(() => {
    mock.reset();
  });

  it('renders sample entries', async () => {
    // simulate API response using sampleEntries
    mock.onGet().reply(200, sampleEntries);

    // set proper attributes
    const page = await newSpecPage({
      components: [RrkMealplanMealList],
      html: `<rrk-mealplan-meal-list ambulance-id="test-ambulance" api-base="http://test/api"></rrk-mealplan-meal-list>`,
    });
    const wlList = page.rootInstance as RrkMealplanMealList;
    const expectedPatients = wlList?.meals?.length;

    const items = page.root.shadowRoot.querySelectorAll('md-list-item');
    // use sample entries as expectation
    expect(expectedPatients).toEqual(sampleEntries.length);
    expect(items.length).toEqual(expectedPatients);
  });

  it('renders error message on network issues', async () => {
    mock.onGet().networkError();
    const page = await newSpecPage({
      components: [RrkMealplanMealList], //
      html: `<rrk-mealplan-meal-list ambulance-id="test-ambulance" api-base="http://test/api"></rrk-mealplan-meal-list>`, //
    });

    const wlList = page.rootInstance as RrkMealplanMealList; //
    const expectedPatients = wlList?.meals?.length;

    const errorMessage = page.root.shadowRoot.querySelectorAll('.error');
    const items = page.root.shadowRoot.querySelectorAll('md-list-item');

    expect(errorMessage.length).toBeGreaterThanOrEqual(1);
    expect(expectedPatients).toEqual(0);
    expect(items.length).toEqual(expectedPatients);
  });
});
