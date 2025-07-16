import React, { useEffect } from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { GridColDef } from "@mui/x-data-grid";
import { Container, Grid, Paper } from "@mui/material";
import PageGrid from "../../../components/PageGrid";
import store from "./store";
import Diagram from "./Diagram";
import DiagramQuestions from "./DiagramQuestioms";



type props = {

}


const TelegramAdminListVew: React.FC<props> = observer((props) => {

  const { t } = useTranslation();
  const translate = t;

  useEffect(  () => {
    const load = async () => {
      await store.loadSubjects()
      await store.loadQuestions();
      await store.loadChatsGroupByMonth();
      await  store.loadClickedQuestionsCounts();
    }
    load();
  }, []);


  const columns: GridColDef[] = [

    {
      field: 'name',
      headerName: translate("label:TelegramAdminListView.name"),
      flex: 1,
      renderCell: (param) => (<div data-testid="table_task_type_column_name"> {param.row.name} </div>),
      renderHeader: (param) => (<div data-testid="table_task_type_header_name">{param.colDef.headerName}</div>)
    }
  ];

  let type1: string = 'form';
  let component = null;
  switch (type1) {
    case 'form':
      component =
        <PageGrid
          title={translate("label:TelegramAdminListView.entityTitle")}
          onDeleteClicked={(id: number) => store.deleteSubjects(id)}
          columns={columns}
          data={store.data}
          tableName="TelegramAdmin" />

      break
    // case 'popup':
    //   component = <PopupGrid
    //     title={translate("label:task_typeListView.entityTitle")}
    //     onDeleteClicked={(id: number) => store.deletetask_type(id)}
    //     onEditClicked={(id: number) => store.onEditClicked(id)}
    //     columns={columns}
    //     data={store.data}
    //     tableName="task_type" />
    //   break
  }

  return (
    <Container maxWidth='xl' sx={{ mt: 4 }}>
      {component}

      {/*<Task_typePopupForm*/}
      {/*  openPanel={store.openPanel}*/}
      {/*  id={store.currentId}*/}
      {/*  onBtnCancelClick={() => store.closePanel()}*/}
      {/*  onSaveClick={() => {*/}
      {/*    store.closePanel()*/}
      {/*    // store.loadtask_types()*/}
      {/*  }}*/}
      {/*/>*/}
      <Grid container spacing={2}>
        <Grid item md={12} xs={5}>
          <Diagram chars={store.dataChars}/>
        </Grid>
        <Grid item md={12} xs={5}>
          <DiagramQuestions questionsCount={store.dataQuestionsWithCount}/>
        </Grid>
      </Grid>

    </Container>
  )
})

export default TelegramAdminListVew;