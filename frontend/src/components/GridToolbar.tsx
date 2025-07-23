import React from 'react';
import {
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarExport,
  GridToolbarDensitySelector,
  GridToolbarQuickFilter,
} from '@mui/x-data-grid';
import { Box, IconButton, Tooltip, useTheme, alpha, InputBase } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import PrintIcon from '@mui/icons-material/Print';
import SearchIcon from '@mui/icons-material/Search';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import FilterListIcon from '@mui/icons-material/FilterList';
import DensityMediumIcon from '@mui/icons-material/DensityMedium';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { useTranslation } from 'react-i18next';
import { styled } from '@mui/material/styles';

// Berry-style search bar
const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.grey[100],
  '&:hover': {
    backgroundColor: theme.palette.grey[200],
  },
  width: '100%',
  maxWidth: 250,
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.text.secondary,
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  fontSize: '0.875rem',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
  },
}));

// Berry-style icon button
const ToolbarIconButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.text.secondary,
  backgroundColor: theme.palette.grey[100],
  width: 34,
  height: 34,
  '&:hover': {
    backgroundColor: theme.palette.grey[200],
  },
}));

// Hidden container for native toolbar buttons
const HiddenButtonContainer = styled(Box)({
  display: 'none',
});

interface CustomToolbarProps {
  onRefresh?: () => void;
  onPrint?: () => void;
  showQuickFilter?: boolean;
  showColumnsButton?: boolean;
  showFilterButton?: boolean;
  showDensitySelector?: boolean;
  showExportButton?: boolean;
  showPrintButton?: boolean;
  showRefreshButton?: boolean;
}

const GridToolbar: React.FC<CustomToolbarProps> = ({
  onRefresh,
  onPrint,
  showQuickFilter = true,
  showColumnsButton = true,
  showFilterButton = true,
  showDensitySelector = true,
  showExportButton = true,
  showPrintButton = true,
  showRefreshButton = true,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [searchValue, setSearchValue] = React.useState('');
  const hiddenContainerRef = React.useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    if (onPrint) {
      onPrint();
    } else {
      window.print();
    }
  };

  const triggerButtonClick = (ariaLabel: string) => {
    if (hiddenContainerRef.current) {
      const button = hiddenContainerRef.current.querySelector(`[aria-label="${ariaLabel}"]`) as HTMLElement;
      if (button) button.click();
    }
  };

  return (
    <GridToolbarContainer 
      sx={{ 
        px: 2,
        py: 1.5,
        gap: 1,
        flexWrap: 'wrap',
        minHeight: 56,
        justifyContent: 'space-between',
      }}
    >
      {/* Hidden native buttons */}
      <HiddenButtonContainer ref={hiddenContainerRef}>
        {showColumnsButton && <GridToolbarColumnsButton />}
        {showFilterButton && <GridToolbarFilterButton />}
        {showDensitySelector && <GridToolbarDensitySelector />}
        {showExportButton && (
          <GridToolbarExport 
            csvOptions={{
              fileName: `export_${new Date().toISOString().split('T')[0]}`,
              delimiter: ';',
              utf8WithBom: true,
            }}
            printOptions={{
              hideFooter: true,
              hideToolbar: true,
              allColumns: true,
            }}
          />
        )}
        {showQuickFilter && (
          <GridToolbarQuickFilter
            value={searchValue}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => setSearchValue(event.target.value)}
            quickFilterParser={(searchInput: string) =>
              searchInput
                .split(',')
                .map((value) => value.trim())
                .filter((value) => value !== '')
            }
            debounceMs={300}
          />
        )}
      </HiddenButtonContainer>

      {/* Custom styled buttons */}
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
        {showColumnsButton && (
          <Tooltip title={t('common:grid.columns')} arrow>
            <ToolbarIconButton 
              size="small"
              onClick={() => triggerButtonClick('Select columns')}
            >
              <ViewColumnIcon sx={{ fontSize: 18 }} />
            </ToolbarIconButton>
          </Tooltip>
        )}
        
        {showFilterButton && (
          <Tooltip title={t('common:grid.filters')} arrow>
            <ToolbarIconButton 
              size="small"
              onClick={() => triggerButtonClick('Show filters')}
            >
              <FilterListIcon sx={{ fontSize: 18 }} />
            </ToolbarIconButton>
          </Tooltip>
        )}
        
        {showDensitySelector && (
          <Tooltip title={t('common:grid.density')} arrow>
            <ToolbarIconButton 
              size="small"
              onClick={() => triggerButtonClick('Select density')}
            >
              <DensityMediumIcon sx={{ fontSize: 18 }} />
            </ToolbarIconButton>
          </Tooltip>
        )}
        
        {showExportButton && (
          <Tooltip title={t('common:grid.export')} arrow>
            <ToolbarIconButton 
              size="small"
              onClick={() => triggerButtonClick('Export')}
            >
              <FileDownloadIcon sx={{ fontSize: 18 }} />
            </ToolbarIconButton>
          </Tooltip>
        )}
        
        {showRefreshButton && onRefresh && (
          <Tooltip title={t('common:grid.refresh')} arrow>
            <ToolbarIconButton 
              size="small"
              onClick={onRefresh}
            >
              <RefreshIcon sx={{ fontSize: 18 }} />
            </ToolbarIconButton>
          </Tooltip>
        )}
        
        {showPrintButton && (
          <Tooltip title={t('common:grid.print')} arrow>
            <ToolbarIconButton 
              size="small"
              onClick={handlePrint}
            >
              <PrintIcon sx={{ fontSize: 18 }} />
            </ToolbarIconButton>
          </Tooltip>
        )}
      </Box>
      
      {showQuickFilter && (
        <Search>
          <SearchIconWrapper>
            <SearchIcon sx={{ fontSize: 20 }} />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder={t('common:grid.search')}
            value={searchValue}
            onChange={(e) => {
              const newValue = e.target.value;
              setSearchValue(newValue);
              // Trigger the hidden quick filter
              if (hiddenContainerRef.current) {
                const input = hiddenContainerRef.current.querySelector('.MuiDataGrid-toolbarQuickFilter input') as HTMLInputElement;
                if (input) {
                  input.value = newValue;
                  input.dispatchEvent(new Event('input', { bubbles: true }));
                }
              }
            }}
          />
        </Search>
      )}
    </GridToolbarContainer>
  );
};

export default GridToolbar;