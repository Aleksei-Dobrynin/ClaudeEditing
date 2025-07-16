-- Dictionary

create table district
(
    id               serial
        primary key,
    name             text,
    description      text,
    code             text,
    created_at       timestamp,
    created_by       integer,
    updated_at       timestamp,
    updated_by       integer,
    name_kg          text,
    description_kg   text,
    text_color       text,
    background_color text
);

create table application_status
(
    id               serial
        primary key,
    name             text,
    description      text,
    code             text,
    created_at       timestamp,
    updated_at       timestamp,
    created_by       integer,
    updated_by       integer,
    name_kg          text,
    status_color     text,
    description_kg   text,
    text_color       text,
    background_color text
);

create table work_schedule
(
    id         serial
        primary key,
    name       text,
    is_active  boolean,
    year       integer,
    created_at timestamp,
    created_by integer,
    updated_at timestamp,
    updated_by integer
);

create table country
(
    id               serial
        primary key,
    name             text,
    code             text,
    description      text,
    created_at       timestamp,
    created_by       integer,
    updated_at       timestamp,
    updated_by       integer,
    name_kg          text,
    description_kg   text,
    text_color       text,
    background_color text,
    icon_svg         text,
    iso_code         text,
    is_default       boolean
);

create table contact_type
(
    id               serial
        primary key,
    name             text,
    description      text,
    code             text,
    additional       text,
    regex            text,
    created_at       timestamp,
    created_by       integer,
    updated_at       timestamp,
    updated_by       integer,
    name_kg          text,
    description_kg   text,
    text_color       text,
    background_color text
);

create table service
(
    id                   serial
        constraint "XPKУслуги"
            primary key,
    name                 text,
    short_name           text,
    code                 text,
    description          text,
    day_count            integer,
    workflow_id          integer,
    price                real,
    name_kg              varchar,
    name_long            varchar,
    name_long_kg         varchar,
    name_statement       varchar,
    name_statement_kg    varchar,
    name_confirmation    varchar,
    name_confirmation_kg varchar,
    is_active            boolean,
    created_at           timestamp,
    created_by           integer,
    updated_at           timestamp,
    updated_by           integer,
    description_kg       text,
    text_color           text,
    background_color     text
);

create table workflow
(
    name       text,
    is_active  boolean,
    date_start timestamp,
    date_end   timestamp,
    created_at timestamp,
    updated_at timestamp,
    created_by integer,
    updated_by integer,
    id         serial
        primary key,
    name_kg    text
);

create table structure_post
(
    id               serial
        primary key,
    name             varchar,
    description      varchar,
    code             varchar,
    created_at       timestamp,
    created_by       integer,
    updated_at       timestamp,
    updated_by       integer,
    name_kg          text,
    description_kg   text,
    text_color       text,
    background_color text
);

create table application_road_groups
(
    id         serial
        primary key,
    name       text,
    roles      jsonb not null,
    created_at timestamp,
    updated_at timestamp,
    created_by integer,
    updated_by integer
);

create table application_road
(
    id                serial
        primary key,
    from_status_id    integer,
    to_status_id      integer,
    rule_expression   text,
    description       text,
    validation_url    text,
    post_function_url text,
    is_active         boolean,
    created_at        timestamp,
    created_by        integer,
    updated_at        timestamp,
    updated_by        integer,
    group_id          integer
        constraint fk_application_road_application_road_groups
            references application_road_groups
);

create table tag
(
    id                serial
        primary key,
    name             varchar,
    code             varchar,
    description      varchar,
    created_at       timestamp,
    created_by       integer,
    updated_at       timestamp,
    updated_by       integer,
    name_kg          text,
    description_kg   text,
    text_color       text,
    background_color text
);

create table "Language"
(
    name             varchar,
    description      varchar,
    code             varchar,
    "isDefault"      boolean,
    "queueNumber"    integer,
    id               serial
        primary key,
    created_at       timestamp,
    created_by       integer,
    updated_at       timestamp,
    updated_by       integer,
    name_kg          text,
    description_kg   text,
    text_color       text,
    background_color text
);



-- Example create tables script
-- This would match your actual database schema

create table tech_decision
(
    id               serial
        primary key,
    name             text,
    code             text,
    description      text,
    name_kg          text,
    description_kg   text,
    text_color       text,
    background_color text,
    created_at       timestamp,
    updated_at       timestamp,
    created_by       integer,
    updated_by       integer
);



create table work_day
(
    id          serial
        primary key,
    week_number integer,
    time_start  timestamp,
    time_end    timestamp,
    schedule_id integer,
    created_at  timestamp,
    created_by  integer,
    updated_at  timestamp,
    updated_by  integer
);

create table work_schedule_exception
(
    id          serial
        primary key,
    date_start  timestamp,
    date_end    timestamp,
    name        text,
    schedule_id integer,
    is_holiday  boolean,
    time_start  timestamp,
    time_end    timestamp,
    created_at  timestamp,
    created_by  integer,
    updated_at  timestamp,
    updated_by  integer
);

create table arch_object
(
    id          serial
        primary key,
    address     text,
    name        text,
    identifier  text,
    created_at  timestamp,
    updated_at  timestamp,
    created_by  integer,
    updated_by  integer,
    district_id integer not null,
    description text,
    xcoordinate double precision,
    ycoordinate double precision,
    name_kg     text
);

create table application_object
(
    id             serial
        primary key,
    application_id integer not null,
    arch_object_id integer not null
        constraint app_object_to_object
            references arch_object,
    created_at     timestamp,
    created_by     integer,
    updated_at     timestamp,
    updated_by     integer
);

