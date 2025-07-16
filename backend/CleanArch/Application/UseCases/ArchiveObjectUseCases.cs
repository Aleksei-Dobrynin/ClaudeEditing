using Application.Models;
using Application.Repositories;
using DocumentFormat.OpenXml.Office2016.Drawing.ChartDrawing;
using Domain.Entities;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Application.UseCases
{
    public class ArchiveObjectUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public ArchiveObjectUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public Task<List<ArchiveObject>> GetAll()
        {
            return unitOfWork.ArchiveObjectRepository.GetAll();
        }
        
        public async Task<List<ArchiveObject>> Search(string? number, double? latitude, double? longitude, double? radius)
        {
            var results = await unitOfWork.ArchiveObjectRepository.Search(number, latitude, longitude, radius);
            return results;
        }
        public async Task<List<ArchiveObject>> SearchByNumber(string? number)
        {
            var results = await unitOfWork.ArchiveObjectRepository.SearchByNumber(number);
            return results;
        }
        
        public Task<List<ArchiveObject>> GetArchiveObjectsFromApplication()
        {
            return unitOfWork.ArchiveObjectRepository.GetArchiveObjectsFromApplication();
        }
        
        public async Task<ArchiveObject> GetOneByID(int id)
        {
            var res = await unitOfWork.ArchiveObjectRepository.GetOneByID(id);
            if(res.parent_id != null)
            {
                res.parent_object = await unitOfWork.ArchiveObjectRepository.GetOneByID(res.parent_id ?? 0);
            }
            res.divided_objects = await unitOfWork.ArchiveObjectRepository.GetChildObjects(res.id);
            return res;
        }
        public Task<ArchiveObject> GetOneByProcessId(int process_id)
        {
            return unitOfWork.ArchiveObjectRepository.GetOneByProcessId(process_id);
        }

        public async Task<ArchiveObject> Create(ArchiveObject domain)
        {
            if (domain.parent_id == 0) domain.parent_id = null;

            var statuses = await unitOfWork.status_dutyplan_objectRepository.GetAll();
            var from_arch = statuses.FirstOrDefault(x => x.code == "archive");

            domain.status_dutyplan_object_id = from_arch.id;
            var result = await unitOfWork.ArchiveObjectRepository.Add(domain);

            foreach (var customer_ArchObj in domain.customers_for_archive_object)
            {
                customer_ArchObj.id = 0;
                var customers_ArchObj_id = await unitOfWork.customers_for_archive_objectRepository.Add(customer_ArchObj);
                customer_ArchObj.id = customers_ArchObj_id;
            }

            foreach (var customer_ArchObj in domain.customers_for_archive_object)
            {
                await unitOfWork.ArchiveObjectCustomerRepository.Add(new ArchiveObjectCustomer
                {
                    customer_id = customer_ArchObj.id,
                    archive_object_id = result,
                });
            }

           
            domain.id = result;
            unitOfWork.Commit();
            return domain;
        }

        public async Task<int> CreateWithFolder(ArchiveObject domain)
        {
            var statuses = await unitOfWork.status_dutyplan_objectRepository.GetAll();
            var from_arch = statuses.FirstOrDefault(x => x.code == "archive");

            domain.status_dutyplan_object_id = from_arch.id;
            var result = await unitOfWork.ArchiveObjectRepository.Add(domain);
            domain.id = result;

            var folder = new archive_folder
            {
                dutyplan_object_id = result,
                object_number = domain.doc_number,
                archive_folder_name = domain.doc_number
            };
            var folderId = await unitOfWork.archive_folderRepository.Add(folder);

            unitOfWork.Commit();
            return folderId;
        }

        public async Task<ArchiveObject> Update(ArchiveObject domain)
        {
            if (domain.parent_id == 0) domain.parent_id = null;

            await unitOfWork.ArchiveObjectRepository.Update(domain);
            var existingCustomers = await unitOfWork.ArchiveObjectCustomerRepository.GetByArchiveObjectId(domain.id);
            var customerIds = domain.customers_for_archive_object
                .Where(x => x.id > 0)
                .Select(x => x.id).ToList();
            
            var customersToDelete = existingCustomers
                .Where(x => !customerIds.Contains(x.customer_id))
                .ToList();
            
            foreach (var customerToDelete in customersToDelete)
            {
                await unitOfWork.ArchiveObjectCustomerRepository.Delete(customerToDelete.id);
            }
            
            foreach (var customer_ArchObj in domain.customers_for_archive_object)
            {
                if (customer_ArchObj.id <= 0)
                {
                    var customerId = await unitOfWork.customers_for_archive_objectRepository.Add(customer_ArchObj);
                    await unitOfWork.ArchiveObjectCustomerRepository.Add(new ArchiveObjectCustomer
                    {
                        customer_id = customerId,
                        archive_object_id = domain.id,
                    });
                }
                else
                {
                    await unitOfWork.customers_for_archive_objectRepository.Update(customer_ArchObj);
                }
            }
            unitOfWork.Commit();
            return domain;
        }
        public async Task<ArchiveObject> SetDutyNumberToDuty(int from_duty_id, int to_duty_id)
        {
            var user_id = await unitOfWork.UserRepository.GetUserID();

            var objs = await unitOfWork.application_duty_objectRepository.GetBydutyplan_object_id(from_duty_id);
            foreach (var obj in objs)
            {
                obj.dutyplan_object_id = to_duty_id;
                obj.updated_at = DateTime.Now;
                obj.updated_by = user_id;
                await unitOfWork.application_duty_objectRepository.Update(obj);
            }

            var docs = await unitOfWork.ArchiveObjectFileRepository.GetByidArchiveObject(from_duty_id);
            foreach (var doc in docs)
            {
                doc.archive_object_id = to_duty_id;
                doc.updated_at = DateTime.Now;
                doc.updated_by = user_id;
                await unitOfWork.ArchiveObjectFileRepository.Update(doc);
            }

            await unitOfWork.ArchiveObjectRepository.Delete(from_duty_id);

            unitOfWork.Commit();

            var domain = await unitOfWork.ArchiveObjectRepository.GetOneByID(to_duty_id);
            return domain;
        }

        public Task<PaginatedList<ArchiveObject>> GetPagniated(ArchiveObjectFilter filter)
        {
            if (filter.pageSize < 1) filter.pageSize = 1;
            if (filter.pageNumber < 1) filter.pageNumber = 1;
            return unitOfWork.ArchiveObjectRepository.GetPaginated(filter);
        }
        
        public async Task<List<int>> DivideArchiveObject(DivideArchiveObjectDto data)
        {
            var user_id = await unitOfWork.UserRepository.GetUserID();
            var obj = await unitOfWork.ArchiveObjectRepository.GetOneByID(data.obj_id);
            var ids = new List<int>();

            foreach (var new_obj in data.new_objects)
            {
                var newObj = await unitOfWork.ArchiveObjectRepository.Add(new ArchiveObject
                {
                    doc_number = new_obj.doc_number,
                    status_dutyplan_object_id = obj.status_dutyplan_object_id,
                    created_at = DateTime.Now,
                    address = new_obj.address,
                    created_by = user_id,
                    parent_id = obj.id,
                });
                ids.Add(newObj);
            }

            //foreach (var file_id in file_ids)
            //{
            //    var file = await unitOfWork.ArchiveObjectFileRepository.GetOneByID(file_id);
            //    file.archive_object_id = newObj;
            //    await unitOfWork.ArchiveObjectFileRepository.Update(file);
            //}

            unitOfWork.Commit();

            return ids;
        }
        
        
        public async Task<int> CombineArchiveObjects(CombineArchiveObjects data)
        {
            var user_id = await unitOfWork.UserRepository.GetUserID();


            var newObj = await unitOfWork.ArchiveObjectRepository.Add(new ArchiveObject
            {
                doc_number = data.new_doc_number,
                //status_dutyplan_object_id = obj.status_dutyplan_object_id,
                created_at = DateTime.Now,
                address = data.new_address,
                created_by = user_id,
            });


            foreach (var obj_id in data.object_ids)
            {
                var obj = await unitOfWork.ArchiveObjectRepository.GetOneByID(obj_id);
                obj.parent_id = newObj;
                await unitOfWork.ArchiveObjectRepository.Update(obj);
            }
            unitOfWork.Commit();

            return newObj;
        }

        public async Task Delete(int id)
        {
            await unitOfWork.ArchiveObjectRepository.Delete(id);
            unitOfWork.Commit();
        }
    }
}
