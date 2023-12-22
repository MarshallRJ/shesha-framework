import React, { CSSProperties, ReactNode } from 'react';
import { IToolboxComponent } from '@/interfaces';
import { FormMarkup, IConfigurableFormComponent } from '@/providers/form/models';
import { LinkOutlined } from '@ant-design/icons';
import { evaluateString, getStyle, validateConfigurableComponentSettings } from '@/providers/form/utils';
import { useForm, useFormData } from '@/providers';
import settingsFormJson from './settingsForm.json';
import ComponentsContainer from '../../containers/componentsContainer';
import { AlignItems, JustifyContent, JustifyItems } from '@/designer-components/container/interfaces';
import { ContainerDirection } from '../../common/interfaces';
import { migrateCustomFunctions, migratePropertyName } from '@/designer-components/_common-migrations/migrateSettings';
import ConfigurableFormItem from '../formItem';

export interface IAlertProps extends IConfigurableFormComponent {
  text: string;
  description?: string;
  showIcon?: boolean;
  icon?: string;
}
export interface ILinkProps extends IConfigurableFormComponent {
  href?: string;
  content?: string;
  propertyName: string;
  target?: string;
  download?: string;
  direction?: ContainerDirection;
  hasChildren?: boolean;
  justifyContent?: JustifyContent;
  alignItems?: AlignItems;
  justifyItems?: JustifyItems;
  className?: string;
  icon?: ReactNode;
  components?: IConfigurableFormComponent[];
}

const settingsForm = settingsFormJson as FormMarkup;
const LinkComponent: IToolboxComponent<ILinkProps> = {
  type: 'link',
  name: 'link',
  icon: <LinkOutlined />,
  Factory: ({ model }) => {
    const { formMode } = useForm();

    const { data } = useFormData();

    const {
      href: initialHref = '',
      content = '',
      style,
      target,
      direction,
      justifyContent,
      id,
      alignItems,
      justifyItems,
      hasChildren,
    } = model;

    const linkStyle: CSSProperties = {};

    if (direction === 'horizontal' && justifyContent) {
      linkStyle['display'] = 'flex';
      linkStyle['justifyContent'] = justifyContent;
      linkStyle['alignItems'] = alignItems;
      linkStyle['justifyItems'] = justifyItems;
    }

    const isDesignerMode = formMode === 'designer';

    if (model.hidden)
      return null;

    return (
      <ConfigurableFormItem model={model}  >
        {() => {

          const href = evaluateString(initialHref || model?.href, data);

          if (!hasChildren) {
            return (
              <a href={href} target={target} className="sha-link" style={{ ...linkStyle, ...getStyle(style, data) }}>
                {content}
              </a>
            );
          }

          const containerHolder = () => (
            <ComponentsContainer
              containerId={id}
              direction={direction}
              justifyContent={model.direction === 'horizontal' ? model?.justifyContent : null}
              alignItems={model.direction === 'horizontal' ? model?.alignItems : null}
              justifyItems={model.direction === 'horizontal' ? model?.justifyItems : null}
              className={model.className}
              itemsLimit={1}
              dynamicComponents={model?.isDynamic ? model?.components?.map(c => ({ ...c, readOnly: model?.readOnly })) : []}
            />
          );
          if (isDesignerMode) {
            return containerHolder();
          }
          return (
            <a href={href} target={target}className="sha-link"  style={getStyle(style, data)}>
              {containerHolder()}
            </a>
          );
        }}
      </ConfigurableFormItem>
    );
  },
  settingsFormMarkup: settingsForm,
  validateSettings: model => validateConfigurableComponentSettings(settingsForm, model),
  initModel: (model: ILinkProps) => {
    const customProps: ILinkProps = {
      ...model,
      direction: 'vertical',
      target: '_self',
      justifyContent: 'left',
    };

    return customProps;
  },
  migrator: (m) => m
    .add<ILinkProps>(0, (prev) => ({...prev} as ILinkProps))
    .add<ILinkProps>(1, (prev) => {
      return {
        ...prev,
        label: prev.label ?? prev['name'],
        href: prev.content,
        content: prev['name'],
      };
    })
    .add<ILinkProps>(2, (prev) => migratePropertyName(migrateCustomFunctions(prev)))
  ,

};

export default LinkComponent;
