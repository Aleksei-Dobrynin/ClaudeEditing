using Application.Models;
using Application.Repositories;
using Application.Services;
using Domain.Entities;

namespace Application.UseCases
{
    public class TechCouncilUseCases
    {
        private readonly IUnitOfWork unitOfWork;
        private readonly ISendNotification _sendNotification;
        private readonly IAuthRepository _authRepository;

        public TechCouncilUseCases(IUnitOfWork unitOfWork, ISendNotification sendNotification,  IAuthRepository authRepository)
        {
            this.unitOfWork = unitOfWork;
            _sendNotification = sendNotification;
            _authRepository = authRepository;
        }

        public Task<List<TechCouncil>> GetAll()
        {
            return unitOfWork.TechCouncilRepository.GetAll();
        }        
        
        public Task<List<TechCouncilTable>> GetTable()
        {
            return unitOfWork.TechCouncilRepository.GetTable();
        }
        
        public Task<List<TechCouncilTable>> GetTableBySession(int session_id)
        {
            return unitOfWork.TechCouncilRepository.GetTableBySession(session_id);
        }
        
        public Task<List<TechCouncilTable>> GetTableByStructure(int structure_id)
        {
            return unitOfWork.TechCouncilRepository.GetTableByStructure(structure_id);
        }
        
        public Task<List<TechCouncilTable>> GetTableWithOutSession()
        {
            return unitOfWork.TechCouncilRepository.GetTableWithOutSession();
        }
        
        public async Task<int> GetCountMyStructure()
        {
            var employee = await unitOfWork.EmployeeRepository.GetUser();
            employee.head_of_structures = await unitOfWork.EmployeeInStructureRepository.HeadOfStructures(employee.id);
            var structures = await unitOfWork.OrgStructureRepository.GetByUserId(employee.user_id);
            var first_structure = structures.FirstOrDefault();
            if (first_structure != null && first_structure.name == employee.head_of_structures.FirstOrDefault()?.name)
            {
                var list = await unitOfWork.TechCouncilRepository.GetByStructureId(first_structure.id);
                return list.Count;
            }
            return 0;
        }
        
        public async Task UpdateSession(int? application_id, int? session_id)
        {
            await unitOfWork.TechCouncilRepository.UpdateSession(application_id, session_id);
            unitOfWork.Commit();
        }
        
        public async Task UpdateSession(List<int> application_ids, int? session_id)
        {
            foreach (var application_id in application_ids)
            {
                await unitOfWork.TechCouncilRepository.UpdateSession(application_id, session_id);
            }
            unitOfWork.Commit();
        }

        public async Task<List<TechCouncil>> GetByApplicationId(int application_id)
        {
            return await unitOfWork.TechCouncilRepository.GetByApplicationId(application_id);
        }

        public Task<TechCouncil> GetOneByID(int id)
        {
            return unitOfWork.TechCouncilRepository.GetOneByID(id);
        }

        public async Task<TechCouncil> Create(TechCouncil domain)
        {
            var result = await unitOfWork.TechCouncilRepository.Add(domain);
            domain.id = result;
            unitOfWork.Commit();
            return domain;
        }
        
        public async Task<TechCouncilFiles> UploadFile(FileTechCouncilRequest domain)
        {
            var newTechCouncilFile = new TechCouncilFiles
            {
                tech_council_id = domain.id
            };
            if (domain.document != null)
            {
                var document = unitOfWork.FileRepository.AddDocument(domain.document);
                var idFile = await unitOfWork.FileRepository.Add(document);
                newTechCouncilFile.file_id = idFile;
            }
            var result = await unitOfWork.TechCouncilFilesRepository.Add(newTechCouncilFile);
            domain.id = result;
            unitOfWork.Commit();
            return newTechCouncilFile;
        }

        public async Task<int> SendTo(int application_id, List<int> participants)
        {
            foreach (var structure in participants)
            {
                var headsStructure = await unitOfWork.EmployeeInStructureRepository.
                    GetByStructureAndPost(structure, "head_structure");
                var head = headsStructure.FirstOrDefault();
                if (head == null)
                {
                    continue;
                }
                var application = await unitOfWork.ApplicationRepository.GetOneByID(application_id);

                var param = new Dictionary<string, string>();
                param.Add("application_number", application.number);
                param.Add("application_id", application.id.ToString());

                await _sendNotification.SendNotification(
                    "new_tech_council",
                    head.employee_id,
                    param);

                var newTechCouncil = new TechCouncil
                {
                    application_id = application_id,
                    structure_id = structure
                };

                await unitOfWork.TechCouncilRepository.Add(newTechCouncil);
                
                unitOfWork.Commit();
            }
            return application_id;
        }

        public async Task<UpdateLegalRecordsRequest> UpdateLegalRecords(UpdateLegalRecordsRequest domain)
        {
            await unitOfWork.LegalRecordInCouncilRepository.DeleteByTechCouncilId(domain.id);
            foreach (var record in domain.legal_records)
            {
                var newRecord = new LegalRecordInCouncil
                {
                    tech_council_id = domain.id,
                    application_legal_record_id = record,
                };
                await unitOfWork.LegalRecordInCouncilRepository.Add(newRecord);
            }
            unitOfWork.Commit();
            return domain;
        }        
        
        public async Task<TechCouncil> Update(TechCouncil domain)
        {
            var employee = await unitOfWork.EmployeeRepository.GetUser();
            domain.employee_id = employee.id;
            domain.date_decision = DateTime.Now;
            await unitOfWork.TechCouncilRepository.Update(domain);
            unitOfWork.Commit();
            return domain;
        }

        public Task<PaginatedList<TechCouncil>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.TechCouncilRepository.GetPaginated(pageSize, pageNumber);
        }

        public async Task Delete(int id)
        {
            await unitOfWork.TechCouncilRepository.Delete(id);
            unitOfWork.Commit();
        }
    }
}