create table application
(
    id                       serial
        primary key,
    registration_date        timestamp,
    customer_id              integer,
    status_id                integer,
    workflow_id              integer,
    service_id               integer,
    created_at               timestamp,
    updated_at               timestamp,
    deadline                 timestamp,
    arch_object_id           integer,
    comment                  varchar,
    number                   varchar,
    is_paid                  boolean default false,
    created_by               integer,
    updated_by               integer,
    customer_fullname        varchar,
    customer_pin             varchar,
    customer_is_organisation boolean,
    maria_db_statement_id    integer,
    work_description         text,
    assigned_employees_id    integer[],
    customers_info           json[],
    cashed_info              jsonb,
    object_tag_id            integer,
    is_deleted               boolean,
    incoming_numbers         text,
    outgoing_numbers         text,
    tech_decision_id         integer
        constraint r_1916
            references tech_decision,
    sum_wo_discount          double precision,
    total_sum                double precision,
    discount_percentage      double precision,
    discount_value           double precision,
    nds_value                double precision,
    nsp_value                double precision,
    nds_percentage           double precision,
    nsp_percentage           double precision,
    has_discount             boolean,
    calc_updated_by          integer,
    calc_created_by          integer,
    calc_created_at          timestamp,
    calc_updated_at          timestamp,
    total_payed              numeric,
    application_code         text,
    dp_outgoing_number       text,
    tech_decision_date       timestamp,
    done_date                timestamp,
    old_sum                  double precision,
    app_cabinet_uuid         varchar,
    cabinet_html             text,
    is_electronic_only       boolean);

create table customer_contact
(
    id                 serial
        primary key,
    value              text,
    customer_id        integer,
    allow_notification boolean,
    type_id            integer,
    created_at         timestamp,
    created_by         integer,
    updated_at         timestamp,
    updated_by         integer,
    additional         text
);

create table customer_representative
(
    id                       serial
        primary key,
    customer_id              integer not null,
    created_at               timestamp,
    updated_at               timestamp,
    created_by               integer,
    updated_by               integer,
    last_name                text,
    first_name               text,
    second_name              text,
    date_start               timestamp,
    date_end                 timestamp,
    notary_number            text,
    requisites               text,
    is_included_to_agreement boolean,
    pin                      text,
    date_document            timestamp,
    contact                  text
);

CREATE TABLE "User"
(
    id             serial
        primary key,
    "userId"       varchar,
    email          varchar,
    password_hash  varchar,
    active         boolean,
    first_reset    boolean,
    is_super_admin boolean,
    type_system    text,
    created_at     timestamp,
    created_by     integer,
    updated_at     timestamp,
    updated_by     integer
);

create table employee
(
    id          serial
        primary key,
    last_name   text,
    first_name  text,
    second_name text,
    pin         text,
    remote_id   text,
    user_id     text,
    created_at  timestamp,
    updated_at  timestamp,
    created_by  integer,
    updated_by  integer,
    telegram    text,
    email       text,
    guid        text
);

create table object_tag
(
    id          serial
        primary key,
    name        text,
    description text,
    code        text,
    created_at  timestamp,
    updated_at  timestamp,
    created_by  integer,
    updated_by  integer
);

create table organization_type
(
    id               serial
        primary key,
    name             text,
    code             text,
    description      text,
    created_at       timestamp,
    created_by       integer,
    updated_at       timestamp,
    updated_by       integer,
    name_kg          text,
    description_kg   text,
    text_color       text,
    background_color text
);

create table architecture_status
(
    id               serial
        primary key,
    name             text,
    description      text,
    code             text,
    name_kg          text,
    description_kg   text,
    text_color       text,
    background_color text,
    created_at       timestamp,
    updated_at       timestamp,
    created_by       integer,
    updated_by       integer
);

create table task_status
(
    name             text,
    description      text,
    code             text,
    id               serial
        primary key,
    backcolor        varchar,
    textcolor        varchar,
    created_at       timestamp,
    created_by       integer,
    updated_at       timestamp,
    updated_by       integer,
    name_kg          text,
    description_kg   text,
    text_color       text,
    background_color text
);

create table application_task
(
    application_id   integer not null,
    task_template_id integer,
    comment          text,
    name             text,
    is_required      boolean,
    "order"          integer,
    status_id        integer not null
        constraint "R_1750"
            references task_status,
    progress         integer,
    created_at       timestamp,
    updated_at       timestamp,
    created_by       integer,
    updated_by       integer,
    structure_id     integer,
    id               serial
        primary key,
    type_id          integer,
    task_deadline    timestamp,
    is_main          boolean,
    is_main2         boolean
);

create table architecture_process
(
    id         serial
        primary key,
    status_id  integer
        constraint r_1896
            references architecture_status,
    created_at timestamp,
    updated_at timestamp,
    created_by integer,
    updated_by integer
);

create table task_type
(
    id               serial
        primary key,
    name             varchar,
    code             varchar,
    description      varchar,
    is_for_task      boolean,
    is_for_subtask   boolean,
    icon_color       varchar,
    svg_icon_id      integer,
    created_at       timestamp,
    created_by       integer,
    updated_at       timestamp,
    updated_by       integer,
    name_kg          text,
    description_kg   text,
    text_color       text,
    background_color text
);

create table org_structure
(
    id           serial
        primary key,
    parent_id    integer,
    unique_id    text,
    name         text,
    version      text,
    is_active    boolean,
    date_start   timestamp,
    date_end     timestamp,
    remote_id    text,
    created_at   timestamp,
    updated_at   timestamp,
    created_by   integer,
    updated_by   integer,
    short_name   text,
    code         varchar,
    order_number integer
);



create table application_task_assignee
(
    structure_employee_id integer not null,
    application_task_id   integer not null
        constraint "R_1740"
            references application_task,
    created_at            timestamp default (now() + '06:00:00'::interval),
    updated_at            timestamp default (now() + '06:00:00'::interval),
    created_by            integer,
    updated_by            integer,
    id                    serial
        primary key
);

create table employee_in_structure
(
    id           serial
        primary key,
    employee_id  integer   not null
        references employee,
    date_start   timestamp not null,
    date_end     timestamp,
    created_at   timestamp,
    updated_at   timestamp,
    created_by   integer,
    updated_by   integer,
    structure_id integer   not null
        references org_structure,
    post_id      integer,
    is_temporary boolean,
    district_id  integer
);

