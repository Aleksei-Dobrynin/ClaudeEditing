using Application.Models;
using Application.Repositories;
using Domain.Entities;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Application.UseCases
{
    public class HistoryTableUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        HashSet<string> fieldsToExclude = new HashSet<string>
        {
            "id",
            "created_at",
            "created_by",
            "updated_at",
            "updated_by",
            "status_id",
            "tech_decision_id",
            "file_id",
            "application_task_id",
            "id_tag",
            "type_id",
            "id_object",
            "task_template_id",
            "structure_id",
            "dutyplan_object_id",
            "structure_tag_id",
            "unit_type_id",
            "id_type",
            "task_id",
            "district_id",
            "head_structure_id",
            "language_id",
            "template_id",
            "application_subtask_id",
            "subtask_template_id",
            "implementer_id",
            "body",
            "identity_document_type_id",
            "organization_type_id",
            "application_document_id",
            "service_document_id",
            "structure_employee_id",
            "object_tag_id",
            "service_id",
            "customer_id",
            "workflow_id",
            "arch_object_id",
            "application_id"
        };

        public HistoryTableUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public async Task<List<HistoryTable>> GetAll()
        {
            var data = await unitOfWork.HistoryTableRepository.GetAll();
            foreach (var item in data)
            {
                if (item.old_value != null) item.old_value = FilterFields(item.old_value, fieldsToExclude);
                if (item.new_value != null) item.new_value = FilterFields(item.new_value, fieldsToExclude);
                if (item.field != null)
                {
                    if (item.old_value != null) item.old_value = FilterFields(item.old_value, item.field);
                    if (item.new_value != null) item.new_value = FilterFields(item.new_value, item.field);
                }
            }

            return data;
        }
        
        public async Task<List<HistoryTable>> GetByApplication(int application_id, DateTime? date_start, DateTime? date_end, int employee_id)
        {
            var user_id = await unitOfWork.EmployeeRepository.GetUserIdByEmployeeId(employee_id);



            var data = await unitOfWork.HistoryTableRepository.GetByApplication(application_id);

            data = data.Where(x => (employee_id == 0 ? true : x.created_by == user_id) && (date_start == null ? true : x.created_at > date_start) && (date_end == null ? true : x.created_at < date_end)).ToList();

            foreach (var item in data)
            {
                if (item.old_value != null) item.old_value = FilterFields(item.old_value, fieldsToExclude);
                if (item.new_value != null) item.new_value = FilterFields(item.new_value, fieldsToExclude);
                if (item.field != null)
                {
                    if (item.old_value != null) item.old_value = FilterFields(item.old_value, item.field);
                    if (item.new_value != null) item.new_value = FilterFields(item.new_value, item.field);
                }
            }

            return data;
        }

        public Task<HistoryTable> GetOneByID(int id)
        {
            return unitOfWork.HistoryTableRepository.GetOneByID(id);
        }

        public Task<PaginatedList<HistoryTable>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.HistoryTableRepository.GetPaginated(pageSize, pageNumber);
        }

        private string FilterFields(string jsonString, HashSet<string> fieldsToExclude)
        {
            var jsonObject = JObject.Parse(jsonString);
            foreach (var field in fieldsToExclude)
            {
                jsonObject.Remove(field);
            }

            return jsonObject.ToString(Formatting.None);
        }

        private string FilterFields(string jsonString, string field)
        {
            try
            {
                var jsonObject = JsonConvert.DeserializeObject<Dictionary<string, object>>(jsonString);

                var fieldNameToMatch = field.Replace("_id", "");

                var matchedKey = jsonObject.Keys
                    .FirstOrDefault(key => key.Contains(fieldNameToMatch, StringComparison.OrdinalIgnoreCase));

                if (matchedKey != null)
                {
                    var filteredObject = new Dictionary<string, object>
                    {
                        { matchedKey, jsonObject[matchedKey] }
                    };

                    return JsonConvert.SerializeObject(filteredObject);
                }
                else
                {
                    return "{}";
                }
            }
            catch (JsonException)
            {
                return jsonString;
            }
        }
    }
}