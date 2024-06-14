import { IConfigurableFormComponent } from '@/interfaces';
import { ICodeExposedVariable } from '@/components/codeVariablesTable';
import { CodeLanguages } from './types';
import { IObjectMetadata } from '@/interfaces/metadata';
import { CodeTemplateSettings } from '@/components/codeEditor/models';

export interface IExecutableCodeEditor {
  fileName?: string;
  wrapInTemplate?: boolean;
  templateSettings?: CodeTemplateSettings;

  /**
   * @deprecated to be removed
   */
  exposedVariables?: ICodeExposedVariable[];
}

export interface ICodeEditorProps extends Omit<IConfigurableFormComponent, 'type' | 'id'>, IExecutableCodeEditor {
  id?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  mode?: 'inline' | 'dialog';
  language?: CodeLanguages;
  availableConstants?: IObjectMetadata | (() => Promise<IObjectMetadata>);
}

export interface ICodeEditorComponentProps extends IConfigurableFormComponent, IExecutableCodeEditor {
  mode?: 'dialog' | 'inline';

  language?: CodeLanguages;
  availableConstantsExpression?: string;
  availableConstants?: IObjectMetadata;
}