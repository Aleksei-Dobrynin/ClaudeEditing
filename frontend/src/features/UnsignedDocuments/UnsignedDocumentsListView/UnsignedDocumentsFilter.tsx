import React, { FC, useState, useCallback } from "react";
import {
  Box,
  Grid,
  IconButton,
  InputAdornment,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Typography,
  Chip,
  Badge,
  Popover,
  Paper,
  Divider,
} from "@mui/material";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import CustomButton from "components/Button";
import CustomTextField from "components/TextField";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";

interface UnsignedDocumentsFilterProps {
  store: any;
  onSearch: () => void;
  onClear: () => void;
}

// Компонент текстового поля с debounce
const DebouncedTextField = React.memo(({
  value,
  onChange,
  onKeyDown,
  label,
  name,
  id,
  helperText,
  startIcon = <SearchIcon color="action" />,
  ...props
}: any) => {
  const [localValue, setLocalValue] = useState(value);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    const newTimeoutId = setTimeout(() => {
      onChange(newValue);
    }, 300);

    setTimeoutId(newTimeoutId);
  }, [onChange, timeoutId]);

  const handleClear = useCallback(() => {
    setLocalValue("");
    onChange("");
  }, [onChange]);

  return (
    <CustomTextField
      value={localValue}
      onChange={handleChange}
      onKeyDown={onKeyDown}
      name={name}
      label={label}
      id={id}
      helperText={helperText}
      InputProps={{
        startAdornment: startIcon && (
          <InputAdornment position="start">
            {startIcon}
          </InputAdornment>
        ),
        endAdornment: localValue && (
          <InputAdornment position="end">
            <IconButton
              id={`${id}_Clear_Btn`}
              size="small"
              onClick={handleClear}
            >
              <ClearIcon fontSize="small" />
            </IconButton>
          </InputAdornment>
        )
      }}
      {...props}
    />
  );
});

const UnsignedDocumentsFilter: FC<UnsignedDocumentsFilterProps> = observer(({
  store,
  onSearch,
  onClear,
}) => {
  const { t } = useTranslation();
  
  // Состояние Popover для фильтров
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const openFilters = Boolean(anchorEl);

  const handleFilterClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setAnchorEl(null);
  };

  const handleApplyFilters = () => {
    store.applyFilters();
    handleFilterClose();
  };

  const handleSearchKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.keyCode === 13) {
      onSearch();
    }
  }, [onSearch]);

  const handleSearchChange = useCallback((value: string) => {
    store.setSearchTerm(value);
  }, [store]);

  // Подсчёт активных фильтров
  const getActiveFiltersCount = () => {
    let count = 0;
    if (store.filter.searchTerm) count++;
    if (store.filter.showOverdue) count++;
    if (!store.filter.showPending) count++;
    if (store.filter.showApproved) count++;
    if (store.filter.showRejected) count++;
    return count;
  };

  const hasActiveFilters = getActiveFiltersCount() > 0;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Grid container spacing={2} alignItems="center">
        {/* Поиск */}
        <Grid item xs={12} md={6}>
          <Paper variant="outlined" sx={{ p: 2, backgroundColor: '#e3f2fd' }}>
            <DebouncedTextField
              value={store.filter.searchTerm}
              onChange={handleSearchChange}
              name="searchTerm"
              label={t("label:DocumentNotificationsView.search")}
              onKeyDown={handleSearchKeyDown}
              id="searchTerm"
              helperText={t("label:UnsignedDocuments.searchHelperText") || "Поиск по номеру заявки, ФИО, ПИН, названию документа"}
              startIcon={<SearchIcon color="primary" />}
            />
          </Paper>
        </Grid>

        {/* Кнопки действий */}
        <Grid item xs={12} md={6}>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Индикатор активных фильтров */}
            {hasActiveFilters && (
              <Badge badgeContent={getActiveFiltersCount()} color="primary">
                <Chip
                  label={t("label:UnsignedDocuments.activeFilters") || "Активные фильтры"}
                  onDelete={onClear}
                  deleteIcon={<ClearIcon />}
                  color="primary"
                  variant="outlined"
                  size="small"
                />
              </Badge>
            )}

            {/* Кнопка фильтров */}
            <IconButton onClick={handleFilterClick} color="primary">
              <FilterListIcon />
            </IconButton>

            {/* Кнопка поиска */}
            <CustomButton
              variant="contained"
              id="searchButton"
              onClick={onSearch}
            >
              {t("search")}
            </CustomButton>

            {/* Кнопка сброса */}
            {hasActiveFilters && (
              <CustomButton
                variant="outlined"
                id="clearButton"
                onClick={onClear}
              >
                {t("clear")}
              </CustomButton>
            )}
          </Box>
        </Grid>
      </Grid>

      {/* Popover с фильтрами */}
      <Popover
        open={openFilters}
        anchorEl={anchorEl}
        onClose={handleFilterClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        sx={{ mt: 1 }}
      >
        <Paper sx={{ p: 2, width: 280 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            {t("label:DocumentNotificationsView.documentStatus")}
          </Typography>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={store.tempFilters.showPending}
                  onChange={() => store.updateTempFilter('showPending', !store.tempFilters.showPending)}
                  size="small"
                />
              }
              label={t("label:DocumentNotificationsView.showPending")}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={store.tempFilters.showApproved}
                  onChange={() => store.updateTempFilter('showApproved', !store.tempFilters.showApproved)}
                  size="small"
                />
              }
              label={t("label:DocumentNotificationsView.showApproved")}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={store.tempFilters.showRejected}
                  onChange={() => store.updateTempFilter('showRejected', !store.tempFilters.showRejected)}
                  size="small"
                />
              }
              label={t("label:DocumentNotificationsView.showRejected")}
            />
          </FormGroup>

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            {t("label:DocumentNotificationsView.deadline")}
          </Typography>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={store.tempFilters.showOverdue}
                  onChange={() => store.updateTempFilter('showOverdue', !store.tempFilters.showOverdue)}
                  size="small"
                />
              }
              label={t("label:DocumentNotificationsView.showOverdueOnly")}
            />
          </FormGroup>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <CustomButton variant="outlined" size="small" onClick={() => store.resetFilters()}>
              {t("label:DocumentNotificationsView.reset")}
            </CustomButton>
            <CustomButton variant="contained" size="small" onClick={handleApplyFilters}>
              {t("label:DocumentNotificationsView.apply")}
            </CustomButton>
          </Box>
        </Paper>
      </Popover>
    </Box>
  );
});

export default UnsignedDocumentsFilter;