CREATE TABLE customer
(
    id                        SERIAL PRIMARY KEY,
    pin                       VARCHAR(255),
    is_organization           BOOLEAN,
    full_name                 VARCHAR(255),
    address                   VARCHAR(255),
    director                  VARCHAR(255),
    okpo                      VARCHAR(255),
    organization_type_id      INTEGER,
    payment_account           VARCHAR(255),
    postal_code               VARCHAR(255),
    ugns                      VARCHAR(255),
    bank                      VARCHAR(255),
    bik                       VARCHAR(255),
    registration_number       VARCHAR(255),
    individual_name           VARCHAR(255),
    individual_secondname     VARCHAR(255),
    individual_surname        VARCHAR(255),
    identity_document_type_id INTEGER,
    document_serie            VARCHAR(255),
    document_date_issue       TIMESTAMP,
    document_whom_issued      VARCHAR(255),
    created_at                TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at                TIMESTAMP,
    created_by                INTEGER,
    updated_by                INTEGER,
    is_foreign                BOOLEAN,
    foreign_country           INTEGER
);

create table workflow_task_template
(
    id           SERIAL PRIMARY KEY,
    workflow_id  integer
        constraint r_1729
            references workflow,
    name         text,
    "order"      integer,
    is_active    boolean,
    is_required  boolean,
    description  text,
    created_at   timestamp,
    updated_at   timestamp,
    created_by   integer,
    updated_by   integer,
    structure_id integer,
    type_id      integer,
    district_id  integer
);


create table application_status_history
(
    id             serial
        primary key,
    application_id integer
        constraint application_status_history_application_id_fk
            references application,
    status_id      integer
        constraint application_status_history_application_status_id_fk
            references application_status,
    user_id        integer
        constraint application_status_history_user_id_fk
            references "User",
    date_change    timestamp,
    old_status_id  integer
        constraint application_status_history_application_status_id_fk_2
            references application_status,
    created_at     timestamp,
    created_by     integer,
    updated_at     timestamp,
    updated_by     integer
);

create table structure_application_log
(
    id             serial
        primary key,
    created_by     integer,
    updated_by     integer,
    updated_at     timestamp,
    created_at     timestamp,
    structure_id   integer,
    application_id integer,
    status         text,
    status_code    text
);

create table application_subtask
(
    application_id      integer not null,
    subtask_template_id integer,
    name                text,
    status_id           integer not null
        constraint "R_1753"
            references task_status,
    progress            integer,
    application_task_id integer not null
        constraint "R_1754"
            references application_task,
    description         text,
    created_at          timestamp,
    updated_at          timestamp,
    created_by          integer,
    updated_by          integer,
    id                  serial
        primary key,
    type_id             integer,
    subtask_deadline    timestamp
);

create table arch_object_tag
(
    id         serial
        primary key,
    id_object  integer
        constraint table_name_arch_object_id_fk
            references arch_object,
    id_tag     integer
        constraint table_name_tag_id_fk
            references tag,
    created_at timestamp,
    created_by integer,
    updated_at timestamp,
    updated_by integer
);

create table structure_tag
(
    id           serial
        primary key,
    name         text,
    description  text,
    code         text,
    created_at   timestamp,
    updated_at   timestamp,
    created_by   integer,
    updated_by   integer,
    structure_id integer not null
        constraint r_1867
            references org_structure
);

create table structure_tag_application
(
    id               serial
        primary key,
    structure_tag_id integer not null
        constraint r_1865
            references structure_tag,
    application_id   integer not null,
    created_at       timestamp,
    updated_at       timestamp,
    created_by       integer,
    updated_by       integer,
    structure_id     integer not null
        constraint r_1868
            references org_structure
);

create table file
(
    id         serial
        constraint "XPKФайл"
            primary key,
    name       text,
    path       text,
    created_at timestamp,
    created_by integer,
    updated_at timestamp,
    updated_by integer
);

create table application_payment
(
    id                  serial
        primary key,
    application_id      integer not null
        constraint "R_1771"
            references application,
    description         varchar,
    sum                 double precision,
    structure_id        integer
        constraint "R_1807"
            references org_structure,
    created_at          timestamp,
    updated_at          timestamp,
    created_by          integer,
    updated_by          integer,
    sum_wo_discount     double precision,
    discount_percentage double precision,
    discount_value      double precision,
    reason              text,
    file_id             integer
        constraint fk_application_payment_file
            references file,
    nds                 double precision,
    nsp                 double precision,
    head_structure_id   integer
        constraint fk_application_payment_head_structure_id_employee
            references employee,
    implementer_id      integer
        constraint fk_application_payment_implementer_id_employee
            references employee,
    nds_value           double precision,
    nsp_value           double precision,
    invoice_id          integer
);

create table unit_type
(
    id               serial
        primary key,
    created_at       timestamp,
    updated_at       timestamp,
    created_by       integer,
    updated_by       integer,
    name             varchar,
    code             varchar,
    description      varchar,
    name_kg          text,
    description_kg   text,
    text_color       text,
    background_color text,
    type             text
);



create table application_square
(
    id             serial
        primary key,
    application_id integer not null
        constraint r_1887
            references application,
    structure_id   integer not null
        constraint r_1889
            references org_structure,
    unit_type_id   integer not null
        constraint r_1891
            references unit_type,
    created_at     timestamp,
    updated_at     timestamp,
    created_by     integer,
    updated_by     integer,
    value          double precision
);

create table "CustomSvgIcon"
(
    name         varchar,
    "svgPath"    varchar,
    "usedTables" varchar,
    id           serial
        primary key,
    created_at   timestamp,
    created_by   integer,
    updated_at   timestamp,
    updated_by   integer
);

create table "S_DocumentTemplateType"
(
    id               serial
        primary key,
    name             varchar,
    description      varchar,
    code             varchar,
    "queueNumber"    integer,
    created_at       timestamp,
    created_by       integer,
    updated_at       timestamp,
    updated_by       integer,
    name_kg          text,
    description_kg   text,
    text_color       text,
    background_color text
);

create table document_metadata
(
    id         serial
        primary key,
    metadata   jsonb,
    version    text,
    created_at timestamp,
    updated_at timestamp,
    created_by integer,
    updated_by integer,
    name       varchar
);

create table "S_DocumentTemplate"
(
    id                serial
        primary key,
    name              varchar,
    description       varchar,
    code              varchar,
    "idCustomSvgIcon" integer
        constraint "R_441"
            references "CustomSvgIcon",
    "iconColor"       varchar,
    "idDocumentType"  integer not null
        constraint "R_608"
            references "S_DocumentTemplateType",
    metadata_id       integer
        references document_metadata,
    created_at        timestamp,
    created_by        integer,
    updated_at        timestamp,
    updated_by        integer,
    name_kg           text,
    description_kg    text,
    text_color        text,
    background_color  text
);

