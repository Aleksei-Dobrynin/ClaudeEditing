import Stack from '@mui/material/Stack';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import { FC, useState } from 'react';
import { useTranslation } from "react-i18next";

export type Dictionary = {
  id: number;
  name: string;
  [key: string]: any; // Add index signature to allow any property
};

type MtmLookupProps = {
  data: Dictionary[];
  value: number[];
  onChange: (name: string, value: number[]) => void;
  name: string;
  label: string;
  onKeyDown?: (e) => void;
  toggles?: boolean;
  disabled?: boolean;
  toggleGridColumn?: number;
  displayField?: string; // New prop for specifying the display field
};

const MtmLookup: FC<MtmLookupProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  const [showToggles, setShowToggles] = useState(false);
  const values = props.data.filter((x) => props.value?.find((y) => y === x.id));

  const handleToggleChange = (id: number, checked: boolean) => {
    const newValue = checked
      ? [...props.value, id]
      : props.value.filter((itemId) => itemId !== id);

    props.onChange(props.name, newValue);
  };

  // Determine the display field based on the prop or default to 'name'
  const displayField = props.displayField || 'name';

  return (
    <WrapperAutocomplete>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Autocomplete
          multiple
          id="size-small-outlined-multi"
          size="small"
          value={values}
          disabled={props.disabled ?? false}
          sx={{ minWidth: 300 }}
          disableCloseOnSelect={true}
          ListboxProps={{ style: { maxHeight: '300px' } }}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          onChange={(e, value) => {
            props.onChange(props.name, value.map((x) => x.id));
          }}
          fullWidth
          options={props.data}
          // Use the specified display field or default to 'name'
          getOptionLabel={(option) => option?.[displayField] || ''}
          renderInput={(params) => <TextField {...params} label={props.label} />}
        />
        {props.toggles && (
          <Button
            size="small"
            variant="contained"
            sx={{ ml: 2 }}
            onClick={() => setShowToggles(!showToggles)}
          >
            {showToggles ? translate("hideSelect") : translate("showSelect")}
          </Button>
        )}
      </Stack>
      {props.toggles && showToggles && (
        <ScrollableGrid>
          <Grid container spacing={2} mt={2}>
            {props.data.map((item) => (
              <Grid item xs={props.toggleGridColumn} key={item.id}>
                <StyledFormControlLabel
                  control={
                    <Switch
                      checked={props.value.includes(item.id)}
                      onChange={(e) =>
                        handleToggleChange(item.id, e.target.checked)
                      }
                    />
                  }
                  // Use the specified display field or default to 'name'
                  label={<StyledLabel>{item?.[displayField]}</StyledLabel>}
                />
              </Grid>
            ))}
          </Grid>
        </ScrollableGrid>
      )}
    </WrapperAutocomplete>
  );
});

const WrapperAutocomplete = styled.div`
  width: 100%;
`;

const StyledFormControlLabel = styled(FormControlLabel)`
  margin-bottom: -20px;
`;

const StyledLabel = styled.span`
  display: inline-block;
  max-width: 450px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const ScrollableGrid = styled.div`
  max-height: 500px; /* Ограничиваем высоту */
  overflow-y: auto; /* Добавляем вертикальную прокрутку */
  border: 1px solid #ddd; /* Добавляем рамку для визуального ограничения */
  padding: 8px;
  border-radius: 4px;
`;

export default MtmLookup;
