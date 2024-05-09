import { Component, Event, EventEmitter, Host, Prop, State, h } from '@stencil/core';
import { Meal, MealPlan, MealPlansApiFactory, MealsApiFactory } from '../../api/mealplan';

@Component({
  tag: 'rrk-mealplan-mealplan-list',
  styleUrl: 'rrk-mealplan-mealplan-list.css',
  shadow: true,
})
export class RrkMealplanMealPlanList {
  mealPlans: MealPlan[];
  meals: Record<string, Meal>;

  @Event({ eventName: 'entry-clicked' }) entryClicked: EventEmitter<string>;
  @Prop() apiBase: string;
  @Prop() patientId: string;

  @State() errorMessage: string;

  private async getMealPlansAsync() {
    try {
      const response = await MealPlansApiFactory(undefined, this.apiBase).listMealPlans(this.patientId);
      if (response.status < 299) {
        return response.data;
      } else {
        this.errorMessage = `Cannot retrieve list of waiting patients: ${response.statusText}`;
      }
    } catch (err: any) {
      this.errorMessage = `Cannot retrieve list of waiting patients: ${err.message || 'unknown'}`;
    }
    return [];
  }

  private async getMeals(): Promise<Meal[]> {
    try {
      const response = await MealsApiFactory(undefined, this.apiBase).listMeals();
      if (response.status < 299) {
        return response.data;
      }
    } catch (err: any) {
      this.errorMessage = `Cannot retrieve list of meals: ${err.message || 'unknown'}`;
    }
    return [];
  }

  async componentWillLoad() {
    this.mealPlans = await this.getMealPlansAsync();
    this.meals = await this.getMeals().then(meals => {
      const mealsById: Record<string, Meal> = {};
      meals.forEach(meal => (mealsById[meal.id] = meal));
      return mealsById;
    });
  }

  render() {
    return (
      <Host>
        {this.errorMessage ? (
          <div class="error">{this.errorMessage}</div>
        ) : (
          <md-list>
            {this.mealPlans?.map(mealPlan => (
              <md-list-item onClick={() => this.entryClicked.emit(mealPlan.id)}>
                <div slot="headline">
                  {new Date(mealPlan.date).toLocaleString(undefined, {
                    weekday: 'long',
                    year: 'numeric',
                    day: 'numeric',
                    month: 'numeric',
                  })}
                </div>
                <div slot="supporting-text">
                  {'Jedlá: '}{' '}
                  {mealPlan.meals
                    .map(meal => `${this.meals[meal.mealId]?.name} - ${meal.time}`)
                    .filter(Boolean)
                    .join(', ')}
                </div>
                <md-icon slot="start">event</md-icon>
              </md-list-item>
            ))}
          </md-list>
        )}
        <md-filled-icon-button class="add-button" onclick={() => this.entryClicked.emit('@new')}>
          <md-icon>add</md-icon>
        </md-filled-icon-button>
      </Host>
    );
  }
}