create table "S_Query"
(
    name             varchar,
    description      varchar,
    code             varchar,
    query            varchar,
    id               serial
        primary key,
    created_at       timestamp,
    created_by       integer,
    updated_at       timestamp,
    updated_by       integer,
    name_kg          text,
    description_kg   text,
    text_color       text,
    background_color text
);

create table "S_PlaceHolderType"
(
    name          varchar,
    description   varchar,
    code          varchar,
    "queueNumber" integer,
    id            serial
        primary key,
    created_at    timestamp,
    created_by    integer,
    updated_at    timestamp,
    updated_by    integer
);

create table "S_PlaceHolderTemplate"
(
    id                  serial
        primary key,
    name                varchar,
    description         varchar,
    code                varchar,
    "idQuery"           integer not null
        constraint "R_137"
            references "S_Query",
    "idPlaceholderType" integer not null
        constraint "R_1212"
            references "S_PlaceHolderType",
    value               text,
    created_at          timestamp,
    created_by          integer,
    updated_at          timestamp,
    updated_by          integer,
    name_kg             text,
    description_kg      text,
    text_color          text,
    background_color    text
);

create table "S_DocumentTemplateTranslation"
(
    id                   serial
        primary key,
    template             varchar,
    "idDocumentTemplate" integer not null
        constraint "R_271"
            references "S_DocumentTemplate",
    "idLanguage"         integer not null
        constraint "R_1213"
            references "Language",
    created_at           timestamp,
    created_by           integer,
    updated_at           timestamp,
    updated_by           integer
);

create table application_comment
(
    id             serial
        primary key,
    application_id integer not null
        references application,
    comment        text,
    updated_by     integer,
    created_by     integer,
    created_at     timestamp,
    updated_at     timestamp
);


create table status_dutyplan_object
(
    id               serial
        primary key,
    name             text,
    description      text,
    code             text,
    name_kg          text,
    description_kg   text,
    text_color       text,
    background_color text,
    created_at       timestamp,
    updated_at       timestamp,
    created_by       integer,
    updated_by       integer
);

create table dutyplan_object
(
    id                        serial
        primary key,
    doc_number                varchar,
    address                   varchar,
    latitude                  double precision,
    longitude                 double precision,
    layer                     jsonb,
    customer                  text,
    description               text,
    created_at                timestamp,
    created_by                integer,
    updated_at                timestamp,
    updated_by                integer,
    date_setplan              timestamp,
    quantity_folder           integer,
    status_dutyplan_object_id integer
        constraint r_1915
            references status_dutyplan_object
);

create table application_duty_object
(
    id                 serial
        primary key,
    dutyplan_object_id integer
        constraint r_1902
            references dutyplan_object,
    application_id     integer
        constraint r_1901
            references architecture_process,
    created_at         timestamp,
    updated_at         timestamp,
    created_by         integer,
    updated_by         integer
);

create table application_subtask_assignee
(
    structure_employee_id  integer not null
        constraint "R_1816"
            references employee_in_structure,
    application_subtask_id integer not null
        constraint "R_1817"
            references application_subtask,
    created_at             timestamp,
    updated_at             timestamp,
    created_by             integer,
    updated_by             integer,
    id                     serial
        primary key
);

create table reestr_status
(
    id          serial
        constraint reestr_status_pk
            primary key,
    name        text,
    description text,
    code        text,
    created_at  timestamp,
    updated_at  timestamp,
    created_by  integer,
    updated_by  integer
);

create table reestr
(
    id         serial
        constraint reestr_pk
            primary key,
    name       text,
    month      integer,
    year       integer,
    status_id  integer not null
        constraint r_1825
            references reestr_status,
    created_at timestamp,
    updated_at timestamp,
    created_by integer,
    updated_by integer
);

create table application_in_reestr
(
    id             serial
        constraint application_in_reestr_pk
            primary key,
    reestr_id      integer not null
        constraint r_1827
            references reestr,
    application_id integer not null,
    created_at     timestamp,
    updated_at     timestamp,
    created_by     integer,
    updated_by     integer
);

create table legal_registry_status
(
    id               serial
        primary key,
    name             text,
    description      text,
    code             text,
    created_at       timestamp,
    updated_at       timestamp,
    created_by       integer,
    updated_by       integer,
    name_kg          text,
    description_kg   text,
    text_color       text,
    background_color text
);


create table legal_record_registry
(
    id          serial
        primary key,
    subject     text,
    complainant text,
    decision    text,
    addition    text,
    created_at  timestamp,
    updated_at  timestamp,
    created_by  integer,
    updated_by  integer,
    is_active   boolean,
    defendant   text,
    id_status   integer not null
        constraint fk_status
            references legal_registry_status
);

create table legal_act_registry_status
(
    id               serial
        primary key,
    name             text,
    description      text,
    code             text,
    created_at       timestamp,
    updated_at       timestamp,
    created_by       integer,
    updated_by       integer,
    name_kg          text,
    description_kg   text,
    text_color       text,
    background_color text
);

create table legal_act_registry
(
    id         serial
        primary key,
    subject    text,
    act_number text,
    decision   text,
    addition   text,
    created_at timestamp,
    updated_at timestamp,
    created_by integer,
    updated_by integer,
    is_active  boolean,
    act_type   text,
    date_issue timestamp,
    id_status  integer not null
        constraint fk_status
            references legal_act_registry_status
);

create table application_legal_record
(
    id             serial
        primary key,
    id_application integer not null
        constraint fk_application
            references application,
    id_legalrecord integer
        constraint fk_legalrecord
            references legal_record_registry,
    id_legalact    integer
        constraint fk_legalact
            references legal_act_registry,
    created_at     timestamp,
    updated_at     timestamp,
    created_by     integer,
    updated_by     integer
);

create table application_paid_invoice
(
    id                 serial
        primary key,
    date               timestamp,
    payment_identifier text,
    sum                double precision,
    application_id     integer,
    bank_identifier    varchar,
    created_at         timestamp,
    updated_at         timestamp,
    created_by         integer,
    updated_by         integer,
    invoice_id         integer
);

