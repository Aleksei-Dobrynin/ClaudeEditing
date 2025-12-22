// Мок данных для дополнительных услуг

export const mockAdditionalServices = {
  status: 200,
  data: [
    {
      id: 1,
      application_id: 12345,
      additional_service_id: 42,
      service_name: "Топосъемка",
      added_at_step_id: 103,
      added_at_step_name: "Экспертиза",
      insert_after_step_id: 103,
      add_reason: "Для проведения экспертизы фасада необходимы данные топосъемки территории",
      requested_by: 5,
      requested_by_name: "Иванов Иван Иванович",
      requested_at: "2024-12-09T10:30:00Z",
      status: "active",
      first_added_step_id: 501,
      last_added_step_id: 505,
      completed_at: null,
    },
    {
      id: 2,
      application_id: 12345,
      additional_service_id: 43,
      service_name: "Историческая экспертиза",
      added_at_step_id: 105,
      added_at_step_name: "Утверждение",
      insert_after_step_id: 105,
      add_reason: "Требуется историческая экспертиза объекта",
      requested_by: 5,
      requested_by_name: "Иванов Иван Иванович",
      requested_at: "2024-12-10T14:20:00Z",
      status: "completed",
      first_added_step_id: 506,
      last_added_step_id: 509,
      completed_at: "2024-12-11T16:45:00Z",
    },
  ],
};

export const mockServicesForAdding = {
  status: 200,
  data: [
    {
      id: 42,
      name: "Топосъемка",
      description: "Геодезическая топографическая съемка территории",
    },
    {
      id: 43,
      name: "Историческая экспертиза",
      description: "Экспертиза историко-культурной ценности объекта",
    },
    {
      id: 44,
      name: "Геодезическая съемка",
      description: "Геодезические изыскания",
    },
    {
      id: 45,
      name: "Экологическая экспертиза",
      description: "Оценка воздействия на окружающую среду",
    },
  ],
};

export const mockServiceSteps = {
  status: 200,
  data: [
    {
      id: 201,
      name: "Прием заявки на топосъемку",
      order_number: 1,
      description: "Регистрация заявки на проведение топосъемки",
    },
    {
      id: 202,
      name: "Выезд на объект",
      order_number: 2,
      description: "Выезд специалиста на место проведения работ",
    },
    {
      id: 203,
      name: "Выполнение топосъемки",
      order_number: 3,
      description: "Проведение топографических измерений",
    },
    {
      id: 204,
      name: "Обработка данных",
      order_number: 4,
      description: "Камеральная обработка полученных данных",
    },
    {
      id: 205,
      name: "Формирование акта",
      order_number: 5,
      description: "Подготовка итогового акта топосъемки",
    },
  ],
};

export const mockAddStepsResponse = {
  status: 200,
  data: {
    id: 3,
    application_id: 12345,
    additional_service_id: 42,
    status: "active",
    first_added_step_id: 510,
    last_added_step_id: 514,
  },
};

// Моковые данные: Роли
export const mockRoles = {
  1: { id: 1, name: "Начальник отдела" },
  2: { id: 2, name: "Главный специалист" },
  3: { id: 3, name: "Специалист" },
  4: { id: 4, name: "Директор" },
  5: { id: 5, name: "Юрист" },
  6: { id: 6, name: "Бухгалтер" },
};

// Моковые данные: Отделы
export const mockDepartments = {
  1: { id: 1, name: "Отдел приема документов" },
  2: { id: 2, name: "Отдел проверки" },
  3: { id: 3, name: "Юридический отдел" },
  4: { id: 4, name: "Финансовый отдел" },
  5: { id: 5, name: "Административный отдел" },
};

