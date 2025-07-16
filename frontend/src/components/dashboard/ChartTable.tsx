import React from "react";
import { observer } from "mobx-react";
import { Card, CardContent, Paper } from "@mui/material";

/**
 * Универсальный компонент для отображения таблицы + графика
 * @param {string} dataUrl - URL для загрузки данных (может быть null, если данные передаются в initialData)
 * @param {Array} columns - описание колонок ( [\{ key: '...', label: '...', renderCell: (row) => ... }, ... ] )
 * @param {Array} chartSeries - какие поля использовать на графике ( [\{ name: '...', key: '...' }, ... ] )
 * @param {string} categoryKey - ключ в объекте данных, по которому строим категории (ось для графика)
 * @param {boolean} horizontal - показывать ли столбики горизонтально
 * @param {Array} initialData - если данные уже есть, можно передать их напрямую
 */

type Props = {
  columns: (
    {
      key: string;
      label: string;
      color?: string,
      renderCell: (row: any) => JSX.Element;
    } | {
      key: string;
      label: string;
      color?: string,
      renderCell?: undefined;
    })[];
  horizontal?: boolean;
  initialData?: any[];
  border?: boolean;
}


const ChartTable: React.FC<Props> = observer(({ columns, horizontal = false, initialData = [], border = false }) => {
  const styles = {
    table:
    {
      borderCollapse: 'collapse' as 'collapse',
      width: '100%'
    }
    ,
    th: {
      border: border ? '1px solid #eee' : 'none',
      padding: '10px',
      textAlign: 'left' as 'left',
    },
    tr: {
      border: 'none',
    },
    td: {
      padding: '10px',
      border: border ? '1px solid #eee' : 'none'
    }
  };

  return (
    <Paper elevation={7} variant="outlined" sx={{ mt: 2 }}>
      <Card component={Paper}>
        <CardContent>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Таблица */}
            <table style={styles.table}>
              <thead>
                <tr>
                  {columns.map((col, idx) => (
                    <th key=
                      {idx}
                      style={styles.th}>
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {initialData.map((row, rowIdx) => (
                  <tr key=
                    {rowIdx}
                    style={styles.tr}>
                    {columns.map((col, colIdx) => {
                      const cellValue = col.renderCell
                        ? col.renderCell(row)
                        : row[col.key];
                      return (
                        <td key=
                          {colIdx}
                          style={styles.td}>
                          {cellValue}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </Paper>
  )
})



export default ChartTable;
