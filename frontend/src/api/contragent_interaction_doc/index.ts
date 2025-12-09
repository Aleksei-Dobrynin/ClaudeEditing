import http from "api/https";
import { contragent_interaction_doc } from "constants/contragent_interaction_doc";

export const createcontragent_interaction_doc = (data: contragent_interaction_doc, fileName: string, file): Promise<any> => {
  const formData = new FormData();
  
  for (var key in data) {
    if (data[key] == null) continue;
    formData.append(key, data[key]);
  }
  formData.append("document.name", fileName);
  formData.append("document.file", file);

  return http.post(`/contragent_interaction_doc`, formData);
};

export const deletecontragent_interaction_doc = (id: number): Promise<any> => {
  return http.remove(`/contragent_interaction_doc/${id}`, {});
};

export const getcontragent_interaction_doc = (id: number): Promise<any> => {
  return http.get(`/contragent_interaction_doc/${id}`);
};

export const getcontragent_interaction_docs = (): Promise<any> => {
  return http.get("/contragent_interaction_doc/GetAll");
};

export const updatecontragent_interaction_doc = (data: contragent_interaction_doc, fileName: string, file): Promise<any> => {
  const formData = new FormData();
  
  for (var key in data) {
    if (data[key] == null) continue;
    formData.append(key, data[key]);
  }
  formData.append("document.name", fileName);
  formData.append("document.file", file);

  return http.put(`/contragent_interaction_doc/${data.id}`, formData);

};


export const getcontragent_interaction_docsByinteraction_id = (interaction_id: number): Promise<any> => {
  return http.get(`/contragent_interaction_doc/GetByinteraction_id?interaction_id=${interaction_id}`);
};
