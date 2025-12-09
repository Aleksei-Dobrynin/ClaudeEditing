import { FC, useEffect } from 'react';
import {
  Container,
} from '@mui/material';
import PageGrid from 'components/PageGrid';
import { observer } from "mobx-react"
import store from "./store"
import { useTranslation } from 'react-i18next';
import { GridColDef } from '@mui/x-data-grid';
import PopupGrid from 'components/PopupGrid';
import ArchiveObjectsEventsPopupForm from './../ArchiveObjectsEventsAddEditView/popupForm'
import dayjs from 'dayjs';

type ArchiveObjectsEventsListViewProps = {
  idArchiveObject?: number;
  isEmbedded?: boolean;
  isReadOnly?: boolean;
};

const ArchiveObjectsEventsListView: FC<ArchiveObjectsEventsListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    if (props.idArchiveObject) {
      store.idMain = props.idArchiveObject;
      store.loadArchiveObjectsEventsByObjectId(props.idArchiveObject);
    } else {
      store.loadArchiveObjectsEvents();
    }
    return () => {
      store.clearStore()
    }
  }, [props.idArchiveObject])

  const columns: GridColDef[] = [
    {
      field: 'description',
      headerName: translate("label:ArchiveObjectsEventsListView.description"),
      flex: 2,
      renderCell: (param) => (<div data-testid="table_ArchiveObjectsEvents_column_description"> {param.row.description} </div>),
      renderHeader: (param) => (<div data-testid="table_ArchiveObjectsEvents_header_description">{param.colDef.headerName}</div>)
    },
    {
      field: 'employee_name',
      headerName: translate("label:ArchiveObjectsEventsListView.employee"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_ArchiveObjectsEvents_column_employee"> {param.row.employee_name || param.row.employee_id} </div>),
      renderHeader: (param) => (<div data-testid="table_ArchiveObjectsEvents_header_employee">{param.colDef.headerName}</div>)
    },
    {
      field: 'event_type_name',
      headerName: translate("label:ArchiveObjectsEventsListView.event_type"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_ArchiveObjectsEvents_column_event_type"> {param.row.event_type_name || param.row.event_type_id} </div>),
      renderHeader: (param) => (<div data-testid="table_ArchiveObjectsEvents_header_event_type">{param.colDef.headerName}</div>)
    },
    {
      field: 'event_date',
      headerName: translate("label:ArchiveObjectsEventsListView.event_date"),
      flex: 1,
      renderCell: (param) => (
        <div data-testid="table_ArchiveObjectsEvents_column_event_date"> 
          {param.row.event_date ? dayjs(param.row.event_date).format('DD.MM.YYYY HH:mm') : ''} 
        </div>
      ),
      renderHeader: (param) => (<div data-testid="table_ArchiveObjectsEvents_header_event_date">{param.colDef.headerName}</div>)
    },
    ...(!props.isEmbedded ? [{
      field: 'archive_object_name',
      headerName: translate("label:ArchiveObjectsEventsListView.archive_object"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_ArchiveObjectsEvents_column_archive_object"> {param.row.archive_object_name || param.row.archive_object_id} </div>),
      renderHeader: (param) => (<div data-testid="table_ArchiveObjectsEvents_header_archive_object">{param.colDef.headerName}</div>)
    }] : []),
    {
      field: 'structure_name',
      headerName: translate("label:ArchiveObjectsEventsListView.structure"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_ArchiveObjectsEvents_column_structure"> {param.row.structure_name || param.row.structure_id} </div>),
      renderHeader: (param) => (<div data-testid="table_ArchiveObjectsEvents_header_structure">{param.colDef.headerName}</div>)
    },
    // {
    //   field: 'application_number',
    //   headerName: translate("label:ArchiveObjectsEventsListView.application"),
    //   flex: 1,
    //   renderCell: (param) => (<div data-testid="table_ArchiveObjectsEvents_column_application"> {param.row.application_number || param.row.application_id} </div>),
    //   renderHeader: (param) => (<div data-testid="table_ArchiveObjectsEvents_header_application">{param.colDef.headerName}</div>)
    // },
  ];

  const containerProps = props.isEmbedded ? {} : { maxWidth: 'xl' as const, sx: { mt: 4 } };

  const gridComponent = (
    <>
      {props.isEmbedded ? (
        <PopupGrid
          title={translate("label:ArchiveObjectsEventsListView.entityTitle")}
          onEditClicked={(id: number) => store.onEditClicked(id)}
          onDeleteClicked={(id: number) => store.deletearchive_objects_event(id)}
          columns={columns}
          data={store.data}
          tableName="ArchiveObjectsEvents"
        />
      ) : (
        <PageGrid
          title={translate("label:ArchiveObjectsEventsListView.entityTitle")}
          onDeleteClicked={(id: number) => store.deletearchive_objects_event(id)}
          columns={columns}
          data={store.data}
          tableName="ArchiveObjectsEvents"
        />
      )}

      <ArchiveObjectsEventsPopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        idArchiveObject={props.idArchiveObject}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel()
          if (props.idArchiveObject) {
            store.loadArchiveObjectsEventsByObjectId(props.idArchiveObject);
          } else {
            store.loadArchiveObjectsEvents();
          }
        }}
      />
    </>
  );

  return props.isEmbedded ? (
    gridComponent
  ) : (
    <Container {...containerProps}>
      {gridComponent}
    </Container>
  );
})

export default ArchiveObjectsEventsListView