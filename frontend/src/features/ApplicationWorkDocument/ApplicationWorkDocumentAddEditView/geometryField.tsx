import React, { useEffect, useRef, useState } from "react";
import { LayersControl, MapContainer, TileLayer, useMap } from "react-leaflet";
import L, { LatLngExpression } from "leaflet";
import { DrawEvents } from "leaflet";
import FeatureTable from "./featureTable";
import { useTranslation } from "react-i18next";

type GeometryFieldProps = {
  value: GeoJSON.Feature[];
  onChange?: (features: GeoJSON.Feature[]) => void;
};

const { BaseLayer } = LayersControl;

const DrawControl: React.FC<{
  onCreated: (layer: L.Layer) => void;
  onEdited: (layers: L.Layer[]) => void;
  onDeleted: (layers: L.Layer[]) => void;
  features: GeoJSON.Feature[];
}> = ({ onCreated, onEdited, onDeleted, features }) => {
  const map = useMap();
  const featureGroupRef = useRef<L.FeatureGroup>(L.featureGroup());
  const { t } = useTranslation();
  const translate = t;

  useEffect(() => {
    if (!map) return;

    const featureGroup = featureGroupRef.current;
    featureGroup.addTo(map);

    L.drawLocal.draw.toolbar.buttons.polyline = translate('label:geometryFieldView.buttons_polyline');
    L.drawLocal.draw.toolbar.buttons.polygon = translate('label:geometryFieldView.buttons_polygon');
    L.drawLocal.draw.toolbar.buttons.marker = translate('label:geometryFieldView.buttons_marker');
    L.drawLocal.draw.toolbar.actions.title = translate('label:geometryFieldView.actions_title');
    L.drawLocal.draw.toolbar.actions.text = translate('label:geometryFieldView.actions_cancel');
    L.drawLocal.draw.toolbar.undo.title = translate('label:geometryFieldView.undo_title');
    L.drawLocal.draw.toolbar.undo.text = translate('label:geometryFieldView.undo_text');
    L.drawLocal.draw.toolbar.finish.title = translate('label:geometryFieldView.finish_title');
    L.drawLocal.draw.toolbar.finish.text = translate('label:geometryFieldView.finish_text');

    L.drawLocal.draw.handlers.polyline.tooltip.start = translate('label:geometryFieldView.polyline_tooltip_start');
    L.drawLocal.draw.handlers.polyline.tooltip.cont = translate('label:geometryFieldView.polyline_tooltip_cont');
    L.drawLocal.draw.handlers.polyline.tooltip.end = translate('label:geometryFieldView.polyline_tooltip_end');
    L.drawLocal.draw.handlers.polygon.tooltip.start = translate('label:geometryFieldView.polygon_tooltip_start');
    L.drawLocal.draw.handlers.polygon.tooltip.cont = translate('label:geometryFieldView.polygon_tooltip_cont');
    L.drawLocal.draw.handlers.polygon.tooltip.end = translate('label:geometryFieldView.polygon_tooltip_end');
    L.drawLocal.draw.handlers.marker.tooltip.start = translate('label:geometryFieldView.marker_tooltip_start');

    L.drawLocal.edit.toolbar.actions.save.title = translate('label:geometryFieldView.save_title');
    L.drawLocal.edit.toolbar.actions.save.text = translate('label:geometryFieldView.save_text');
    L.drawLocal.edit.toolbar.actions.cancel.title = translate('label:geometryFieldView.cancel_title');
    L.drawLocal.edit.toolbar.actions.cancel.text = translate('label:geometryFieldView.cancel_text');
    L.drawLocal.edit.toolbar.actions.clearAll.title = translate('label:geometryFieldView.clearAll_title');
    L.drawLocal.edit.toolbar.actions.clearAll.text = translate('label:geometryFieldView.clearAll_text');
    L.drawLocal.edit.handlers.edit.tooltip.text = translate('label:geometryFieldView.edit_tooltip_text');
    L.drawLocal.edit.handlers.edit.tooltip.subtext = translate('label:geometryFieldView.edit_tooltip_subtext');
    L.drawLocal.edit.handlers.remove.tooltip.text = translate('label:geometryFieldView.remove_tooltip_text');

    L.drawLocal.edit.toolbar.buttons.edit = translate('label:geometryFieldView.buttons_edit');
    L.drawLocal.edit.toolbar.buttons.editDisabled = translate('label:geometryFieldView.buttons_editDisabled');
    L.drawLocal.edit.toolbar.buttons.remove = translate('label:geometryFieldView.buttons_remove');
    L.drawLocal.edit.toolbar.buttons.removeDisabled = translate('label:geometryFieldView.buttons_removeDisabled');

    const drawControl = new L.Control.Draw({
      edit: {
        featureGroup: featureGroup,
        remove: true,
      },
      draw: {
        polygon: {},
        polyline: {},
        marker: {},
        rectangle: false,
        circle: false,
        circlemarker: false,
      },
    });
    map.addControl(drawControl);

    const handleCreated = (e: DrawEvents.Created) => {
      const layer = e.layer;
      featureGroup.addLayer(layer);
      onCreated(layer);
    };

    const handleEdited = (e: DrawEvents.Edited) => {
      const editedLayers: L.Layer[] = [];
      e.layers.eachLayer((layer) => {
        editedLayers.push(layer);
      });
      onEdited(editedLayers);
    };

    const handleDeleted = (e: DrawEvents.Deleted) => {
      const deletedLayers: L.Layer[] = [];
      e.layers.eachLayer((layer) => {
        deletedLayers.push(layer);
      });
      onDeleted(deletedLayers);
    };

    map.on(L.Draw.Event.CREATED, handleCreated);
    map.on(L.Draw.Event.EDITED, handleEdited);
    map.on(L.Draw.Event.DELETED, handleDeleted);

    return () => {
      map.removeControl(drawControl);
      map.off(L.Draw.Event.CREATED, handleCreated);
      map.off(L.Draw.Event.EDITED, handleEdited);
      map.off(L.Draw.Event.DELETED, handleDeleted);
      featureGroup.clearLayers();
    };
  }, [map, onCreated, onEdited, onDeleted]);

  useEffect(() => {
    if (!map) return;

    const featureGroup = featureGroupRef.current;

    featureGroup.clearLayers();

    features.forEach((geojsonFeature) => {
      const layer = L.geoJSON(geojsonFeature);
      layer.eachLayer((l) => {
        featureGroup.addLayer(l);
      });
    });
  }, [map, features]);

  return null;
};

