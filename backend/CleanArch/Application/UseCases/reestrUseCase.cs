using Application.Models;
using Application.Repositories;
using Application.Services;
using Domain.Entities;
using Newtonsoft.Json;

namespace Application.UseCases
{
    public class reestrUseCases
    {
        private readonly IUnitOfWork unitOfWork;
        private readonly IN8nService _n8nService;
        
        public reestrUseCases(IUnitOfWork unitOfWork, IN8nService n8nService)
        {
            this.unitOfWork = unitOfWork;
            _n8nService = n8nService;
        }

        public Task<List<reestr>> GetAll()
        {
            return unitOfWork.reestrRepository.GetAll();
        }
        public Task<reestr> GetOne(int id)
        {
            return unitOfWork.reestrRepository.GetOne(id);
        }
        public async Task<List<reestr>> GetAllMy()
        {
            var user_id = await unitOfWork.UserRepository.GetUserID();
            return await unitOfWork.reestrRepository.GetAllMy(user_id);
        }
        public async Task<reestr> Create(reestr domain)
        {
            var statuss = await unitOfWork.reestr_statusRepository.GetAll();
            var status_id = statuss.FirstOrDefault(x => x.code == "edited");
            domain.status_id = status_id?.id ?? 0;
            var user_id = await unitOfWork.UserRepository.GetUserID();
            domain.created_by = user_id;
            domain.created_at = DateTime.Now;
            var result = await unitOfWork.reestrRepository.Add(domain);
            domain.id = result;
            unitOfWork.Commit();


            var cb = 0; //TODO
            if (domain.created_by == 153) cb = 1449;
            if (domain.created_by == 453) cb = 1446;
            if (domain.created_by == 353) cb = 1729;

            try
            {



                await unitOfWork.MariaDbRepository.AddReestr(new Reestr
                {
                    cname = domain.name,
                    branch = 101,
                    status = domain.status_id == 1 ? 0 : 3,
                    uid = cb,
                    ymonth = ((domain.year ?? 0) - 2000) * 100 + (domain.month ?? 0)
                });
            }
            catch (Exception e)
            {
                Console.WriteLine($"{JsonConvert.SerializeObject(e)}");

            }


            return domain;
        }

        public async Task<reestr> Update(reestr domain)
        {
            var user_id = await unitOfWork.UserRepository.GetUserID();
            domain.updated_by = user_id;
            domain.updated_at = DateTime.Now;
            await unitOfWork.reestrRepository.Update(domain);
            unitOfWork.Commit();

            try
            {

                await unitOfWork.MariaDbRepository.UpdateReestr(new Reestr
                {
                    cname = domain.name,
                    status = domain.status_id == 1 ? 0 : 3,
                    ymonth = ((domain.year ?? 0) - 2000) * 100 + (domain.month ?? 0)
                });
            }
            catch (Exception e)
            {

                Console.WriteLine($"{JsonConvert.SerializeObject(e)}");

            }

            return domain;
        }

        public async Task<bool> ChangeReestrStatus(string status_code, int reestr_id)
        {
            var user_id = await unitOfWork.UserRepository.GetUserID();
            var reestr = await unitOfWork.reestrRepository.GetOne(reestr_id);
            var statuses = await unitOfWork.reestr_statusRepository.GetAll();
            var status = statuses.FirstOrDefault(x => x.code == status_code);
            if (status != null)
            {
                reestr.status_id = status.id;
                await unitOfWork.reestrRepository.Update(reestr);
                unitOfWork.Commit();

                try
                {


                    await unitOfWork.MariaDbRepository.UpdateReestr(new Reestr
                    {
                        cname = reestr.name,
                        status = reestr.status_id == 1 ? 0 : 3,
                        ymonth = ((reestr.year ?? 0) - 2000) * 100 + (reestr.month ?? 0)
                    });
                }
                catch (Exception e)
                {
                    Console.WriteLine($"{JsonConvert.SerializeObject(e)}");
                }

                return true;
            }
            return false;
        }

        public async Task<bool> ChangeAllApplicationStatusInReestr(int reestr_id)
        {
            var status = await unitOfWork.ApplicationStatusRepository.GetByCode("done"); //todo
            await unitOfWork.ApplicationRepository.ChangeAllStatuses(reestr_id, status.id);
            unitOfWork.Commit();
            return true;
        }

