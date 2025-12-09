import { FC } from "react";
import {
  Box,
  Card,
  CardContent,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
} from '@mui/material';
import { observer } from "mobx-react"
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import store from "./store"
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import PaymentStore from 'features/ApplicationPayment/application_paymentListView/store'

type CheckListProps = {};

const CheckList: FC<CheckListProps> = observer((props) => {
  const hasTechDecision = ((store.tech_decision_id > 0 && store.tech_decision_id != null) && (store.tech_decision_id != store.tech_decisions.find(x => x.code == "reject").id && (store.tech_decision_id != store.tech_decisions.find(x => x.code == "reject_nocouncil").id)))
  const hasDistrict = store.district_id > 0 && store.district_id != null
  const hasTypeObject = store.object_tag_id != null && store.object_tag_id != 0
  const child_ids = store.OrgStructures.filter(x => x.parent_id === store.structure_id).map(x => x.id)
  // const hasCalculation = PaymentStore.data.filter(x => x.structure_id === store.structure_id || child_ids.includes(x.structure_id)).length > 0
  const hasCalculation = store.hasCalculation
  const showTypeService = store.StructureTags.filter(x => x.structure_id === store.structure_id).length !== 0
  const hasTypeService = store.structure_tag_id !== null && store.structure_tag_id !== 0
  const hasCoords = store.object_xcoord != 0 && store.object_ycoord != 0
  const isDone = store.is_done;
  const hasSquare = store.object_square != 0 && store.object_square != null


  return (
    <Paper elevation={7} variant="outlined" sx={{ mb: 2 }}>
      <Card>
        <CardContent>
          <Typography sx={{ fontSize: '16px', fontWeight: 400, ml: 2 }}>
            Чек лист:
          </Typography>
          <Grid container spacing={1}>
            <Grid item md={4} xs={12}>
              <Box display={"flex"} alignItems={"center"} sx={{ ml: 1 }}>
                <ListItemIcon>
                  {hasTechDecision ? <CheckCircleIcon sx={{ color: "green" }} /> : <RadioButtonUncheckedIcon sx={{ color: "red" }} />}
                </ListItemIcon>
                <ListItemText primary={<span style={{ color: hasTechDecision ? 'green' : "red", fontWeight: 500 }}>Результат изучения материалов</span>} />
              </Box>
            </Grid>
            <Grid item md={4} xs={12}>
              <Box display={"flex"} alignItems={"center"} sx={{ ml: 1 }}>
                <ListItemIcon>
                  {hasTypeObject ? <CheckCircleIcon sx={{ color: "green" }} /> : <RadioButtonUncheckedIcon sx={{ color: "red" }} />}
                </ListItemIcon>
                <ListItemText primary={<span style={{ color: hasTypeObject ? 'green' : "red", fontWeight: 500 }}>Тип объекта</span>} />
              </Box>
            </Grid>
            <Grid item md={4} xs={12}>
              <Box display={"flex"} alignItems={"center"} sx={{ ml: 1 }}>
                <ListItemIcon>
                  {hasCalculation ? <CheckCircleIcon sx={{ color: "green" }} /> : <RadioButtonUncheckedIcon sx={{ color: "red" }} />}
                </ListItemIcon>
                <ListItemText primary={<span style={{ color: hasCalculation ? 'green' : "red", fontWeight: 500 }}>Калькуляция</span>} />
              </Box>
            </Grid>
            {showTypeService && <Grid item md={4} xs={12}>
              <Box display={"flex"} alignItems={"center"} sx={{ ml: 1 }}>
                <ListItemIcon>
                  {hasTypeService ? <CheckCircleIcon sx={{ color: "green" }} /> : <RadioButtonUncheckedIcon sx={{ color: "red" }} />}
                </ListItemIcon>
                <ListItemText primary={<span style={{ color: hasTypeService ? 'green' : "red", fontWeight: 500 }}>Тип услуги</span>} />
              </Box>
            </Grid>}
            <Grid item md={4} xs={12}>
              <Box display={"flex"} alignItems={"center"} sx={{ ml: 1 }}>
                <ListItemIcon>
                  {hasCoords ? <CheckCircleIcon sx={{ color: "green" }} /> : <RadioButtonUncheckedIcon sx={{ color: "red" }} />}
                </ListItemIcon>
                <ListItemText primary={<span style={{ color: hasCoords ? 'green' : "red", fontWeight: 500 }}>Точка на карте</span>} />
              </Box>
            </Grid>
            <Grid item md={4} xs={12}>
              <Box display={"flex"} alignItems={"center"} sx={{ ml: 1 }}>
                <ListItemIcon>
                  {isDone ? <CheckCircleIcon sx={{ color: "green" }} /> : <RadioButtonUncheckedIcon sx={{ color: "red" }} />}
                </ListItemIcon>
                <ListItemText primary={<span style={{ color: isDone ? 'green' : "red", fontWeight: 500 }}>Все задачи завершены</span>} />
              </Box>
            </Grid>
          </Grid>

          {/* <nav aria-label="main mailbox folders">
        <List>
          <ListItem >
            <ListItemIcon>
              {hasDistrict ? <CheckCircleIcon sx={{ color: "green" }} /> : <RadioButtonUncheckedIcon sx={{ color: "red" }} />}
            </ListItemIcon>
            <ListItemText primary={<span style={{ color: hasDistrict ? 'green' : "red", fontWeight: 500 }}>Район объекта</span>} />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              {hasTypeObject ? <CheckCircleIcon sx={{ color: "green" }} /> : <RadioButtonUncheckedIcon sx={{ color: "red" }} />}
            </ListItemIcon>
            <ListItemText primary={<span style={{ color: hasTypeObject ? 'green' : "red", fontWeight: 500 }}>Тип объекта</span>} />
          </ListItem>
          <ListItem >
            <ListItemIcon>
              {hasCalculation ? <CheckCircleIcon sx={{ color: "green" }} /> : <RadioButtonUncheckedIcon sx={{ color: "red" }} />}
            </ListItemIcon>
            <ListItemText primary={<span style={{ color: hasCalculation ? 'green' : "red", fontWeight: 500 }}>Калькуляция</span>} />
          </ListItem>
          {showTypeService && <ListItem >
            <ListItemIcon>
              {hasTypeService ? <CheckCircleIcon sx={{ color: "green" }} /> : <RadioButtonUncheckedIcon sx={{ color: "red" }} />}
            </ListItemIcon>
            <ListItemText primary={<span style={{ color: hasTypeService ? 'green' : "red", fontWeight: 500 }}>Тип услуги</span>} />
          </ListItem>}
          <ListItem >
            <ListItemIcon>
              {hasCoords ? <CheckCircleIcon sx={{ color: "green" }} /> : <RadioButtonUncheckedIcon sx={{ color: "red" }} />}
            </ListItemIcon>
            <ListItemText primary={<span style={{ color: hasCoords ? 'green' : "red", fontWeight: 500 }}>Точка на карте</span>} />
          </ListItem>
          <ListItem >
            <ListItemIcon>
              {isDone ? <CheckCircleIcon sx={{ color: "green" }} /> : <RadioButtonUncheckedIcon sx={{ color: "red" }} />}
            </ListItemIcon>
            <ListItemText primary={<span style={{ color: isDone ? 'green' : "red", fontWeight: 500 }}>Все задачи завершены</span>} />
          </ListItem>
        </List>
      </nav> */}
        </CardContent>
      </Card>
    </Paper>
  );
})


export default CheckList