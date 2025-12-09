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
import Faq_questionPopupForm from './../faq_questionAddEditView/popupForm'
import styled from 'styled-components';


type faq_questionListViewProps = {
};


const faq_questionListView: FC<faq_questionListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;


  useEffect(() => {
    store.loadfaq_questions()
    return () => {
      store.clearStore()
    }
  }, [])


  const columns: GridColDef[] = [

    {
      field: 'title',
      headerName: translate("label:faq_questionListView.title"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_faq_question_column_title"> {param.row.title} </div>),
      renderHeader: (param) => (<div data-testid="table_faq_question_header_title">{param.colDef.headerName}</div>)
    },
    {
      field: 'answer',
      headerName: translate("label:faq_questionListView.answer"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_faq_question_column_answer"> {param.row.answer} </div>),
      renderHeader: (param) => (<div data-testid="table_faq_question_header_answer">{param.colDef.headerName}</div>)
    },
    {
      field: 'video',
      headerName: translate("label:faq_questionListView.video"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_faq_question_column_video"> {param.row.video} </div>),
      renderHeader: (param) => (<div data-testid="table_faq_question_header_video">{param.colDef.headerName}</div>)
    },
    {
      field: 'is_visible',
      headerName: translate("label:faq_questionListView.is_visible"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_faq_question_column_is_visible"> {param.row.is_visible} </div>),
      renderHeader: (param) => (<div data-testid="table_faq_question_header_is_visible">{param.colDef.headerName}</div>)
    },
    {
      field: 'settings',
      headerName: translate("label:faq_questionListView.settings"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_faq_question_column_settings"> {param.row.settings} </div>),
      renderHeader: (param) => (<div data-testid="table_faq_question_header_settings">{param.colDef.headerName}</div>)
    },
  ];

  let type1: string = 'form';
  let component = null;
  switch (type1) {
    case 'form':
      component = <PageGrid
        title={translate("label:faq_questionListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deletefaq_question(id)}
        columns={columns}
        data={store.data}
        tableName="faq_question" />
      break
    case 'popup':
      component = <PopupGrid
        title={translate("label:faq_questionListView.entityTitle")}
        onDeleteClicked={(id: number) => store.deletefaq_question(id)}
        onEditClicked={(id: number) => store.onEditClicked(id)}
        columns={columns}
        data={store.data}
        tableName="faq_question" />
      break
  }


  return (
    <Container maxWidth='xl' sx={{ mt: 4 }}>
      {component}

      <Faq_questionPopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        onBtnCancelClick={() => store.closePanel()}
        onSaveClick={() => {
          store.closePanel()
          store.loadfaq_questions()
        }}
      />

    </Container>
  );
})



export default faq_questionListView
