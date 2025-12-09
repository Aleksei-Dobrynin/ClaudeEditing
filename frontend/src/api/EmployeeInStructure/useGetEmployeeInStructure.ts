import http from "api/https";

export const getEmployeeInStructure = (id: number): Promise<any> => {
  return http.get(`/EmployeeInStructure/GetOneById?id=${id}`);
};
export const getEmployeeInStructureGroup = (idStructure: number): Promise<any> => {
  return http.get(`/EmployeeInStructure/GetByEmployeeStructureId?idStructure=${idStructure}`);
};


export const checkIsHeadStructure = (employee_id: number): Promise<any> => {
  return http.get(`/EmployeeInStructure/CheckIsHeadStructure?employee_id=${employee_id}`);
};
