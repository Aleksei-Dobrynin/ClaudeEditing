import { TreeTable } from 'primereact/treetable';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import React from 'react';
import { observer } from 'mobx-react';
import { Box, Card, Chip, IconButton, Paper, Tooltip, Typography } from '@mui/material';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import store from './store';
import { useTranslation } from 'react-i18next';
import CustomButton from 'components/Button';
import { Link as RouterLink, useNavigate } from "react-router-dom";
import EditIcon from '@mui/icons-material/Edit';
import dayjs from 'dayjs';
import CustomTextField from 'components/TextField';
import styled from 'styled-components';
import DateField from 'components/DateField';
import { Paginator, PaginatorPageChangeEvent } from 'primereact/paginator';


type TreeTasksViewProps = {

}

const TreeTasksView: React.FC<TreeTasksViewProps> = observer((props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const translate = t;
  const [products, setProducts] = React.useState([{
    id: '1000',
    code: 'f230fh0g3',
    name: 'Bamboo Watch',
    description: 'Product Description',
    image: 'bamboo-watch.jpg',
    price: 65,
    category: 'Accessories',
    quantity: 24,
    inventoryStatus: 'INSTOCK',
    rating: 5
  }, {
    id: '1001',
    code: 'f230fh0g3',
    name: 'Bamboo Watch',
    description: 'Product Description',
    image: 'bamboo-watch.jpg',
    price: 65,
    category: 'Accessories',
    quantity: 24,
    inventoryStatus: 'INSTOCK',
    rating: 5
  }, {
    id: '1002',
    code: 'f230fh0g3',
    name: 'Bamboo Watch',
    description: 'Product Description',
    image: 'bamboo-watch.jpg',
    price: 65,
    category: 'Accessories',
    quantity: 24,
    inventoryStatus: 'INSTOCK',
    rating: 5
  }]);


  const onPageChange = (event: PaginatorPageChangeEvent) => {
    store.page = event.first;
    store.pageSize = event.rows;
    store.loadapplication_tasks();
  };

  return (
    <Card component={Paper} elevation={3} sx={{ m: 2, p: 2, pt: 0 }}>

      <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"}>

        <h1>{translate("label:application_taskListView.allTasks")}</h1>

        <Box display={"flex"} alignItems={"center"}>

          <Box sx={{ ml: 1 }}>
            <DateField
              value={store.date_start != null ? dayjs(new Date(store.date_start)) : null}
              onChange={(event) => store.changeDateStart(event.target.value)}
              name="date_start"
              id="filterByDateStart"
              label={translate("label:ApplicationListView.filterByDateStart")}
              helperText={""}
              error={false}
            />
          </Box>
          <Box sx={{ ml: 1 }}>
            <DateField
              value={store.date_end != null ? dayjs(new Date(store.date_end)) : null}
              onChange={(event) => store.changeDateEnd(event.target.value)}
              name="date_end"
              id="filterByDateEnd"
              label={translate("label:ApplicationListView.filterByDateEnd")}
              helperText={""}
              error={false}
            />
          </Box>
          <Box sx={{ maxWidth: 700, minWidth: 500, ml: 1 }} display={"flex"} alignItems={"center"}>

            <CustomTextField
              value={store.searchField}
              onChange={(e) => store.changeSearch(e.target.value)}
              label={translate("label:application_taskListView.tasks_allFilter")}
              onKeyDown={(e) => e.keyCode === 13 && store.loadapplication_tasks()}
              name="TaskSearchField"
              id="TaskSearchField"
            />
            <CustomButton sx={{ ml: 1 }} variant='contained' size="small" onClick={() => { store.loadapplication_tasks() }}>
              {translate("common:Find")}
            </CustomButton>
          </Box>
        </Box>

      </Box>

      <TreeTable
        value={store.data} tableStyle={{ minWidth: '50rem' }}>

        <Column style={{ width: 100 }} body={(data) => {
          return <Box display={"flex"} alignItems={"center"}>
            <StyledRouterLink to={`/user/application_task/addedit?id=${data.id}&back=all`}>
              <Typography
              >
                {data.application_number}
              </Typography>
            </StyledRouterLink>
          </Box>
        }} field="application_number" header={translate("Номер")}></Column>
        <Column style={{ width: 150 }} body={(data) => {
          return <Chip size="small" label={data.status_idNavName} style={{ background: data.status_backcolor, color: data.status_textcolor }} />
        }} field="status_idNavName" header={translate("label:application_taskListView.status_id")}></Column>
        <Column body={(data) => {
          return <div>
            {data.service_name}<br />
            {data.work_description}
          </div>
        }} field="service_name" header={translate("label:application_taskListView.service_name")}></Column>
        <Column style={{ maxWidth: 350 }} field="assignees" header={translate("Исполнители")}
          body={(data) => {
            return <>{data.assignees}</>
          }}></Column>
        <Column field="address" header={translate("label:application_taskListView.address")}
          body={(data) => {
            return <>{data.address}</>
          }}></Column>
        <Column body={(data) => {
          return <div>Контакты: {data.contact}<br />ИНН: {data.pin}<br />{data.full_name}<br /></div>
        }} field="full_name" header={translate("label:application_taskListView.full_name")}></Column>

        <Column
          body={(data) => {
            const { task_deadline, status_backcolor, status_textcolor } = data;

            if (!task_deadline) {
              return (
                <Chip
                  size="small"
                  label={translate("label:application_taskListView.no_deadline")}
                  style={{ background: '#9e9e9e', color: '#ffffff' }}
                />
              );
            }

            const daysLeft = dayjs(task_deadline).diff(dayjs(), 'day');

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
                label={dayjs(task_deadline).format('DD.MM.YYYY')}
                style={{ background: backgroundColor, color: status_textcolor }}
              />
            );
          }}
          field="deadline"
          style={{ width: 150 }}
          header={translate("label:application_taskListView.task_deadline")}
        />

        <Column
          body={(data) => {
            const { app_deadline, status_backcolor, status_textcolor } = data;
            if (!app_deadline) {
              return (
                <Chip
                  size="small"
                  label={translate("label:application_taskListView.no_deadline")}
                  style={{ background: '#9e9e9e', color: '#ffffff' }}
                />
              );
            }
            const daysLeft = dayjs(app_deadline).diff(dayjs(), 'day');
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
                label={dayjs(app_deadline).format('DD.MM.YYYY')}
                style={{ background: backgroundColor, color: status_textcolor }}
              />
            );
          }}
          field="app_deadline"
          style={{ width: 150 }}
          header={translate("Дедлайн заявки")}
        />

      </TreeTable>

      <div className="card">
        <Paginator first={store.page} rows={store.pageSize} totalRecords={store.totalCount} rowsPerPageOptions={[10, 25, 100]} onPageChange={onPageChange} />
      </div>
    </Card>
  );

})
const StyledRouterLink = styled(RouterLink)`
  &:hover{
    text-decoration: underline;
  }
  color: #0078DB;
`


export default TreeTasksView;