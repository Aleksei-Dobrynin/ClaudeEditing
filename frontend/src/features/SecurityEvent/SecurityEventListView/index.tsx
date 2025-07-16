import React, { FC, useEffect } from 'react';
import { observer } from "mobx-react";
import dayjs from "dayjs";
import { useTranslation } from 'react-i18next';
import { GridColDef } from '@mui/x-data-grid';
import store from "./store";
import PageGrid from 'components/PageGrid';
import { Box, Container } from '@mui/material';


type SecurityEventListViewProps = {

};


const SecurityEventListView: FC<SecurityEventListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    store.loadSecurityEvents()
    return () => {
      store.clearStore()
    }
  }, [])


  const columns: GridColDef[] = [

    {
      field: 'eventType',
      headerName: translate("label:SecurityEventListView.eventType"),
      flex: 0.7,
      renderCell: (param) => (<div data-testid="table_SecurityEvent_column_eventType"> {param.row.event_type} </div>),
      renderHeader: (param) => (<div data-testid="table_SecurityEvent_header_eventType">{param.colDef.headerName}</div>)
    },
    {
      field: 'eventDescription',
      headerName: translate("label:SecurityEventListView.eventDescription"),
      flex: 1.5,
      renderCell: (param) => (<div data-testid="table_SecurityEvent_column_eventDescription"> {param.row.event_description} </div>),
      renderHeader: (param) => (<div data-testid="table_SecurityEvent_header_eventDescription">{param.colDef.headerName}</div>)
    },
    {
      field: 'eventTime',
      headerName: translate("label:SecurityEventListView.eventTime"),
      flex: 0.5,
      renderCell: (param) => (<div data-testid="table_SecurityEvent_column_eventTime"> {param.row.event_time ? dayjs(param.row.event_time)?.format("DD.MM.YYYY HH:mm") : ""} </div>),
      renderHeader: (param) => (<div data-testid="table_SecurityEvent_header_eventTime">{param.colDef.headerName}</div>)
    },
    {
      field: 'ipAddress',
      headerName: translate("label:SecurityEventListView.ipAddress"),
      flex: 0.5,
      renderCell: (param) => (<div data-testid="table_SecurityEvent_column_ipAddress"> {param.row.ip_address} </div>),
      renderHeader: (param) => (<div data-testid="table_SecurityEvent_header_ipAddress">{param.colDef.headerName}</div>)
    },
    {
      field: 'severityLevel',
      headerName: translate("label:SecurityEventListView.severityLevel"),
      flex: 0.3,
      renderCell: (param) => (<div data-testid="table_SecurityEvent_column_severityLevel"> {param.row.severity_level} </div>),
      renderHeader: (param) => (<div data-testid="table_SecurityEvent_header_severityLevel">{param.colDef.headerName}</div>)
    },
    {
      field: 'userAgent',
      headerName: translate("label:SecurityEventListView.userAgent"),
      flex: 2,
      renderCell: (param) => (<div data-testid="table_SecurityEvent_column_userAgent"> {param.row.user_agent} </div>),
      renderHeader: (param) => (<div data-testid="table_SecurityEvent_header_userAgent">{param.colDef.headerName}</div>)
    },
    // {
    //   field: 'isResolved',
    //   headerName: translate("label:SecurityEventListView.isResolved"),
    //   flex: 1,
    //   renderCell: (param) => (<div data-testid="table_SecurityEvent_column_isResolved"> {param.row.isResolved} </div>),
    //   renderHeader: (param) => (<div data-testid="table_SecurityEvent_header_isResolved">{param.colDef.headerName}</div>)
    // },
    // {
    //   field: 'resolutionTime',
    //   headerName: translate("label:SecurityEventListView.resolutionTime"),
    //   flex: 1,
    //   renderCell: (param) => (<div data-testid="table_SecurityEvent_column_resolutionTime"> {param.row.resolutionTime ? dayjs(param.row.resolutionTime)?.format("DD.MM.YYYY HH:mm") : ""} </div>),
    //   renderHeader: (param) => (<div data-testid="table_SecurityEvent_header_resolutionTime">{param.colDef.headerName}</div>)
    // },
    // {
    //   field: 'resolutionNotes',
    //   headerName: translate("label:SecurityEventListView.resolutionNotes"),
    //   flex: 1,
    //   renderCell: (param) => (<div data-testid="table_SecurityEvent_column_resolutionNotes"> {param.row.resolutionNotes} </div>),
    //   renderHeader: (param) => (<div data-testid="table_SecurityEvent_header_resolutionNotes">{param.colDef.headerName}</div>)
    // },
    // {
    //   field: 'userId',
    //   headerName: translate("label:SecurityEventListView.userId"),
    //   flex: 1,
    //   renderCell: (param) => (<div data-testid="table_SecurityEvent_column_userId"> {param.row.userId} </div>),
    //   renderHeader: (param) => (<div data-testid="table_SecurityEvent_header_userId">{param.colDef.headerName}</div>)
    // },
  ];

  return (
    <Box style={{ margin: 30 }}>
      <PageGrid
        title={translate("label:SecurityEventListView.entityTitle")}
        onDeleteClicked={(id: number) => {}}
        columns={columns}
        hideActions
        hideAddButton
        data={store.data}
        tableName="Service" />
    </Box>
  );
})



export default SecurityEventListView
