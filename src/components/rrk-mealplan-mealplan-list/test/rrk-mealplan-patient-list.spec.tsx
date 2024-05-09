import { newSpecPage } from '@stencil/core/testing';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { MealPlan } from '../../../api/mealplan';
import { RrkMealplanMealPlanList } from '../rrk-mealplan-mealplan-list';

describe('rrk-mealplan-mealplan-list', () => {
  const sampleEntries: MealPlan[] = [
    {
      patientId: 'entry-1',
      id: 'entry-1',
      date: '2021-10-10',
      meals: [
        {
          time: '2021-10-10T12:00:00',
          mealId: 'meal-1',
        },
      ],
    },
    {
      patientId: 'entry-2',
      id: 'entry-2',
      date: '2021-10-11',
      meals: [
        {
          time: '2021-10-11T12:00:00',
          mealId: 'meal-2',
        },
      ],
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
      components: [RrkMealplanMealPlanList],
      html: `<rrk-mealplan-mealplan-list  api-base="http://test/api"></rrk-mealplan-mealplan-list>`,
    });
    const wlList = page.rootInstance as RrkMealplanMealPlanList;
    const expectedMealPlans = wlList?.mealPlans?.length;

    const items = page.root.shadowRoot.querySelectorAll('md-list-item');
    // use sample entries as expectation
    expect(expectedMealPlans).toEqual(sampleEntries.length);
    expect(items.length).toEqual(expectedMealPlans);
  });

  it('renders error message on network issues', async () => {
    mock.onGet().networkError();
    const page = await newSpecPage({
      components: [RrkMealplanMealPlanList], //
      html: `<rrk-mealplan-mealplan-list  api-base="http://test/api"></rrk-mealplan-mealplan-list>`, //
    });

    const wlList = page.rootInstance as RrkMealplanMealPlanList; //
    const expectedMealPlans = wlList?.mealPlans?.length;

    const errorMessage = page.root.shadowRoot.querySelectorAll('.error');
    const items = page.root.shadowRoot.querySelectorAll('md-list-item');

    expect(errorMessage.length).toBeGreaterThanOrEqual(1);
    expect(expectedMealPlans).toEqual(0);
    expect(items.length).toEqual(expectedMealPlans);
  });
});
