import React, { FC, useState, useCallback, useMemo } from "react";
import {
  Box,
  Grid,
  IconButton,
  InputAdornment,
  RadioGroup,
  FormControlLabel,
  Radio,
  Autocomplete,
  TextField,
  CircularProgress,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Chip,
  Badge,
  Divider,
  Tooltip,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  ListItemButton,
  Stack
} from "@mui/material";
import { runInAction } from "mobx";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import CustomButton from "components/Button";
import CustomTextField from "components/TextField";
import LookUp from "components/LookUp";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import DateField from "components/DateField";
import MtmLookup from "components/mtmLookup";
import CustomCheckbox from "../../../components/Checkbox";
import AutocompleteCustom from "components/Autocomplete";
import MainStore from "MainStore";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FilterListIcon from "@mui/icons-material/FilterList";
import PrintIcon from "@mui/icons-material/Print";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import DeleteIcon from "@mui/icons-material/Delete";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { toJS } from 'mobx';
interface ApplicationListFilterProps {
  store: any;
  onSearch: () => void;
  onClear: () => void;
  onPrint: () => void;
  onExportExcel: () => void;
  onSaveFilter?: () => void;
  onCloseFilter?: () => void;
  forFilter?: boolean;
  isJournal?: boolean;
  selectedIds?: number[];
  onTemplateMenuOpen?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

// Создаем отдельный компонент для текстовых полей с локальным состоянием
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

