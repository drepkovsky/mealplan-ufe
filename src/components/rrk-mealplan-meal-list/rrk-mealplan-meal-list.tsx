import { Component, Event, EventEmitter, Host, Prop, State, h } from '@stencil/core';
import { Meal, MealsApiFactory } from '../../api/mealplan';

@Component({
  tag: 'rrk-mealplan-meal-list',
  styleUrl: 'rrk-mealplan-meal-list.css',
  shadow: true,
})
export class RrkMealplanMealList {
  meals: Meal[];

  @Event({ eventName: 'entry-clicked' }) entryClicked: EventEmitter<string>;
  @Prop() apiBase: string;
  @State() errorMessage: string;

  private async getWaitingPatientsAsync() {
    try {
      const response = await MealsApiFactory(undefined, this.apiBase).listMeals();
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

  async componentWillLoad() {
    this.meals = await this.getWaitingPatientsAsync();
  }

  render() {
    return (
      <Host>
        {this.errorMessage ? (
          <div class="error">{this.errorMessage}</div>
        ) : (
          <md-list>
            {this.meals?.map(meal => (
              <md-list-item onClick={() => this.entryClicked.emit(meal.id)}>
                <div slot="headline">{meal.name}</div>
                <div slot="supporting-text">{'Velkost porcie: ' + meal.portionSize}</div>
                <md-icon slot="start">person</md-icon>
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
