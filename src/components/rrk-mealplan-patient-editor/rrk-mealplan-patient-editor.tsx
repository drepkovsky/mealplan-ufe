import { Component, Event, EventEmitter, Host, Prop, State, h } from '@stencil/core';
import { Patient, PatientsApiFactory } from '../../api/mealplan';

@Component({
  tag: 'rrk-mealplan-patient-editor',
  styleUrl: 'rrk-mealplan-patient-editor.css',
  shadow: true,
})
export class RrkMealplanPatientEditor {
  @Prop() entryId: string;
  @Prop() apiBase: string;

  @Event({ eventName: 'editor-closed' }) editorClosed: EventEmitter<string>;

  @State() entry: Patient;
  @State() errorMessage: string;
  @State() isValid: boolean;

  private formElement: HTMLFormElement;

  private isNewEntry(): boolean {
    return this.entryId === '@new';
  }

  private async getPatientAsync(): Promise<Patient> {
    if (this.entryId === '@new') {
      this.isValid = false;
      this.entry = {
        patientId: '@new',
        age: 40,
        allergens: [],
        fullName: '',
        ingredientPreferences: [],
      };
      return this.entry;
    }

    if (!this.entryId) {
      this.isValid = false;
      return undefined;
    }
    try {
      const response = await PatientsApiFactory(undefined, this.apiBase).getPatient(this.entryId);

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
    this.getPatientAsync();
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
            label="Celé meno"
            required
            value={this.entry?.fullName}
            oninput={(ev: InputEvent) => {
              if (this.entry) {
                this.entry.fullName = this.handleInputEvent(ev);
              }
            }}
          >
            <md-icon slot="leading-icon">menu_book</md-icon>
          </md-filled-text-field>
          <md-filled-text-field
            label="Vek"
            required
            value={this.entry?.age}
            oninput={(ev: InputEvent) => {
              if (!this.entry) return;
              const num = Number.parseInt(this.handleInputEvent(ev));
              if (isNaN(num)) {
                return;
              }
              this.entry.age = num;
            }}
          >
            <md-icon slot="leading-icon">fastfood</md-icon>
          </md-filled-text-field>
          <md-filled-text-field
            label="Alergény pacienta"
            required
            value={this.entry?.allergens.join(',')}
            oninput={(ev: InputEvent) => {
              if (this.entry) {
                this.entry.allergens = this.handleInputEvent(ev)
                  .split(',')
                  .map(s => s.trim());
              }
            }}
          ></md-filled-text-field>
          <md-filled-text-field
            label={`Preferované ingrediencie`}
            value={this.entry?.ingredientPreferences.join(',')}
            oninput={(ev: InputEvent) => {
              if (this.entry) {
                this.entry.ingredientPreferences = this.handleInputEvent(ev).split(',');
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
      const api = PatientsApiFactory(undefined, this.apiBase);
      const response = this.entryId === '@new' ? await api.createPatient(this.entry) : await api.updatePatient(this.entryId, this.entry);
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
}
