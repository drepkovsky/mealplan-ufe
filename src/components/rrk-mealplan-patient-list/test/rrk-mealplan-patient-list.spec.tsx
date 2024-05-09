import { newSpecPage } from '@stencil/core/testing';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { Patient } from '../../../api/mealplan';
import { RrkMealplanPatientList } from '../rrk-mealplan-patient-list';

describe('rrk-mealplan-patient-list', () => {
  const sampleEntries: Patient[] = [
    {
      patientId: 'entry-1',
      allergens: ['nuts'],
      ingredientPreferences: ['water', 'flour', 'nuts'],
      fullName: 'Janko Hrasko',
      age: 30,
    },
    {
      patientId: 'entry-2',
      allergens: ['lactose'],
      ingredientPreferences: ['water', 'flour', 'nuts'],
      fullName: 'Ferko Mrkvicka',
      age: 40,
    },
    {
      patientId: 'entry-3',
      allergens: ['nuts'],
      ingredientPreferences: ['water', 'flour', 'nuts'],
      fullName: 'Jozko Vajda',
      age: 50,
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
      components: [RrkMealplanPatientList],
      html: `<rrk-mealplan-patient-list ambulance-id="test-ambulance" api-base="http://test/api"></rrk-mealplan-patient-list>`,
    });
    const wlList = page.rootInstance as RrkMealplanPatientList;
    const expectedPatients = wlList?.patients?.length;

    const items = page.root.shadowRoot.querySelectorAll('md-list-item');
    // use sample entries as expectation
    expect(expectedPatients).toEqual(sampleEntries.length);
    expect(items.length).toEqual(expectedPatients);
  });

  it('renders error message on network issues', async () => {
    mock.onGet().networkError();
    const page = await newSpecPage({
      components: [RrkMealplanPatientList], //
      html: `<rrk-mealplan-patient-list ambulance-id="test-ambulance" api-base="http://test/api"></rrk-mealplan-patient-list>`, //
    });

    const wlList = page.rootInstance as RrkMealplanPatientList; //
    const expectedPatients = wlList?.patients?.length;

    const errorMessage = page.root.shadowRoot.querySelectorAll('.error');
    const items = page.root.shadowRoot.querySelectorAll('md-list-item');

    expect(errorMessage.length).toBeGreaterThanOrEqual(1);
    expect(expectedPatients).toEqual(0);
    expect(items.length).toEqual(expectedPatients);
  });
});
