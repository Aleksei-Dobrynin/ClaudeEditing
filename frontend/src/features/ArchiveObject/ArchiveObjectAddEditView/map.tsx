import React, { FC, useRef, useState, useEffect, useCallback } from "react";
import { observer } from "mobx-react";
import {
  MapContainer,
  TileLayer,
  FeatureGroup,
  useMap, Popup, Marker,
  LayersControl,
  WMSTileLayer,
  CircleMarker,
  Polygon,
  Polyline
} from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import { LatLngExpression, LatLngBounds, LatLngTuple } from "leaflet";
import drawLocales from "leaflet-draw-locales";
import L from "leaflet";
import store from "./store";
import storeList from "features/ArchiveObject/ArchiveObjectListView/store"; // Импортируем store_list
import proj4 from "proj4";
import { Grid, Slider, Typography } from "@mui/material";
import MaskedAutocomplete from "components/MaskedAutocomplete";
import { useTranslation } from "react-i18next";
import CustomTextField from "components/TextField";
import GisSearch from "components/2gisSearch";

const { BaseLayer, Overlay } = LayersControl;

type MapContainerViewProps = {
  isReadOnly?: boolean
};

// Константы для отображения маркеров из map_example.tsx
const MIN_ZOOM_FOR_MARKERS = 14; // Минимальный уровень масштаба для отображения маркеров
const ZOOM_THRESHOLD_FOR_CUSTOM_ICON = 17; // Уровень масштаба для переключения между CircleMarker и Custom Icon

// Создаем кастомный рендерер на основе Canvas
const canvasRenderer = L.canvas({ padding: 0.5 });

proj4.defs(
  "EPSG:7694",
  "+proj=tmerc +lat_0=0 +lon_0=74.5166666666667 +k=1 +x_0=3300000 +y_0=14743.5 +datum=WGS84 +units=m +no_defs"
);

