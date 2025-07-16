using Application.Models;
using Application.Repositories;
using Domain.Entities;
using Newtonsoft.Json;

namespace Application.UseCases
{
    public class application_in_reestrUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public application_in_reestrUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public Task<List<application_in_reestr>> GetAll()
        {
            return unitOfWork.application_in_reestrRepository.GetAll();
        }
        public Task<application_in_reestr> GetOne(int id)
        {
            return unitOfWork.application_in_reestrRepository.GetOne(id);
        }
        public async Task<application_in_reestr> Create(application_in_reestr domain)
        {
            var user_id = await unitOfWork.UserRepository.GetUserID();
            domain.created_by = user_id;
            domain.created_at = DateTime.Now;
            var result = await unitOfWork.application_in_reestrRepository.Add(domain);
            domain.id = result;
            unitOfWork.Commit();
            return domain;
        }

        public async Task<application_in_reestr> Update(application_in_reestr domain)
        {
            var user_id = await unitOfWork.UserRepository.GetUserID();
            domain.updated_by = user_id;
            domain.updated_at = DateTime.Now;
            await unitOfWork.application_in_reestrRepository.Update(domain);
            unitOfWork.Commit();
            return domain;
        }

        public Task<PaginatedList<application_in_reestr>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.application_in_reestrRepository.GetPaginated(pageSize, pageNumber);
        }

        public async Task<int> Delete(int id)
        {
            await unitOfWork.application_in_reestrRepository.Delete(id);
            unitOfWork.Commit();
            return id;
        }

        public async Task<int> DeleteByAppId(int application_id)
        {
            var apps = await unitOfWork.application_in_reestrRepository.GetByAppId(application_id);
            foreach (var app in apps)
            {
                //await unitOfWork.ApplicationInReestrCalcRepository.DeleteByAppReestrId(app.id);
                //await unitOfWork.ApplicationInReestrPayedRepository.DeleteByAppReestrId(app.id);
                await unitOfWork.application_in_reestrRepository.Delete(app.id);
            }
            unitOfWork.Commit();

            try
            {
                var ap = await unitOfWork.ApplicationRepository.GetOneByID(application_id);
                if (ap.maria_db_statement_id != null) //TODO
                {
                    await unitOfWork.MariaDbRepository.DeleteAppInReestr(ap.maria_db_statement_id.Value);
                    await unitOfWork.MariaDbRepository.DeletePayInReestr(ap.maria_db_statement_id.Value);
                }
            }
            catch (Exception e)
            {
                Console.WriteLine($"{JsonConvert.SerializeObject(e)}");
            }

            return apps.Count;
        }



        public Task<List<application_in_reestr>> GetByreestr_id(int reestr_id)
        {
            return unitOfWork.application_in_reestrRepository.GetByreestr_id(reestr_id);
        }

        public Task<List<TaxOtchetData>> GetTaxReport(int year, int month, string status)
        {
            return unitOfWork.application_in_reestrRepository.GetTaxReport(year, month, status);
        }


        public async Task<ReestrOtchetData> GetOtchetData(int? reestr_id, int year, int month, string status)
        {
            var res = new ReestrOtchetData();

            if (reestr_id != null)
            {
                var reestr = await unitOfWork.reestrRepository.GetOne(reestr_id.Value);
                res.reestr = reestr;
            }

            var all_structures = await unitOfWork.OrgStructureRepository.GetAll();

            List<ReestrOtchetApplicationData> apps = new List<ReestrOtchetApplicationData>();

            if (reestr_id != null)
            {
                apps = (await unitOfWork.application_in_reestrRepository.GetByreestr_idWithApplication(reestr_id.Value));
            }
            else
            {
                apps = (await unitOfWork.application_in_reestrRepository.GetSvodnaya(year, month, status));
            }

            var appIds = apps.Select(x => x.id).ToList();
            var all_calcs = await unitOfWork.application_paymentRepository.GetByApplicationIds(appIds);
            var all_oplata = await unitOfWork.ApplicationPaidInvoiceRepository.GetOneByApplicationIds(appIds);


            var fizic_apps = apps.Where(x => x.is_organization != true).ToList();
            var your_apps = apps.Where(x => x.is_organization).ToList();

            var structure_ids = new List<int>();

            var index = 1;
            your_apps.ForEach(app =>
            {
                app.index = index;
                index++;

                var calcs = all_calcs.Where(x => x.application_id == app.id).ToList();
                var oplatas = all_oplata.Where(x => x.application_id == app.id).ToList();
                app.sum = calcs.Sum(x => x.sum) ?? 0;
                app.sum_oplata = oplatas.Sum(x => x.sum);
                app.number_kvitancii = string.Join(", ", oplatas.Select(x => x.payment_identifier + " от " + x.date?.ToString("dd.MM.yyyy")));

                app.otdel_calcs = calcs.GroupBy(x => x.structure_id).Select(x => new
                ReestrOtchetOtdelData
                {
                    otdel_id = x.Key ?? 0,
                    sum = x.Sum(x => x.sum) ?? 0
                }).ToList();
                structure_ids.AddRange(calcs.Select(x => x.structure_id ?? 0).Distinct().ToList());


            });

            index = 1;
            fizic_apps.ForEach(app =>
            {
                app.index = index;
                index++;

                var calcs = all_calcs.Where(x => x.application_id == app.id).ToList();
                var oplatas = all_oplata.Where(x => x.application_id == app.id).ToList();
                app.sum = calcs.Sum(x => x.sum) ?? 0;
                app.sum_oplata = oplatas.Sum(x => x.sum);
                app.number_kvitancii = string.Join(", ", oplatas.Select(x => x.payment_identifier + " от " + x.date?.ToString("dd.MM.yyyy")));

                app.otdel_calcs = calcs.GroupBy(x => x.structure_id).Select(x => new
                ReestrOtchetOtdelData
                {
                    otdel_id = x.Key ?? 0,
                    sum = x.Sum(x => x.sum) ?? 0
                }).ToList();
                structure_ids.AddRange(calcs.Select(x => x.structure_id ?? 0).Distinct().ToList());
            });

            structure_ids = structure_ids.Distinct().ToList();

            res.structures = all_structures.Where(x => structure_ids.Contains(x.id) && x.order_number != null).OrderBy(x => x.order_number).ToList();


            var your_sum = your_apps.Sum(x => x.sum_oplata);
            var fizic_sum = fizic_apps.Sum(x => x.sum_oplata);

            res.fiz_lica = fizic_apps;
            res.your_lica = your_apps;
            res.your_summa = your_sum;
            res.fiz_summa = fizic_sum;
            res.all_summa = your_sum + fizic_sum;

            return res;
        }

    }
}
