import { FC } from "react";
import {
  Container, Grid
} from "@mui/material";
import PageGrid from "components/PageGrid";
import { observer } from "mobx-react";
import store from "./store";
import { useTranslation } from "react-i18next";
import { GridColDef } from "@mui/x-data-grid";
import AutocompleteCustom from "../../components/Autocomplete";
import * as React from "react";
import DateField from "../../components/DateField";

type ApplicationsCategoryCountListViewProps = {};


const ApplicationsCategoryCountListView: FC<ApplicationsCategoryCountListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: translate("label:ApplicationsCategoryCountListView.name"),
      flex: 1
    },
    {
      field: "completed",
      headerName: translate("label:ApplicationsCategoryCountListView.completed"),
      flex: 1
    },
    {
      field: "in_work",
      headerName: translate("label:ApplicationsCategoryCountListView.in_work"),
      flex: 1
    },
    {
      field: "refusal",
      headerName: translate("label:ApplicationsCategoryCountListView.refusal"),
      flex: 1
    },
    {
      field: "all_count",
      headerName: translate("label:ApplicationsCategoryCountListView.all_count"),
      flex: 1
    }
  ];

  let component = <PageGrid
    title={translate("Зарегистрированные заявки за период по услугам")}
    columns={columns}
    pageSize={100}
    hideActions={true}
    hideAddButton={true}
    data={store.ApplicationsCategoryCount}
    hustomHeader={<><Grid container spacing={2}>
      <Grid item xs={12} md={3}>
        <DateField
          value={store.category_count_date_start}
          onChange={(event) => {
            store.category_count_date_start = event.target.value;
            store.loadApplicationsCategoryCount();
          }}
          name="category_count_date_start"
          id="id_f_category_count_date_start"
          label={translate("label:Dashboard.startDate")}
          helperText={""}
        />
      </Grid>
      <Grid item xs={12} md={3}>
        <DateField
          value={store.category_count_date_end}
          onChange={(event) => {
            store.category_count_date_end = event.target.value;
            store.loadApplicationsCategoryCount();
          }}
          name="category_count_date_end"
          id="id_f_category_count_date_end"
          label={translate("label:Dashboard.endDate")}
          helperText={""}
        />
      </Grid>
      <Grid item xs={12} md={3}>
        <AutocompleteCustom
          value={store.category_count_district_id}
          onChange={(event) => {
            store.category_count_district_id = event.target.value;
            store.loadApplicationsCategoryCount();
          }}
          name="category_count_district_id"
          data={store.Districts}
          fieldNameDisplay={(f) => f.name}
          id="category_count_district_id"
          label={translate("label:Dashboard.District")}
          helperText={""}
          error={false}
        />
      </Grid>
      <Grid item xs={12} md={3}>
        <AutocompleteCustom
          value={store.category_count_is_paid_id}
          onChange={(event) => {
            store.category_count_is_paid_id = event.target.value;
            store.loadApplicationsCategoryCount();
          }}
          name="category_count_is_paid"
          data={[{id: 1, name: 'Оплачено', code: 'paid'}, {id: 2, name: 'Не оплаченно', code: 'not_paid'}]}
          fieldNameDisplay={(f) => f.name}
          id="category_count_is_paid"
          label={translate("label:Dashboard.Payment_status")}
          helperText={""}
          error={false}
        />
      </Grid>
    </Grid>
      <br />
    </>
    }
    tableName="ApplicationsCategoryCount" />;

  return (
    <Container maxWidth="xl" style={{ marginTop: 30 }}>
      {component}
    </Container>
  );
});


export default ApplicationsCategoryCountListView;