create table application_document_type
(
    id               serial
        constraint "XPKТип_документа"
            primary key,
    name             text,
    description      text,
    code             text,
    created_at       timestamp,
    created_by       integer,
    updated_at       timestamp,
    updated_by       integer,
    name_kg          text,
    description_kg   text,
    text_color       text,
    background_color text
);


create table application_document
(
    id               serial
        constraint "XPKДокументы_подачи"
            primary key,
    name             text,
    document_type_id integer not null
        constraint r_1717
            references application_document_type,
    description      text,
    law_description  text,
    name_kg          varchar,
    code             varchar,
    doc_is_outcome   boolean,
    created_at       timestamp,
    created_by       integer,
    updated_at       timestamp,
    updated_by       integer,
    description_kg   text,
    text_color       text,
    background_color text
);

create table application_filter_type
(
    id           serial
        primary key,
    name         text,
    code         text,
    description  text,
    post_id      integer
        constraint fk_application_filter_type_structure_post
            references structure_post,
    structure_id integer
        constraint fk_application_filter_type_org_structure
            references org_structure,
    created_at   timestamp,
    updated_at   timestamp,
    created_by   integer,
    updated_by   integer
);

create table application_filter
(
    id          serial
        primary key,
    name        text,
    code        text,
    description text,
    type_id     integer
        constraint fk_application_filter_application_filter_type
            references application_filter_type,
    query_id    integer
        constraint fk_application_filter_s_query
            references "S_Query",
    post_id     integer
        constraint fk_application_filter_structure_post
            references structure_post,
    created_at  timestamp,
    updated_at  timestamp,
    created_by  integer,
    updated_by  integer,
    parameters  jsonb
);


create table archirecture_road
(
    id                serial
        primary key,
    rule_expression   text,
    description       text,
    validation_url    text,
    post_function_url text,
    is_active         boolean,
    from_status_id    integer not null
        constraint r_1894
            references architecture_status,
    to_status_id      integer not null
        constraint r_1895
            references architecture_status,
    created_at        timestamp,
    updated_at        timestamp,
    created_by        integer,
    updated_by        integer
);

create table service_document
(
    id                      serial
        constraint "XPKДокументы_для_услуги"
            primary key,
    service_id              serial
        constraint r_1720
            references service,
    application_document_id serial
        constraint r_1721
            references application_document,
    is_required             boolean,
    created_at              timestamp,
    created_by              integer,
    updated_at              timestamp,
    updated_by              integer
);

create table application_work_document
(
    id                    serial
        primary key,
    file_id               integer,
    task_id               integer,
    comment               text,
    structure_employee_id integer,
    id_type               integer,
    created_at            timestamp,
    created_by            integer,
    updated_at            timestamp,
    updated_by            integer,
    metadata              jsonb,
    deactivated_at        timestamp,
    deactivated_by        integer,
    is_active             boolean,
    reason_deactivated    text
);

create table application_work_document_history
(
    id                 serial
        primary key,
    application_id     integer                                          not null,
    operation          varchar(10)                                      not null,
    old_value          jsonb,
    new_value          jsonb,
    action_description text,
    field              text,
    created_at         timestamp default (now() + '06:00:00'::interval) not null,
    created_by         integer                                          not null
);

create table uploaded_application_document
(
    id                      serial
        primary key,
    file_id                 integer
        constraint "R_1774"
            references file,
    application_document_id integer,
    name                    varchar,
    service_document_id     integer
        constraint "R_1788"
            references service_document,
    created_at              timestamp,
    updated_at              timestamp,
    created_by              integer,
    updated_by              integer,
    is_outcome              boolean,
    document_number         text
);

create table uploaded_application_document_history
(
    id                               serial
        primary key,
    application_id                   integer                                          not null,
    operation                        varchar(10)                                      not null,
    old_value                        jsonb,
    new_value                        jsonb,
    action_description               text,
    field                            text,
    created_at                       timestamp default (now() + '06:00:00'::interval) not null,
    created_by                       integer                                          not null,
    uploaded_application_document_id integer
);

create table archive_doc_tag
(
    id               serial
        primary key,
    name             text,
    description      text,
    code             text,
    name_kg          text,
    description_kg   text,
    text_color       text,
    background_color text,
    created_at       timestamp,
    updated_at       timestamp,
    created_by       integer,
    updated_by       integer
);


create table archive_folder
(
    id                  serial
        primary key,
    archive_folder_name text,
    dutyplan_object_id  integer
        constraint r_1908
            references dutyplan_object,
    folder_location     text,
    created_at          timestamp,
    updated_at          timestamp,
    created_by          integer,
    updated_by          integer
);

create table archive_object_file
(
    id                serial
        primary key,
    archive_object_id integer not null
        references dutyplan_object,
    file_id           integer not null
        references file,
    name              varchar,
    created_at        timestamp,
    created_by        integer,
    updated_at        timestamp,
    updated_by        integer,
    archive_folder_id integer
        constraint r_1909
            references archive_folder,
    description       text,
    quantity_pages    integer
);

create table archive_file_tags
(
    id         serial
        primary key,
    created_at timestamp,
    updated_at timestamp,
    created_by integer,
    updated_by integer,
    file_id    integer
        constraint r_1906
            references archive_object_file,
    tag_id     integer
        constraint r_1907
            references archive_doc_tag
);

create table archive_object
(
    id          serial
        primary key,
    doc_number  varchar,
    address     varchar,
    latitude    double precision,
    longitude   double precision,
    layer       jsonb,
    customer    text,
    description text,
    created_at  timestamp,
    created_by  integer,
    updated_at  timestamp,
    updated_by  integer
);

create table identity_document_type
(
    id               serial
        primary key,
    name             text,
    code             text,
    description      text,
    created_at       timestamp,
    created_by       integer,
    updated_at       timestamp,
    updated_by       integer,
    name_kg          text,
    description_kg   text,
    text_color       text,
    background_color text
);

create table contragent
(
    id         serial
        primary key,
    name       text,
    created_by integer,
    updated_by integer,
    created_at timestamp,
    updated_at timestamp,
    address    text,
    contacts   text,
    user_id    text
);

