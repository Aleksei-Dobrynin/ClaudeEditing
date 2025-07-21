import React, { ReactNode } from 'react';
import { Box, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';

interface FormFieldGroupProps {
  children: ReactNode;
  columns?: number | { xs?: number; sm?: number; md?: number; lg?: number; xl?: number };
  spacing?: number;
  alignItems?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
}

const FieldGroupContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  marginBottom: theme.spacing(2),
}));

const FormFieldGroup: React.FC<FormFieldGroupProps> = ({
  children,
  columns = 2,
  spacing = 2,
  alignItems = 'flex-start',
}) => {
  // Преобразование количества колонок в размер для Grid
  const getGridSize = (cols: number) => {
    return 12 / cols;
  };

  // Определение размеров для разных breakpoints
  const getResponsiveGridSizes = () => {
    if (typeof columns === 'number') {
      return {
        xs: 12,
        sm: columns === 1 ? 12 : 12,
        md: getGridSize(columns),
        lg: getGridSize(columns),
        xl: getGridSize(columns),
      };
    }
    return {
      xs: columns.xs ? getGridSize(columns.xs) : 12,
      sm: columns.sm ? getGridSize(columns.sm) : 12,
      md: columns.md ? getGridSize(columns.md) : 6,
      lg: columns.lg ? getGridSize(columns.lg) : 6,
      xl: columns.xl ? getGridSize(columns.xl) : 6,
    };
  };

  const gridSizes = getResponsiveGridSizes();

  // Преобразуем children в массив для удобной работы
  const childrenArray = React.Children.toArray(children);

  return (
    <FieldGroupContainer>
      <Grid container spacing={spacing} alignItems={alignItems}>
        {childrenArray.map((child, index) => (
          <Grid 
            item 
            key={index}
            xs={gridSizes.xs}
            sm={gridSizes.sm}
            md={gridSizes.md}
            lg={gridSizes.lg}
            xl={gridSizes.xl}
          >
            {child}
          </Grid>
        ))}
      </Grid>
    </FieldGroupContainer>
  );
};

export default FormFieldGroup;