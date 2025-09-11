import React, { FC, useEffect } from 'react';
import {
  Container, Dialog, DialogContent, DialogTitle, List, ListItem
} from "@mui/material";
import PageGrid from 'components/PageGrid';
import { observer } from "mobx-react"
import store from "./store"
import { useTranslation } from 'react-i18next';
import { GridColDef } from '@mui/x-data-grid';
import dayjs from "dayjs";
import Button from "@mui/material/Button";

type SignDocumentsListViewProps = {};

const SignDocumentsListView: FC<SignDocumentsListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    store.loadSignDocumentss()
    return () => {
      store.clearStore()
    }
  }, [])

  const columns: GridColDef[] = [
    {
      field: 'structure_fullname',
      headerName: translate("label:SignDocumentsListView.structure_fullname"),
      flex: 1
    },
    {
      field: 'file_name',
      headerName: translate("label:SignDocumentsListView.file_name"),
      flex: 1
    },
    {
      field: 'file_type',
      headerName: translate("label:SignDocumentsListView.file_type"),
      flex: 1
    },
    {
      field: 'timestamp',
      headerName: translate("label:SignDocumentsListView.timestamp"),
      flex: 1,
      renderCell: (params) => (
        <span>
          {params.value ? dayjs(params.value).format('DD.MM.YYYY HH:mm') : ""}
        </span>
      )
    },
    {
      field: 'application_number',
      headerName: translate("label:SignDocumentsListView.application_number"),
      flex: 1
    },
    {
      field: 'actions',
      headerName: translate("actions"),
      flex: 1,
      renderCell: (params) => (
        <Button
          variant="outlined"
          size="small"
          onClick={() => {
            store.loadSigners(params.row.file_id);
            store.dialogOpen = true;
          }}
        >
          {translate("label:SignDocumentsListView.signers")}
        </Button>
      )
    }
  ];

  let component = <PageGrid
    title={translate("label:SignDocumentsListView.entityTitle")}
    onDeleteClicked={() => {}}
    columns={columns}
    hideAddButton={true}
    hideActions={true}
    data={store.data}
    tableName="FilterApplication" />;

  return (
    <Container maxWidth='xl' style={{ marginTop: 30 }}>
      {component}
      <Dialog open={store.dialogOpen} onClose={() => {store.dialogOpen = false; store.signers = [] }} fullWidth>
        <DialogTitle>{translate("label:SignDocumentsListView.signers")}</DialogTitle>
        <DialogContent>
          <table>
            {store.signers.map((s, i) => (
              <tr key={i}>
                <td>{s.employee_fullname}</td>
                <td>{s.structure_fullname}</td>
                <td>{s.timestamp ? dayjs(s.timestamp).format("DD.MM.YYYY HH:mm") : ""}</td>
              </tr>
            ))}
          </table>
        </DialogContent>
      </Dialog>
    </Container>
  );
})


export default SignDocumentsListView
