import { FC, useEffect } from 'react';
import DynamicTable from "components/TableForm";
import {TableColumn} from "components/TableForm"
import axios from "axios";
import { observer } from "mobx-react"
import store from './store'
import { FieldConfig } from "constants/TableFormField"


type ReportConfigProps = {
  // fields?: any
};


const ReportConfig: FC<ReportConfigProps> = observer((props) => {

  const tableStructure = {
    columns: [
      { key: "workName", label: "Наименование выполненных работ", editable: false, type: "string" as TableColumn["type"]  },
      { key: "unit", label: "Ед. изм", editable: false, type: "string" as TableColumn["type"]},
      { key: "gpo_2022_12", label: "2022 г за 12 месяц", editable: true, type: "number"  as TableColumn["type"]},
      { key: "gpo_2023_q1", label: "за 1 кв. 2023г.", editable: true, type: "number" as TableColumn["type"] },
      { key: "gpo_2023_q2", label: "за 2 кв. 2023г.", editable: true, type: "number" as TableColumn["type"]},
      { key: "gpo_2023_q3", label: "за 3 кв. 2023г.", editable: true, type: "number" as TableColumn["type"]},
      { key: "gpo_2023_9m", label: "за 9 мес", editable: true, type: "number" as TableColumn["type"]},
    ],
// заполенение строк
    initialData: [  
      {
        workName: "генплана",
        unit: "шт",
        gpo_2022_12: 0,
        gpo_2023_q1: 0,
        gpo_2023_q2: 0,
        gpo_2023_q3: 0,
        gpo_2023_9m: 0,
      },
      {
        workName: "ПДП",
        unit: "шт",
        gpo_2022_12: 0,
        gpo_2023_q1: 0,
        gpo_2023_q2: 0,
        gpo_2023_q3: 0,
        gpo_2023_9m: 0,
      },
      {
        workName: "проекта застройки",
        unit: "шт",
        gpo_2022_12: 22,
        gpo_2023_q1: 15,
        gpo_2023_q2: 14,
        gpo_2023_q3: 0,
        gpo_2023_9m: 29,
      },
      {
        workName: "схемы инженерных сетей",
        unit: "шт",
        gpo_2022_12: 0,
        gpo_2023_q1: 0,
        gpo_2023_q2: 0,
        gpo_2023_q3: 0,
        gpo_2023_9m: 0,
      },
    ],
  };

  const handleSave = (data: Record<string, any>[]) => {
    console.log("Сохраненные данные:", data);
  };

  return (
    <div>
      <h1>Табличная форма</h1>
      <DynamicTable
      columns={tableStructure.columns}
      initialData={tableStructure.initialData}
      onSave={handleSave}
    />

    </div>
  );
});

export default ReportConfig;
