# rrk-mealplan-app



<!-- Auto Generated Below -->


## Properties

| Property   | Attribute   | Description | Type     | Default     |
| ---------- | ----------- | ----------- | -------- | ----------- |
| `apiBase`  | `api-base`  |             | `string` | `undefined` |
| `basePath` | `base-path` |             | `string` | `''`        |


## Dependencies

### Depends on

- [rrk-mealplan-meal-editor](../rrk-mealplan-meal-editor)
- [rrk-mealplan-patient-list](../rrk-mealplan-patient-list)
- [rrk-mealplan-patient-editor](../rrk-mealplan-patient-editor)
- [rrk-mealplan-meal-list](../rrk-mealplan-meal-list)
- [rrk-mealplan-mealplan-editor](../rrk-mealplan-mealplan-editor)

### Graph
```mermaid
graph TD;
  rrk-mealplan-app --> rrk-mealplan-meal-editor
  rrk-mealplan-app --> rrk-mealplan-patient-list
  rrk-mealplan-app --> rrk-mealplan-patient-editor
  rrk-mealplan-app --> rrk-mealplan-meal-list
  rrk-mealplan-app --> rrk-mealplan-mealplan-editor
  rrk-mealplan-patient-editor --> rrk-mealplan-mealplan-list
  style rrk-mealplan-app fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