// Моковые данные: Услуги с шагами и подписантами
export const mockServicesWithSigners = {
  status: 200,
  data: [
    // 1. Правовой анализ
    {
      id: 201,
      service_id: 2,
      order: 1,
      name: "Правовой анализ документов",
      description: "Проверка юридической чистоты документов",
      estimated_duration_hours: 16,
      responsible_department_id: 3,
      responsible_department_name: "Юридический отдел",
      signers: [
        {
          id: 5,
          order: 1,
          role_id: 5,
          role_name: "Юрист",
          department_id: 3,
          department_name: "Юридический отдел",
          is_required: true,
          description: "Проведение правового анализа",
        },
        {
          id: 6,
          order: 2,
          role_id: 2,
          role_name: "Главный специалист",
          department_id: 3,
          department_name: "Юридический отдел",
          is_required: true,
          description: "Проверка юридического заключения",
        },
        {
          id: 7,
          order: 3,
          role_id: 1,
          role_name: "Начальник отдела",
          department_id: 3,
          department_name: "Юридический отдел",
          is_required: true,
          description: "Утверждение юридического заключения",
        },
      ],
    },

    // 2. Подготовка правового заключения
    {
      id: 202,
      service_id: 2,
      order: 2,
      name: "Подготовка правового заключения",
      description: "Составление официального заключения",
      estimated_duration_hours: 4,
      responsible_department_id: 3,
      responsible_department_name: "Юридический отдел",
      signers: [
        {
          id: 8,
          order: 1,
          role_id: 5,
          role_name: "Юрист",
          department_id: 3,
          department_name: "Юридический отдел",
          is_required: true,
          description: "Составление заключения",
        },
        {
          id: 9,
          order: 2,
          role_id: 4,
          role_name: "Директор",
          department_id: 3,
          department_name: "Юридический отдел",
          is_required: true,
          description: "Финальное утверждение",
        },
      ],
    },

    // 3. Проверка фактических данных
    {
      id: 203,
      service_id: 2,
      order: 3,
      name: "Проверка фактических данных",
      description: "Сверка предоставленных данных с реальными обстоятельствами",
      estimated_duration_hours: 6,
      responsible_department_id: 4,
      responsible_department_name: "Финансовый отдел",
      signers: [
        {
          id: 10,
          order: 1,
          role_id: 6,
          role_name: "Бухгалтер",
          department_id: 4,
          department_name: "Финансовый отдел",
          is_required: true,
          description: "Анализ финансовых документов",
        },
        {
          id: 11,
          order: 2,
          role_id: 2,
          role_name: "Главный специалист",
          department_id: 4,
          department_name: "Финансовый отдел",
          is_required: true,
          description: "Проверка соответствия данных",
        },
      ],
    },

    // 4. Согласование с руководством
    {
      id: 204,
      service_id: 2,
      order: 4,
      name: "Согласование с руководством",
      description: "Предварительное согласование решения руководящим составом",
      estimated_duration_hours: 3,
      responsible_department_id: 5,
      responsible_department_name: "Административный отдел",
      signers: [
        {
          id: 12,
          order: 1,
          role_id: 1,
          role_name: "Начальник отдела",
          department_id: 5,
          department_name: "Административный отдел",
          is_required: true,
          description: "Рассмотрение решения",
        },
        {
          id: 13,
          order: 2,
          role_id: 4,
          role_name: "Директор",
          department_id: 5,
          department_name: "Административный отдел",
          is_required: true,
          description: "Предварительное утверждение",
        },
      ],
    },

    // 5. Финальная экспертиза
    {
      id: 205,
      service_id: 2,
      order: 5,
      name: "Финальная экспертиза",
      description: "Окончательная проверка перед выпуском итогового документа",
      estimated_duration_hours: 5,
      responsible_department_id: 6,
      responsible_department_name: "Экспертный отдел",
      signers: [
        {
          id: 14,
          order: 1,
          role_id: 7,
          role_name: "Эксперт",
          department_id: 6,
          department_name: "Экспертный отдел",
          is_required: true,
          description: "Проведение итоговой экспертизы",
        },
        {
          id: 15,
          order: 2,
          role_id: 1,
          role_name: "Начальник отдела",
          department_id: 6,
          department_name: "Экспертный отдел",
          is_required: true,
          description: "Утверждение результатов экспертизы",
        },
      ],
    },

    // 6. Формирование итогового акта
    {
      id: 206,
      service_id: 2,
      order: 6,
      name: "Формирование итогового акта",
      description: "Подготовка и передача финального юридического акта",
      estimated_duration_hours: 2,
      responsible_department_id: 3,
      responsible_department_name: "Юридический отдел",
      signers: [
        {
          id: 16,
          order: 1,
          role_id: 5,
          role_name: "Юрист",
          department_id: 3,
          department_name: "Юридический отдел",
          is_required: true,
          description: "Составление итогового акта",
        },
        {
          id: 17,
          order: 2,
          role_id: 4,
          role_name: "Директор",
          department_id: 3,
          department_name: "Юридический отдел",
          is_required: true,
          description: "Финальное утверждение акта",
        },
      ],
    },
  ]
};
