import React, { FC, useEffect, useRef, useState, useCallback } from "react";
import { observer } from "mobx-react";
import { reaction } from "mobx";
import store from "./store";
import { useTranslation } from "react-i18next";
import {
  LayersControl,
  MapContainer,
  TileLayer,
  useMap,
  WMSTileLayer,
  Popup,
  CircleMarker,
  Marker,
  Polygon,
  Polyline,
  GeoJSON
} from "react-leaflet";
import L, { LatLngExpression, LatLngBounds, Renderer, LatLngTuple } from "leaflet";
import dayjs, { Dayjs } from "dayjs";
import { Card } from "@mui/material";

const { BaseLayer, Overlay } = LayersControl;

type ArchiveObjectListViewProps = {};

// Минимальный уровень масштаба для отображения объектов
const MIN_ZOOM_FOR_OBJECTS = 14;
// Уровень масштаба для переключения между CircleMarker и Custom Icon
const ZOOM_THRESHOLD_FOR_CUSTOM_ICON = 17;

// Создаем кастомный рендерер на основе Canvas
const canvasRenderer = L.canvas({ padding: 0.5 });

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

const ArchMap: FC<ArchiveObjectListViewProps> = observer((props) => {
  const { t } = useTranslation();
  const translate = t;
  const [isMapReady, setMapReady] = useState(false);
  const mapRef = useRef(null);
  const [visibleBounds, setVisibleBounds] = useState<LatLngBounds | null>(null);
  const [currentZoom, setCurrentZoom] = useState<number>(11);
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null);
  const [popupPosition, setPopupPosition] = useState<LatLngExpression | null>(null);
  const [popupContent, setPopupContent] = useState<any>(null);

  const wmsUrl = "http://map.darek.kg/qgis/qgis_mapserv.fcgi.exe?map=C:/OSGeo4W64/projects/ГИСАР/ГИСАР.qgz";

  useEffect(() => {
    if (!isMapReady || !mapRef.current) return;

    const dispose = reaction(
      () => ({ id: store.focus_id }),
      ({ id }) => {
        if (!id) return;

        const map = mapRef.current as any;
        const item = store.data?.find((x: any) => x.id === id);
        if (!item || !map) {
          store.clearMapFocus();
          return;
        }

        const geometries = getGeometry(item);
        const center = getObjectCenter(geometries);

        if (center) {
          map.setView(center, Math.max(17, map.getZoom() ?? 17));
          if (true) {
            handleObjectClick(item, center);
          } else {
            closePopup();
          }
        }
        store.clearMapFocus();
      },
      { fireImmediately: true }
    );

    return () => dispose();
  }, [isMapReady]);

  const wmsBaseParams = {
    SERVICE: "WMS",
    REQUEST: "GetMap",
    LAYERS: "Граница Кыргызстана,Границы областей,Границы районов,Границы айылных аймаков,Озера,Улицы,Жайыльский район,Участки ЕНИ,Здания ЕНИ",
    STYLES: "",
    FORMAT: "image/png",
    TRANSPARENT: true,
    VERSION: "1.3.0",
    EXCEPTIONS: "INIMAGE",
    CRS: "EPSG:3857",
    DPI: 96,
    OPACITIES: "255,255,255,255,255,255,255,255,255,255,255,255"
  };

  // Функция для извлечения геометрии из объекта - исправлена для возврата всех объектов
  const getGeometry = useCallback((item) => {
    try {
      const layerData = JSON.parse(item.layer);
      if (!layerData || !Array.isArray(layerData) || layerData.length === 0) return null;

      // Возвращаем все геометрии из объекта вместо только первой
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
        // Для полигона: используем первую точку или центроид
        if (geometry.coordinates[0].length > 2) {
          let x = 0, y = 0;
          const points = geometry.coordinates[0];
          for (let i = 0; i < points.length; i++) {
            x += points[i][0];
            y += points[i][1];
          }
          center = [y / points.length, x / points.length];
        } else {
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

  const formatDate = (date: Dayjs | null | undefined) => {
    if (!date) return null;
    if (!dayjs(date).isValid()) return null;
    return dayjs(date).format("YYYY-MM-DD HH:mm");
  }

  // Обработчик клика по объекту
  const handleObjectClick = useCallback((item, position) => {
    setSelectedObjectId(item.id);
    setPopupPosition(position);

    // Подготовка содержимого для попапа
    const content = (
      <div>
        <p><strong>{translate("label:ArchiveObjectListView.doc_number")}:</strong> {item.doc_number}</p>
        <p><strong>{translate("label:ArchiveObjectListView.address")}:</strong> {item.address}</p>
        {(() => {
          const names = item.customer_name ? item.customer_name.split(",").map(s => s.trim()) : [];
          const numbers = item.customer_number ? item.customer_number.split(",").map(s => s.trim()) : [];
          return (
            <div>
              {names.map((name, i) => (
                <Card
                  key={i}
                  variant="outlined"
                  sx={{ mt: 0.5, p: 0.5 }}
                >
                  <strong>{translate("label:ArchiveObjectListView.customer")} {i + 1}:</strong> {name}<br/>
                  <strong>{translate("label:ArchiveObjectListView.customer_number")}:</strong> {numbers[i]}
                </Card>
              ))}
            </div>
          );
        })()}
        <p><strong>{translate("label:ArchiveObjectListView.description")}:</strong> {item.description}</p>
        <p><strong>{translate("label:ArchiveObjectListView.created_at")}:</strong> {formatDate(item.created_at)}</p>
        <p><strong>{translate("label:ArchiveObjectListView.updated_at")}:</strong> {formatDate(item.updated_at)}</p>
        {/* {store.customers
          .filter((x) => x.obj_id === item.id)
          .map((x) => (
            <p key={x.id}>
              <strong>{translate("label:ArchiveObjectListView.customer")}:</strong> {x.full_name}
            </p>
          ))
        } */}
      </div>
    );

    setPopupContent(content);
  }, [translate]);

  // Закрытие попапа
  const closePopup = useCallback(() => {
    setSelectedObjectId(null);
    setPopupPosition(null);
    setPopupContent(null);
  }, []);

  // Компонент для отслеживания изменений видимой области карты
  const MapHandler = observer(() => {
    const map = useMap();

    useEffect(() => {
      // Инициализируем карту только один раз
      if (!isMapReady) {
        setMapReady(true);
        mapRef.current = map;

        // Инициализируем начальные значения только при первом рендере
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
      map.on('click', closePopup);

      // Удаляем обработчики при размонтировании компонента
      return () => {
        map.off('moveend', updateVisibleArea);
        map.off('zoomend', updateVisibleArea);
        map.off('click', closePopup);
      };
    }, [map, isMapReady, currentZoom, visibleBounds, closePopup]); // Включаем все зависимости

    return null;
  });

  // Создаем observable-переменную для отслеживания изменений в mobx
  const [visibleObjects, setVisibleObjects] = useState([]);

  // Обновляем объекты при изменении границ, масштаба или данных в store
  useEffect(() => {
    // Получаем только объекты, которые находятся в видимой области и соответствуют требованиям масштаба
    const updateVisibleObjects = () => {
      // Если объектов меньше 100, показываем все независимо от масштаба и видимой области
      if (store?.data && store.data.length <= 100) {
        setVisibleObjects(store.data);
        return;
      }

      // Иначе применяем фильтрацию
      if (!store?.data || currentZoom < MIN_ZOOM_FOR_OBJECTS || !visibleBounds) {
        setVisibleObjects([]);
        return;
      }

      const filteredObjects = store.data.filter((item) => {
        const geometries = getGeometry(item);
        if (!geometries) return false;
        return isObjectInBounds(geometries, visibleBounds);
      });

      setVisibleObjects(filteredObjects);
    };

    updateVisibleObjects();
  }, [store?.data, visibleBounds, currentZoom, getGeometry, isObjectInBounds]);

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
      const eventHandlers = {
        click: (e) => {
          L.DomEvent.stopPropagation(e);
          handleObjectClick(item, e.latlng || objectCenter);
        }
      };

      // Вместо обработки только одной геометрии, рендерим все геометрии объекта
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
                        fillColor: item?.tag_description ? item?.tag_description : "#000",
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
                    color={item?.tag_description ? item?.tag_description : "#000000"}
                    weight={5}
                    positions={lineCoords}
                    pathOptions={lineStyle}
                    eventHandlers={eventHandlers}
                  />
                );
              }

              case "Polygon": {
                // For polygons - properly handle coordinate structure
                try {
                  // GeoJSON polygons can have multiple rings (outer + holes)
                  // Each ring is an array of coordinates
                  if (!geometry.coordinates || !Array.isArray(geometry.coordinates)) {
                    return null;
                  }

                  // Handle all rings of the polygon (first is outer, rest are holes)
                  const polygonRings = geometry.coordinates.map(ring => {
                    // Each ring needs to be converted from [lon, lat] to [lat, lon]
                    return ring.map(coord => [coord[1], coord[0]] as LatLngTuple);
                  });

                  // Styles for polygons
                  const polygonStyle = {
                    color: isSelected ? '#ff0000' : '#000',
                    weight: isSelected ? 3 : 2,
                    fillColor: item?.tag_description ? item?.tag_description : '#000',
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
                // Для других, более сложных типов используем GeoJSON
                const geoJsonData = {
                  type: "Feature",
                  geometry: geometry,
                  properties: { id: item.id }
                };

                return null
            }
          })}
        </React.Fragment>
      );
    } catch (e) {
      console.error(`Ошибка при рендеринге объекта ${item.id}:`, e);
      return null;
    }
  }, [currentZoom, selectedObjectId, getGeometry, getObjectCenter, getIconText, handleObjectClick]);

  return (
    <>
      {/* Информация о количестве объектов */}
      <div style={{ marginBottom: '10px' }}>
        {store?.data && <span>Всего объектов: {store.data.length}&nbsp;&nbsp;</span>}
        {visibleObjects?.length > 0 && <span>Видимых объектов: {visibleObjects.length}</span>}
      </div>

      <MapContainer
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
        {currentZoom < MIN_ZOOM_FOR_OBJECTS && store?.data && store.data.length > 100 && (
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
            Увеличьте масштаб до {MIN_ZOOM_FOR_OBJECTS} для отображения объектов
          </div>
        )}

        {/* Динамическое отображение геообъектов */}
        {visibleObjects.map((item) => renderGeoObject(item))}

        {/* Отдельный попап, который управляется состоянием */}
        {popupPosition && popupContent && (
          <Popup
            position={popupPosition}
            eventHandlers={{
              popupclose: closePopup
            }}
          >
            {popupContent}
          </Popup>
        )}
      </MapContainer>
    </>
  );
});

export default ArchMap;