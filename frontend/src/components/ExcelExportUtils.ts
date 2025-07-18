import * as XLSX from 'xlsx';
import { GridColDef } from '@mui/x-data-grid';
import { getVisibleColumns } from './GridTypes';

interface ExportToExcelParams {
  data: any[];
  columns: GridColDef[];
  fileName?: string;
  sheetName?: string;
  includeHeaders?: boolean;
  autoWidth?: boolean;
}

export const exportToExcel = ({
  data,
  columns,
  fileName = `export_${new Date().toISOString().split('T')[0]}`,
  sheetName = 'Sheet1',
  includeHeaders = true,
  autoWidth = true,
}: ExportToExcelParams) => {
  try {
    // Фильтруем только видимые колонки и исключаем actions
    const visibleColumns = getVisibleColumns(columns);

    // Подготавливаем данные для экспорта
    const exportData = data.map(row => {
      const exportRow: any = {};
      visibleColumns.forEach(col => {
        const field = col.field;
        let value = row[field];

        // Обработка специальных случаев
        if (value === null || value === undefined) {
          value = '';
        } else if (typeof value === 'boolean') {
          value = value ? 'Да' : 'Нет';
        } else if (value instanceof Date) {
          value = value.toLocaleDateString('ru-RU');
        } else if (typeof value === 'object') {
          // Для объектов пытаемся получить строковое представление
          value = JSON.stringify(value);
        }

        // Используем headerName или field как ключ
        const columnName = col.headerName || field;
        exportRow[columnName] = value;
      });
      return exportRow;
    });

    // Создаем новую книгу
    const wb = XLSX.utils.book_new();

    // Создаем лист с данными
    const ws = XLSX.utils.json_to_sheet(exportData, { 
      header: includeHeaders ? undefined : null 
    });

    // Применяем стили к заголовкам
    if (includeHeaders) {
      const range = XLSX.utils.decode_range(ws['!ref'] || 'A1');
      
      // Стили для заголовков
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const address = XLSX.utils.encode_col(C) + '1';
        if (!ws[address]) continue;
        
        ws[address].s = {
          font: { bold: true, sz: 12 },
          fill: { fgColor: { rgb: "E3F2FD" } },
          alignment: { horizontal: "center", vertical: "center" },
          border: {
            top: { style: "thin" },
            bottom: { style: "thin" },
            left: { style: "thin" },
            right: { style: "thin" }
          }
        };
      }

      // Закрепляем первую строку
      ws['!freeze'] = { xSplit: 0, ySplit: 1, topLeftCell: 'A2', activePane: 'bottomRight' };
    }

    // Автоматическая ширина колонок
    if (autoWidth) {
      const colWidths: any[] = [];
      
      // Получаем максимальную ширину для каждой колонки
      visibleColumns.forEach((col, index) => {
        const columnName = col.headerName || col.field;
        let maxWidth = columnName.length;
        
        data.forEach(row => {
          const value = row[col.field];
          const length = value ? value.toString().length : 0;
          if (length > maxWidth) maxWidth = length;
        });
        
        // Ограничиваем максимальную ширину
        colWidths[index] = { wch: Math.min(maxWidth + 2, 50) };
      });
      
      ws['!cols'] = colWidths;
    }

    // Добавляем лист в книгу
    XLSX.utils.book_append_sheet(wb, ws, sheetName);

    // Сохраняем файл
    XLSX.writeFile(wb, `${fileName}.xlsx`);

    return true;
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    return false;
  }
};

// Функция для экспорта с фильтрами и сортировкой
export const exportFilteredDataToExcel = ({
  data,
  columns,
  filterModel,
  sortModel,
  fileName,
}: {
  data: any[];
  columns: GridColDef[];
  filterModel?: any;
  sortModel?: any;
  fileName?: string;
}) => {
  // Применяем фильтры если есть
  let filteredData = [...data];
  
  if (filterModel && filterModel.items && filterModel.items.length > 0) {
    filteredData = data.filter(row => {
      return filterModel.items.every((filter: any) => {
        const value = row[filter.field];
        const filterValue = filter.value;
        
        switch (filter.operator) {
          case 'contains':
            return value?.toString().toLowerCase().includes(filterValue.toLowerCase());
          case 'equals':
            return value === filterValue;
          case 'startsWith':
            return value?.toString().toLowerCase().startsWith(filterValue.toLowerCase());
          case 'endsWith':
            return value?.toString().toLowerCase().endsWith(filterValue.toLowerCase());
          case 'isEmpty':
            return !value;
          case 'isNotEmpty':
            return !!value;
          default:
            return true;
        }
      });
    });
  }

  // Применяем сортировку если есть
  if (sortModel && sortModel.length > 0) {
    const { field, sort } = sortModel[0];
    filteredData.sort((a, b) => {
      const aValue = a[field];
      const bValue = b[field];
      
      if (aValue === bValue) return 0;
      
      const comparison = aValue > bValue ? 1 : -1;
      return sort === 'asc' ? comparison : -comparison;
    });
  }

  return exportToExcel({
    data: filteredData,
    columns,
    fileName: fileName || `filtered_export_${new Date().toISOString().split('T')[0]}`,
  });
};