const GeometryField: React.FC<GeometryFieldProps> = ({ value, onChange }) => {
  const [features, setFeatures] = useState<GeoJSON.Feature[]>([]);

  useEffect(() => {
    setFeatures(Array.isArray(value) ? value : []);
  }, [value]);

  const updateFeatures = (newFeatures: GeoJSON.Feature[]) => {
    setFeatures(newFeatures);
    onChange?.(newFeatures);
  };

  const handleCreated = (layer: L.Layer) => {
    const feature = (layer as any).toGeoJSON() as GeoJSON.Feature;
    feature.id = Date.now();
    updateFeatures([...features, feature]);
  };

  const handleEdited = (layers: L.Layer[]) => {
    const editedFeatures = layers.map((l) => {
      const feature = (l as any).toGeoJSON() as GeoJSON.Feature;
      const originalFeature = features.find((f) => f.id === feature.id);
      if (originalFeature) {
        feature.id = originalFeature.id;
      }
      return feature;
    });

    const newFeatures = features.map((orig) => {
      const match = editedFeatures.find((ef) => ef.id === orig.id);
      return match || orig;
    });

    updateFeatures(newFeatures);
  };

  const handleDeleted = (layers: L.Layer[]) => {
    const deletedFeatures = layers.map((l) => (l as any).toGeoJSON() as GeoJSON.Feature);
    const newFeatures = features.filter(
      (f) => !deletedFeatures.some((df) => df.id === f.id)
    );
    updateFeatures(newFeatures);
  };

  return (
    <div>
      <div style={{ width: "100%", height: "400px" }}>
        <MapContainer
          center={[42.87, 74.60] as LatLngExpression}
          zoom={11}
          style={{ height: "100%", width: "100%" }}
        >
          <LayersControl position="topright">
            <BaseLayer checked name="Схема">
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
          />
            </BaseLayer>
            <BaseLayer name="Спутник">
              <TileLayer
                maxZoom={24}
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                attribution='&copy; <a href="https://www.esri.com/">Esri</a> contributors'
              />
            </BaseLayer>
          </LayersControl>
          <DrawControl
            features={features}
            onCreated={handleCreated}
            onEdited={handleEdited}
            onDeleted={handleDeleted}
          />
        </MapContainer>
      </div>
      <FeatureTable features={features} onEdit={updateFeatures} />
    </div>
  );
};

export default GeometryField;