using Application.Models;
using Application.Repositories;
using DocumentFormat.OpenXml;
using DocumentFormat.OpenXml.Drawing;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Spreadsheet;
using Domain;
using Domain.Entities;
using FluentResults;
using Newtonsoft.Json;
using System.Reflection;
using System.Text.RegularExpressions;

namespace Application.UseCases
{
    public class S_DocumentTemplateUseCases
    {
        private readonly IUnitOfWork unitOfWork;
        public S_DocumentTemplateUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }
        
        public Task<List<S_DocumentTemplate>> GetAll()
        {
            return unitOfWork.S_DocumentTemplateRepository.GetAll();
        }
        public Task<List<S_DocumentTemplate>> GetByType(string type)
        {
            return unitOfWork.S_DocumentTemplateRepository.GetByType(type);
        }

        public async Task<List<S_DocumentTemplate>> GetMyStructureReports()
        {

            var user = await unitOfWork.EmployeeRepository.GetUser();
            var head_structures = (await unitOfWork.EmployeeInStructureRepository.HeadOfStructures(user.id)).Select(x => x.id).ToList();


            var res = await unitOfWork.S_DocumentTemplateRepository.GetStructureReports(head_structures);
            return res;
        }
        public async Task<List<S_DocumentTemplate>> GetByApplicationType()
        {
            var type = await unitOfWork.S_DocumentTemplateTypeRepository.GetOneByCode("application");
            var res = await unitOfWork.S_DocumentTemplateRepository.GetByidDocumentType(type.id);
            return res;
        }

        public async Task<List<S_DocumentTemplate>> GetByDefaultCalcType()
        {
            var type = await unitOfWork.S_DocumentTemplateTypeRepository.GetOneByCode("default_calc");
            var res = await unitOfWork.S_DocumentTemplateRepository.GetByidDocumentType(type.id);
            return res;
        }
        
        public async Task<List<S_DocumentTemplate>> GetByApplicationTypeAndID(int idApplication)
        {
            var app = await unitOfWork.S_DocumentTemplateRepository.GetByApplicationIsOrganization(idApplication);

            var type = await unitOfWork.S_DocumentTemplateTypeRepository.GetOneByCode("application");
            var yur = await unitOfWork.S_DocumentTemplateTypeRepository.GetOneByCode("app_yur");
            var phys = await unitOfWork.S_DocumentTemplateTypeRepository.GetOneByCode("app_phys");


            var templatesForType = await unitOfWork.S_DocumentTemplateRepository.GetByApplicationTypeAndID(type.id, idApplication);
            var templatesForYur = await unitOfWork.S_DocumentTemplateRepository.GetByApplicationTypeAndID(yur.id, idApplication);
            var templatesForPhys = await unitOfWork.S_DocumentTemplateRepository.GetByApplicationTypeAndID(phys.id, idApplication);

            var templatesToConcat = app.is_organization ? templatesForYur : templatesForPhys;

            var result = templatesForType.Concat(templatesToConcat).ToList();
            return result;
        }

        public Task<S_DocumentTemplate> GetOne(int id)
        {
            return unitOfWork.S_DocumentTemplateRepository.GetOne(id);
        }
        public async Task<S_DocumentTemplate> Create(S_DocumentTemplate domain)
        {
            var result = await unitOfWork.S_DocumentTemplateRepository.Add(domain);
            domain.id = result;

            foreach (var structure in domain.orgStructures)
            {
                org_structure_templates template = new org_structure_templates
                {
                    created_at = DateTime.Now,
                    updated_at = DateTime.Now,
                    structure_id = structure,
                    template_id = domain.id,
                };

                await unitOfWork.org_structure_templatesRepository.Add(template);
            }

            foreach (var x in domain.translations)
            {
                x.id = 0;
                x.idDocumentTemplate = result;
                await unitOfWork.S_DocumentTemplateTranslationRepository.Add(x);
            }

            unitOfWork.Commit();
            return domain;
        }

        public async Task<S_DocumentTemplate> Update(S_DocumentTemplate domain)
        {

            await unitOfWork.S_DocumentTemplateRepository.Update(domain);


            var existingUnits = await unitOfWork.org_structure_templatesRepository.GetBytemplate_id(domain.id);

            var existingUnitIds = existingUnits.Select(u => u.structure_id).ToList();


            foreach (var structure in domain.orgStructures)
            {
                if (!existingUnitIds.Contains(structure))
                {
                    org_structure_templates template = new org_structure_templates
                    {
                        created_at = DateTime.Now,
                        updated_at = DateTime.Now,
                        structure_id = structure,
                        template_id = domain.id,
                    };

                    await unitOfWork.org_structure_templatesRepository.Add(template);
                }
                else
                {
                    existingUnitIds.Remove(structure);
                }
            }

            foreach (var idToRemove in existingUnitIds)
            {
                var unitToRemove = existingUnits.FirstOrDefault(u => u.structure_id == idToRemove);
                if (unitToRemove != null)
                {
                    await unitOfWork.org_structure_templatesRepository.Delete(unitToRemove.id);
                    unitOfWork.Commit();
                }
            }
            unitOfWork.Commit();

            foreach (var translation in domain.translations)
            {

                translation.idDocumentTemplate = domain.id;
                if (translation.id == 0)
                {
                    await unitOfWork.S_DocumentTemplateTranslationRepository.Add(translation);
                    unitOfWork.Commit();
                }
                else
                {
                    await unitOfWork.S_DocumentTemplateTranslationRepository.Update(translation);
                    unitOfWork.Commit();
                }
            }

            //domain.translations.ForEach(async x =>
            //{
            //});

            return domain;
        }

