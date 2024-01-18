import { IToolboxComponent } from '@/interfaces';
import { ISizableColumnComponentProps } from './interfaces';
import { BorderHorizontalOutlined } from '@ant-design/icons';
import React, { Fragment } from 'react';
import { useFormData, useGlobalState } from '@/providers';
import Split from 'react-split';
import ComponentsContainer from '@/components/formDesigner/containers/componentsContainer';
import { getLayoutStyle } from '@/utils/publicUtils';
import { nanoid } from '@/utils/uuid';
import { SizableColumnsSettingsForm } from './sizableColumnsSettings';
import { migrateCustomFunctions, migratePropertyName } from '@/designer-components/_common-migrations/migrateSettings';
import ParentProvider from '@/providers/parentProvider/index';

const SizableColumnsComponent: IToolboxComponent<ISizableColumnComponentProps> = {
  type: 'sizableColumns',
  name: 'SizableColumns',
  icon: <BorderHorizontalOutlined />,
  Factory: ({ model }) => {
    const { data } = useFormData();
    const { globalState } = useGlobalState();
    const { columns } = model as ISizableColumnComponentProps;
    const style = { ...getLayoutStyle(model, { data, globalState }), display: 'flex' };

    if (model.hidden) return null;

    return (
      <Split cursor="col-resize" style={style}>
        <ParentProvider model={model}>
          {columns &&
            columns.map((col) => (
              <Fragment>
                <ComponentsContainer
                  containerId={col.id}
                  dynamicComponents={
                    model?.isDynamic ? col?.components : []
                  }
                />
              </Fragment>
          ))}
        </ParentProvider>
      </Split>
    );
  },
  initModel: (model) => {
    const tabsModel: ISizableColumnComponentProps = {
      ...model,
      columns: [
        { id: nanoid(), size: 50, components: [] },
        { id: nanoid(), size: 50, components: [] },
      ],
    };

    return tabsModel;
  },
  settingsFormFactory: (props) => <SizableColumnsSettingsForm {...props} />,
  migrator: (m) =>
    m.add<ISizableColumnComponentProps>(
      0,
      (prev) => migratePropertyName(migrateCustomFunctions(prev)) as ISizableColumnComponentProps
    ),
  customContainerNames: ['columns'],
};

export default SizableColumnsComponent;
