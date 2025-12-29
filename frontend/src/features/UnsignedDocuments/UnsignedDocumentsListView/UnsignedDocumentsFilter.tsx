import React, { FC, useState, useCallback } from "react";
import {
  Box,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
} from "@mui/material";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import CustomButton from "components/Button";
import CustomTextField from "components/TextField";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";

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

  const handleSearchKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.keyCode === 13) {
      onSearch();
    }
  }, [onSearch]);

  const handleSearchChange = useCallback((value: string) => {
    store.setSearchTerm(value);
  }, [store]);

  const hasActiveFilters = store.filter.searchTerm !== "";

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Grid container spacing={2} alignItems="center">
        {/* Поиск */}
        <Grid item xs={12} md={8}>
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
        <Grid item xs={12} md={4}>
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
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
    </Box>
  );
});

export default UnsignedDocumentsFilter;