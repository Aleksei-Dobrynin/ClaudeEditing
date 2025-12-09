import React, { useEffect, useRef, useState } from "react";
import { TextField, Paper, List, ListItem, ListItemText } from "@mui/material";
import axios from "axios";
import store from "./store";

const API_KEY = "62443c1e-62a2-4381-a57f-c465b514581d";

type TextFieldProps = {
  label: string;
  id: string;
  multiline?: boolean;
  onPointChange?: (point: any[]) => void;
  onAddressChange?: (address: string) => void;
  value?: string;
}

const GisSearch = (props: TextFieldProps) => {
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isListOpen, setIsListOpen] = useState(false);

  useEffect(() => {
    setSearchQuery(props.value);
  }, [props.value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    if (props.onAddressChange) {
      props.onAddressChange(query);
    } else {
      store.address = query;
    }
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
      const response = await axios.get("https://catalog.api.2gis.com/3.0/items", {
        params: {
          q: query,
          point: "74.60,42.87",
          radius: 10000,
          key: API_KEY,
          fields: "items.point,items.address_name"
        }
      });

      const results = response.data.result.items || [];
      setSearchResults(results);
      setIsListOpen(true);
    } catch (error) {

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
    }, 200);
  };

  const handleItemClick = (result: any) => {
    setIsListOpen(false);
    const point = [result.point.lat, result.point.lon];
    const address = result.address_name;
    if (props.onPointChange) {
      props.onPointChange(point);
    } else {
      store.point = point;
    }

    if (props.onAddressChange) {
      props.onAddressChange(address);
    } else {
      store.address = address;
    }
    setSearchQuery(result.address_name);
  };

  return (
    <div style={{ position: "relative" }}>
      <TextField
        fullWidth
        variant="outlined"
        label={props.label}
        data-testid={props.id}
        value={searchQuery}
        onChange={handleInputChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        size="small"
        multiline={props.multiline}
      />

      {isListOpen && searchResults.length > 0 && (
        <Paper
          elevation={3}
          sx={{
            position: "absolute",
            top: "50px",
            left: 0,
            zIndex: 1000,
            padding: 1,
            borderRadius: 1,
            maxHeight: "300px",
            overflowY: "auto",
            width: "100%"
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
                  primary={result.name || "Без названия"}
                  secondary={result.address_name || "Без адреса"}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </div>
  );
};

export default GisSearch;
