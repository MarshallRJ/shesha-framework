import { createAction } from 'redux-actions';
import { IUpdateChildItemsPayload, IUpdateItemSettingsPayload } from './contexts';

export enum RefListItemGroupActionEnums {
  UpdateItem = 'UPDATE_ITEM',
  SelectItem = 'SELECT_ITEM',
  UpdateChildItems = 'UPDATE_CHILD_ITEMS',
  SetItems = 'SET_ITEMS',
}

export const setItems = createAction<any[], any[]>(RefListItemGroupActionEnums.SetItems, (p) => p);

export const selectItemAction = createAction<string, string>(RefListItemGroupActionEnums.SelectItem, (p) => p);

export const updateItemAction = createAction<IUpdateItemSettingsPayload, IUpdateItemSettingsPayload>(
  RefListItemGroupActionEnums.UpdateItem,
  (p) => p
);

export const updateChildItemsAction = createAction<IUpdateChildItemsPayload, IUpdateChildItemsPayload>(
  RefListItemGroupActionEnums.UpdateChildItems,
  (p) => p
);