create table discount_type
(
    id          serial
        primary key,
    name        text,
    code        text,
    description text,
    created_at  timestamp,
    updated_at  timestamp,
    created_by  integer,
    updated_by  integer
);

create table discount_document_type
(
    id          serial
        primary key,
    name        text,
    code        text,
    description text,
    created_at  timestamp,
    updated_at  timestamp,
    created_by  integer,
    updated_by  integer
);

create table discount_documents
(
    id               serial
        primary key,
    file_id          integer
        constraint fk_discount_documents_file
            references file,
    description      text,
    discount         double precision,
    discount_type_id integer
        constraint fk_discount_documents_discount_type
            references discount_type,
    document_type_id integer
        constraint fk_discount_documents_discount_document_type
            references discount_document_type,
    start_date       timestamp,
    end_date         timestamp,
    created_at       timestamp,
    updated_at       timestamp,
    created_by       integer,
    updated_by       integer
);

create table notification
(
    id          serial
        primary key,
    title       text,
    text        text,
    employee_id integer,
    has_read    boolean,
    created_at  timestamp,
    code        text,
    link        text,
    user_id     integer,
    created_by  integer,
    updated_at  timestamp,
    updated_by  integer
);

create table notification_log
(
    id             serial
        primary key,
    employee_id    integer,
    user_id        integer,
    message        varchar,
    subject        varchar,
    guid           text,
    date_send      timestamp,
    type           varchar,
    created_at     timestamp,
    created_by     integer,
    updated_at     timestamp,
    updated_by     integer,
    application_id integer,
    customer_id    integer,
    status_id      integer,
    phone          text
);

create table notification_log_status
(
    id               serial
        primary key,
    name             text,
    description      text,
    code             text,
    created_at       timestamp,
    updated_at       timestamp,
    created_by       integer,
    updated_by       integer,
    name_kg          text,
    description_kg   text,
    text_color       text,
    background_color text
);

create table notification_template
(
    id              serial
        primary key,
    contact_type_id integer
        constraint "R_1826"
            references contact_type,
    code            varchar,
    subject         varchar,
    body            varchar,
    placeholders    varchar,
    link            varchar,
    created_at      timestamp,
    created_by      integer,
    updated_at      timestamp,
    updated_by      integer
);

create table customer_discount
(
    id           serial
        primary key,
    pin_customer text,
    description  text,
    created_at   timestamp,
    updated_at   timestamp,
    created_by   integer,
    updated_by   integer
);

create table customer_discount_documents
(
    id                    serial
        primary key,
    customer_discount_id  integer
        constraint fk_customer_discount_customer_discount
            references customer_discount,
    discount_documents_id integer
        constraint fk_customer_discount_discount_documents
            references discount_documents
);

create table decision_type
(
    id          serial
        primary key,
    name        varchar,
    code        varchar,
    description varchar,
    created_at  timestamp,
    updated_at  timestamp,
    created_by  integer,
    updated_by  integer
);

create table tech_council_session
(
    id         serial
        primary key,
    date       timestamp,
    is_active  boolean,
    created_at timestamp,
    created_by integer,
    updated_at timestamp,
    updated_by integer,
    document   varchar
);

create table tech_council
(
    id                      serial
        primary key,
    structure_id            integer not null
        constraint "R_1916"
            references org_structure,
    application_id          integer not null,
    decision                varchar,
    decision_type_id        integer
        constraint "R_1940"
            references decision_type,
    date_decision           timestamp,
    employee_id             integer
        constraint "R_1918"
            references employee,
    created_at              timestamp,
    updated_at              timestamp,
    created_by              integer,
    updated_by              integer,
    tech_council_session_id integer
        constraint "R_1957"
            references tech_council_session
);

create table tech_council_files
(
    id              serial
        primary key,
    tech_council_id integer not null
        constraint "R_1948"
            references tech_council,
    file_id         integer not null
        constraint "R_1949"
            references file,
    created_at      timestamp,
    updated_at      timestamp,
    created_by      integer,
    updated_by      integer
);


create table tech_council_participants_settings
(
    id           serial
        primary key,
    structure_id integer not null
        constraint "R_1919"
            references org_structure,
    service_id   integer not null
        constraint "R_1920"
            references service,
    is_active    boolean,
    created_at   timestamp,
    updated_at   timestamp,
    created_by   integer,
    updated_by   integer
);

create table legal_object
(
    id          serial
        primary key,
    description text,
    address     text,
    geojson     json,
    created_at  timestamp,
    updated_at  timestamp,
    created_by  integer,
    updated_by  integer
);

create table legal_act_object
(
    id         serial
        primary key,
    created_at timestamp,
    updated_at timestamp,
    created_by integer,
    updated_by integer,
    id_act     integer not null
        constraint fk_act
            references legal_act_registry,
    id_object  integer not null
        constraint fk_object
            references legal_object
);

create table legal_act_employee
(
    id                    serial
        primary key,
    is_active             boolean,
    created_at            timestamp,
    updated_at            timestamp,
    created_by            integer,
    updated_by            integer,
    id_act                integer
        constraint r_1953
            references legal_act_registry,
    id_structure_employee integer
        constraint r_1955
            references employee_in_structure
);

create table legal_record_employee
(
    id                    serial
        primary key,
    is_active             boolean,
    created_at            timestamp,
    updated_at            timestamp,
    created_by            integer,
    updated_by            integer,
    id_record             integer
        constraint r_1952
            references legal_record_registry,
    id_structure_employee integer
        constraint r_1956
            references employee_in_structure
);

create table legal_record_in_council
(
    id                          serial
        primary key,
    application_legal_record_id integer not null
        constraint "R_1950"
            references application_legal_record,
    tech_council_id             integer not null
        constraint "R_1951"
            references tech_council,
    created_at                  timestamp,
    updated_at                  timestamp,
    created_by                  integer,
    updated_by                  integer
);

create table legal_record_object
(
    id         serial
        primary key,
    created_at timestamp,
    updated_at timestamp,
    created_by integer,
    updated_by integer,
    id_record  integer not null
        constraint fk_record
            references legal_record_registry,
    id_object  integer not null
        constraint fk_object
            references legal_object
);

