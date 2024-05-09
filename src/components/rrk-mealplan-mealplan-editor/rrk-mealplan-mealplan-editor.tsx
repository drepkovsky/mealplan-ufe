import { Component, Event, EventEmitter, Host, Prop, State, h } from '@stencil/core';
import { Meal, MealPlan, MealPlansApiFactory, MealsApiFactory, PatientsApiFactory } from '../../api/mealplan';

@Component({
  tag: 'rrk-mealplan-mealplan-editor',
  styleUrl: 'rrk-mealplan-mealplan-editor.css',
  shadow: true,
})
export class RrkMealplanMealPlanEditor {
  @Prop() entryId: string;
  @Prop() patientId: string;
  @Prop() apiBase: string;

  @Event({ eventName: 'editor-closed' }) editorClosed: EventEmitter<string>;

  @State() entry: MealPlan;
  @State() errorMessage: string;
  @State() isValid: boolean;

  @State() meals: Meal[];

  private formElement: HTMLFormElement;

  private isNewEntry(): boolean {
    return this.entryId === '@new';
  }

  private async getMeals(): Promise<Meal[]> {
    try {
      const response = await MealsApiFactory(undefined, this.apiBase).listMeals();
      if (response.status < 299) {
        this.meals = response.data;
      }
    } catch (err: any) {
      this.errorMessage = `Cannot retrieve list of meals: ${err.message || 'unknown'}`;
    }
    return this.meals ?? [];
  }

  private async getMealPlanAsync(): Promise<MealPlan> {
    if (this.isNewEntry()) {
      this.isValid = false;
      this.entry = {
        date: new Date().toISOString(),
        id: '@new',
        meals: [],
        patientId: this.patientId,
      };
      return this.entry;
    }

    if (!this.entryId) {
      this.isValid = false;
      return undefined;
    }
    try {
      const response = await MealPlansApiFactory(undefined, this.apiBase).getMealPlan(this.entryId);

      if (response.status < 299) {
        this.entry = response.data;
        this.isValid = true;
      } else {
        this.errorMessage = `Cannot retrieve list of waiting patients: ${response.statusText}`;
      }
    } catch (err: any) {
      this.errorMessage = `Cannot retrieve list of waiting patients: ${err.message || 'unknown'}`;
    }
    return undefined;
  }

  async componentWillLoad() {
    this.getMealPlanAsync();
    this.getMeals();
  }

  addMeal() {
    this.entry.meals ??= [];
    this.entry.meals.push({
      mealId: '',
      time: '',
    });
    this.entry = { ...this.entry };
  }

  removeMeal(index: number) {
    this.entry.meals.splice(index, 1);
    this.entry = { ...this.entry };
  }

  render() {
    if (this.errorMessage) {
      return (
        <Host>
          <div class="error">{this.errorMessage}</div>
        </Host>
      );
    }

    return (
      <Host>
        <form ref={el => (this.formElement = el)}>
          <md-filled-text-field
            label="Dátum"
            type="date"
            required
            value={this.entry?.date}
            oninput={(ev: InputEvent) => {
              if (this.entry) {
                this.entry.date = this.handleInputEvent(ev);
              }
            }}
          >
            <md-icon slot="leading-icon">menu_book</md-icon>
          </md-filled-text-field>

          <h4>Jedlá</h4>
          {this.entry?.meals?.map((meal, index) => (
            <div class="form-row" key={index}>
              <md-filled-text-field
                label="Čas"
                type="time"
                class="form-row-item"
                required
                value={meal.time}
                oninput={(ev: InputEvent) => {
                  if (meal) {
                    meal.time = this.handleInputEvent(ev);
                  }
                }}
              >
                <md-icon slot="leading-icon">menu_book</md-icon>
              </md-filled-text-field>
              {this.renderMealSelect(index)}

              <md-outlined-button onClick={() => this.removeMeal(index)} type="button">
                <md-icon slot="icon">delete</md-icon>
                Zmazať
              </md-outlined-button>
            </div>
          ))}

          <md-outlined-button onClick={() => this.addMeal()} type="button">
            <md-icon slot="icon">add</md-icon>
            Pridať jedlo
          </md-outlined-button>
        </form>

        <md-divider></md-divider>
        <div class="actions">
          <md-filled-tonal-button id="delete" disabled={!this.entry} onClick={() => this.deleteEntry()}>
            <md-icon slot="icon">delete</md-icon>
            Zmazať záznam
          </md-filled-tonal-button>
          <span class="stretch-fill"></span>
          <md-outlined-button id="cancel" onClick={() => this.editorClosed.emit('cancel')}>
            Zrušiť
          </md-outlined-button>
          <md-filled-button id="confirm" disabled={!this.isValid} onClick={() => this.updateEntry()}>
            <md-icon slot="icon">save</md-icon>
            Uložiť
          </md-filled-button>
        </div>
      </Host>
    );
  }

  private handleInputEvent(ev: InputEvent): string {
    const target = ev.target as HTMLInputElement;
    // check validity of elements
    this.isValid = true;
    for (let i = 0; i < this.formElement.children.length; i++) {
      const element = this.formElement.children[i];
      if ('reportValidity' in element) {
        const valid = (element as HTMLInputElement).reportValidity();
        this.isValid &&= valid;
      }
    }
    return target.value;
  }

  private async updateEntry() {
    this.entry.meals = this.entry.meals.filter(meal => meal.mealId !== '');

    try {
      const api = MealPlansApiFactory(undefined, this.apiBase);
      const response = this.entryId === '@new' ? await api.createMealPlan(this.entry) : await api.updateMealPlan(this.entryId, this.entry);
      if (response.status < 299) {
        this.editorClosed.emit('store');
      } else {
        this.errorMessage = `Cannot store entry: ${response.statusText}`;
      }
    } catch (err: any) {
      this.errorMessage = `Cannot store entry: ${err.message || 'unknown'}`;
    }
  }

  private async deleteEntry() {
    try {
      const response = await PatientsApiFactory(undefined, this.apiBase).deletePatient(this.entryId);
      if (response.status < 299) {
        this.editorClosed.emit('delete');
      } else {
        this.errorMessage = `Cannot delete entry: ${response.statusText}`;
      }
    } catch (err: any) {
      this.errorMessage = `Cannot delete entry: ${err.message || 'unknown'}`;
    }
  }

  private renderMealSelect(index: number) {
    let meals = this.meals || [];
    const selectedMeal = this.entry?.meals[index];
    const entryMealId = selectedMeal?.mealId || '';
    return (
      <md-filled-select label="Jedlo" display-text={this.entry?.meals} oninput={(ev: InputEvent) => this.handleMealSelect(ev, index)} class="form-row-item">
        <md-icon slot="leading-icon">sick</md-icon>
        {meals.map(meal => {
          return (
            <md-select-option value={meal.id} selected={meal.id === entryMealId}>
              <div slot="headline">{meal.name}</div>
              <div slot="supporting-text">
                {meal.portionSize} - Alergény:{meal.allergens.join(',')}
              </div>
            </md-select-option>
          );
        })}
      </md-filled-select>
    );
  }

  private async handleMealSelect(ev: InputEvent, index: number) {
    const target = ev.target as HTMLSelectElement;
    const selectedMeal = this.meals.find(meal => meal.id === target.value);
    this.entry.meals[index] = {
      mealId: selectedMeal.id,
      time: this.entry.meals[index].time,
    };
  }
}
