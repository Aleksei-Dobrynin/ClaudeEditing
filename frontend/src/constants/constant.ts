// theme constant
export const gridSpacing = 3;
export const drawerWidth = 260;
export const appDrawerWidth = 320;

export const EOStructureCode = "ЕО"

export const ReestrCode = {
  EDITED: "edited",
  ACCEPTED: "accepted",
};

export const ContactTypes = {
  EMAIL: "email",
  TELEGRAM: "telegram",
  SMS: "sms"
}

export const applicationResolvedStatuses = [
  "draft", "service_requests", "ready_for_eo", "return_to_eo", "refusal_ready", "document_issued", "done",
]

export const SelectOrgStructureForWorklofw = {
  GIVE_DUPLICATE: "give_duplicate"
}

export const ErrorResponseCode = {
  NOT_FOUND: "NOT_FOUND",
  VALIDATION: "VALIDATION",
  LOGIC: "LOGIC",
  PERMISSION_ACCESS: "PERMISSION_ACCESS",
  ALREADY_UPDATED: "ALREADY_UPDATED",
  MESSAGE: "MESSAGE",
};
export const DOCUMENT_TYPES = {
  payment: "Payment",
  work: "work",
  urban_dev_docs: "urban_dev_docs",
};

export const APPLICATION_STATUSES = {
  review: "review", // Прием заявления
  done: "done", // Реализован
  refusal_issued: "refusal_issued", // Отказ выдан заявителю
  document_issued: "document_issued", // Пакет документов выдан заявителю
  refusal_ready: "refusal_ready", // Отказ готов к выдаче
  document_ready: "document_ready", // Пакет документов готов к выдаче
  draft: "draft", // Доработка
  service_requests: "service_requests", // Запросы в службу
  refusal_sent: "refusal_sent", // Отказ передан в ОЕ
  document_sent: "document_sent", // Пакет документов передан в ЕО
  preparation: "preparation", // Изучение материалов и подготовка
  executor_assignment: "executor_assignment", // Назначение исполнителя
  deleted: "deleted", // Удален
  return_to_eo: "return_to_eo", // Готово для ППО
  ready_for_eo: "ready_for_eo", // Отказ готово для ЕО
  rejection_ready: "rejection_ready", // Готовы для ЕО
  ready_for_ppo: "ready_for_ppo", // Возврат в ЕО
  to_technical_council: "to_technical_council", //Отправить на техсовет
  from_cabinet: "from_cabinet", //Из личного кабинета
  rejected_cabinet: "rejected_cabinet", //Отклонен в кабинете
  approved_cabinet: "approved_cabinet", //Отклонен в кабинете
};

export const RoleCode = {
  ADMIN: "admin",
  HEAD_STRUCTURE: "head_structure",
  FINANCIAL_PLAN: "financial_plan",
  REGISTRAR: "registrar",
  CLERK: "clerk",
  EMPLOYEE: "employee",
  ARCHIVE: "archive",
  DEPUTYCHIEF: "deputy_chief",
  SMM: "smm",
  DUTY_PLAN: "duty_plan",
  ACCOUNTANT: "accountant",
  LAWYER: "lawyer",
  SECRETARY: "secretary"
};

export const RoleMenu = {
  head_structure: [
    {
      group: "CustomPage",
      rows: ["Application", "MyTasks", "MyApps", "OrgTasks", "CustomSubscribtion", "CustomerDiscount", "DashboardHeadDepartment", "TechCouncil", "ArchiveObject"],
    },
  ],
  registrar: [
    {
      group: "CustomPage",
      rows: [
        "Application",
        "AppsFromCabinet",
        "AppNotification",
        "CustomSubscribtion",
      
      ],
    },
  ],
  secretary: [
    {
      group: "CustomPage",
      rows: [
        "Application",
        "AppNotification",
        "CustomSubscribtion",
        "TechCouncilSession",
        "TechCouncilArchiveSession"
      ],
    },
  ],
  clerk: [
    {
      group: "CustomPage",
      rows: ["AwaitingApplication"],
    },
  ],
  employee: [
    {
      group: "CustomPage",
      rows: ["Application", "MyTasks", "MyApps", "OrgTasks", "CustomSubscribtion", "ArchiveLog","ArchiveObject"],
    },
  ],
  accountant: [
    {
      group: "CustomPage",
      rows: ["Application", "Report", "CustomSubscribtion", "ArchiveLog","Income"],
    },
  ],
  lawyer: [
    {
      group: "CustomPage",
      rows: ["Application", ],
    },
    {
      group: "Admin",
      rows: ["LegalObject", "LegalRecordRegistry","LegalActRegistry","ArchiveObject"],
    }
  ],
  archive: [
    {
      group: "CustomPage",
      rows: ["ArchiveLog", "ArchitectureProcessToArchive","ArchiveObject"],
    },
  ],
  smm: [
    {
      group: "CustomPage",
      rows: ["TelegramAdmin"],
    },
  ],
  financial_plan: [
    {
      group: "CustomPage",
      rows: ["ApplicationFinPlan", "ReestrOtchet", "ReestrRealization", "ReestrTax", "Reestrs", "ReestrSvodnaya", "Report", "Income"],
    },
  ],
  duty_plan: [
    {
      group: "CustomPage",
      rows: ["ArchiveObject", "ArchitectureProcess"],
    },
  ],
  deputy_chief: [
    {
      group: "CustomPage",
      rows: ["Application", "CustomSubscribtion", "employee", "Dashboard", "AllTasks", "Reports", "TechCouncilSession","ArchiveObject",
        "JournalApplication",
        "DocumentJournals",
        "Services",
      ],
    },
    // {
    //   group: "Admin",
    //   rows: ["LegalObject", "LegalRecordRegistry","LegalActRegistry"],
    // },
    {
      group: "StaffingTable",
      rows: ["employee"],
    },
  ],
};

