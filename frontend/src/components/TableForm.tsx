import React, { useState } from "react";
import { DataGrid, GridColDef, GridRowsProp, GridEventListener } from "@mui/x-data-grid";

export type TableColumn = {
  key: string; // Уникальный идентификатор столбца
  label: string; // Отображаемое имя столбца
  editable?: boolean; // Можно ли редактировать столбец
  type:  "string" | "number"; // Тип данных
}



type TableProps = {
  columns: TableColumn[]; // Структура столбцов
  initialData: Record<string, any>[]; // Начальные данные для таблицы
  onSave: (data: Record<string, any>[]) => void; // Callback для сохранения данных
}

const DynamicTable: React.FC<TableProps> = ({ columns, initialData, onSave }) => {
  const [rows, setRows] = useState<GridRowsProp>(
    initialData.map((row, index) => ({ id: index + 1, ...row }))
  );

  // Преобразование конфигурации столбцов в формат DataGrid
  const gridColumns: GridColDef[] = columns.map((column) => ({
    field: column.key,
    headerName: column.label,
    editable: column.editable || false,
    type: column.type || "string",
    flex: 1,
  }));

  // Обработчик изменения данных в строке
  const handleProcessRowUpdate = (newRow: any, oldRow: any) => {
    const updatedRows = rows.map((row) =>
      row.id === newRow.id ? { ...row, ...newRow } : row
    );
    setRows(updatedRows);
    return newRow;
  };

  const handleSave = () => {
    onSave(rows.map(({ id, ...row }) => row)); // Убираем `id` перед сохранением
  };

  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={gridColumns}
        processRowUpdate={handleProcessRowUpdate}
        autoHeight
        // pageSize={5}
        // rowsPerPageOptions={[5, 10, 20]}
        // experimentalFeatures={{ newEditingApi: true }}
      />
      <button onClick={handleSave} style={{ marginTop: "10px" }}>
        Сохранить данные
      </button>
    </div>
  );
};

export default DynamicTable;