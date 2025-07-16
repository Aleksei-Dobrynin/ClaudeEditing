import http from "api/https";
import { ArchObject } from "../../constants/ArchObject";

export const updateArchObject = (data: ArchObject): Promise<any> => {
  return http.put(`/ArchObject/Update`, data);
};

export const updateArchObjectCoords = (
  application_id: number,
  xcoord: number,
  ycoord: number
): Promise<any> => {
  const data = {
    application_id,
    xcoord,
    ycoord,
  };
  return http.put(`/ArchObject/UpdateCoords`, data);
};
