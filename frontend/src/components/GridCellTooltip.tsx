import React, { useRef, useState, useEffect } from 'react';
import { Tooltip, Box } from '@mui/material';

interface GridCellTooltipProps {
  value: string | number | null | undefined;
  width?: number;
}

export const GridCellTooltip: React.FC<GridCellTooltipProps> = ({ value, width }) => {
  const cellRef = useRef<HTMLDivElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const displayValue = value?.toString() || '';

  useEffect(() => {
    const checkOverflow = () => {
      if (cellRef.current) {
        const { scrollWidth, clientWidth } = cellRef.current;
        setIsOverflowing(scrollWidth > clientWidth);
      }
    };

    checkOverflow();
    // Проверяем при изменении размера окна
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, [value]);

  const content = (
    <Box
      ref={cellRef}
      sx={{
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        width: width || '100%',
        display: 'block',
      }}
    >
      {displayValue}
    </Box>
  );

  if (!isOverflowing || !displayValue) {
    return content;
  }

  return (
    <Tooltip 
      title={displayValue} 
      placement="top"
      arrow
      enterDelay={500}
      sx={{
        maxWidth: 'none',
        '& .MuiTooltip-tooltip': {
          fontSize: '0.875rem',
          maxWidth: '400px',
          wordWrap: 'break-word',
          whiteSpace: 'pre-wrap',
        },
      }}
    >
      {content}
    </Tooltip>
  );
};

// Функция для создания колонки с тултипом
export const createTooltipColumn = (column: any) => {
  return {
    ...column,
    renderCell: (params: any) => {
      // Если уже есть кастомный renderCell, оборачиваем его
      if (column.renderCell) {
        const CustomCell = column.renderCell(params);
        return (
          <Tooltip 
            title={params.value?.toString() || ''} 
            placement="top"
            arrow
            enterDelay={500}
          >
            <Box
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                width: '100%',
              }}
            >
              {CustomCell}
            </Box>
          </Tooltip>
        );
      }
      // Иначе используем стандартный компонент
      return <GridCellTooltip value={params.value} />;
    },
  };
};