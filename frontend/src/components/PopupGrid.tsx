import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import {
  DataGrid,
  GridColDef,
  GridActionsCellItem,
} from '@mui/x-data-grid';
import { observer } from 'mobx-react';
import { Box, Paper, Tooltip } from "@mui/material";
import CustomButton from './Button';
import { useTranslation } from 'react-i18next';
import Typography from "@mui/material/Typography";

type GridProps = {
  columns: GridColDef[];
  data: any;
  onDeleteClicked: (id: number) => void;
  onEditClicked: (id: number) => void;
  title?: string;
  tableName: string;
  hideAddButton?: boolean;
  hideEditButton?: boolean;
  hideDeleteButton?: boolean;
  customActionButton?: (id: number) => React.ReactNode;
  customBottom?: React.ReactNode;
  hideTitle?: boolean;
  hideActions?: boolean;
  canEdit?: (row: any) => boolean;
  canDelete?: (row: any) => boolean;
  pageSize?: number
  checkbox?: React.ReactNode;
}

const PopupGrid = observer((props: GridProps) => {
  const { t } = useTranslation();
  const translate = t;

  const actions: GridColDef[] = [{
    field: 'actions',
    type: 'actions',
    headerName: translate('actions'),
    width: 150,
    cellClassName: 'actions',
    getActions: ({ id, row }) => {
      const canEdit = props.canEdit ? props.canEdit(row) : true;
      const canDelete = props.canDelete ? props.canDelete(row) : true;

      let buttons = [];

      if (canEdit && !props.hideEditButton) {
        buttons.push(
          <GridActionsCellItem
            icon={<Tooltip title={translate('edit')}><EditIcon /></Tooltip>}
            label="Edit"
            className="textPrimary"
            data-testid={`${props.tableName}EditButton`}
            onClick={() => props.onEditClicked(id as number)}
            color="inherit"
          />
        );
      }

      if (canDelete && !props.hideDeleteButton) {
        buttons.push(
          <GridActionsCellItem
            icon={<Tooltip title={translate('delete')}><DeleteIcon /></Tooltip>}
            label="Delete"
            data-testid={`${props.tableName}DeleteButton`}
            onClick={() => props.onDeleteClicked(id as number)}
            color="inherit"
          />
        );
      }
      if (props.customActionButton) {
        buttons.push(props.customActionButton(id as number));
      }

      return buttons;
    },
  }];

  let res = props.columns;
  if (!props.hideActions) {
    res = actions.concat(props.columns);
  }

  return (
    <Paper elevation={5} style={{ width: '100%', padding: 20 }}>
      <Box sx={{display: "flex", width: "100%", alignItems: "center"}}>
        {props.hideTitle ? null : <h1 data-testid={`${props.tableName}HeaderTitle`}>{props.title}</h1>}
        {props.checkbox ? <Typography sx={{ml: "auto"}}>{props.checkbox}</Typography> : null}
      </Box>


      {!props.hideAddButton && (
        <CustomButton
          variant='contained'
          sx={{ mb: 1 }}
          id={`${props.tableName}AddButton`}
          onClick={() => props.onEditClicked(0)}
          endIcon={<AddIcon />}
        >
          {translate('add')}
        </CustomButton>
      )}
      {props.customBottom}

      <DataGrid
        rows={props.data}
        columns={res}
        initialState={{
          pagination: { paginationModel: { pageSize: props.pageSize ? props.pageSize : 10 } },
        }}
        pageSizeOptions={[10, 25, 100]}
        data-testid={`${props.tableName}Table`}
        editMode="row"
        rowSelection={false}
      />
    </Paper>
  );
});

export default PopupGrid;