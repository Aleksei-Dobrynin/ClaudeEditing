import { FilterApplication } from "constants/Application";
import dayjs from 'dayjs';

/**
 * Извлекает параметры фильтров из URL
 */
export const getFiltersFromURL = (searchParams: URLSearchParams): Partial<FilterApplication> | null => {
  // Проверяем, есть ли хоть один параметр фильтра в URL
  const hasFilterParams = Array.from(searchParams.keys()).some(key => 
    FILTER_URL_PARAMS.includes(key)
  );
  
  if (!hasFilterParams) {
    return null; // Если нет параметров - вернуть null, чтобы использовать localStorage
  }

  const filters: Partial<FilterApplication> = {};

  // Boolean параметры
  if (searchParams.has('isMyOrgApplication')) {
    filters.isMyOrgApplication = searchParams.get('isMyOrgApplication') === 'true';
  }
  
  if (searchParams.has('withoutAssignedEmployee')) {
    filters.withoutAssignedEmployee = searchParams.get('withoutAssignedEmployee') === 'true';
  }

  if (searchParams.has('isExpired')) {
    filters.isExpired = searchParams.get('isExpired') === 'true';
  }

  if (searchParams.has('for_signature')) {
    filters.for_signature = searchParams.get('for_signature') === 'true';
  }

  // String параметры
  if (searchParams.has('number')) {
    filters.number = searchParams.get('number') || '';
  }

  if (searchParams.has('customerName')) {
    filters.customerName = searchParams.get('customerName') || '';
  }

  if (searchParams.has('isAssignedToMe')) {
    filters.isAssignedToMe = searchParams.get('isAssignedToMe') === 'true';
  }

  if (searchParams.has('isFavorite')) {
    filters.isFavorite = searchParams.get('isFavorite') === 'true';
  }

  if (searchParams.has('pin')) {
    filters.pin = searchParams.get('pin') || '';
  }

  if (searchParams.has('address')) {
    filters.address = searchParams.get('address') || '';
  }

  if (searchParams.has('common_filter')) {
    filters.common_filter = searchParams.get('common_filter') || '';
  }

  // Number параметры
  if (searchParams.has('employee_id')) {
    const empId = parseInt(searchParams.get('employee_id') || '0');
    filters.employee_id = !isNaN(empId) ? empId : 0;
  }

  if (searchParams.has('district_id')) {
    const districtId = parseInt(searchParams.get('district_id') || '');
    filters.district_id = !isNaN(districtId) ? districtId : null;
  }

  if (searchParams.has('tunduk_district_id')) {
    const tundukDistrictId = parseInt(searchParams.get('tunduk_district_id') || '');
    filters.tunduk_district_id = !isNaN(tundukDistrictId) ? tundukDistrictId : null;
  }

  // Array параметры (ids через запятую)
  if (searchParams.has('status_ids')) {
    const statusIds = searchParams.get('status_ids')
      ?.split(',')
      .map(id => parseInt(id.trim()))
      .filter(id => !isNaN(id)) || [];
    filters.status_ids = statusIds;
  }

  if (searchParams.has('service_ids')) {
    const serviceIds = searchParams.get('service_ids')
      ?.split(',')
      .map(id => parseInt(id.trim()))
      .filter(id => !isNaN(id)) || [];
    filters.service_ids = serviceIds;
  }

  if (searchParams.has('structure_ids')) {
    const structureIds = searchParams.get('structure_ids')
      ?.split(',')
      .map(id => parseInt(id.trim()))
      .filter(id => !isNaN(id)) || [];
    filters.structure_ids = structureIds;
  }

  // Date параметры
//   if (searchParams.has('date_start')) {
//     const dateStr = searchParams.get('date_start');
//     const date = dayjs(dateStr);
//     filters.date_start = date.isValid() ? date : null;
//   }

//   if (searchParams.has('date_end')) {
//     const dateStr = searchParams.get('date_end');
//     const date = dayjs(dateStr);
//     filters.date_end = date.isValid() ? date : null;
//   }

  return filters;
};

/**
 * Преобразует фильтры в URL параметры
 */
export const setFiltersToURL = (
  filters: FilterApplication,
  navigate: any,
  location: any
) => {
  const params = new URLSearchParams();

  // Добавляем только непустые значения
  if (filters.isMyOrgApplication) {
    params.set('isMyOrgApplication', 'true');
  }

  if (filters.withoutAssignedEmployee) {
    params.set('withoutAssignedEmployee', 'true');
  }

  if (filters.isExpired) {
    params.set('isExpired', 'true');
  }

  if (filters.for_signature) {
    params.set('for_signature', 'true');
  }

  if (filters.isAssignedToMe) {
    params.set('isAssignedToMe', 'true');
  }

  if (filters.isFavorite) {
    params.set('isFavorite', 'true');
  }

  if (filters.number) {
    params.set('number', filters.number);
  }

  if (filters.customerName) {
    params.set('customerName', filters.customerName);
  }

  if (filters.pin) {
    params.set('pin', filters.pin);
  }

  if (filters.address) {
    params.set('address', filters.address);
  }

  if (filters.common_filter) {
    params.set('common_filter', filters.common_filter);
  }

  if (filters.employee_id && filters.employee_id !== 0) {
    params.set('employee_id', filters.employee_id.toString());
  }

  if (filters.status_ids && filters.status_ids.length > 0) {
    params.set('status_ids', filters.status_ids.join(','));
  }

  if (filters.service_ids && filters.service_ids.length > 0) {
    params.set('service_ids', filters.service_ids.join(','));
  }

  if (filters.structure_ids && filters.structure_ids.length > 0) {
    params.set('structure_ids', filters.structure_ids.join(','));
  }

  if (filters.date_start) {
    params.set('date_start', dayjs(filters.date_start).format('YYYY-MM-DD'));
  }

  if (filters.date_end) {
    params.set('date_end', dayjs(filters.date_end).format('YYYY-MM-DD'));
  }

  // Обновляем URL без перезагрузки страницы
  const newSearch = params.toString();
  if (newSearch) {
    navigate(`${location.pathname}?${newSearch}`, { replace: true });
  } else {
    navigate(location.pathname, { replace: true });
  }
};

/**
 * Очищает URL параметры фильтров
 */
export const clearFiltersFromURL = (navigate: any, location: any) => {
  navigate(location.pathname, { replace: true });
};

// Список всех возможных параметров фильтров
const FILTER_URL_PARAMS = [
  'isMyOrgApplication',
  'withoutAssignedEmployee',
  'isExpired',
  'for_signature',
  'number',
  'isAssignedToMe',
  'isFavorite',
  'customerName',
  'pin',
  'address',
  'common_filter',
  'employee_id',
  'district_id',
  'tunduk_district_id',
  'status_ids',
  'service_ids',
  'structure_ids',
  'date_start',
  'date_end'
];