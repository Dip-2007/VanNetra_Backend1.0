import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, LayersControl, FeatureGroup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const FRAMap: React.FC = () => {
  const center: [number, number] = [20.5937, 78.9629]; // India center
  
  // Mock FRA data
  const fraRecords = [
    { id: '1', name: 'Ravi Kumar', type: 'IFR', coordinates: [19.0760, 82.6040], village: 'Kondagaon', status: 'approved' },
    { id: '2', name: 'Sunita Devi', type: 'CR', coordinates: [19.1340, 82.6510], village: 'Narayanpur', status: 'pending' },
    { id: '3', name: 'Mangal Singh', type: 'CFR', coordinates: [19.2150, 82.5830], village: 'Bastar', status: 'approved' },
  ];

  const getMarkerColor = (status: string) => {
    switch (status) {
      case 'approved': return 'green';
      case 'pending': return 'orange';
      case 'rejected': return 'red';
      default: return 'blue';
    }
  };

  return (
    <div className="h-full bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="h-8 bg-gray-50 border-b border-gray-200 flex items-center px-4">
        <h3 className="text-sm font-medium text-gray-700">Interactive FRA Atlas</h3>
      </div>
      
      <MapContainer
        center={center}
        zoom={6}
        style={{ height: 'calc(100% - 2rem)', width: '100%' }}
        className="z-10"
      >
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="OpenStreetMap">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>
          
          <LayersControl.BaseLayer name="Satellite">
            <TileLayer
              attribution='&copy; Esri'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />
          </LayersControl.BaseLayer>

          <LayersControl.Overlay checked name="FRA Records">
            <FeatureGroup>
              {fraRecords.map((record) => (
                <CircleMarker
                  key={record.id}
                  center={record.coordinates as [number, number]}
                  pathOptions={{
                    color: getMarkerColor(record.status),
                    fillColor: getMarkerColor(record.status),
                    fillOpacity: 0.7,
                  }}
                  radius={8}
                >
                  <Popup>
                    <div className="text-sm">
                      <h4 className="font-medium">{record.name}</h4>
                      <p>Type: <span className="font-medium">{record.type}</span></p>
                      <p>Village: {record.village}</p>
                      <p>Status: <span className={`font-medium ${
                        record.status === 'approved' ? 'text-green-600' :
                        record.status === 'pending' ? 'text-orange-600' : 'text-red-600'
                      }`}>{record.status}</span></p>
                    </div>
                  </Popup>
                </CircleMarker>
              ))}
            </FeatureGroup>
          </LayersControl.Overlay>

          <LayersControl.Overlay name="Forest Cover">
            <FeatureGroup>
              <CircleMarker
                center={[19.1, 82.6]}
                pathOptions={{ color: 'darkgreen', fillColor: 'green', fillOpacity: 0.3 }}
                radius={20}
              >
                <Popup>Dense Forest Area</Popup>
              </CircleMarker>
            </FeatureGroup>
          </LayersControl.Overlay>
        </LayersControl>
      </MapContainer>
    </div>
  );
};

export default FRAMap;