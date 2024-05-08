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

  @Prop() counter: number = 0;

  interval: NodeJS.Timeout;

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

    this.interval = setInterval(() => {
      this.counter++;
    }, 1000);
  }

  disconnectedCallback() {
    clearInterval(this.interval);
  }

  render() {
    console.debug('rrk-mealplan-app.render() - path: %s', this.relativePath);
    let element = 'list';
    let entryId = '@new';

    if (this.relativePath.startsWith('entry/')) {
      element = 'editor';
      entryId = this.relativePath.split('/')[1];
    }

    const navigate = (path: string) => {
      const absolute = new URL(path, new URL(this.basePath, document.baseURI)).pathname;
      window.navigation.navigate(absolute);
    };

    return (
      <Host>
        <div class="content">
          <div class="navbar">
            <h1>Sprava jedalnickov pacientov</h1>

            <nav>
              <ul class="navbar-menu">
                <li>
                  <a href="#">Zoznam jedal</a>
                </li>
                <li>
                  <a href="#">Zoznam pacientov</a>
                </li>
              </ul>
            </nav>
          </div>

          <div class="counter">
            Pocitatlo s casovacom ako ukazka JS.
            <br />
            {this.counter}
          </div>
        </div>
        {element === 'editor' ? (
          <rrk-mealplan-meal-editor entry-id={entryId} oneditor-closed={() => navigate('./list')} api-base={this.apiBase}></rrk-mealplan-meal-editor>
        ) : (
          <rrk-mealplan-meal-list api-base={this.apiBase} onentry-clicked={(ev: CustomEvent<string>) => navigate('./entry/' + ev.detail)}></rrk-mealplan-meal-list>
        )}
      </Host>
    );
  }
}
