import React, { useEffect, useRef, useState } from 'react';
import { load } from '@2gis/mapgl';
import axios from 'axios';

const API_KEY = '62443c1e-62a2-4381-a57f-c465b514581d';

type MapsGisProps = {
  coord?: [number, number];
  onSetCoords?: (x: number, y: number) => void;
  changeAddress?: (address: string) => void;
};

export const Map2Gis: React.FC<MapsGisProps> = ({ coord, onSetCoords, changeAddress }) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const [mapInstance, setMapInstance] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const markerRef = useRef<any | null>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let map: any;

    load().then((mapglAPI) => {
      if (mapContainerRef.current) {
        map = new mapglAPI.Map(mapContainerRef.current, {
          center: [74.60, 42.87],
          zoom: 11,
          key: API_KEY,
        });
        setMapInstance(map);
      }
    });

    return () => {
      if (map) {
        map.destroy();
      }
    };
  }, []);

  const searchBuildings = async () => {
    if (!searchQuery) return;
    console.log(searchQuery);
    try {
      const response = await axios.get('https://catalog.api.2gis.com/3.0/items', {
        params: {
          q: searchQuery,
          point: '74.60,42.87', // Координаты центра поиска
          radius: 10000, // Радиус поиска в метрах
          key: API_KEY,
          fields: 'items.point,items.address_name', // Получаем координаты и адрес
        },
      });

      const results = response.data.result.items;
      console.log(results);
      setSearchResults(results);

      if (results.length > 0 && mapInstance) {
        const { lat, lon } = results[0].point; // Координаты первого результата
        mapInstance.setCenter([lon, lat], 16);

        load().then((mapglAPI) => {
          setMarker([lon, lat], mapglAPI);
        });

        if (changeAddress && results[0].address_name) {
          changeAddress(results[0].address_name);
        }
      }
    } catch (error) {
      console.error('Ошибка поиска:', error);
    }
  };

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      searchBuildings();
    }, 2000);
  };

  const setMarker = (coordinates: [number, number], mapglAPI: any) => {
    if (markerRef.current) {
      markerRef.current.destroy();
    }

    markerRef.current = new mapglAPI.Marker(mapInstance, {
      coordinates,
    });

    if (onSetCoords) {
      onSetCoords(coordinates[0], coordinates[1]);
    }
  };

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      {/* Поле для ввода запроса и кнопка поиска */}
      <div
        style={{
          position: "absolute",
          top: "10px",
          left: "10px",
          zIndex: 1000,
          background: "white",
          padding: "10px",
          borderRadius: "5px",
          boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)"
        }}
      >
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Введите адрес или название"
          style={{ padding: "5px", width: "250px", marginRight: "5px" }}
        />
        <button onClick={handleSearch} style={{ padding: "5px" }}>
          Искать
        </button>
      </div>

      {/* Карта */}
      <div
        ref={mapContainerRef}
        style={{ width: '650px', height: '450px', margin: '0 auto' }}
      />

      {/* Результаты поиска */}
      {searchResults.length > 0 && (
        <div
          style={{
            position: 'absolute',
            top: '70px',
            left: '10px',
            zIndex: 1000,
            background: 'white',
            padding: '10px',
            borderRadius: '5px',
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
            maxHeight: '300px',
            overflowY: 'auto',
            width: '280px',
          }}
        >
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {searchResults.map((result, index) => (
              <li
                key={index}
                style={{
                  padding: '5px 0',
                  cursor: 'pointer',
                  borderBottom: '1px solid #ddd',
                }}
                onClick={() => {
                  if (mapInstance && result.point) {
                    const { lat, lon } = result.point;
                    mapInstance.setCenter([lon, lat], 16);

                    load().then((mapglAPI) => {
                      setMarker([lon, lat], mapglAPI);
                    });

                    if (changeAddress && result.address_name) {
                      changeAddress(result.address_name);
                    }
                  }
                }}
              >
                <strong>{result.name}</strong> - {result.address_name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