const MapContainerView: FC<MapContainerViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  const featureGroupRef = useRef<L.FeatureGroup | null>(null);
  const [isMapReady, setMapReady] = useState(false);
  const mapRef = useRef(null);
  const wmsUrl = 'http://map.darek.kg/qgis/qgis_mapserv.fcgi.exe?map=C:/OSGeo4W64/projects/ГИСАР/ГИСАР.qgz';

  // Состояния для маркеров из map_example.tsx
  const [visibleBounds, setVisibleBounds] = useState<LatLngBounds | null>(null);
  const [currentZoom, setCurrentZoom] = useState<number>(11);
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null);
  const [popupPosition, setPopupPosition] = useState<LatLngExpression | null>(null);
  const [popupContent, setPopupContent] = useState<any>(null);
  const [visibleObjects, setVisibleObjects] = useState([]);

  const wmsBaseParams = {
    SERVICE: 'WMS',
    REQUEST: 'GetMap',
    LAYERS: 'Граница Кыргызстана,Границы областей,Границы районов,Границы айылных аймаков,Озера,Улицы,Жайыльский район,Участки ЕНИ,Здания ЕНИ',
    STYLES: '',
    FORMAT: 'image/png',
    TRANSPARENT: true,
    VERSION: '1.3.0',
    EXCEPTIONS: 'INIMAGE',
    CRS: 'EPSG:3857',
    DPI: 96,
    OPACITIES: '255,255,255,255,255,255,255,255,255,255,255,255',
  };

  const [wmsParams, setWmsParams] = useState<Record<string, string | number | boolean>>(wmsBaseParams);

  // Функция создания кастомной иконки
  const createCustomIcon = (text?: string, color?: string) => {
    const displayText = text || "";
    const displayColor = color || "#FF0000";
    const svgIcon = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" xml:space="preserve">
        <path d="M26 12c0 8-11 17-11 17S4 20 4 12C4 5.9 8.9 1 15 1s11 4.9 11 11" fill="${displayColor}"/>
        <circle cx="15" cy="12" r="10" fill="#FFFFFF"/>
        <text x="15" y="13" font-size="4.5" text-anchor="middle" fill="#000000" font-family="Arial, sans-serif">${displayText}</text>
      </svg>`;
    const encodedSvg = btoa(unescape(encodeURIComponent(svgIcon)));

    return new L.Icon({
      iconUrl: `data:image/svg+xml;base64,${encodedSvg}`,
      iconSize: [60, 60],
      iconAnchor: [30, 60]
    });
  };

  // Функция для извлечения геометрии из объекта (как в map_example.tsx)
  const getGeometry = useCallback((item) => {
    try {
      const layerData = JSON.parse(item.layer);
      if (!layerData || !Array.isArray(layerData) || layerData.length === 0) return null;
      
      // Возвращаем все геометрии из объекта
      return layerData.map(layer => layer?.geometry).filter(geom => geom);
    } catch (e) {
      console.error("Ошибка при получении геометрии:", e);
      return null;
    }
  }, []);

  // Функция для извлечения центра объекта (для попапа)
  const getObjectCenter = useCallback((geometries) => {
    if (!geometries || !Array.isArray(geometries) || geometries.length === 0) return null;
    
    // Используем первую геометрию для определения центра
    const geometry = geometries[0];
    if (!geometry) return null;
    
    let center: LatLngTuple | null = null;
    
    switch (geometry.type) {
      case "Point":
        // Для точки: координаты [long, lat] -> [lat, long]
        center = [geometry.coordinates[1], geometry.coordinates[0]];
        break;
      
      case "LineString":
        // Для линии: берем середину
        const middle = Math.floor(geometry.coordinates.length / 2);
        center = [geometry.coordinates[middle][1], geometry.coordinates[middle][0]];
        break;
        
      case "Polygon":
        // Для полигона: используем центроид
        if (geometry.coordinates[0].length > 2) {
          let x = 0, y = 0;
          const points = geometry.coordinates[0];
          for (let i = 0; i < points.length; i++) {
            x += points[i][0];
            y += points[i][1];
          }
          center = [y / points.length, x / points.length];
        } else if (geometry.coordinates[0].length > 0) {
          center = [geometry.coordinates[0][0][1], geometry.coordinates[0][0][0]];
        }
        break;
        
      default:
        return null;
    }
    
    return center;
  }, []);

  // Функция для проверки, находится ли объект в видимой области карты
  const isObjectInBounds = useCallback((geometries: any[], bounds: LatLngBounds | null): boolean => {
    if (!bounds || !geometries || !Array.isArray(geometries) || geometries.length === 0) return false;
    
    // Объект находится в границах, если хотя бы одна из его геометрий находится в границах
    return geometries.some(geometry => {
      if (!geometry) return false;
      
      try {
        switch (geometry.type) {
          case "Point": {
            const latLng = L.latLng(geometry.coordinates[1], geometry.coordinates[0]);
            return bounds.contains(latLng);
          }
            
          case "LineString":
            // Для линии проверяем, находится ли хотя бы одна точка в границах
            return geometry.coordinates.some(coord => {
              const latLng = L.latLng(coord[1], coord[0]);
              return bounds.contains(latLng);
            });
            
          case "Polygon":
            // Для полигона проверяем, находится ли хотя бы одна точка в границах
            return geometry.coordinates[0].some(coord => {
              const latLng = L.latLng(coord[1], coord[0]);
              return bounds.contains(latLng);
            });
            
          default:
            return false;
        }
      } catch (e) {
        console.error("Ошибка при проверке границ:", e);
        return false;
      }
    });
  }, []);

  // Обработчик клика по объекту
  const handleObjectClick = useCallback((item, position) => {
    // Отключаем клики в режиме только для чтения
    if (props.isReadOnly) return;
    
    setSelectedObjectId(item.id);
    setPopupPosition(position);

    // Подготовка содержимого для попапа
    const content = (
      <div>
        <p><strong>{translate("label:ArchiveObjectListView.doc_number")}:</strong> {item.doc_number}</p>
        <p><strong>{translate("label:ArchiveObjectListView.address")}:</strong> {item.address}</p>
        {storeList.customers
          .filter((x) => x.obj_id === item.id)
          .map((x) => (
            <p key={x.id}>
              <strong>{translate("label:ArchiveObjectListView.customer")}:</strong> {x.full_name}
            </p>
          ))
        }
      </div>
    );

    setPopupContent(content);
  }, [translate, props.isReadOnly]);

  // Закрытие попапа
  const closePopup = useCallback(() => {
    // Отключаем закрытие попапов в режиме только для чтения
    if (props.isReadOnly) return;
    
    setSelectedObjectId(null);
    setPopupPosition(null);
    setPopupContent(null);
  }, [props.isReadOnly]);

  // Получение текста для кастомной иконки
  const getIconText = useCallback((item) => {
    return item.doc_number;
  }, []);

  // Функция для рендеринга объекта в зависимости от его типа и масштаба
  const renderGeoObject = useCallback((item) => {
    try {
      const geometries = getGeometry(item);
      if (!geometries || geometries.length === 0) return null;
      
      const isSelected = selectedObjectId === item.id;
      const objectCenter = getObjectCenter(geometries);
      
      // Общий обработчик событий для всех типов объектов
      const eventHandlers = props.isReadOnly ? {} : {
        click: (e) => {
          L.DomEvent.stopPropagation(e);
          handleObjectClick(item, e.latlng || objectCenter);
        }
      };
      
      // Рендерим все геометрии объекта
      return (
        <React.Fragment key={item.id}>
          {geometries.map((geometry, idx) => {
            if (!geometry) return null;
            
            // Рендерим каждую геометрию в зависимости от её типа и текущего масштаба
            switch (geometry.type) {
              case "Point":
                // Точки всегда рендерим по-разному в зависимости от масштаба
                if (currentZoom >= ZOOM_THRESHOLD_FOR_CUSTOM_ICON) {
                  // При большом масштабе используем кастомную иконку
                  const iconText = getIconText(item);
                  const customIcon = createCustomIcon(iconText);
                  
                  return (
                    <Marker
                      key={`${item.id}-point-${idx}`}
                      position={[geometry.coordinates[1], geometry.coordinates[0]]}
                      icon={customIcon}
                      eventHandlers={eventHandlers}
                    />
                  );
                } else {
                  // При малом масштабе используем круговой маркер
                  return (
                    <CircleMarker
                      key={`${item.id}-point-${idx}`}
                      center={[geometry.coordinates[1], geometry.coordinates[0]]}
                      radius={isSelected ? 10 : 8}
                      pathOptions={{
                        fillOpacity: 0.8,
                        fillColor: "#000",
                        color: isSelected ? '#000' : '#fff',
                        weight: isSelected ? 2 : 1,
                        opacity: 1,
                      }}
                      eventHandlers={eventHandlers}
                      renderer={canvasRenderer}
                    />
                  );
                }
                
              case "LineString": {
                // Для линий - просто рендерим всегда
                // Конвертируем координаты из [lon, lat] в [lat, lon] для Leaflet
                const lineCoords: LatLngTuple[] = geometry.coordinates.map(coord => 
                  [coord[1], coord[0]] as LatLngTuple
                );

                // Стили для линий
                const lineStyle = {
                  color: isSelected ? '#000' : '#000000',
                  weight: isSelected ? 6 : 5,
                  opacity: 0.8,
                };
                
                return (
                  <Polyline
                    key={`${item.id}-line-${idx}`}
                    color="#000000"
                    weight={5}
                    positions={lineCoords}
                    pathOptions={lineStyle}
                    eventHandlers={eventHandlers}
                  />
                );
              }
                
              case "Polygon": {
                // Для полигонов - правильно обрабатываем структуру координат
                try {
                  // В GeoJSON полигоны могут иметь несколько колец (внешнее + отверстия)
                  // Каждое кольцо - это массив координат
                  if (!geometry.coordinates || !Array.isArray(geometry.coordinates)) {
                    return null;
                  }
                  
                  // Обрабатываем все кольца полигона (первое - внешнее, остальные - отверстия)
                  const polygonRings = geometry.coordinates.map(ring => {
                    // Каждое кольцо нужно конвертировать из [lon, lat] в [lat, lon]
                    return ring.map(coord => [coord[1], coord[0]] as LatLngTuple);
                  });
                  
                  // Стили для полигонов
                  const polygonStyle = {
                    color: isSelected ? '#ff0000' : '#000',
                    weight: isSelected ? 3 : 2,
                    fillColor: '#000',
                    fillOpacity: 0.5,
                  };
                  
                  return (
                    <Polygon
                      key={`${item.id}-poly-${idx}`}
                      positions={polygonRings}
                      pathOptions={polygonStyle}
                      eventHandlers={eventHandlers}
                    />
                  );
                } catch (e) {
                  console.error(`Error rendering polygon for item ${item.id}:`, e);
                  return null;
                }
              }
                
              default:
                console.log(`Неподдерживаемый тип геометрии: ${geometry.type}`);
                return null;
            }
          })}
        </React.Fragment>
      );
    } catch (e) {
      console.error(`Ошибка при рендеринге объекта ${item.id}:`, e);
      return null;
    }
  }, [currentZoom, selectedObjectId, getGeometry, getObjectCenter, getIconText, handleObjectClick, props.isReadOnly]);

  const updateWmsParams = () => {
    const map = mapRef.current;
    if (!map) return;

    const bounds = map.getBounds();
    const southWest = map.options.crs.project(bounds.getSouthWest());
    const northEast = map.options.crs.project(bounds.getNorthEast());

    const bbox = `${southWest.x},${southWest.y},${northEast.x},${northEast.y}`;

    const mapContainer = map.getContainer();
    const width = mapContainer.offsetWidth;
    const height = mapContainer.offsetHeight;

    const aspectRatio = width / height;

    const mapBoundsWidth = northEast.x - southWest.x;
    const mapBoundsHeight = northEast.y - southWest.y;
    const mapAspectRatio = mapBoundsWidth / mapBoundsHeight;

    let adjustedWidth = width;
    let adjustedHeight = height;

    if (aspectRatio > mapAspectRatio) {
      adjustedWidth = Math.round(height * mapAspectRatio);
    } else if (aspectRatio < mapAspectRatio) {
      adjustedHeight = Math.round(width / mapAspectRatio);
    }

    const newParams = {
      ...wmsBaseParams,
      BBOX: bbox,
      WIDTH: adjustedWidth,
      HEIGHT: adjustedHeight,
    };
    setWmsParams(newParams);
  };

  const constructWmsUrl = (baseUrl: string, params: Record<string, string | number | boolean>): string => {
    const query = Object.entries(params)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
      .join('&');
    return `${baseUrl}&${query}`;
  };

  useEffect(() => {
    if (!featureGroupRef.current) {
      featureGroupRef.current = new L.FeatureGroup();
    }
    drawLocales("ru");
    L.drawLocal.draw.toolbar.buttons.polygon = "Создать полигон";
    return () => {
      if (featureGroupRef.current) {
        featureGroupRef.current.clearLayers();
      }
    };
  }, []);

  // Обновляем объекты при изменении границ, масштаба или данных в store
  useEffect(() => {
    // Получаем только объекты, которые находятся в видимой области и соответствуют требованиям масштаба
    const updateVisibleObjects = () => {
      // Если объектов меньше 100, показываем все независимо от масштаба и видимой области
      if (storeList?.data && storeList.data.length <= 100) {
        setVisibleObjects(storeList.data);
        return;
      }

      // Иначе применяем фильтрацию
      if (!storeList?.data || currentZoom < MIN_ZOOM_FOR_MARKERS || !visibleBounds) {
        setVisibleObjects([]);
        return;
      }

      const filteredObjects = storeList.data.filter((item) => {
        if (item.id == store.id) return false; // Исключаем текущий объект
        const geometries = getGeometry(item);
        if (!geometries) return false;
        return isObjectInBounds(geometries, visibleBounds);
      });

      setVisibleObjects(filteredObjects);
    };

    updateVisibleObjects();
  }, [storeList?.data, visibleBounds, currentZoom, getGeometry, isObjectInBounds, store.id]);

  useEffect(() => {
    if (store.geometry.length > 0 && mapRef.current) {
      const map = mapRef.current;

      const bounds = store.geometry;

      const swappedBounds = bounds.map((point) => [point[1], point[0]]);

      if (bounds && bounds.length > 0) {
        const geoJson: GeoJSON.Feature = {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [swappedBounds]
          },
          properties: {}
        };
        
        if (!props.isReadOnly) {
          store.addLayerOne(geoJson);
        }

        const leafletLayer = L.geoJSON(geoJson);
        featureGroupRef.current?.addLayer(leafletLayer);

        map.fitBounds(leafletLayer.getBounds());
      }
    }
    if (store.point.length > 0 && mapRef.current) {
      const map = mapRef.current;
      const point = store.point;

      const geoJsonPoint: GeoJSON.Feature = {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [point[1], point[0]],
        },
        properties: {},
      };
      
      if (!props.isReadOnly) {
        store.addLayerOne(geoJsonPoint);
      }

      const marker = L.geoJSON(geoJsonPoint, {
        pointToLayer: (feature, latlng) => L.marker(latlng),
      });

      featureGroupRef.current?.addLayer(marker);

      map.setView([point[0], point[1]], map.getZoom());
    }
  }, [store.geometry, store.point, props.isReadOnly]);

  useEffect(() => {
    if (isMapReady && featureGroupRef.current && store.mapLayers) {
      featureGroupRef.current.clearLayers();
      store.mapLayers.forEach((layer) => {
        try {
          const leafletLayer = L.geoJSON(layer);
          leafletLayer.addTo(featureGroupRef.current!);
        } catch (error) {
          console.log("Invalid GeoJSON format", error, layer);
        }
      });
    }
  }, [isMapReady, store.mapLayers]);

  const MapHandler = () => {
    const map = useMap();

    useEffect(() => {
      if (!isMapReady) {
        setMapReady(true);
        mapRef.current = map;

        // Инициализируем начальные значения только один раз при первом рендере
        setVisibleBounds(map.getBounds());
        setCurrentZoom(map.getZoom());
      }

      // Функция обновления при движении или масштабировании карты
      const updateVisibleArea = () => {
        // Проверяем, изменились ли границы существенно, перед обновлением состояния
        const newBounds = map.getBounds();
        const newZoom = map.getZoom();

        if (newZoom !== currentZoom) {
          setCurrentZoom(newZoom);
        }

        if (!visibleBounds ||
          !newBounds.equals(visibleBounds, 0.001)) { // Сравниваем с погрешностью
          setVisibleBounds(newBounds);
        }
      };

      // Добавляем обработчики событий
      map.on('moveend', updateVisibleArea);
      map.on('zoomend', updateVisibleArea);
      
      // Отключаем клики по карте в режиме только для чтения
      if (!props.isReadOnly) {
        map.on('click', closePopup);
      }

      // Удаляем обработчики при размонтировании компонента
      return () => {
        map.off('moveend', updateVisibleArea);
        map.off('zoomend', updateVisibleArea);
        if (!props.isReadOnly) {
          map.off('click', closePopup);
        }
      };
    }, [map, isMapReady, currentZoom, visibleBounds, closePopup, props.isReadOnly]);

    return null;
  };

  const onCreated = (e: any) => {
    // Отключаем создание в режиме только для чтения
    if (props.isReadOnly) return;
    
    const { layerType, layer } = e;
    // Разрешаем все типы объектов, не только polygon и marker
    const geoJSON = layer.toGeoJSON();
    store.addLayerOne(geoJSON);

    if (featureGroupRef.current) {
      featureGroupRef.current.addLayer(layer);
    }
  };

  const onDeleted = (e: any) => {
    // Отключаем удаление в режиме только для чтения
    if (props.isReadOnly) return;
    
    const deletedLayers = e.layers.toGeoJSON().features;
    store.removeLayers(deletedLayers);
  };

  const onEdited = (e: any) => {
    // Отключаем редактирование в режиме только для чтения
    if (props.isReadOnly) return;
    
    // Обрабатываем изменение слоев
    const editedLayers = e.layers;
    editedLayers.eachLayer((layer: any) => {
      const geoJSON = layer.toGeoJSON();
      // Обновляем в хранилище соответствующий слой
      store.updateLayer(geoJSON);
    });
  };

  return (
    <>
      {/* Скрываем элементы управления в режиме только для чтения */}
      {!props.isReadOnly && (
        <Grid container spacing={1} sx={{ mb: 1 }}>
          <Grid item md={3}>
            <MaskedAutocomplete
              data={store.DarekSearchList ?? []}
              value={0}
              label={translate("label:ArchObjectAddEditView.identifier")}
              name="darek_eni"
              onChange={(newValue: any) => {
                store.darek_eni = newValue?.propcode ?? '';
                store.identifier = newValue?.propcode ?? '';
                store.searchFromDarek(newValue.propcode);
              }}
              freeSolo={true}
              fieldNameDisplay={(option) => option?.propcode}
              onInputChange={(event, value) => {
                store.darek_eni = "";
                if (value?.length > 12) {
                  store.identifier = value;
                  store.getSearchListFromDarek(value);
                }
              }}
              mask="0-00-00-0000-0000-00-000"
            />
          </Grid>
          <Grid item md={3}>
            <GisSearch
              id="id_f_ArchObject_address"
              label={translate("label:ArchObjectAddEditView.address")}
              onChange={store.handleAddressChange}
              value={store.gis_address}
            />
          </Grid>
          <Grid item md={3}>
            <CustomTextField
              helperText={store.errordutyPlanObjectNumber}
              error={store.errordutyPlanObjectNumber != ""}
              id="id_f_dutyPlanObjectNumber"
              label={translate("Поиск по объектам дежурного плана")}
              value={store.dutyPlanObjectNumber}
              onChange={(event) => {
                store.handleChange(event)
              }}
              name="dutyPlanObjectNumber"
            />
          </Grid>
        </Grid>
      )}

      {/* Информация о количестве объектов */}
      <div style={{ marginBottom: '10px' }}>
        {storeList?.data && <span>Всего объектов: {storeList.data.length}&nbsp;&nbsp;</span>}
        {visibleObjects?.length > 0 && <span>Видимых объектов: {visibleObjects.length}</span>}
      </div>

      <MapContainer
        ref={(ref) => {
          if (ref && mapRef.current !== ref) {
            mapRef.current = ref;
            ref.on("moveend", updateWmsParams);
            ref.on("zoomend", updateWmsParams);
          }
        }}
        center={[42.87, 74.60] as LatLngExpression}
        zoom={11}
        maxZoom={19}
        style={{ height: "70vh", width: "100%" }}>
        <MapHandler />
        <LayersControl position="topright">
          <BaseLayer checked name="2GIS">
            <TileLayer
              maxZoom={24}
              url="https://tile1.maps.2gis.com/tiles?x={x}&y={y}&z={z}&v=1"
              attribution='&copy; <a href="https://2gis.com">2GIS</a>'
            />
          </BaseLayer>
          <BaseLayer name="Схема">
            <TileLayer
              maxZoom={24}
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
          </BaseLayer>
          <BaseLayer name="Спутник">
            <TileLayer
              maxZoom={24}
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              attribution='&copy; <a href="https://www.esri.com/">Esri</a> contributors'
            />
          </BaseLayer>
          <Overlay name="Darek.kg" checked>
            <WMSTileLayer
              url={wmsUrl}
              maxZoom={24}
              layers={wmsBaseParams.LAYERS as string}
              format="image/png"
              transparent={true}
              version="1.3.0"
              crs={L.CRS.EPSG3857}
              opacity={0.8}
            />
          </Overlay>
        </LayersControl>

        {/* Предупреждение о масштабе */}
        {currentZoom < MIN_ZOOM_FOR_MARKERS && storeList?.data && storeList.data.length > 100 && (
          <div className="map-zoom-message" style={{
            position: 'absolute',
            bottom: '10px',
            left: '10px',
            zIndex: 1000,
            backgroundColor: 'white',
            padding: '5px 10px',
            borderRadius: '5px',
            boxShadow: '0 0 5px rgba(0,0,0,0.3)'
          }}>
            Увеличьте масштаб до {MIN_ZOOM_FOR_MARKERS} для отображения объектов
          </div>
        )}

        <FeatureGroup
          ref={(ref) => {
            if (ref && featureGroupRef.current !== ref) {
              featureGroupRef.current = ref;
            }
          }}
        >
          {/* Скрываем EditControl в режиме только для чтения */}
          {!props.isReadOnly && (
            <EditControl
              position="topright"
              onCreated={onCreated}
              onDeleted={onDeleted}
              onEdited={onEdited}
              draw={{
                rectangle: false,
                polygon: true,
                polyline: true,
                circle: false,
                circlemarker: false,
                marker: true
              }}
              edit={{
                featureGroup: featureGroupRef.current || new L.FeatureGroup(),
                edit: true,
                remove: true
              }}
            />
          )}
        </FeatureGroup>

        {/* Динамическое отображение геообъектов вместо маркеров */}
        {visibleObjects.map((item) => renderGeoObject(item))}

        {/* Отдельный попап, который управляется состоянием */}
        {popupPosition && popupContent && !props.isReadOnly && (
          <Popup
            position={popupPosition}
            eventHandlers={{
              popupclose: closePopup
            }}
          >
            {popupContent}
          </Popup>
        )}

        {/* Отображение объектов дежурного плана */}
        {store.mapDutyPlanObject.length > 0 && store.mapDutyPlanObject.map((layer, index) => {
          const customIcon = createCustomIcon(layer.number, "#0000FF");
          if (!layer.point || !layer.address) {
            return null;
          }
          const files = layer.archive_folders ? JSON.parse(layer.archive_folders) : [];
          
          // Обработчики событий для маркеров дежурного плана
          const dutyPlanEventHandlers = props.isReadOnly ? {} : {};
          
          return (
            <Marker 
              key={`duty-${index}`} 
              position={[layer.point[0], layer.point[1]]} 
              icon={customIcon}
              eventHandlers={dutyPlanEventHandlers}
            >
              {!props.isReadOnly && (
                <Popup>
                  <div>
                    <strong>Номер документа:</strong> {`${layer.number}`}<br />
                    <strong>Адрес:</strong> {`${layer.address}`}<br />
                    <a
                      href={`https://2gis.kg/bishkek/geo/${layer.point[1]}%2C${layer.point[0]}?m=${layer.point[1]}%2C${layer.point[0]}%2F14.6`}
                      target="_blank"
                      rel="noopener noreferrer">Открыть в 2gis</a>
                    <br />
                    <br />
                    {store.id !== layer.id && <a
                      rel="noopener noreferrer"
                      onClick={() => store.onClickDutyInMap(layer)}
                      style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}
                    >
                      Перекинуть сюда
                    </a>}
                    <br />

                    <br />
                    {files && files.length > 0 && (
                      <div style={{ maxHeight: "200px", overflow: "auto", border: "1px solid black" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                          <thead>
                            <tr>
                              <th style={{ border: "1px solid black", padding: "5px" }}>Имя папки</th>
                              <th style={{ border: "1px solid black", padding: "5px" }}>Имя файла</th>
                            </tr>
                          </thead>
                          <tbody>
                            {files.filter(item => item.folder_name && item.file_name).map((item, idx) => (
                              <tr key={idx}>
                                <td style={{ border: "1px solid black", padding: "5px" }}>{item.folder_name}</td>
                                <td style={{ border: "1px solid black", padding: "5px" }}>{item.file_name}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </Popup>
              )}
            </Marker>
          );
        })}

      </MapContainer>
    </>
  );
});

export default MapContainerView;