    // Отменяем предыдущий таймаут
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // Устанавливаем новый таймаут для debounce
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

const ApplicationListFilter: FC<ApplicationListFilterProps> = observer(({
  store,
  onSearch,
  onClear,
  onPrint,
  onExportExcel,
  onSaveFilter,
  onCloseFilter,
  forFilter,
  isJournal,
  selectedIds = [],
  onTemplateMenuOpen
}) => {
  const { t } = useTranslation();
  const translate = t;
  const [filterMode, setFilterMode] = useState<"quick" | "advanced">("quick");
  const [expandedSections, setExpandedSections] = useState<string[]>(["search"]);
  const [localStatusIds, setLocalStatusIds] = React.useState(() => toJS(store.filter.status_ids) || []);
  const [localServiceIds, setLocalServiceIds] = React.useState(() => toJS(store.filter.service_ids) || []);
  React.useEffect(() => {
    setLocalStatusIds(toJS(store.filter.status_ids) || []);
  }, [store.filter.status_ids]);

  React.useEffect(() => {
    setLocalServiceIds(toJS(store.filter.service_ids) || []);
  }, [store.filter.service_ids]);

  // Мемоизируем обработчики
  const handleSearchKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.keyCode === 13) {
      onSearch();
    }
  }, [onSearch]);

  const handleCommonFilterChange = useCallback((value: string) => {
    store.changeCommonFilter(value);
  }, [store]);

  const handleNumberChange = useCallback((value: string) => {
    store.changeNumber(value);
  }, [store]);

  const handleCustomerNameChange = useCallback((value: string) => {
    store.changeCustomerName(value);
  }, [store]);

  const handlePinChange = useCallback((value: string) => {
    store.changePin(value);
  }, [store]);

  const handleAddressChange = useCallback((value: string) => {
    store.changeAddress(value);
  }, [store]);

  const handleIncomingNumbersChange = useCallback((value: string) => {
    store.changeIncomingNumbers(value);
  }, [store]);

  const handleOutgoingNumbersChange = useCallback((value: string) => {
    store.changeOutgoingNumbers(value);
  }, [store]);

  const hasActiveFilters = useMemo(() => {
    return (
      store.filter.common_filter !== "" ||
      store.filter.pin !== "" ||
      store.filter.customerName !== "" ||
      store.filter.number !== "" ||
      store.filter.address !== "" ||
      store.filter.service_ids.length !== 0 ||
      store.filter.date_start !== null ||
      store.filter.date_end !== null ||
      store.filter.status_ids.length > 0 ||
      store.filter.district_id != 0 ||
      store.filter.journals_id != 0 ||
      store.filter.tag_id != 0 ||
      store.filter.isExpired != false ||
      store.filter.isMyOrgApplication != false ||
      store.filter.withoutAssignedEmployee != false ||
      store.filter.employee_id != 0 ||
      store.filter.incoming_numbers != "" ||
      store.filter.outgoing_numbers != "" ||
      store.filter.total_sum_from !== null ||
      store.filter.total_sum_to !== null ||
      store.filter.total_payed_from !== null ||
      store.filter.total_payed_to !== null ||
      store.filter.tunduk_district_id !== null ||
      store.filter.tunduk_address_unit_id !== null ||
      store.filter.tunduk_street_id !== null
    );
  }, [store.filter]);

  const getActiveFiltersCount = useMemo(() => {
    let count = 0;
    if (store.filter.common_filter !== "") count++;
    if (store.filter.pin !== "") count++;
    if (store.filter.customerName !== "") count++;
    if (store.filter.number !== "") count++;
    if (store.filter.address !== "") count++;
    if (store.filter.service_ids.length > 0) count++;
    if (store.filter.date_start !== null) count++;
    if (store.filter.date_end !== null) count++;
    if (store.filter.status_ids.length > 0) count++;
    if (store.filter.district_id != 0) count++;
    if (store.filter.isExpired) count++;
    if (store.filter.employee_id != 0) count++;
    if (store.filter.total_sum_from !== null || store.filter.total_sum_to !== null) count++;
    if (store.filter.total_payed_from !== null || store.filter.total_payed_to !== null) count++;
    if (store.filter.tunduk_district_id !== null) count++;
    return count;
  }, [store.filter]);

  const handleSectionChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedSections(prev =>
      isExpanded
        ? [...prev, panel]
        : prev.filter(p => p !== panel)
    );
  };

  const handleStatusChange = useCallback((name: string, value: number[]) => {
    setLocalStatusIds(value);
    store.changeStatus(value);
  }, [store]);

  const handleServiceChange = useCallback((name: string, value: number[]) => {
    setLocalServiceIds(value);
    store.changeService(value);
  }, [store]);

  // Quick filter - основные поля
  const QuickFilters = () => (
    <Grid container spacing={2}>
      {/* Журнал для журнального режима */}
      {isJournal && (
        <Grid item xs={12}>
          <LookUp
            id="id_f_DocumentJournals_journals_id"
            label={translate("label:JournalApplicationListView.journal_id")}
            value={store.filter.journals_id}
            data={store.Journals}
            onChange={(e) => store.changeJournalId(e.target.value)}
            name="journals_id"
            fieldNameDisplay={(i) => i.name}
          />
        </Grid>
      )}

      {/* Универсальный поиск - только если НЕ детальный режим */}
      {!store.is_allFilter && (
        <Grid item xs={12}>
          <Paper variant="outlined" sx={{ p: 2, backgroundColor: '#e3f2fd' }}>
            <DebouncedTextField
              value={store.filter.common_filter}
              onChange={handleCommonFilterChange}
              name="searchByCommonFilter"
              label={translate("label:ApplicationListView.search")}
              onKeyDown={handleSearchKeyDown}
              id="common_filter"
              helperText="Поиск по номеру, ПИН, ФИО, адресу..."
              startIcon={<SearchIcon color="primary" />}
            />
          </Paper>
        </Grid>
      )}

      {/* Детальный поиск - только если включен детальный режим */}
      {store.is_allFilter && (
        <>
          <Grid item xs={12}>
            <Paper variant="outlined" sx={{ p: 2, backgroundColor: '#f5f7fa' }}>
              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 'bold' }}>
                Приоритетный поиск
              </Typography>
              <Grid container spacing={2}>
                <Grid item md={3} xs={12}>
                  <DebouncedTextField
                    value={store.filter.number}
                    onChange={handleNumberChange}
                    name="number"
                    label={translate("label:ApplicationListView.searchByNumber")}
                    onKeyDown={handleSearchKeyDown}
                    id="number"
                  />
                </Grid>

                <Grid item md={3} xs={12}>
                  <DebouncedTextField
                    value={store.filter.customerName}
                    onChange={handleCustomerNameChange}
                    name="customerName"
                    label={translate("label:ApplicationListView.searchCustomerName")}
                    onKeyDown={handleSearchKeyDown}
                    id="customerName"
                  />
                </Grid>

                <Grid item md={3} xs={12}>
                  <DebouncedTextField
                    value={store.filter.pin}
                    onChange={handlePinChange}
                    name="searchByPin"
                    label={translate("label:ApplicationListView.searchByPin")}
                    onKeyDown={handleSearchKeyDown}
                    id="pin"
                  />
                </Grid>

                <Grid item md={3} xs={12}>
                  <AutocompleteCustom
                    value={store.filter.employee_id}
                    onChange={(event) => {
                      store.changeEmployee(event.target.value);
                    }}
                    data={store.Employees}
                    name="employee_id"
                    label={translate("label:ApplicationListView.filterByEmployee")}
                    fieldNameDisplay={(e) => `${e.full_name}`}
                    id="id_f_employee_id"
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Даты - важные поля в детальном режиме */}
          <Grid item md={6} xs={12}>
            <DateField
              value={store.filter.date_start != null ? dayjs(new Date(store.filter.date_start)) : null}
              onChange={(event) => store.changeDateStart(event.target.value)}
              name="dateStart"
              id="filterByDateStart"
              label={translate("label:ApplicationListView.filterByDateStart")}
              helperText={store.errors.dateStart}
              error={!!store.errors.dateStart}
            />
          </Grid>

          <Grid item md={6} xs={12}>
            <DateField
              value={store.filter.date_end != null ? dayjs(new Date(store.filter.date_end)) : null}
              onChange={(event) => store.changeDateEnd(event.target.value)}
              name="dateEnd"
              id="filterByDateEnd"
              label={translate("label:ApplicationListView.filterByDateEnd")}
              helperText={store.errors.dateEnd}
              error={!!store.errors.dateEnd}
            />
          </Grid>
        </>
      )}

      {/* Переключатель режима поиска */}
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <CustomCheckbox
            value={store.is_allFilter}
            onChange={(event) => store.changeAllFilter(event)}
            name="is_allFilter"
            label={translate("label:ApplicationListView.is_allFilter")}
            id="id_f_Application_is_allFilter"
          />
          <Typography variant="caption" color="textSecondary">
            (Переключает между общим и детальным поиском)
          </Typography>
        </Box>
      </Grid>

      {/* Статус и просрочки - всегда видны */}
      <Grid item xs={12}>
        <Grid container spacing={2}>
          <Grid item md={6} xs={12}>
            <MtmLookup
              label={translate("label:ApplicationListView.filterByStatus")}
              name="status_ids"
              value={localStatusIds} // Используем локальное состояние
              onKeyDown={(e) => e.keyCode === 13 && onSearch()}
              data={store.Statuses}
              onChange={handleStatusChange}
              toggles={true}
              toggleGridColumn={4}
            />
          </Grid>

          <Grid item md={6} xs={12}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
              <CustomCheckbox
                value={store.filter.isExpired}
                onChange={(event) => store.handleCheckboxChangeWithLoad('isExpired', event.target.value)}
                name="isExpired"
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <span style={{ color: store.filter.isExpired ? '#d32f2f' : undefined }}>
                      {translate("label:ApplicationListView.isExpired")}
                    </span>
                    {store.filter.isExpired && (
                      <Chip
                        size="small"
                        label="Активно"
                        color="error"
                        sx={{ ml: 1 }}
                      />
                    )}
                  </Box>
                }
                id="id_f_Application_isExpired"
              />

              {store.filter.isExpired && (
                <LookUp
                  value={store.filter.deadline_day}
                  onChange={(event) => store.changeDeadlineDay(event.target.value)}
                  name="deadline_day"
                  data={store.DeadlineDays}
                  id="deadline_day"
                  label={translate("label:ApplicationListView.filterByDeadline")}
                  helperText={""}
                  error={false}
                />
              )}
            </Box>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );

  // Расширенный фильтр - дополнительные поля сгруппированы
  const AdvancedFilters = () => (
    <Box sx={{ mt: 2 }}>
      {/* Только если включен детальный режим показываем расширенные фильтры */}
      {store.is_allFilter && (
        <>
          {/* Местоположение */}
          <Accordion
            expanded={expandedSections.includes('location')}
            onChange={handleSectionChange('location')}
            sx={{ mb: 1 }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1" fontWeight="medium">
                Местоположение
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item md={4} xs={12}>
                  <Autocomplete
                    value={store.TundukDistricts.find(x => x.id === store.filter.tunduk_district_id) || null}
                    onChange={(event, newValue) => store.changeTundukDistrict(newValue?.id || null)}
                    getOptionLabel={(x) => x.name || ""}
                    options={store.TundukDistricts}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={translate("label:ApplicationListView.filterByTundukDistrict")}
                        size="small"
                        fullWidth
                      />
                    )}
                  />
                </Grid>
                <input
                  type="hidden"
                  name="district_id"
                  value={store.filter.district_id || 6}
                />

                <Grid item md={4} xs={12}>
                  <Autocomplete
                    value={store.TundukResidentialAreas.find(x => x.id === store.filter.tunduk_address_unit_id) || null}
                    onChange={(event, newValue) => store.changeTundukAddressUnit(newValue?.id || null)}
                    getOptionLabel={(x) => x.name || ""}
                    options={store.TundukResidentialAreas}
                    disabled={!store.filter.tunduk_district_id}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={translate("label:ApplicationListView.filterByTundukResidentialArea")}
                        size="small"
                        fullWidth
                        helperText={!store.filter.tunduk_district_id ? "Сначала выберите район" : ""}
                      />
                    )}
                  />
                </Grid>

                <Grid item md={4} xs={12}>
                  <Autocomplete
                    value={store.streetSearchState.selectedStreet}
                    inputValue={store.streetSearchState.inputValue}
                    open={store.streetSearchState.isOpen}
                    onOpen={() => runInAction(() => { store.streetSearchState.isOpen = true })}
                    onClose={() => runInAction(() => { store.streetSearchState.isOpen = false })}
                    onChange={(event, newValue) => {
                      runInAction(() => {
                        store.streetSearchState.selectedStreet = newValue;
                        store.changeTundukStreet(newValue?.id || null, newValue);
                      });
                    }}
                    onInputChange={(event, newInputValue, reason) => {
                      if (reason === 'input') {
                        store.handleStreetInputChange(newInputValue);
                      } else {
                        runInAction(() => {
                          store.streetSearchState.inputValue = newInputValue;
                        });
                      }
                    }}
                    isOptionEqualToValue={(option, value) => option.id === value?.id}
                    getOptionLabel={(x) => {
                      if (!x) return '';
                      if (typeof x === 'string') return x;
                      return `${x.name || ""} (${x.address_unit_name || ""})`;
                    }}
                    renderOption={(props, option) => (
                      <Box component="li" {...props}>
                        <div>
                          <div>{option.name}</div>
                          <div style={{ fontSize: '0.85em', color: '#666' }}>
                            {option.address_unit_name}
                          </div>
                        </div>
                      </Box>
                    )}
                    options={store.streetSearchState.searchResults}
                    loading={store.streetSearchState.isLoading}
                    loadingText="Загрузка..."
                    noOptionsText={
                      store.streetSearchState.inputValue.length < 2
                        ? "Введите минимум 2 символа для поиска"
                        : "Ничего не найдено"
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={translate("label:ApplicationListView.filterByTundukStreet")}
                        size="small"
                        fullWidth
                        helperText={
                          store.streetSearchState.inputValue &&
                            store.streetSearchState.inputValue.length > 0 &&
                            store.streetSearchState.inputValue.length < 2
                            ? "Минимум 2 символа"
                            : ""
                        }
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {store.streetSearchState.isLoading ? (
                                <CircularProgress color="inherit" size={20} />
                              ) : null}
                              {params.InputProps.endAdornment}
                            </>
                          ),
                        }}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12}>
                  <DebouncedTextField
                    value={store.filter.address}
                    onChange={handleAddressChange}
                    name="address"
                    label={translate("label:ApplicationListView.searchByAddress")}
                    onKeyDown={handleSearchKeyDown}
                    id="address"
                    startIcon={null}
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          {/* Финансы */}
          <Accordion
            expanded={expandedSections.includes('finance')}
            onChange={handleSectionChange('finance')}
            sx={{ mb: 1 }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1" fontWeight="medium">
                Финансы
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item md={3} xs={12}>
                  <CustomTextField
                    value={store.filter.total_sum_from || ""}
                    onChange={(e) => store.changeTotalSumFrom(e.target.value)}
                    name="total_sum_from"
                    id="total_sum_from"
                    label={translate("label:ApplicationListView.totalSumFrom")}
                    type="number"
                    InputProps={{
                      endAdornment: store.filter.total_sum_from && (
                        <InputAdornment position="end">
                          <IconButton
                            id="total_sum_from_Clear_Btn"
                            size="small"
                            onClick={() => store.changeTotalSumFrom("")}
                          >
                            <ClearIcon fontSize="small" />
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>

                <Grid item md={3} xs={12}>
                  <CustomTextField
                    value={store.filter.total_sum_to || ""}
                    onChange={(e) => store.changeTotalSumTo(e.target.value)}
                    name="total_sum_to"
                    id="total_sum_to"
                    label={translate("label:ApplicationListView.totalSumTo")}
                    type="number"
                    InputProps={{
                      endAdornment: store.filter.total_sum_to && (
                        <InputAdornment position="end">
                          <IconButton
                            id="total_sum_to_Clear_Btn"
                            size="small"
                            onClick={() => store.changeTotalSumTo("")}
                          >
                            <ClearIcon fontSize="small" />
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>

                <Grid item md={3} xs={12}>
                  <CustomTextField
                    value={store.filter.total_payed_from || ""}
                    onChange={(e) => store.changeTotalPayedFrom(e.target.value)}
                    name="total_payed_from"
                    id="total_payed_from"
                    label={translate("label:ApplicationListView.totalPayedFrom")}
                    type="number"
                    InputProps={{
                      endAdornment: store.filter.total_payed_from && (
                        <InputAdornment position="end">
                          <IconButton
                            id="total_payed_from_Clear_Btn"
                            size="small"
                            onClick={() => store.changeTotalPayedFrom("")}
                          >
                            <ClearIcon fontSize="small" />
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>

                <Grid item md={3} xs={12}>
                  <CustomTextField
                    value={store.filter.total_payed_to || ""}
                    onChange={(e) => store.changeTotalPayedTo(e.target.value)}
                    name="total_payed_to"
                    id="total_payed_to"
                    label={translate("label:ApplicationListView.totalPayedTo")}
                    type="number"
                    InputProps={{
                      endAdornment: store.filter.total_payed_to && (
                        <InputAdornment position="end">
                          <IconButton
                            id="total_payed_to_Clear_Btn"
                            size="small"
                            onClick={() => store.changeTotalPayedTo("")}
                          >
                            <ClearIcon fontSize="small" />
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <CustomCheckbox
                      value={store.filter.is_paid}
                      onChange={(event) => store.handleCheckboxChangeWithLoad('is_paid', true, () => store.changeIsPaid(true))}
                      name="isPaid"
                      label={translate("label:ApplicationListView.paidOnly")}
                      id="id_f_Application_isPaid"
                    />
                    <CustomCheckbox
                      value={store.filter.is_paid == false}
                      onChange={(event) => store.handleCheckboxChangeWithLoad('is_paid', false, () => store.changeIsPaid(false))}
                      name="isPaid"
                      label={translate("label:ApplicationListView.notPaidOnly")}
                      id="id_f_Application_isNotPaid"
                    />
                  </Box>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          {/* Услуги */}
          <Accordion
            expanded={expandedSections.includes('services')}
            onChange={handleSectionChange('services')}
            sx={{ mb: 1 }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1" fontWeight="medium">
                Услуги
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <MtmLookup
                label={translate("label:ApplicationListView.filterByService")}
                name="service_ids"
                value={localServiceIds} // Используем локальное состояние
                onKeyDown={(e) => e.keyCode === 13 && onSearch()}
                data={store.Services || []}
                onChange={handleServiceChange}
                toggles={true}
                toggleGridColumn={4}
              />
            </AccordionDetails>
          </Accordion>

          {/* Документооборот */}
          <Accordion
            expanded={expandedSections.includes('documents')}
            onChange={handleSectionChange('documents')}
            sx={{ mb: 1 }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1" fontWeight="medium">
                Документооборот
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item md={6} xs={12}>
                  <DebouncedTextField
                    value={store.filter.incoming_numbers}
                    onChange={handleIncomingNumbersChange}
                    name="searchByIncomingNumbers"
                    label={translate("label:ApplicationListView.searchByIncomingNumbers")}
                    onKeyDown={handleSearchKeyDown}
                    id="incoming_numbers"
                    startIcon={null}
                  />
                </Grid>

                <Grid item md={6} xs={12}>
                  <DebouncedTextField
                    value={store.filter.outgoing_numbers}
                    onChange={handleOutgoingNumbersChange}
                    name="searchByOutgoingNumbers"
                    label={translate("label:ApplicationListView.searchByOutgoingNumbers")}
                    onKeyDown={handleSearchKeyDown}
                    id="outgoing_numbers"
                    startIcon={null}
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          {/* Дополнительные опции */}
          {(MainStore.isHeadStructure || MainStore.isEmployee) && <Accordion
            expanded={expandedSections.includes('additional')}
            onChange={handleSectionChange('additional')}
            sx={{ mb: 1 }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1" fontWeight="medium">
                Дополнительные параметры
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <CustomCheckbox
                  value={store.filter.isMyOrgApplication}
                  onChange={(event) => store.handleCheckboxChangeWithLoad('isMyOrgApplication', event.target.value)}
                  name="isMyOrgApplication"
                  label={translate("label:ApplicationListView.isMyOrgApplication")}
                  id="id_f_Application_isMyOrgApplication"
                />

                {store.is_allFilter && (
                  <CustomCheckbox
                    value={store.filter.withoutAssignedEmployee}
                    onChange={(event) => store.handleCheckboxChangeWithLoad('withoutAssignedEmployee', event.target.value)}
                    name="withoutAssignedEmployee"
                    label={translate("label:ApplicationListView.withoutAssignedEmployee")}
                    id="id_f_Application_withoutAssignedEmployee"
                  />
                )}
              </Box>
            </AccordionDetails>
          </Accordion>}
        </>
      )}
    </Box>
  );

  return (
    <>
      <Box sx={{ display: { sm: "flex" } }} justifyContent={"space-between"}>
        <Grid container spacing={2}>
          <Grid item xs={12} lg={10}>
            {/* Заголовок с индикатором фильтров и кнопками сохраненных фильтров */}
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {hasActiveFilters && (
                  <Badge badgeContent={getActiveFiltersCount} color="primary">
                    <Chip
                      label="Активные фильтры"
                      onDelete={onClear}
                      deleteIcon={<ClearIcon />}
                      color="primary"
                      variant="outlined"
                      size="small"
                    />
                  </Badge>
                )}

                {/* Кнопки для работы с сохраненными фильтрами */}
                <Stack direction="row" spacing={1}>
                  <Tooltip title="Загрузить сохраненный фильтр">
                    <IconButton
                      color="primary"
                      onClick={() => store.openLoadFilterDialogHandler()}
                      sx={{
                        border: '1px solid',
                        borderColor: 'primary.main',
                        borderRadius: 1
                      }}
                    >
                      <BookmarkIcon />
                    </IconButton>
                  </Tooltip>

                  {hasActiveFilters && (
                    <Tooltip title="Сохранить текущий фильтр">
                      <IconButton
                        color="secondary"
                        onClick={() => store.openSaveFilterDialogHandler()}
                        sx={{
                          border: '1px solid',
                          borderColor: 'secondary.main',
                          borderRadius: 1
                        }}
                      >
                        <BookmarkBorderIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                </Stack>
              </Box>

              {/* Переключатель режима */}
              {store.is_allFilter && (
                <Tabs
                  value={filterMode}
                  onChange={(e, newValue) => setFilterMode(newValue)}
                  sx={{ minHeight: 36 }}
                >
                  <Tab
                    value="quick"
                    label="Основные"
                    sx={{ minHeight: 36, py: 1 }}
                  />
                  <Tab
                    value="advanced"
                    label="Расширенные"
                    sx={{ minHeight: 36, py: 1 }}
                  />
                </Tabs>
              )}
            </Box>

            {/* Основная область фильтров */}
            <Box>
              {/* Быстрые фильтры всегда видны */}
              <QuickFilters />

              {/* Расширенные фильтры по условию */}
              {filterMode === "advanced" && <AdvancedFilters />}
            </Box>
          </Grid>

          {/* Панель действий */}
          <Grid item xs={12} lg={2}>
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 1
            }}>
              {forFilter && (
                <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                  <CustomButton
                    variant="outlined"
                    size="small"
                    fullWidth
                    id="saveFilterButton"
                    onClick={onSaveFilter}
                  >
                    {translate("save")}
                  </CustomButton>
                  <CustomButton
                    variant="outlined"
                    size="small"
                    fullWidth
                    id="closeFilterButton"
                    onClick={onCloseFilter}
                  >
                    {translate("close")}
                  </CustomButton>
                </Box>
              )}

              <CustomButton
                variant="contained"
                fullWidth
                id="searchFilterButton"
                onClick={onSearch}
                sx={{ mb: 1 }}
              >
                {translate("search")}
              </CustomButton>

              {hasActiveFilters && (
                <CustomButton
                  variant="outlined"
                  fullWidth
                  id="clearSearchFilterButton"
                  onClick={onClear}
                  sx={{ mb: 1 }}
                >
                  {translate("clear")}
                </CustomButton>
              )}

              <CustomButton
                variant="contained"
                fullWidth
                id="printButton"
                onClick={onPrint}
                sx={{ mb: 1 }}
              >
                {translate("print") || "Печать"}
              </CustomButton>

              <CustomButton
                variant="contained"
                fullWidth
                id="exportExcelButton"
                onClick={onExportExcel}
                sx={{ mb: 1 }}
              >
                {translate("export_to_excel") || "Экспорт в Excel"}
              </CustomButton>

              {selectedIds.length > 0 && (
                <CustomButton
                  variant="contained"
                  fullWidth
                  id="printTemplateButton"
                  onClick={onTemplateMenuOpen}
                >
                  {translate("label:ApplicationListView.print_template")}
                </CustomButton>
              )}
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Dialog for saving filter */}
      <Dialog open={store.openSaveFilterDialog} onClose={() => store.closeSaveFilterDialog()} maxWidth="sm" fullWidth>
        <DialogTitle>Сохранить фильтр</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Название фильтра"
            fullWidth
            variant="outlined"
            value={store.newFilterName}
            onChange={(e) => store.newFilterName = e.target.value}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                store.saveCurrentFilter();
              }
            }}
            helperText="Введите название для сохранения текущих настроек фильтра"
          />
        </DialogContent>
        <DialogActions>
          <CustomButton onClick={() => store.closeSaveFilterDialog()}>
            Отмена
          </CustomButton>
          <CustomButton
            onClick={() => store.saveCurrentFilter()}
            variant="contained"
            disabled={!store.newFilterName.trim()}
          >
            Сохранить
          </CustomButton>
        </DialogActions>
      </Dialog>

      {/* Dialog for loading saved filters */}
      <Dialog open={store.openLoadFilterDialog} onClose={() => store.closeLoadFilterDialog()} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Сохраненные фильтры</Typography>
            <IconButton onClick={() => store.closeLoadFilterDialog()}>
              <ClearIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          {store.savedFilters.length === 0 ? (
            <Typography color="textSecondary" align="center" sx={{ py: 4 }}>
              У вас нет сохраненных фильтров
            </Typography>
          ) : (
            <List>
              {store.savedFilters.map((filter) => (
                <ListItem
                  key={filter.id}
                  sx={{
                    mb: 1,
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1,
                    '&:hover': {
                      backgroundColor: 'action.hover'
                    }
                  }}
                >
                  <ListItemButton onClick={() => store.loadSavedFilter(filter.id)}>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="subtitle1">{filter.filter_name}</Typography>
                          {filter.usage_count > 0 && (
                            <Chip
                              size="small"
                              label={`Использован: ${filter.usage_count}`}
                              icon={<TrendingUpIcon />}
                              variant="outlined"
                            />
                          )}
                        </Box>
                      }
                      secondary={
                        <Box sx={{ display: 'flex', gap: 2, mt: 0.5 }}>
                          {filter.last_used_at && (
                            <Typography variant="caption" color="textSecondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <AccessTimeIcon fontSize="small" />
                              Последнее использование: {dayjs(filter.last_used_at).format('DD.MM.YYYY HH:mm')}
                            </Typography>
                          )}
                        </Box>
                      }
                    />
                  </ListItemButton>
                  <ListItemSecondaryAction>
                    <Tooltip title="Удалить фильтр">
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => store.deleteSavedFilter(filter.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <CustomButton onClick={() => store.closeLoadFilterDialog()}>
            Закрыть
          </CustomButton>
        </DialogActions>
      </Dialog>
    </>
  );
});

export default ApplicationListFilter;