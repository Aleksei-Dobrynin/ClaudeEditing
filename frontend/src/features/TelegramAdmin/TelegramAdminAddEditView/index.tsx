import React, { FC, useEffect } from "react";
import BaseTelegramAdminView from "./base";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router";
import { Box, Container } from "@mui/material";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react";
import store from "./store";
import PageGridTelegram from "./pageGrid";
import { GridColDef } from "@mui/x-data-grid";
import TelegramAdminPopupForm from "./popupForm";
import CustomButton from "../../../components/Button";

type TelegramAdminProps = {};

const TelegramAdminAddEditView: FC<TelegramAdminProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  const navigate = useNavigate();
  const query = useQuery();
  const id = query.get("id")

  useEffect(() => {
    if ((id != null) &&
      (id !== '') &&
      !isNaN(Number(id.toString()))) {
      store.doLoad(Number(id))
    } else {
      navigate('/error-404')
    }
    return () => {
      store.clearStore()
    }
  }, [])

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: translate("label:TelegramAdminAddEditView.titleQuestions"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_name_column_name"> {param.row.name} </div>),
      renderHeader: (param) => (<div data-testid="table_name_header_name">{param.colDef.headerName}</div>)
    },{
      field: 'name_kg',
      headerName: translate("label:TelegramAdminAddEditView.titleQuestionsKg"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_name_kg_column_name"> {param.row.name_kg} </div>),
      renderHeader: (param) => (<div data-testid="table_name_kg_header_name">{param.colDef.headerName}</div>)
    },{
      field: 'answer',
      headerName: translate("label:TelegramAdminAddEditView.titleAnswers"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_task_type_column_name"> {param.row.answer} </div>),
      renderHeader: (param) => (<div data-testid="table_task_type_header_name">{param.colDef.headerName}</div>)
    },{
      field: 'answer_kg',
      headerName: translate("label:TelegramAdminAddEditView.titleAnswersKg"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_answer_kg_column_name"> {param.row.answer_kg} </div>),
      renderHeader: (param) => (<div data-testid="table_answer_kg_header_name">{param.colDef.headerName}</div>)
    },
  ];

  return (
    <>
      <BaseTelegramAdminView {...props}>
      </BaseTelegramAdminView>

      <Container maxWidth='xl' sx={{ mt: 4 }}>
        {id !== "0" && (
          <PageGridTelegram
            title={translate("label:TelegramAdminAddEditView.titleQuestionsAndAnswer")}
            columns={columns}
            data={store.dataQuestions}
            tableName="Questions"
            onEditClicked={store.onEditClicked}
            onDeleteClicked={store.deleteQuestion}
          />
        )}
        <Box m={2}>
          <CustomButton
            variant="contained"
            id="id_task_typeCloseButton"
            name={'task_typeAddEditView.close'}
            onClick={() => navigate('/user/TelegramAdmin')}
          >
            {translate("common:close")}
          </CustomButton>
        </Box>
      </Container>
      <TelegramAdminPopupForm
        openPanel={store.openPanel}
        id={store.currentId}
        onBtnCancelClick={store.closePanel}
        onSaveClick={()=> {}}
        load={store.loadOnePopUp}
      />
    </>
  );
})

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default TelegramAdminAddEditView