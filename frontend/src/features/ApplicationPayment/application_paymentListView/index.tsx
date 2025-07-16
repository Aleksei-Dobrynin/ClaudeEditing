import { FC, useEffect } from 'react';
import {
    Box,
    Container,
    Grid,
    IconButton,
    InputAdornment,
    Paper, Chip
} from "@mui/material";
import PageGrid from 'components/PageGrid';
import { observer } from "mobx-react"
import store from "./store"
import { useTranslation } from 'react-i18next';
import { GridColDef } from '@mui/x-data-grid';
import PopupGrid from 'components/PopupGrid';
import CustomButton from "components/Button";
import MtmLookup from "components/mtmLookup";
import DateField from 'components/DateField';
import PageGridPagination from "components/PageGridPagination";
import dayjs, { Dayjs } from 'dayjs';



type application_paymentListViewProps = {
    idMain: number;
};

const application_paymentListView: FC<application_paymentListViewProps> = observer((props) => {
    const { t } = useTranslation();
    const translate = t;


    useEffect(() => {
        if (store.idMain !== props.idMain) {
            store.idMain = props.idMain
        }
        store.forApplication = false;
        store.load_structures()
        store.loadapplication_payments()
        return () => store.clearStore()
    }, [props.idMain])

    const columns: GridColDef[] = [
        {
            field: 'sum',
            headerName: translate("label:application_paymentListView.sum"),
            flex: 1,
            renderCell: (param) => (<div data-testid="table_application_payment_column_sum"> {param.row.sum} </div>),
            renderHeader: (param) => (<div data-testid="table_application_payment_header_sum">{param.colDef.headerName}</div>)
        },
        {
            field: 'stucture_name',
            headerName: translate("label:application_paymentListView.structure_id"),
            flex: 1,
            renderCell: (param) => (<div data-testid="table_application_payment_column_stucture_name"> {param.row.structure_name} </div>),
            renderHeader: (param) => (<div data-testid="table_application_payment_header_stucture_name">{param.colDef.headerName}</div>)
        },
    ];

    let type1: string = 'form';
    let component = null;
    switch (type1) {
        case 'form':
            component = <PageGrid
                columns={columns}
                data={store.data}
                tableName="Application"
                onDeleteClicked={(id: number) => store.deleteapplication_payment(id)}
                hideActions={true}
                hideAddButton={true}
            />;
            break
        case 'popup':
            component = <PopupGrid
                title={translate("label:application_paymentListView.entityTitle")}
                onDeleteClicked={(id: number) => store.deleteapplication_payment(id)}
                onEditClicked={(id: number) => store.onEditClicked(id)}
                columns={columns}
                data={store.data}
                tableName="application_payment" />
            break
    }

    return (
        <Container maxWidth="xl">

            <h2>Калькуляция по отделам</h2>
            <Paper elevation={5} style={{ width: "100%", padding: 20, marginBottom: 20 }}>
                <Box sx={{ display: { sm: "flex" } }} justifyContent={"space-between"}>
                    <Grid container spacing={2}>
                        <Grid item md={6} xs={12}>
                            <DateField
                                label={translate("label:ApplicationListView.startDate")}
                                name="startDate"
                                value={store.startDate}
                                onChange={(event) => store.changeDateStart(event.target.value)}
                                helperText={store.errors_startDate}
                                error={!!store.errors_startDate}

                                id='ApplicationListView_startDate'
                            />
                        </Grid>
                        <Grid item md={6} xs={12}>
                            <DateField
                                label={translate("label:ApplicationListView.endDate")}
                                name="endDate"
                                value={store.endDate}
                                onChange={(event) => store.changeDateEnd(event.target.value)}
                                helperText={store.errors_endDate}
                                error={!!store.errors_endDate}
                                id='ApplicationListView_endDate'
                            />
                        </Grid>
                        <Grid item md={12} xs={12}>
                            <MtmLookup
                                label={translate("label:application_paymentListView.searchByStructure")}
                                name="departments_ids"
                                value={store.structures_ids}
                                data={store.structures}
                                onChange={(name, value) => store.changeDepartments(value)}
                            />
                        </Grid>
                    </Grid>
                    <Box display={"flex"} flexDirection={"column"} sx={{ ml: 2 }} alignItems={"center"}>
                        <Box sx={{ minWidth: 80 }}>
                            <CustomButton
                                variant="contained"
                                id="searchFilterButton"
                                onClick={() => {
                                    store.loadapplication_payments();
                                }}
                            >
                                {translate("search")}
                            </CustomButton>
                        </Box>
                        {(store.endDate !== dayjs()
                            || store.startDate !== dayjs()
                            || store.structures_ids.length > 0
                        ) && <Box sx={{ mt: 2 }}>
                                <CustomButton
                                    id="clearSearchFilterButton"
                                    onClick={() => {
                                        store.clearFilter();
                                        store.loadapplication_payments();
                                    }}
                                >
                                    {translate("clear")}
                                </CustomButton>
                            </Box>}
                    </Box>
                </Box>
            </Paper>

            {component}

        </Container>
    );
})

export default application_paymentListView
