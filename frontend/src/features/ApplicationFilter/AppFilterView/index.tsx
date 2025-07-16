import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Container,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CardHeader, Grid
} from "@mui/material";
import store from "./store";
import storeApplication from "../../Application/ApplicationListView/store";
import Link from "@mui/material/Link";

const AppFilterListView = () => {
  const { t } = useTranslation();
  const [groupedData, setGroupedData] = useState({});

  useEffect(() => {
    const loadFilters = async () => {
      try {
        await store.loadApplicationFilters();
        const data = store.data;

        const grouped = data.reduce((acc, item) => {
          if (!acc[item.type_id]) {
            acc[item.type_id] = [];
          }
          acc[item.type_id].push(item);
          return acc;
        }, {});

        setGroupedData(grouped);
      } catch (error) {
        console.error(t("error.loadingFilters"), error);
      }
    };

    loadFilters();

    return () => {
      store.clearStore();
    };
  }, []);

  return (
    <Container maxWidth="xl" style={{ marginTop: 30 }}>
      <Grid container spacing={3}>
        {Object.keys(groupedData).map((typeId) => {
          const groupItems = groupedData[typeId];

          return (
            <Grid item md={6} xs={6}>
              <Card key={typeId} style={{ marginBottom: 20 }}>
                <CardHeader
                  title={groupItems[0]?.type_name || t("filters.unknownGroup")}
                  style={{ paddingBottom: 0 }}
                />
                <CardContent>
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>{t("label:AppFilterListView.name")}</TableCell>
                          <TableCell>{t("label:AppFilterListView.count")}</TableCell>
                          <TableCell>{t("label:AppFilterListView.link")}</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {groupItems.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>{item.count}</TableCell>
                            <TableCell>
                              <Link href="/user/Application" target="_blank" variant="body2" onClick={() => {
                                const filterData = typeof item.filter === 'string' ? JSON.parse(item.filter) : item.filter;
                                storeApplication.filter = filterData;
                                storeApplication.setFilterToLocalStorage();
                              }}>
                                {t("go")}
                              </Link>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
};

export default AppFilterListView;
