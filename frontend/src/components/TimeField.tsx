import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import styled from "styled-components";
import CalendarIcon from './CalendarIcon'
import { observer } from 'mobx-react';
import 'dayjs/locale/ru';

type TimePickerValueProps = {
  id: string;
  value: Dayjs;
  label: string;
  name: string;
  minTime?: Dayjs;
  maxTime?: Dayjs;
  disabled?: boolean;
  error?: boolean;
  helperText: string;
  onChange: (e) => void;
};


const TimeField: React.FC<TimePickerValueProps> = observer((props) => {
  return (
    <div id={props.id} data-testid={props.id} >
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
        <WrappedTimeField
          format={"HH:mm"}
          value={props.value}
          label={props.label}
          disabled={props.disabled}
          ampm={false}
          onChange={(newValue: Dayjs) => {
            if (newValue instanceof dayjs || newValue === null) {
              props.onChange({ target: { value: newValue, name: props.name } })
            }
          }}
          closeOnSelect={false}
          slotProps={{
            textField: {
              helperText: props.helperText,
              error: props.error,
            },
          }}
          minTime={props.minTime}
          maxTime={props.maxTime}
          slots={{
            openPickerIcon: CalendarIcon
          }}
        />
      </LocalizationProvider>
    </div>
  );
})

const WrappedTimeField = styled(TimePicker)`
  width: 100% !important;
  input {
    padding: 9px 8px;
    border-color: #CDD3EC;
  }
  label {
    position: absolute;
    top: -8px;
  }
`
export default TimeField;