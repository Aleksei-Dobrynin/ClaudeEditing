import http from "api/https";
import { ArchiveObject } from "../../constants/ArchiveObject";

export const createArchiveObject = (data: ArchiveObject): Promise<any> => {
  return http.post(`/ArchiveObject/Create`, data);
};

export const createArchiveObjectWithFolder = (data: ArchiveObject): Promise<any> => {
  return http.post(`/ArchiveObject/CreateWithFolder`, data);
};

interface NewArchiveObject {
  doc_number: string;
  address: string;
}

export const divideArchiveObject = (
  idObj: number, 
  newObjects: NewArchiveObject[], 
  fileIds: number[]
): Promise<any> => {
  const data = {
    obj_id: idObj,
    new_objects: newObjects,
    file_ids: fileIds,
  }
  return http.post(`/ArchiveObject/DivideArchiveObject`, data);
};

export const combineArchiveObjects = (
  object_ids: number[], 
  new_doc_number: string, 
  new_address: string
): Promise<any> => {
  const data = {
    object_ids,
    new_doc_number,
    new_address,
  }
  return http.post(`/ArchiveObject/CombineArchiveObjects`, data);
};