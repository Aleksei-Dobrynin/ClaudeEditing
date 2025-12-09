import { TreeTable } from 'primereact/treetable';
import { Column } from 'primereact/column';
import React from 'react';
import { observer } from 'mobx-react';
import { Box, Card, Chip, IconButton, Paper, Tooltip, Typography } from '@mui/material';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import store from './store';
import { useTranslation } from 'react-i18next';
import CustomButton from 'components/Button';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import dayjs from 'dayjs';
import CustomTextField from 'components/TextField';


type TreeTasksViewProps = {

}

const TreeTasksView: React.FC<TreeTasksViewProps> = observer((props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const translate = t;

  return (
    <Card component={Paper} elevation={3} sx={{ m: 2, p: 2, pt: 0 }}>

      <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"}>

        <h1>{store.my_tasks ? translate("label:application_taskListView.myTasks") : translate("label:application_taskListView.orgTasks")}</h1>

        <Box sx={{ maxWidth: 500, minWidth: 300, mt: 2, ml: 1 }} display={"flex"} alignItems={"center"}>

          <CustomTextField
            value={store.searchField}
            onChange={(e) => store.changeSearch(e.target.value)}
            label={translate("label:application_taskListView.Search")}
            onKeyDown={(e) => e.keyCode === 13 && store.loadapplication_tasks()}
            name="TaskSearchField"
            id="TaskSearchField"
          />
          <CustomButton sx={{ ml: 1 }} variant='contained' size="small" onClick={() => { store.loadapplication_tasks() }}>
            {translate("common:Find")}
          </CustomButton>
        </Box>

      </Box>

      <TreeTable value={store.data} paginator rows={10} resizableColumns rowsPerPageOptions={[10, 20, 50]} tableStyle={{ minWidth: '50rem' }}>

        <Column style={{ width: 50 }} body={(data) => {
          return <Tooltip sx={{ mr: 1 }} title={translate('edit')}>
            <IconButton onClick={() => {
              if (data.data.is_task) {
                navigate(`/user/application_task/addedit?id=${data.data.id}`)
              } else {
                navigate(`/user/application_subtask/addedit?id=${data.data.id}`)
              }
            }}>
              <EditIcon />
            </IconButton>
          </Tooltip>
        }} header=""></Column>
        {/*<Column body={(data) => {*/}
        {/*  if (!data.data.is_task) return*/}
        {/*  return <Box display={"flex"} alignItems={"center"}>*/}
        {/*    <CustomButton*/}
        {/*      variant='contained'*/}
        {/*      size="small"*/}
        {/*      onClick={() => navigate(`/user/Application/addedit?id=${data.data.application_id}`)}*/}
        {/*    >*/}
        {/*      Перейти*/}
        {/*    </CustomButton>*/}
        {/*  </Box>*/}
        {/*}} field="application_id" header={translate("label:application_taskListView.application_id")}></Column>*/}
        <Column body={(data) => {
          if (!data.data.is_task) return
          return <Box display={"flex"} alignItems={"center"}>
            <Typography
              onClick={() => navigate(`/user/Application/addedit?id=${data.data.application_id}`)}
              style={{ cursor: "pointer", color: "blue" }} // Добавление стилей для указателя
            >
              {data.data.application_number}
            </Typography>
          </Box>
        }} field="application_number" header={translate("label:application_taskListView.application_number")}></Column>
        {/*<Column field="application_number" sortable header={translate("label:application_taskListView.application_number")}></Column>*/}
        <Column style={{ width: 350 }} field="name" sortable header={translate("label:application_taskListView.name")} expander></Column>
        <Column body={(data) => {
          return <Chip size="small" label={data.data.status_idNavName} style={{ background: data.data.status_backcolor, color: data.data.status_textcolor }} />
        }} field="status_idNavName" sortable header={translate("label:application_taskListView.status_id")}></Column>
        <Column field="service_name" sortable header={translate("label:application_taskListView.service_name")}></Column>
        <Column field="address" sortable header={translate("label:application_taskListView.address")}></Column>
        <Column body={(data) => {
          return <div>Конатакт: {data.data.contact}<br />ИНН: {data.data.pin}<br />{data.data.full_name}<br /></div>
        }} field="full_name" sortable header={translate("label:application_taskListView.full_name")}></Column>



        {/* <Column field="address" sortable header={translate("label:application_taskListView.address")}></Column> */}


        {/* <Column field="structure_idNavName" sortable header={translate("label:application_taskListView.structure_id")}></Column> */}
        {/* <Column field="comment" sortable header={translate("label:application_taskListView.comment")}></Column> */}



        {/* <Column field="type_name" sortable header={translate("label:application_taskListView.type_id")}></Column> */}
        {/* <Column body={(data) => {
          if (!data.data.is_task) return
          return <div >
            {data.data.done_subtasks} из  {data.data.subtasks} </div>
        }} header={translate("label:application_taskListView.progress_sub")}></Column> */}
        <Column
          body={(data) => {
            const { deadline, status_backcolor, status_textcolor } = data.data;

            if (!deadline) {
              return (
                <Chip
                  size="small"
                  label={translate("label:application_taskListView.no_deadline")}
                  style={{ background: '#9e9e9e', color: '#ffffff' }}
                />
              );
            }

            const daysLeft = dayjs(deadline).diff(dayjs(), 'day');

            let backgroundColor = '';
            if (daysLeft > 5) {
              backgroundColor = '#4caf50'; // больше 5
            } else if (daysLeft >= 0) {
              backgroundColor = '#ffeb3b'; // меньше 5
            } else {
              backgroundColor = '#f44336'; // дедлайн прошёл
            }

            return (
              <Chip
                size="small"
                label={dayjs(deadline).format('DD.MM.YYYY')}
                style={{ background: backgroundColor, color: status_textcolor }}
              />
            );
          }}
          field="deadline"
          sortable
          header={translate("label:application_taskListView.deadline")}
        />



      </TreeTable>
    </Card>
  );

})


export default TreeTasksView;