        public Task<PaginatedList<S_DocumentTemplate>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.S_DocumentTemplateRepository.GetPaginated(pageSize, pageNumber);
        }

        public async Task<int> Delete(int id)
        {
            //var transla = await unitOfWork.S_DocumentTemplateTranslationRepository.GetByidDocumentTemplate(id);
            //transla.ForEach(async (x) =>
            //{
            //});
            await unitOfWork.S_DocumentTemplateTranslationRepository.DeleteByTemplate(id);

            await unitOfWork.S_DocumentTemplateRepository.Delete(id);
            unitOfWork.Commit();
            return id;
        }



        public Task<List<S_DocumentTemplate>> GetByidCustomSvgIcon(int idCustomSvgIcon)
        {
            return unitOfWork.S_DocumentTemplateRepository.GetByidCustomSvgIcon(idCustomSvgIcon);
        }

        public Task<List<S_DocumentTemplate>> GetByidDocumentType(int idDocumentType)
        {
            return unitOfWork.S_DocumentTemplateRepository.GetByidDocumentType(idDocumentType);
        }
        public async Task<Result<string>> GetFilledReport(GetFilledReportRequest model)
        {

            var p = new Dictionary<string, object> { };
            DateTime start, end;
            var report_title = "Отчет о производственной деятельности ГУ\"Бишкекглавархитектура\" за ";
            var start_month = 0;
            var end_month = 12;

            // Определяем временные интервалы на основе filter_type
            if (model.filter_type == "month")
            {
                start = new DateTime(model.year, model.month, 1);
                end = start.AddMonths(1); // Последний день месяца
                report_title += GetMonthName(model.month) + ", " + model.year + " года";
                start_month = model.month;
                end_month = model.month;
            }
            else if (model.filter_type == "kvartal")
            {
                int startMonth = (model.kvartal - 1) * 3 + 1;
                start = new DateTime(model.year, startMonth, 1);
                end = start.AddMonths(3); // Последний день квартала
                report_title += model.kvartal + "-й квартал, " + model.year + " года";
                start_month = startMonth;
                end_month = startMonth + 2;
            }
            else if (model.filter_type == "halfYear")
            {
                int startMonth = model.polgoda == 1 ? 1 : 7;
                start = new DateTime(model.year, startMonth, 1);
                end = start.AddMonths(6); // Последний день полугодия
                if(model.polgoda == 1)
                {
                    report_title += "первое полугодие, " + model.year + " года";
                }
                else
                {
                    report_title += "второе полугодие, " + model.year + " года";
                }
                start_month = startMonth;
                end_month = startMonth + 5;
            }
            else if (model.filter_type == "9month")
            {
                start = new DateTime(model.year, 1, 1);
                end = start.AddMonths(9); // Последний день 9-го месяца
                report_title += "9 месяцев, " + model.year + " года";
                start_month = 1;
                end_month = 9;
            }
            else if (model.filter_type == "year")
            {
                start = new DateTime(model.year, 1, 1);
                end = new DateTime(model.year + 1, 1, 1); // Последний день года
                report_title += model.year + " год";
                start_month = 1;
                end_month = 12;
            }
            else
            {
                return Result.Fail(new LogicError("Такого filter_type не существует!"));
            }





            p.Add("report_title", report_title);
            p.Add("report_year", model.year);

            p.Add("dateStart", start);
            p.Add("dateEnd", end);

            p.Add("startMonth", start_month);
            p.Add("endMonth", end_month);

            var res = await GetFilledDocumentHtml(model.template_id, model.language, p);

            return res;
        }


        public async Task<Result<string>> GetFilledDocumentHtmlByCode(string template_code, string languageCode, Dictionary<string, object> parameters)
        {
            var temp = await unitOfWork.S_DocumentTemplateRepository.GetOneByCode(template_code);
            return await GetFilledDocumentHtml(temp.id, languageCode, parameters);
        }
        public async Task<Result<string>> GetFilledDocumentHtml(int idTemplate, string languageCode, Dictionary<string, object> parameters)
        {
            var template = await unitOfWork.S_DocumentTemplateRepository.GetOneByLanguage(idTemplate, languageCode);
            if (template?.S_DocumentTemplateTranslation == null || template.S_DocumentTemplateTranslation.template == null)
            {
                return Result.Fail(new LogicError("Шаблон документа не найден или нет перевода!"));
            }
            var placeholdernames = FindPlaceholders(template.S_DocumentTemplateTranslation.template);

            var allplaceholders = await unitOfWork.S_PlaceHolderTemplateRepository.GetAll();
            var placeholders = allplaceholders.Where(x => placeholdernames.Contains(x.name)).ToList();

            var queriedPlaceholders = new Dictionary<string, string>();

            foreach (var item in placeholders)
            {
                var result = await unitOfWork.S_QueryRepository.CallQuery(item.idQuery, parameters);

                if (item.S_PlaceHolderType.code == "text")
                {
                    if(result.Count != 0)
                    {
                        var pl = (IDictionary<string, object>)result.First();
                        queriedPlaceholders.Add(item.name, pl[item.value]?.ToString());
                    }
                }
                else if (item.S_PlaceHolderType.code == "comma")
                {
                    var fields = item.value.Split(',');
                    var res_text = "";
                    foreach (var field in fields)
                    {
                        var pl = (IDictionary<string, object>)result.First();
                        if (pl.ContainsKey(field))
                        {
                            res_text += pl[field]?.ToString() + ", ";
                        }
                    }
                    queriedPlaceholders.Add(item.name, res_text);
                }
                else if (item.S_PlaceHolderType.code == "table")
                {
                    var fields = item.value?.Split(',');
                    var heads = item.code?.Split(',');
                    var res_text = "\r\n   <table border=1 width=\"100%\" style=\"border-collapse:collapse;\">";

                    if (heads != null && heads.Length > 0)
                    {
                        res_text += "\r\n        <thead>";
                        res_text += "\r\n            <tr>";

                        foreach (var head in heads)
                        {
                            res_text += "\r\n                <th style=\"border-collapse:collapse; border: 1px solid black;\">";
                            res_text += head;
                            res_text += "\r\n                </th>";
                        }

                        res_text += "\r\n            </tr>";
                        res_text += "\r\n        <thead>";
                    }

                    res_text += "\r\n        <tbody>";
                    foreach (var value in result)
                    {
                        res_text += "\r\n            <tr>";
                        foreach (var field in fields)
                        {
                            res_text += "\r\n                <td style=\"border-collapse:collapse; border: 1px solid black;\">";
                            var pl = (IDictionary<string, object>)value;
                            if (pl.ContainsKey(field))
                            {
                                res_text += pl[field]?.ToString();
                            }
                            res_text += "\r\n                </td>";
                        }
                        res_text += "\r\n            </tr>";
                        res_text += "";
                    }
                    res_text += "\r\n        </tbody>\r\n    </table>\r\n";
                    queriedPlaceholders.Add(item.name, res_text);
                }else if(item.S_PlaceHolderType.code == "numbering")
                {
                    var fields = item.value?.Split(',');
                    var res_text = "";
                    var j = 1;
                    foreach (var value in result)
                    {
                        var val = (IDictionary<string, object>)value;

                        res_text += j.ToString() + ") " + val[item.value] + "<br /> &emsp;";
                        j++;
                    }
                    queriedPlaceholders.Add(item.name, res_text);
                }

            }

            string res = ReplacePlaceholders(template.S_DocumentTemplateTranslation.template, queriedPlaceholders);

            return res;
        }



        public static List<string> FindPlaceholders(string html)
        {
            string pattern = @"\{([^\}]+)\}";

            List<string> placeholders = new List<string>();

            MatchCollection matches = Regex.Matches(html, pattern);
            foreach (Match match in matches)
            {
                placeholders.Add(match.Groups[1].Value);
            }
            return placeholders;
        }
        public static string ReplacePlaceholders(string html, Dictionary<string, string> replacements)
        {
            string pattern = @"\{([^\}]+)\}";

            // ������������� Regex.Replace � MatchEvaluator ��� ������ ��������� �������������
            return Regex.Replace(html, pattern, match =>
            {
                // ���������� ����� ������������ �� ����������
                string key = match.Groups[1].Value;

                // ��������, ���������� �� ������ ��� ������� �����
                if (replacements.TryGetValue(key, out string replacement))
                {
                    return replacement;
                }

                // ���� ������ �� �������, ���������� ����������� ��� ���������
                return match.Value;
            });
        }


        private static string GetMonthName(int month)
        {
            if (month == 1) return "Январь";
            if (month == 2) return "Февраль";
            if (month == 3) return "Март";
            if (month == 4) return "Апрель";
            if (month == 5) return "Май";
            if (month == 6) return "Июнь";
            if (month == 7) return "Июль";
            if (month == 8) return "Август";
            if (month == 9) return "Сентябрь";
            if (month == 10) return "Октябрь";
            if (month == 11) return "Ноябрь";
            if (month == 12) return "Декабрь";
            return "";
        }

        public Task<List<S_DocumentTemplate>> GetApplicationTemplate()
        {
            return unitOfWork.S_DocumentTemplateRepository.GetApplicationTemplate();
        }
        
        public async Task<List<string>> GetApplicationDocument(int template_id, string language_code, List<int> selected_apps)
        {
            var result = new List<string>();
            foreach (var app in selected_apps)
            {
                var queriedPlaceholders = new Dictionary<string, object>();
                queriedPlaceholders.Add("application_id", app);
                var res = await GetFilledDocumentHtml(template_id, language_code, queriedPlaceholders);
                result.Add(res.Value);
            }
            return result;
        }
    }
}
