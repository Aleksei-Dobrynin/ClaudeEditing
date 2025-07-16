import http from "api/https";

export const getEmployeeInStructures = (): Promise<any> => {
  return http.get("/EmployeeInStructure/GetAll");
};

export const getEmployeeInStructureByService = (idStructure: number): Promise<any> => {
  return http.get(`/EmployeeInStructure/GetByidStructure?idStructure=${idStructure}`);
};

export const getEmployeeInMyStructure = (): Promise<any> => {
  return http.get(`/EmployeeInStructure/GetInMyStructure`);
};

export const getEmployeeInMyStructureHistory = (): Promise<any> => {
  return http.get(`/EmployeeInStructure/GetInMyStructureHistory`);
};


