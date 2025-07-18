import { GridColDef } from '@mui/x-data-grid';

// Расширенный тип колонки с поддержкой скрытия
export type ExtendedGridColDef = GridColDef & {
  hide?: boolean;
};

// Функция для фильтрации видимых колонок
export const getVisibleColumns = (columns: GridColDef[]): GridColDef[] => {
  // В MUI DataGrid v6+ свойство hide было удалено
  // Вместо этого используется columnVisibilityModel
  // Здесь мы просто фильтруем служебные колонки
  return columns.filter(col => 
    col.field !== 'actions' && 
    col.field !== '__check__' &&
    col.field !== '__detail_panel_toggle__'
  );
};

// Функция для проверки, является ли колонка видимой
export const isColumnVisible = (column: GridColDef): boolean => {
  // Проверяем, не является ли колонка служебной
  const hiddenFields = ['actions', '__check__', '__detail_panel_toggle__'];
  return !hiddenFields.includes(column.field);
};

// Тип для модели видимости колонок
export type ColumnVisibilityModel = {
  [key: string]: boolean;
};

// Функция для создания модели видимости колонок
export const createColumnVisibilityModel = (
  columns: GridColDef[],
  hiddenColumns: string[] = []
): ColumnVisibilityModel => {
  const model: ColumnVisibilityModel = {};
  
  columns.forEach(col => {
    model[col.field] = !hiddenColumns.includes(col.field);
  });
  
  return model;
};