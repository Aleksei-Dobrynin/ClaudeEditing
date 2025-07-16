using Application.Models;
using Application.Repositories;
using Domain.Entities;
using System.Collections.Generic;

namespace Application.UseCases
{
    public class StructureReportUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public StructureReportUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public async Task<List<StructureReport>> GetReportsforStructure()
        {
            var userId = await unitOfWork.UserRepository.GetUserID();
            List<StructureReport> reports = new List<StructureReport>();

            var employee = await unitOfWork.EmployeeRepository.GetByUserId(userId);
            if (employee != null)
            {
                var employeeposts = await unitOfWork.EmployeeInStructureRepository.GetByidEmployee(employee.id);
                foreach (var item in employeeposts)
                {
                    var list = await unitOfWork.StructureReportRepository.GetbyidStructure(item.structure_id);
                    reports.AddRange(list);
                }
            }
            return reports;
        }

        public Task<List<StructureReport>> GetAll()
        {
            return unitOfWork.StructureReportRepository.GetAll();
        }
        public Task<List<StructureReport>> GetbyidConfig(int idConfig)
        {
            return unitOfWork.StructureReportRepository.GetbyidConfig(idConfig);
        }

        public Task<List<StructureReport>> GetbyidStructure(int idStructure)
        {
            return unitOfWork.StructureReportRepository.GetbyidStructure(idStructure);
        }

        public Task<StructureReport> GetOne(int id)
        {
            return unitOfWork.StructureReportRepository.GetOne(id);
        }
        public async Task<StructureReport> Create(StructureReport domain)
        {
            var result = await unitOfWork.StructureReportRepository.Add(domain);
            domain.id = result;
            unitOfWork.Commit();
            return domain;
        }

        public async Task<StructureReport> CreateFromConfig(StructureReport domain)
        {

            var reportConfig = await unitOfWork.StructureReportConfigRepository.GetOne(domain.reportConfigId);

            domain.structureId = reportConfig.structureId;
            

            var result = await unitOfWork.StructureReportRepository.Add(domain);

            domain.id = result;
            //unitOfWork.Commit();

            var fieldsConfig = await unitOfWork.StructureReportFieldConfigRepository.GetByidReportConfig(domain.reportConfigId);
            if (fieldsConfig != null && fieldsConfig.Count > 0)
            {

                foreach (var item in fieldsConfig)
                {

                    var units = await unitOfWork.UnitForFieldConfigRepository.GetByidFieldConfig(item.id);

                    if (units != null && units.Count > 0)
                    {
                        foreach (var unit in units)
                        {
                            StructureReportField reportField = new StructureReportField
                            {
                                createdAt = DateTime.Now,
                                reportId = result,
                                fieldId = item.id,
                                updatedAt = DateTime.Now,
                                unitId = unit.unitId,
                            };

                            await unitOfWork.StructureReportFieldRepository.Add(reportField);
                        }
                    }

                }
            }
            unitOfWork.Commit();
            return domain;
        }

        public async Task<StructureReport> Update(StructureReport domain)
        {
            await unitOfWork.StructureReportRepository.Update(domain);
            unitOfWork.Commit();
            return domain;
        }

        public Task<PaginatedList<StructureReport>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.StructureReportRepository.GetPaginated(pageSize, pageNumber);
        }

        public async Task<int> Delete(int id)
        {
            await unitOfWork.StructureReportRepository.Delete(id);
            unitOfWork.Commit();
            return id;
        }

    }
}