create table structure_report
(
    id               serial
        primary key,
    status_id        integer not null,
    report_config_id integer not null,
    created_at       timestamp,
    updated_at       timestamp,
    created_by       integer,
    updated_by       integer,
    month            integer,
    year             integer,
    quarter          integer,
    structure_id     integer
);

create table structure_report_config
(
    id           serial
        primary key,
    structure_id integer not null,
    created_at   timestamp,
    updated_at   timestamp,
    created_by   integer,
    updated_by   integer,
    is_active    boolean,
    name         varchar
);

create table structure_report_field
(
    id         serial
        primary key,
    report_id  integer not null,
    field_id   integer,
    unit_id    integer,
    value      double precision,
    created_at timestamp,
    updated_at timestamp,
    created_by integer,
    updated_by integer
);

create table structure_report_field_config
(
    id                  serial
        primary key,
    structure_report_id integer not null,
    field_name          varchar,
    report_item         varchar,
    created_at          timestamp,
    updated_at          timestamp,
    created_by          integer,
    updated_by          integer
);

create table structure_report_status
(
    id               serial
        primary key,
    created_at       timestamp,
    updated_at       timestamp,
    created_by       integer,
    updated_by       integer,
    name             varchar,
    code             varchar,
    description      varchar,
    name_kg          text,
    description_kg   text,
    text_color       text,
    background_color text
);

create table unit_for_field_config
(
    id         serial
        primary key,
    unit_id    integer not null,
    field_id   integer not null,
    created_at timestamp,
    updated_at timestamp,
    created_by integer,
    updated_by integer
);


create table employee_contact
(
    id                 serial
        primary key,
    value              text,
    employee_id        integer,
    allow_notification boolean,
    type_id            integer,
    created_at         timestamp,
    created_by         integer,
    updated_at         timestamp,
    updated_by         integer
);

create table employee_event
(
    id            serial
        primary key,
    date_start    timestamp,
    date_end      timestamp,
    event_type_id integer,
    employee_id   integer,
    created_at    timestamp,
    created_by    integer,
    updated_at    timestamp,
    updated_by    integer
);

create table hrms_event_type
(
    id               serial
        primary key,
    name             text,
    code             text,
    description      text,
    created_at       timestamp,
    created_by       integer,
    updated_at       timestamp,
    updated_by       integer,
    name_kg          text,
    description_kg   text,
    text_color       text,
    background_color text
);

create table workflow_subtask_template
(
    name             text,
    description      text,
    workflow_task_id integer not null
        constraint r_1736
            references workflow_task_template,
    created_at       timestamp,
    updated_at       timestamp,
    created_by       integer,
    updated_by       integer,
    type_id          integer,
    id               serial
        primary key
);

create table workflow_task_dependency
(
    id                serial
            primary key,
    task_id           integer not null
        constraint r_1745
            references workflow_task_template,
    dependent_task_id integer not null
        constraint r_1746
            references workflow_task_template,
    created_at        timestamp,
    updated_at        timestamp,
    created_by        integer,
    updated_by        integer
);

CREATE TABLE IF NOT EXISTS sm_project (
                                          id SERIAL PRIMARY KEY,
                                          name VARCHAR(255),
    projecttype_id INTEGER,
    test BOOLEAN,
    status_id INTEGER,
    min_responses INTEGER,
    date_end TIMESTAMP,
    access_link VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    created_by INTEGER,
    updated_by INTEGER,
    entity_id INTEGER,
    frequency_id INTEGER,
    is_triggers_required BOOLEAN,
    date_attribute_milestone_id INTEGER
    );

create table customers_for_archive_object
(
    id                 serial
        primary key,
    full_name          text,
    pin                text,
    address            text,
    is_organization    boolean,
    description        text,
    created_at         timestamp,
    created_by         integer,
    updated_at         timestamp,
    updated_by         integer,
    dp_outgoing_number text
);

create table archive_object_customer
(
    id                serial
        primary key,
    archive_object_id integer,
    customer_id       integer,
    description       text,
    created_at        timestamp,
    created_by        integer,
    updated_at        timestamp,
    updated_by        integer
);

create table "SubscriberType"
(
    id          serial
        primary key,
    name        text,
    description text,
    code        text,
    created_at  timestamp,
    created_by  integer,
    updated_at  timestamp,
    updated_by  integer
);

create table "ScheduleType"
(
    id          serial
        primary key,
    name        text,
    description text,
    code        text,
    created_at  timestamp,
    created_by  integer,
    updated_at  timestamp,
    updated_by  integer
);

create table "RepeatType"
(
    id                      serial
        primary key,
    name                    text,
    description             text,
    code                    text,
    "isPeriod"              boolean,
    "repeatIntervalMinutes" integer,
    created_at              timestamp,
    created_by              integer,
    updated_at              timestamp,
    updated_by              integer
);

create table "CustomSubscribtion"
(
    "idSubscriberType" integer,
    "idSchedule"       integer,
    "idRepeatType"     integer,
    "sendEmpty"        boolean,
    "timeStart"        timestamp,
    "timeEnd"          timestamp,
    monday             boolean,
    tuesday            boolean,
    wednesday          boolean,
    thursday           boolean,
    friday             boolean,
    saturday           boolean,
    sunday             boolean,
    "dateOfMonth"      integer,
    "weekOfMonth"      integer,
    "isActive"         boolean,
    "idDocument"       integer,
    "activeDateStart"  timestamp,
    "activeDateEnd"    timestamp,
    body               text,
    title              text,
    id                 serial
        primary key,
    "idEmployee"       integer not null,
    "idStructurePost"  integer,
    created_at         timestamp,
    created_by         integer,
    updated_at         timestamp,
    updated_by         integer
);


create table "SubscribtionContactType"
(
    id               serial
        primary key,
    "idTypeContact"  integer[] not null,
    "idSubscribtion" integer   not null,
    created_at       timestamp,
    created_by       integer,
    updated_at       timestamp,
    updated_by       integer
);

create table org_structure_templates
(
    id           serial
        constraint org_structure_templates_pk
            primary key,
    structure_id integer not null
        constraint r_1825
            references org_structure,
    template_id  integer not null,
    created_at   timestamp,
    created_by   integer,
    updated_at   timestamp,
    updated_by   integer
);


