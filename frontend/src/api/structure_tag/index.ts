import http from "api/https";
import { structure_tag } from "constants/structure_tag";

export const createstructure_tag = (data: structure_tag): Promise<any> => {
  return http.post(`/structure_tag`, data);
};

export const deletestructure_tag = (id: number): Promise<any> => {
  return http.remove(`/structure_tag/${id}`, {});
};

export const getstructure_tag = (id: number): Promise<any> => {
  return http.get(`/structure_tag/${id}`);
};

export const getstructure_tags = (): Promise<any> => {
  return http.get("/structure_tag/GetAll");
};

export const updatestructure_tag = (data: structure_tag): Promise<any> => {
  return http.put(`/structure_tag/${data.id}`, data);
};

export const getstructure_tagsBystructure_id = (structure_id: number): Promise<any> => {
  return http.get(`/structure_tag/GetBystructure_id?structure_id=${structure_id}`);
};

export const getstructure_tagBystructure_idAndAppId = (
  structure_id: number,
  application_id: number
): Promise<any> => {
  return http.get(
    `/structure_tag_application/GetForApplication?structure_id=${structure_id}&application_id=${application_id}`
  );
};

export const updateApplicationTags = (
  application_id: number,
  structure_id: number,
  structure_tag_id: number,
  object_tag_id: number,
  district_id: number,
  application_square_value: number,
  application_square_unit_type_id: number,
  tech_decision_id: number,
  file?: any,
  fileName?: string
): Promise<any> => {
  const formData = new FormData();

  // Добавляем основные поля
  formData.append("application_id", application_id.toString());
  formData.append("structure_id", structure_id.toString());
  formData.append("structure_tag_id", structure_tag_id.toString());
  formData.append("object_tag_id", object_tag_id.toString());
  formData.append("district_id", district_id.toString());
  formData.append("application_square_value", application_square_value.toString()?.replace(",","."));
  formData.append("application_square_unit_type_id", application_square_unit_type_id.toString());
  formData.append("tech_decision_id", tech_decision_id.toString());

  // Добавляем файл и его имя в поле document
  if (file && fileName) {
    formData.append("document.name", fileName);
    formData.append("document.file", file);
  }

  // Отправляем formData через POST-запрос
  return http.post(`/Application/UpdateApplicationTags`, formData, {
    headers: {
      "Content-Type": "multipart/form-data", // Указываем тип контента для отправки файла
    },
  });
};

export const updateApplicationTechTags = (
  application_id: number,
  tech_decision_id: number,
  file?: any,
  fileName?: string
): Promise<any> => {
  const formData = new FormData();
  formData.append("application_id", application_id.toString());
  formData.append("tech_decision_id", tech_decision_id.toString());
  if (file && fileName) {
    formData.append("document.name", fileName);
    formData.append("document.file", file);
  }

  return http.post(`/Application/UpdateApplicationTechTags`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

