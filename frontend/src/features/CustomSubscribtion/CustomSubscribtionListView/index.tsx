import React, { FC, useEffect } from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { Container } from "@mui/material";
import store from "./store";
import { GridColDef } from "@mui/x-data-grid";
import PageGrid from "../../../components/PageGrid";
import dayjs from "dayjs";
import { CustomSubscribtion } from "../../../constants/CustomSubscribtion";


type CustomSubscribtionListViewProps = {
  forMe?: boolean;
};

const CustomSubscribtionListView: FC<CustomSubscribtionListViewProps> = observer((props) => {

  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
   const run =  async () => {
     if (props.forMe) {
       await store.loadCustomSubscribtionByIdEmployee();
     } else {
       await store.loadCustomSubscribtion();
     }
    }
    run();
  }, [props.forMe]);
  const columns: GridColDef[] = [
    {
      field: 'idSchedule',
      headerName: translate("label:CustomSubscribtionListView.idSchedule"),
      flex: 1,
      renderCell: (params) => {
        return <span>{params.row.idScheduleNav?.name }</span>
      }
    },
    {
      field: 'idRepeatType',
      headerName: translate("label:CustomSubscribtionListView.idRepeatType"),
      flex: 1,
      renderCell: (params) => {
        return <span>{params.row.idRepeatTypeNav?.name ? params.row.idRepeatTypeNav?.name : "-" }</span>
      }
    },
    {
      field: 'timeStart',
      headerName: translate("label:CustomSubscribtionListView.timeStart"),
      flex: 1,
      renderCell: (params) => {
       return <span>{params.value ? dayjs(params.value).format('HH:mm') : "-"}</span>
      }

    },
    {
      field: 'timeEnd',
      headerName: translate("label:CustomSubscribtionListView.timeEnd"),
      flex: 1,
      renderCell: (params) => {
        return <span>{params.value ? dayjs(params.value).format('HH:mm') : "-"}</span>
      }
    },
    {
      field: 'dateOfMonth',
      headerName: translate("label:CustomSubscribtionListView.dateOfMonth"),
      flex: 1,
      renderCell: (params) => {
        return <span>{params.value ? params.value : "-"}</span>
      }
    },
    {
      field: 'weekOfMonth',
      headerName: translate("label:CustomSubscribtionListView.weekOfMonth"),
      flex: 1,
      renderCell: (params) => {
        return <span>
          {params.value ? params.value : "-"}
        </span>
      }
    },
    {
      field: 'dayOfWeek',
      headerName: translate("label:CustomSubscribtionListView.dayOfWeek"),
      flex: 1,
      renderCell: (params) => {
        return <span>{
            (params.row.monday && translate("label:CustomSubscribtionListView.monday")) ||
          (params.row.tuesday && translate("label:CustomSubscribtionListView.tuesday")) ||
          (params.row.wednesday && translate("label:CustomSubscribtionListView.wednesday")) ||
          (params.row.thursday && translate("label:CustomSubscribtionListView.thursday")) ||
          (params.row.friday && translate("label:CustomSubscribtionListView.friday")) ||
          (params.row.saturday && translate("label:CustomSubscribtionListView.saturday")) ||
          (params.row.sunday && translate("label:CustomSubscribtionListView.sunday"))
        }
        </span>
      }
    },
    {
      field: 'activeDateStart',
      headerName: translate("label:CustomSubscribtionListView.activeDateStart"),
      flex: 1,
      renderCell: (params) => {
        return <span>{params.value ? dayjs(params.value).format('DD.MM.YYYY') : ""}</span>
      }
    },
    {
      field: 'activeDateEnd',
      headerName: translate("label:CustomSubscribtionListView.activeDateEnd"),
      flex: 1,
      renderCell: (params) => {
        return <span>{params.value ? dayjs(params.value).format('DD.MM.YYYY') : ""}</span>
      }
    },
    {
      field: 'idDocumentNav',
      headerName: translate("label:CustomSubscribtionAddEditView.idDocument"),
      flex: 1,
      renderCell: (params) => {
        return <span>{params.value?.name ? params.value?.name : "-"}</span>
      }
    },
    {
      field: 'idSubscribtionContactType',
      headerName: translate("label:CustomSubscribtionAddEditView.contactType"),
      flex: 1,
      renderCell: (params) => {
        let contactTypes: string[] = [];
        params.value?.idTypeContact?.forEach((item) => {
          store.contactTypes.forEach(itemTwo => {
            if(item === itemTwo.id) {
              contactTypes.push(itemTwo.name)
            }
          })
        })
        return <span>{contactTypes.length > 0 ? contactTypes.join(', ') : '-'}</span>
      }
    },
  ];
  let type1: string = 'form';
  let component = null;
  switch (type1) {
    case 'form':
      component = <PageGrid
        title={translate(props.forMe ? "label:CustomSubscribtionListView.my_custom_subscribtion" : "label:CustomSubscribtionListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deleteCustomSubscribtion(id)}
        columns={columns}
        data={store.data}
        tableName={props.forMe ? "MyCustomSubscribtion" : "CustomSubscribtion"} />
      break
  }

  return (
    <Container maxWidth="xl" style={{ marginTop: 30 }}>
      {component}
    </Container>
  );
});

export default CustomSubscribtionListView;