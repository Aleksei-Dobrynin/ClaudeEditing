import React, { useEffect } from "react";
import store from "./store";
import { GridColDef } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { Chip, Dialog, DialogActions, DialogContent, Tooltip } from "@mui/material";
import { useTranslation } from "react-i18next";
import CustomButton from "../../../components/Button";
import { observer } from "mobx-react";
import dayjs from "dayjs";
import { APPLICATION_STATUSES } from "../../../constants/constant";
import PageGridPagination from "../../../components/PageGridPagination";
import Legal_act_registryListView from "features/legal_act_registry/legal_act_registryListView";
import Legal_record_registryListView from "features/legal_record_registry/legal_record_registryListView";

const PopupApplicationListView = observer(() => {
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    if (store.openCustomerApplicationDialog) store.loadApplications()
  }, [store.openCustomerApplicationDialog]);

  const columns: GridColDef[] = [
    {
      field: "number",
      headerName: translate("label:ApplicationListView.number"),
      flex: 0.4,
      renderCell: (params) => {
        return <Link
          style={{ textDecoration: "underline", marginLeft: 5 }}
          target="_blank"
          to={`/user/Application/addedit?id=${params.row.id}`}>
          {params.value}
        </Link>;
      }
    },
    {
      field: "status_name",
      headerName: translate("label:ApplicationListView.status_name"),
      flex: 0.7,
      renderCell: (params) => (
        <Chip
          variant="outlined"
          label={params.value}
          style={{ backgroundColor: params.row.status_color }}
        />
      )
    },
    {
      field: "service_name",
      headerName: translate("label:ApplicationListView.service_name"),
      flex: 1,
      renderCell: (params) => {
        return <div>
          <Tooltip title={<>{params.row.service_name} ({params.row.day_count})</>}>
            <span style={{ textWrap: "wrap" }}>{params.row.service_name} ({params.row.day_count})</span>
          </Tooltip>
        </div>
      }
    },
    {
      field: "arch_object_address",
      headerName: translate("label:ApplicationListView.arch_object_address"),
      flex: 1.2,
      display: "flex",
      renderCell: (params) => {
        return <div>
          <div>
            {params.value}
          </div>
          <div>
            {params.row.arch_object_district}
          </div>
        </div>;
      }
    },
    {
      field: "customer_name",
      headerName: translate("label:ApplicationListView.customer_name"),
      flex: 1.5,
      display: "flex",
      renderCell: (params) => {
        return <div>
          <div>
            {params.value}
          </div>
          <div>
            {params.row.customer_pin} {params.row.customer_contacts}
          </div>
        </div>;
      }
    },
    {
      field: "deadline",
      headerName: translate("label:ApplicationListView.Registration_time_and_deadline"),
      display: "flex",
      flex: 0.7,
      renderCell: (params) => {
        let dealineColor = null;
        let deadlineTooltip = "";
        if (params.value) {
          const deadline = dayjs(params.value);
          if (params.row.status_code === APPLICATION_STATUSES.review
            || params.row.status_code === APPLICATION_STATUSES.draft
            || params.row.status_code === APPLICATION_STATUSES.service_requests
            || params.row.status_code === APPLICATION_STATUSES.preparation
            || params.row.status_code === APPLICATION_STATUSES.executor_assignment
            || params.row.status_code === APPLICATION_STATUSES.return_to_eo
            || params.row.status_code === APPLICATION_STATUSES.ready_for_eo
            || params.row.status_code === APPLICATION_STATUSES.rejection_ready
          ) {
            if (deadline < dayjs()) {
              dealineColor = "red";
              deadlineTooltip = `Срок выполнения просрочен на ${dayjs().set('hour', 23).set('minute', 59).diff(deadline, 'day')} дней`
            } else if (deadline < dayjs().add(1, "day")) {
              dealineColor = "#0000FF";
            } else if (deadline < dayjs().add(3, "day")) {
              dealineColor = "#FF00FF";
            } else if (deadline < dayjs().add(7, "day")) {
              dealineColor = "#9105fc";
            }
          }
        }

        return <div>
          <div>
            <span>
              {params.row.registration_date ? dayjs(params.row.registration_date).format("DD.MM.YYYY HH:mm") : ""}
            </span>
          </div>
          <div>
            <Tooltip title={deadlineTooltip} placement="bottom">
              <span style={{ color: dealineColor, fontWeight: 700 }}>
                {params.value ? dayjs(params.value).format("DD.MM.YYYY") : ""}
              </span>
            </Tooltip>

          </div>
        </div>;
      }
    },
    {
      field: "assigned_employees_names",
      sortable: false,
      headerName: translate("label:ApplicationListView.Performers"),
      flex: 1.5,
      renderCell: (params) => {
        return (
          <span>
            {params.row.assigned_employees_names}
          </span>
        )
      }
    },
  ];
  return (
    <Dialog open={store.openCustomerApplicationDialog} onClose={null} maxWidth={"xl"} fullWidth={true}>
      <DialogContent>
        <PageGridPagination
          title={translate("label:ApplicationListView.entityTitle")}
          showCount={true}
          page={store.filter.pageNumber}
          pageSize={store.filter.pageSize}
          totalCount={store.totalCount}
          hideActions
          hideAddButton={true}
          changePagination={(page, pageSize) => store.changePagination(page, pageSize)}
          changeSort={(sortModel) => store.changeSort(sortModel)}
          searchText={""}
          columns={columns}
          data={store.applications}
          tableName="Application" />
        {store.legalActs?.length > 0 && <Legal_act_registryListView address={store.filter.address} data={store.legalActs} />}
        {store.legalRecords?.length > 0 && <Legal_record_registryListView address={store.filter.address} data={store.legalRecords} />}
      </DialogContent>

      <DialogActions>
        <DialogActions>
          <CustomButton
            variant="contained"
            id="id_ApplicationCancelButton"
            onClick={() => {
              store.handleChange({
                target: {
                  name: "openCustomerApplicationDialog",
                  value: !store.openCustomerApplicationDialog
                }
              });
              store.clearStore();
            }}
          >
            {translate("common:cancel")}
          </CustomButton>
        </DialogActions>
      </DialogActions >
    </Dialog >
  );
});

export default PopupApplicationListView;