create table saved_application_document
(
    id             serial
        primary key,
    application_id integer not null
        constraint "R_110001"
            references application,
    template_id    integer not null
        constraint "R_110002"
            references "S_DocumentTemplate",
    language_id    integer not null
        constraint "R_110003"
            references "Language",
    body           varchar,
    created_at     timestamp,
    updated_at     timestamp with time zone,
    created_by     integer,
    updated_by     integer
);


create table "S_TemplateDocumentPlaceholder"
(
    id                   serial
        primary key,
    "idTemplateDocument" integer not null
        constraint "R_138"
            references "S_DocumentTemplateTranslation",
    "idPlaceholder"      integer not null
        constraint "R_139"
            references "S_PlaceHolderTemplate",
    created_at           timestamp,
    created_by           integer,
    updated_at           timestamp,
    updated_by           integer
);

create table "S_QueriesDocumentTemplate"
(
    id                   serial
        primary key,
    "idDocumentTemplate" integer not null
        constraint "R_101"
            references "S_DocumentTemplateTranslation",
    "idQuery"            integer not null
        constraint "R_102"
            references "S_Query",
    created_at           timestamp,
    created_by           integer,
    updated_at           timestamp,
    updated_by           integer
);

create table release
(
    id             serial
        primary key,
    number         varchar,
    description    text,
    description_kg text,
    code           varchar,
    date_start     timestamp,
    created_at     timestamp,
    updated_at     timestamp,
    created_by     integer,
    updated_by     integer
);

create table release_seen
(
    id          serial
        primary key,
    release_id  integer not null
        constraint r_1944
            references release,
    user_id     integer not null,
    date_issued timestamp,
    created_at  timestamp,
    updated_at  timestamp,
    created_by  integer,
    updated_by  integer
);

create table release_video
(
    id         serial
        primary key,
    release_id integer not null
        constraint r_1942
            references release,
    file_id    integer not null
        constraint r_1945
            references file,
    name       varchar,
    created_at timestamp,
    updated_at timestamp,
    created_by integer,
    updated_by integer
);


create table "Role"
(
    id         serial
        primary key,
    name       varchar,
    code       varchar,
    created_at timestamp,
    created_by integer,
    updated_at timestamp,
    updated_by integer
);

create table user_role
(
    id           serial
        primary key,
    role_id      integer
        references "Role",
    structure_id integer,
    user_id      integer
        references "User",
    created_at   timestamp,
    created_by   integer,
    updated_at   timestamp,
    updated_by   integer
);

create table query_filters
(
    id           serial
        primary key,
    name         text,
    name_kg      text,
    code         text,
    description  text,
    target_table text,
    query        text,
    created_at   timestamp,
    updated_at   timestamp,
    created_by   integer,
    updated_by   integer
);

create table archive_log_status
(
    id               serial
        primary key,
    name             text,
    description      text,
    code             text,
    created_at       timestamp,
    created_by       integer,
    updated_at       timestamp,
    updated_by       integer,
    name_kg          text,
    description_kg   text,
    text_color       text,
    background_color text
);

create table archive_log
(
    id                  serial
        primary key,
    created_at          timestamp,
    updated_at          timestamp,
    created_by          integer,
    updated_by          integer,
    doc_number          text,
    address             text,
    status_id           integer not null
        references archive_log_status,
    date_return         timestamp,
    take_structure_id   integer,
    take_employee_id    integer,
    return_structure_id integer,
    return_employee_id  integer,
    date_take           timestamp,
    name_take           varchar,
    archive_object_id   integer,
    is_group            boolean,
    deadline            timestamp,
    parent_id           integer,
    archive_folder_id   integer
        constraint r_1910
            references archive_folder
);

create table contragent_interaction
(
    id             serial
        primary key,
    task_id        integer
        constraint "R_1741"
            references application_task,
    contragent_id  integer not null
        constraint "R_1742"
            references contragent,
    description    varchar,
    progress       integer,
    name           varchar,
    created_at     timestamp,
    updated_at     timestamp,
    created_by     integer,
    updated_by     integer,
    application_id integer not null
        constraint "R_1816"
            references application,
    status         text
);


create table contragent_interaction_doc
(
    id             serial
        primary key,
    file_id        integer
        constraint "R_1814"
            references file,
    interaction_id integer not null
        constraint "R_1815"
            references contragent_interaction,
    user_id        integer,
    type_org       varchar,
    message        varchar,
    sent_at        timestamp default (now() + '06:00:00'::interval),
    for_customer   boolean,
    created_at     timestamp,
    created_by     integer,
    updated_at     timestamp,
    updated_by     integer
);

create table system_setting
(
    id          serial
        primary key,
    name        text,
    code        text,
    description text,
    value       text not null,
    created_at  timestamp,
    created_by  integer,
    updated_at  timestamp,
    updated_by  integer
);

create table invoice_status
(
    id               serial
        primary key,
    created_at       timestamp,
    updated_at       timestamp,
    created_by       integer,
    updated_by       integer,
    name             varchar,
    code             varchar,
    description      varchar,
    name_kg          varchar,
    description_kg   varchar,
    text_color       varchar,
    background_color varchar
);

create table application_invoice
(
    id             serial
        primary key,
    application_id integer not null,
    status_id      integer not null,
    created_at     timestamp,
    updated_at     timestamp,
    created_by     integer,
    updated_by     integer,
    sum            double precision,
    nds            integer,
    nsp            integer,
    discount       double precision,
    total_sum      double precision
);

create table file_sign
(
    id                    serial
        primary key,
    timestamp             timestamp,
    pin_user              text,
    pin_organization      text,
    sign_hash             text,
    sign_timestamp        bigint,
    file_id               integer not null,
    employee_id           integer,
    user_id               integer,
    user_full_name        text,
    structure_employee_id integer,
    employee_fullname     text,
    structure_fullname    text
);

create table security_event
(
    id                serial
        primary key,
    event_type        varchar(100) not null,
    event_description text,
    user_id           varchar(100),
    ip_address        varchar(50),
    user_agent        text,
    event_time        timestamp    not null,
    severity_level    integer,
    is_resolved       boolean default false,
    resolution_time   timestamp,
    resolution_notes  text,
    created_at        timestamp,
    created_by        integer,
    updated_at        timestamp,
    updated_by        integer
);