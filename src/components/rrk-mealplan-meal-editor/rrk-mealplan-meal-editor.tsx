import { Component, Event, EventEmitter, Host, Prop, State, h } from '@stencil/core';
import { Meal, MealsApiFactory } from '../../api/mealplan';

@Component({
  tag: 'rrk-mealplan-meal-editor',
  styleUrl: 'rrk-mealplan-meal-editor.css',
  shadow: true,
})
export class RrkMealplanMealEditor {
  @Prop() entryId: string;
  @Prop() ambulanceId: string;
  @Prop() apiBase: string;

  @Event({ eventName: 'editor-closed' }) editorClosed: EventEmitter<string>;

  @State() private duration = 15;
  @State() entry: Meal;
  @State() errorMessage: string;
  @State() isValid: boolean;

  private formElement: HTMLFormElement;

  // private async getConditions(): Promise<Condition[]> {
  //   try {
  //     const response = await AmbulanceConditionsApiFactory(undefined, this.apiBase).getConditions(this.ambulanceId);
  //     if (response.status < 299) {
  //       this.conditions = response.data;
  //     }
  //   } catch (err: any) {
  //     // no strong dependency on conditions
  //   }
  //   // always have some fallback condition
  //   return (
  //     this.conditions || [
  //       {
  //         code: 'fallback',
  //         value: 'Neurčený dôvod návštevy',
  //         typicalDurationMinutes: 15,
  //       },
  //     ]
  //   );
  // }

  private async getMealAsync(): Promise<Meal> {
    if (this.entryId === '@new') {
      this.isValid = false;
      this.entry = {
        id: '@new',
        allergens: [],
        ingredients: [],
        name: '',
        portionSize: '0',
        nutrients: {
          calories: 0,
          carbohydrates: 0,
          fats: 0,
          proteins: 0,
        },
      };
      return this.entry;
    }

    if (!this.entryId) {
      this.isValid = false;
      return undefined;
    }
    try {
      const response = await MealsApiFactory(undefined, this.apiBase).getMeal(this.entryId);

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
    this.getMealAsync();
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
            label="Názov jedla"
            required
            value={this.entry?.name}
            oninput={(ev: InputEvent) => {
              if (this.entry) {
                this.entry.name = this.handleInputEvent(ev);
              }
            }}
          >
            <md-icon slot="leading-icon">menu_book</md-icon>
          </md-filled-text-field>
          <md-filled-text-field
            label="Veľkosť porcie"
            required
            value={this.entry?.portionSize}
            oninput={(ev: InputEvent) => {
              if (this.entry) {
                this.entry.portionSize = this.handleInputEvent(ev);
              }
            }}
          >
            <md-icon slot="leading-icon">fastfood</md-icon>
          </md-filled-text-field>
          <md-filled-text-field
            label="Kalórie"
            required
            value={this.entry?.nutrients.calories.toString()}
            oninput={(ev: InputEvent) => {
              if (this.entry) {
                this.entry.nutrients.calories = Number.parseInt(this.handleInputEvent(ev));
              }
            }}
          >
            <md-icon slot="leading-icon">local_fire_department</md-icon>
          </md-filled-text-field>
          <md-filled-text-field
            label="Sacharidy"
            required
            value={this.entry?.nutrients.carbohydrates.toString()}
            oninput={(ev: InputEvent) => {
              if (this.entry) {
                this.entry.nutrients.carbohydrates = Number.parseInt(this.handleInputEvent(ev));
              }
            }}
          >
            <md-icon slot="leading-icon">cake</md-icon>
          </md-filled-text-field>
          <md-filled-text-field
            label="Tuky"
            required
            value={this.entry?.nutrients.fats.toString()}
            oninput={(ev: InputEvent) => {
              if (this.entry) {
                this.entry.nutrients.fats = Number.parseInt(this.handleInputEvent(ev));
              }
            }}
          >
            <md-icon slot="leading-icon">local_dining</md-icon>
          </md-filled-text-field>
          <md-filled-text-field
            label="Bielkoviny"
            required
            value={this.entry?.nutrients.proteins.toString()}
            oninput={(ev: InputEvent) => {
              if (this.entry) {
                this.entry.nutrients.proteins = Number.parseInt(this.handleInputEvent(ev));
              }
            }}
          >
            <md-icon slot="leading-icon">emoji_food_beverage</md-icon>
          </md-filled-text-field>
          {this.entry?.allergens.map((allergen, i) => {
            return (
              <md-filled-text-field
                label={`Alergén ${i + 1}`}
                required
                value={allergen}
                oninput={(ev: InputEvent) => {
                  if (this.entry) {
                    this.entry.allergens = this.entry.allergens.map(a => (a === allergen ? this.handleInputEvent(ev) : a));
                  }
                }}
              />
            );
          })}
          {/* new allergen */}
          <md-filled-text-field
            label={`Alergén ${this.entry?.allergens.length + 1}`}
            oninput={(ev: InputEvent) => {
              if (this.entry) {
                this.entry.allergens = [...this.entry.allergens, this.handleInputEvent(ev)];
              }
            }}
          />
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
    try {
      const api = MealsApiFactory(undefined, this.apiBase);
      const response = this.entryId === '@new' ? await api.createMeal(this.entry) : await api.updateMeal(this.entryId, this.entry);
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
      const response = await MealsApiFactory(undefined, this.apiBase).deleteMeal(this.entryId);
      if (response.status < 299) {
        this.editorClosed.emit('delete');
      } else {
        this.errorMessage = `Cannot delete entry: ${response.statusText}`;
      }
    } catch (err: any) {
      this.errorMessage = `Cannot delete entry: ${err.message || 'unknown'}`;
    }
  }
}
