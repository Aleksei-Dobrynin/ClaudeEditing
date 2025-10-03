import http from "api/https";
import { archive_objects_event } from "constants/archive_objects_event";

export const createarchive_objects_event = (data: archive_objects_event): Promise<any> => {
  return http.post(`/ArchiveObjectsEvents/Create`, data);
};

export const deletearchive_objects_event = (id: number): Promise<any> => {
  return http.remove(`/ArchiveObjectsEvents/${id}`, {});
};

export const getarchive_objects_event = (id: number): Promise<any> => {
  return http.get(`/ArchiveObjectsEvents/GetOneById?id=${id}`);
};

export const getArchiveObjectsEvents = (): Promise<any> => {
  return http.get("/ArchiveObjectsEvents/GetAll");
};

export const updatearchive_objects_event = (data: archive_objects_event): Promise<any> => {
  return http.put(`/ArchiveObjectsEvents/Update`, data);
};

// Дополнительные методы для фильтрации
export const getArchiveObjectsEventsByObjectId = (archiveObjectId: number): Promise<any> => {
  return http.get(`/ArchiveObjectsEvents/GetByObjectId/?archiveObjectId=${archiveObjectId}`);
};

export const getArchiveObjectsEvents_by_employee = (employee_id: number): Promise<any> => {
  return http.get(`/ArchiveObjectsEvents/by_employee/${employee_id}`);
};

export const getArchiveObjectsEvents_by_event_type = (event_type_id: number): Promise<any> => {
  return http.get(`/ArchiveObjectsEvents/by_event_type/${event_type_id}`);
};

export const getArchiveObjectsEvents_by_date_range = (start_date: string, end_date: string): Promise<any> => {
  return http.get(`/ArchiveObjectsEvents/by_date_range?start_date=${start_date}&end_date=${end_date}`);
};