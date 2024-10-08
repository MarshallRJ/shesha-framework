import { DesignerToolbarSettings } from '@/interfaces/toolbarSettings';

export const getSettings = () =>
  new DesignerToolbarSettings()
    .addCollapsiblePanel({
      id: '11114bf6-f76d-4139-a850-c99bf06c8b69',
      propertyName: 'pnlDisplay',
      parentId: 'root',
      label: 'Display',
      labelAlign: 'left',
      expandIconPosition: 'start',
      ghost: true,
      collapsible: 'header',
      hidden: {_code: 'return getSettingValue(data?.disabled) ?? false;', _mode: 'code', _value: false} as any,
      content: {
        id:'pnl54bf6-f76d-4139-a850-c99bf06c8b69',
        components: [...new DesignerToolbarSettings()
          .addTextField({
            id: '5c813b1a-04c5-4658-ac0f-cbcbae6b3bd4',
            propertyName: 'propertyName',
            parentId: 'pnl54bf6-f76d-4139-a850-c99bf06c8b69',
            label: 'Property name',
            validate: { required: true },
          })    
          .addTextField({
            id: 'd498779d-012a-4c6a-82a9-77231245ae28',
            propertyName: 'label',
            parentId: 'pnl54bf6-f76d-4139-a850-c99bf06c8b69',
            label: 'Label',
          })
          .addEditMode({
            id: '24a8be15-98eb-40f7-99ea-ebb602693e9c',
            propertyName: 'editMode',
            parentId: 'pnl54bf6-f76d-4139-a850-c99bf06c8b69',
            label: 'Edit mode',
            jsSetting: true,
          })
          .addCodeEditor({
            id: '9bwTOXitpfb7rb0DhhQIecgxfkvAZh',
            propertyName: 'availableConstantsExpression',
            componentName: 'availableConstantsExpression',
            label: 'Available constants',
            labelAlign: 'right',
            parentId: 'pnl54bf6-f76d-4139-a850-c99bf06c8b69',
            mode: 'dialog',
            version: 3,
            settingsValidationErrors: [],
            templateSettings: {
              functionName: 'getAvailableConstants',
              useAsyncDeclaration: true
            },
            availableConstantsExpression: '    const { modelType } = data ?? {};\r\n    const mb = metadataBuilder;\r\n    const isEntity = modelType ? await mb.isEntityAsync(modelType) : false;' +
              '\r\n    if (modelType && isEntity){\r\n        await mb.addEntityAsync(\"data\", \"Form data\", modelType);\r\n    } else {\r\n        mb.addObject(\"data\", \"Form data\");\r\n    };' +
              '\r\n    mb.addMetadataBuilder();\r\n    return mb.build();',
            validate: {},
            wrapInTemplate: true
          })
          .toJson()
        ]
      }
    })
    .toJson();
