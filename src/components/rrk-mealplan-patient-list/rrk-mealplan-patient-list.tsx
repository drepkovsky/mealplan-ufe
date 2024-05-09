import { Component, Event, EventEmitter, Host, Prop, State, h } from '@stencil/core';
import { Patient, PatientsApiFactory } from '../../api/mealplan';

@Component({
  tag: 'rrk-mealplan-patient-list',
  styleUrl: 'rrk-mealplan-patient-list.css',
  shadow: true,
})
export class RrkMealplanPatientList {
  patients: Patient[];

  @Event({ eventName: 'entry-clicked' }) entryClicked: EventEmitter<string>;
  @Prop() apiBase: string;
  @State() errorMessage: string;

  private async getPatientsAsync() {
    try {
      const response = await PatientsApiFactory(undefined, this.apiBase).listPatients();
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
    this.patients = await this.getPatientsAsync();
  }

  render() {
    return (
      <Host>
        {this.errorMessage ? (
          <div class="error">{this.errorMessage}</div>
        ) : (
          <md-list>
            {this.patients?.map(patient => (
              <md-list-item onClick={() => this.entryClicked.emit(patient.patientId)}>
                <div slot="headline">{patient.fullName}</div>
                <div slot="supporting-text">
                  {'Alergény: '} {patient.allergens.join(', ')}
                </div>
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