export const RoleMenuHeader = {
  head_structure: [
    {
      group: "CustomPage",
      rows: ["Application"],
    },
    {
      group: "CustomPage",
      rows: ["AppFilter"],
    },
    {
      group: "CustomPage",
      rows: ["DashboardHeadDepartment"],
    },
    {
      group: "CustomPage",
      rows: ["OrgTasks"],
    },
    {
      group: "CustomPage",
      rows: ["StructureReports"],
    },
    {
      group: "CustomPage",
      rows: ["StructureReportsConfig"],
    },
    {
      group: "CustomPage",
      rows: ["MyTasks"],
    },
    {
      group: "CustomPage",
      rows: ["ArchiveObject"],
    },
  ],
  registrar: [
    {
      group: "CustomPage",
      rows: ["Application", "AppNotification", "AppsFromCabinet"],
    },
  ],
  clerk: [
    //   {
    //     group: "CustomPage",
    //     rows: ["AwaitingApplication"],
    // }
  ],
  employee: [
    {
      group: "CustomPage",
      rows: ["Application"],
    },
    {
      group: "CustomPage",
      rows: ["AppFilter"],
    },
    {
      group: "CustomPage",
      rows: ["DashboardHeadDepartment"],
    },
    {
      group: "CustomPage",
      rows: ["MyTasks"],
    },
    {
      group: "CustomPage",
      rows: ["OrgTasks"],
    },
    {
      group: "CustomPage",
      rows: ["StructureReports"],
    },
    {
      group: "CustomPage",
      rows: ["ArchiveLog"],
    },
    {
      group: "CustomPage",
      rows: ["ArchiveObject"],
    },
  ],
  accountant: [
    {
      group: "CustomPage",
      rows: ["Application"],
    },
    {
      group: "CustomPage",
      rows: ["Report"],
    },
    {
      group: "CustomPage",
      rows: ["AppFilter"],
    },
  ],
  lawyer:[
    {
        group: "CustomPage",
        rows: ["Application"],
    },
    {
      group: "Admin",
      rows: ["LegalObject", "LegalRecordRegistry","LegalActRegistry"],
    },
    {
      group: "CustomPage",
      rows: ["ArchiveObject"],
    },
 ],
  archive: [
    {
      group: "CustomPage",
      rows: ["ArchiveLog", "ArchitectureProcessToArchive"],
    },
    {
      group: "CustomPage",
      rows: ["ArchiveObject"],
    },
  ],
  smm: [
    {
      group: "CustomPage",
      rows: ["TelegramAdmin"],
    },
  ],
  deputy_chief: [
    {
      group: "CustomPage",
      rows: ["Application"],
    },
    {
      group: "StaffingTable",
      rows: ["employee"],
    },
    {
      group: "CustomPage",
      rows: ["Dashboard", "AllTasks", "Reports"],
    },
    {
      group: "CustomPage",
      rows: ["ArchiveObject"],
    },
  ],
  financial_plan: [
    {
      group: "CustomPage",
      rows: ["ApplicationFinPlan"],
    },
    {
      group: "CustomPage",
      rows: ["Reestrs", "ReestrSvodnaya", "ReestrOtchet", "ReestrRealization", "ReestrTax", "Report"],
    },
  ],
  duty_plan: [
    {
      group: "CustomPage",
      rows: ["ArchiveObject", "ArchitectureProcess"],
    },
  ],
  secretary: [
    {
      group: "CustomPage",
      rows: [
        "Application",
        "AppNotification",
        "TechCouncilSession",
        "TechCouncilArchiveSession"
      ],
    },
  ],
};


export const MONTHS = [
  { id: 1, name: "Январь" },
  { id: 2, name: "Февраль" },
  { id: 3, name: "Март" },
  { id: 4, name: "Апрель" },
  { id: 5, name: "Май" },
  { id: 6, name: "Июнь" },
  { id: 7, name: "Июль" },
  { id: 8, name: "Август" },
  { id: 9, name: "Сентябрь" },
  { id: 10, name: "Октябрь" },
  { id: 11, name: "Ноябрь" },
  { id: 12, name: "Декабрь" },
]