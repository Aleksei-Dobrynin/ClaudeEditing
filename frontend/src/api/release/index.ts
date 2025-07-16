import http from "api/https";
import { release } from "constants/release";

export const createrelease = (data: release, files: File[]): Promise<any> => {
  const formData = new FormData();
  for (var key in data) {
    if (data[key] == null) continue;
    formData.append(key, data[key]);
  }

  files.forEach((file, index) => {
    formData.append(`files[${index}].file`, file); // Сам файл
    formData.append(`files[${index}].name`, file.name); // Имя файла
  });
  return http.post(`/release`, formData);
};

export const updaterelease = (data: release, files: File[], videos: any[]): Promise<any> => {
  const formData = new FormData();
  for (var key in data) {
    if (data[key] == null) continue;
    formData.append(key, data[key]);
  }

  files.forEach((file, index) => {
    formData.append(`files[${index}].file`, file); // Сам файл
    formData.append(`files[${index}].name`, file.name); // Имя файла
  });

  formData.append("video_ids", videos?.map((x) => x.id).toString());

  videos.forEach((video, index) => {
    formData.append(`videos[${index}].id`, video.id);
  });
  return http.put(`/release/${data.id}`, formData);
};

export const deleterelease = (id: number): Promise<any> => {
  return http.remove(`/release/${id}`, {});
};

export const approveRelease = (id: number): Promise<any> => {
  return http.post(`/release/ApproveRelease`, { id });
};

export const getrelease = (id: number): Promise<any> => {
  return http.get(`/release/${id}`);
};

export const getLastRelease = (): Promise<any> => {
  return http.get(`/release/GetLastRelease`);
};

export const getreleases = (): Promise<any> => {
  return http.get("/release/GetAll");
};

export const getReleaseds = (): Promise<any> => {
  return http.get("/release/GetReleaseds");
};
