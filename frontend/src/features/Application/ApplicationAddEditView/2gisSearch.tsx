import React, { useRef, useState } from "react";
import { List, ListItem, ListItemText, Paper, TextField } from "@mui/material";
import axios from "axios";
import store from "./storeObject";
import { observer } from "mobx-react";
import { API_KEY_2GIS } from "constants/config";

type TextFieldProps = {
  label: string;
  id: string;
  disabled?: boolean;
  index: number;
  autocomplete?: boolean;
  onBlur?: () => void
}

const GisSearch = observer((props: TextFieldProps) => {
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isListOpen, setIsListOpen] = useState(false);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    store.arch_objects[props.index].address = e.target.value;
    setSearchQuery(query);


      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      debounceTimeoutRef.current = setTimeout(() => {
        searchBuildings(query);
      }, 500);

  };

  const searchBuildings = async (query: string) => {
    if (!query) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await axios.get('https://catalog.api.2gis.com/3.0/items', {
        params: {
          q: query,
          point: '74.60,42.87',
          radius: 10000,
          key: API_KEY_2GIS,
          fields: 'items.point,items.address_name,items.adm_div',
        },
      });

      const results = response.data.result.items || [];
      setSearchResults(results);
      setIsListOpen(true);
    } catch (error) {
      console.error('Ошибка поиска:', error);
    }
  };

  const handleFocus = () => {
    if (searchResults.length > 0) {
      setIsListOpen(true);
    }
  };

  const handleBlur = (event: React.FocusEvent) => {
    setTimeout(() => {
      setIsListOpen(false);
      props.onBlur();
    }, 200);
  };

  const handleItemClick = (result: any) => {
    setIsListOpen(false);
    const [street = "", house = "", apartment = ""] =
      (result.address_name ?? "")
        .split(",")
        .map(part => part.trim());
    const dis_id = store.Districts.find(d => result.adm_div?.find((d: any) => d.type === 'district')?.name.includes(d.name))?.id
    store.arch_objects[props.index].point = [result.point.lat, result.point.lon]
    store.arch_objects[props.index].ycoordinate = result.point.lon
    store.arch_objects[props.index].xcoordinate = result.point.lat
    store.arch_objects[props.index].address = result.address_name ?? store.arch_objects[props.index].address
    store.arch_objects[props.index].street = street;
    store.arch_objects[props.index].house = house;
    store.arch_objects[props.index].apartment = apartment;
    store.arch_objects[props.index].district_id = dis_id ?? 6
    store.point = [result.point.lat, result.point.lon]
    store.ycoordinate = result.point.lon
    store.xcoordinate = result.point.lat
    // store.address = result.address_name ?? store.arch_objects[props.index].address
    setSearchQuery(result.address_name);
  };

  return (
    <div style={{ position: 'relative' }}>
      <TextField
        fullWidth
        disabled={props.disabled ? props.disabled : false}
        variant="outlined"
        label={props.label}
        helperText={store.arch_objects[props.index].erroraddress}
        error={!!store.arch_objects[props.index].erroraddress}
        data-testid={props.id}
        value={store.arch_objects[props.index].address}
        onChange={handleInputChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        size="small"
      />

      {isListOpen && searchResults.length > 0 && (
        <Paper
          elevation={3}
          sx={{
            position: 'absolute',
            top: '50px',
            left: 0,
            zIndex: 1000,
            padding: 1,
            borderRadius: 1,
            maxHeight: '300px',
            overflowY: 'auto',
            width: '100%',
          }}
        >
          <List>
            {searchResults.map((result: any, index: number) => (
              <ListItem
                button
                key={index}
                onClick={() => handleItemClick(result)}
              >
                <ListItemText
                  primary={result.name || 'Без названия'}
                  secondary={
                    result.address_name
                      ? `${result.address_name} ${result.adm_div?.find((d: any) => d.type === 'district')?.name || ''}`
                      : 'Без адреса'
                  }
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </div>
  );
});

export default GisSearch;
