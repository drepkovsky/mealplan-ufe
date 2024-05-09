import { Component, Host, Prop, State, h } from '@stencil/core';
declare global {
  interface Window {
    navigation: any;
  }
}

@Component({
  tag: 'rrk-mealplan-app',
  styleUrl: 'rrk-mealplan-app.css',
  shadow: true,
})
export class RrkMealplanApp {
  @State() private relativePath = '';

  @Prop() basePath: string = '';
  @Prop() apiBase: string;

  componentWillLoad() {
    const baseUri = new URL(this.basePath, document.baseURI || '/').pathname;

    const toRelative = (path: string) => {
      if (path.startsWith(baseUri)) {
        this.relativePath = path.slice(baseUri.length);
      } else {
        this.relativePath = '';
      }
    };

    window.navigation?.addEventListener('navigate', (ev: Event) => {
      if ((ev as any).canIntercept) {
        (ev as any).intercept();
      }
      let path = new URL((ev as any).destination.url).pathname;
      toRelative(path);
    });

    toRelative(location.pathname);
  }

  render() {
    console.debug('rrk-mealplan-app.render() - path: %s', this.relativePath);
    let element = 'list';
    let entryId = '@new';
    let patientId = '@new';

    if (this.relativePath.startsWith('meal/')) {
      element = 'editor';
      entryId = this.relativePath.split('/')[1];
    } else if (this.relativePath.match(/patient\/(.*)\/mealplan\/(.*)/)) {
      element = 'mealplan';
      entryId = this.relativePath.split('/')[3];
      patientId = this.relativePath.split('/')[1];
    } else if (this.relativePath.startsWith('patients/')) {
      element = 'patients';
    } else if (this.relativePath.startsWith('patient/')) {
      element = 'patient';
      entryId = this.relativePath.split('/')[1];
    }

    const navigate = (path: string) => {
      const absolute = new URL(path, new URL(this.basePath, document.baseURI)).pathname;
      window.navigation.navigate(absolute);
    };

    const componentMap = (element: string) => {
      return {
        editor: <rrk-mealplan-meal-editor entry-id={entryId} oneditor-closed={() => navigate('/meals')} api-base={this.apiBase}></rrk-mealplan-meal-editor>,
        patients: (
          <rrk-mealplan-patient-list api-base={this.apiBase} onentry-clicked={(ev: CustomEvent<string>) => navigate('/meals/patient/' + ev.detail)}></rrk-mealplan-patient-list>
        ),
        patient: <rrk-mealplan-patient-editor entry-id={entryId} api-base={this.apiBase} oneditor-closed={() => navigate('/meals/patients/')}></rrk-mealplan-patient-editor>,
        list: <rrk-mealplan-meal-list api-base={this.apiBase} onentry-clicked={(ev: CustomEvent<string>) => navigate('/meals/meal/' + ev.detail)}></rrk-mealplan-meal-list>,
        mealplan: (
          <rrk-mealplan-mealplan-editor
            entry-id={entryId}
            patient-id={patientId}
            api-base={this.apiBase}
            oneditor-closed={() => navigate('/meals/patient/' + patientId)}
          ></rrk-mealplan-mealplan-editor>
        ),
      }[element];
    };

    return (
      <Host>
        <div class="content">
          <div class="navbar">
            <h1>Sprava jedalnickov</h1>
            <h2>Zoznam {element === 'patients' ? 'pacientov' : 'jedal'}</h2>
            <nav>
              <ul class="navbar-menu">
                <li>
                  <a
                    href="#"
                    onClick={ev => {
                      ev.preventDefault();
                      navigate('/meals/');
                    }}
                  >
                    Zoznam jedal
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    onClick={ev => {
                      ev.preventDefault();
                      navigate('/meals/patients/');
                    }}
                  >
                    Zoznam pacientov
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
        <div class="content">{componentMap(element)}</div>
      </Host>
    );
  }
}
