import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';


type CheckboxProps = {
  value: boolean;
  label?: string;
  name: string;
  size?: any;
  onChange: (e) => void;
  id: string;
  disabled?: boolean;
}


export default function CustomCheckbox(props: CheckboxProps) {
  return (
    <FormControlLabel
      id={props.id}
      value={props.value}
      data-testid={props.id}
      disabled={props.disabled ? props.disabled : false}
      control={
        <Checkbox
          size={props.size}
          onChange={(e) => props.onChange({ target: { value: e.target.checked, name: props.name } })}
          checked={props.value}
        />
      }
      label={props.label}
    />
  )
}