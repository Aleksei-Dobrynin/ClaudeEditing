import http from "api/https";

// Get all saved filters for current employee (backend determines employee_id)
export const getEmployeeSavedFilters = (): Promise<any> => {
  return http.get("/EmployeeSavedFilters/GetByEmployeeId");
};

// Get a single saved filter by ID
export const getEmployeeSavedFilterById = (id: number): Promise<any> => {
  return http.get(`/EmployeeSavedFilters/GetOneById?id=${id}`);
};

// Create a new saved filter (backend will set employee_id)
export const createEmployeeSavedFilter = (data: any): Promise<any> => {
  // Remove employee_id if it exists in data
  const { employee_id, ...filterData } = data;
  return http.post("/EmployeeSavedFilters/Create", filterData);
};

// Update an existing saved filter
export const updateEmployeeSavedFilter = (data: any): Promise<any> => {
  // Remove employee_id if it exists in data
  const { employee_id, ...filterData } = data;
  return http.put("/EmployeeSavedFilters/Update", filterData);
};

// Delete a saved filter
export const deleteEmployeeSavedFilter = (id: number): Promise<any> => {
  return http.remove(`/EmployeeSavedFilters/Delete?id=${id}`, {});
};

// Helper function to mark filter as used (updates usage count and last_used_at)
export const markEmployeeSavedFilterAsUsed = async (id: number): Promise<any> => {
  try {
    // First get the filter
    const response = await getEmployeeSavedFilterById(id);
    if (response.status === 200 && response.data) {
      const filter = response.data;
      
      // Update usage tracking fields
      filter.last_used_at = new Date().toISOString();
      filter.usage_count = (filter.usage_count || 0) + 1;
      
      // Update the filter (backend handles employee_id)
      return updateEmployeeSavedFilter(filter);
    }
    return response;
  } catch (err) {
    throw err;
  }
};