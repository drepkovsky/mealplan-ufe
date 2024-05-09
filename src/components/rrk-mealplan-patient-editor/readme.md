# rrk-mealplan-meal-editor



<!-- Auto Generated Below -->


## Properties

| Property  | Attribute  | Description | Type     | Default     |
| --------- | ---------- | ----------- | -------- | ----------- |
| `apiBase` | `api-base` |             | `string` | `undefined` |
| `entryId` | `entry-id` |             | `string` | `undefined` |


## Events

| Event           | Description | Type                  |
| --------------- | ----------- | --------------------- |
| `editor-closed` |             | `CustomEvent<string>` |


## Dependencies

### Used by

 - [rrk-mealplan-app](../rrk-mealplan-app)

### Depends on

- [rrk-mealplan-mealplan-list](../rrk-mealplan-mealplan-list)

### Graph
```mermaid
graph TD;
  rrk-mealplan-patient-editor --> rrk-mealplan-mealplan-list
  rrk-mealplan-app --> rrk-mealplan-patient-editor
  style rrk-mealplan-patient-editor fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