        public async Task<application_in_reestr> SetApplicationToReestr(int application_id, int reestr_id)
        {
            var user_id = await unitOfWork.UserRepository.GetUserID();
            var application_in_reestr = new application_in_reestr
            {
                application_id = application_id,
                reestr_id = reestr_id,
                created_at = DateTime.Now,
                created_by = user_id,
            };
            var result = await unitOfWork.application_in_reestrRepository.Add(application_in_reestr);
            application_in_reestr.id = result;
            
            var paidInvoices = await unitOfWork.ApplicationPaidInvoiceRepository.GetByIDApplication(application_id);
            foreach (var paidInvoice in paidInvoices)
            {
                var reestrPayed = new ApplicationInReestrPayed
                {
                    app_reestr_id = result,
                    date = paidInvoice.date.Value,
                    sum = paidInvoice.sum,
                    payment_identifier = paidInvoice.payment_identifier,
                    created_at = DateTime.Now,
                    created_by = user_id,
                };
                await unitOfWork.ApplicationInReestrPayedRepository.Add(reestrPayed); 
            }
            
            var payments = await unitOfWork.application_paymentRepository.GetByapplication_id(application_id);
            var groupedSums = payments
                .Where(p => p.structure_id.HasValue)
                .GroupBy(p => p.structure_id)
                .Select(g => new
                {
                    StructureId = g.Key,
                    TotalSum = g.Sum(p => p.sum)
                })
                .ToList();
            foreach (var groupedSum in groupedSums)
            {
                var reestrCalc = new ApplicationInReestrCalc
                {
                    app_reestr_id = result,
                    structure_id = groupedSum.StructureId.Value,
                    sum = groupedSum.TotalSum.Value,
                    total_sum = payments.Sum(p => p.sum.Value),
                    total_payed = paidInvoices.Sum(p => p.sum),
                    created_at = DateTime.Now,
                    created_by = user_id,
                };
                await unitOfWork.ApplicationInReestrCalcRepository.Add(reestrCalc); 
            }
            unitOfWork.Commit();

            try
            {


                var app = await unitOfWork.ApplicationRepository.GetOneByID(application_id);
                if (app.maria_db_statement_id != null) //TODO
                {
                    var calcs = await unitOfWork.application_paymentRepository.GetByapplication_id(application_id);
                    var otdSumMap = new Dictionary<int, decimal>();

                    // Группируем и суммируем данные по отделам
                    foreach (var c in calcs)
                    {
                        if (!unitOfWork.MariaDbRepository.MapOtdel().ContainsKey(c.structure_id.Value))
                        {
                            continue; //TODO
                        }
                        var otd = unitOfWork.MariaDbRepository.MapOtdel()[c.structure_id.Value];

                        // Если отдел уже есть в словаре, добавляем к его сумме
                        if (otdSumMap.ContainsKey(otd))
                        {
                            otdSumMap[otd] += c.sum ?? 0;
                        }
                        else
                        {
                            // Иначе создаем новую запись
                            otdSumMap[otd] = c.sum ?? 0;
                        }
                    }

                    // Теперь добавляем записи в реестр с уникальными id и просуммированными значениями
                    foreach (var pair in otdSumMap)
                    {
                        int otd = pair.Key;
                        decimal sum = pair.Value;

                        int sid = app.maria_db_statement_id.Value; // пример значения
                        int part1 = sid + 100000;
                        int part2 = otd + 100;
                        string id_str = part1.ToString() + part2.ToString();
                        var id = int.Parse(id_str);

                        await unitOfWork.MariaDbRepository.AddAppInReestr(new ReestrInApp
                        {
                            id = id,
                            otd = otd,
                            sum = (int)(Math.Round(sum, 2) * 100),
                            sid = app.maria_db_statement_id.Value
                        });
                    }

                    var pays = await unitOfWork.ApplicationPaidInvoiceRepository.GetByIDApplication(application_id);
                    var invoce = string.Join("<br><br>", pays.Select(x => x.payment_identifier + " от " + x.date?.ToString("dd.MM.yyyy")));
                    var amount = (int)(Math.Round(pays.Sum(x => x.sum), 2) * 100);
                    await unitOfWork.MariaDbRepository.AddPaymentInReestr(new PaymentInReestr
                    {
                        branch = 101,
                        sid = app.maria_db_statement_id.Value,
                        cid = reestr_id,
                        invoce = invoce,
                        amount = amount
                    });

                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"{JsonConvert.SerializeObject(ex)}");
            }

            return application_in_reestr;
        }        
        
        public async Task<N8nValidationResult> CheckApplicationBeforeRegistering(int application_id)
        {
            return await _n8nService.CheckApplicationBeforeRegisteringN8N(application_id);
        }

        public Task<PaginatedList<reestr>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.reestrRepository.GetPaginated(pageSize, pageNumber);
        }

        public async Task<int> Delete(int id)
        {
            await unitOfWork.reestrRepository.Delete(id);
            unitOfWork.Commit();
            return id;
        }



        public Task<List<reestr>> GetBystatus_id(int status_id)
        {
            return unitOfWork.reestrRepository.GetBystatus_id(status_id);
        }

    }
}
