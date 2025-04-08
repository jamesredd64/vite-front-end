import React from 'react';
import { VectorMap } from "@react-jvectormap/core";
import { worldMill } from "@react-jvectormap/world";

interface USMapProps {
  mapColor?: string;
  data: Record<string, number>;
}

const USMap: React.FC<USMapProps> = ({ mapColor = "#D0D5DD", data }) => {
  // Convert data to jVectorMap format
  const formattedData = Object.entries(data).reduce((acc, [state, value]) => {
    acc[state.toLowerCase()] = value;
    return acc;
  }, {} as Record<string, number>);

  return (
    <VectorMap
      map={worldMill}
      backgroundColor="transparent"
      zoomOnScroll={false}
      focusOn={{
        x: -97, // Center longitude for US
        y: 38,  // Center latitude for US
        scale: 5, // Increased zoom level
        region: 'US',
        animate: true
      }}
      regionsSelectable={false}
      regionStyle={{
        initial: {
          fill: mapColor,
          fillOpacity: 0.1, // Reduce opacity for non-US regions
          stroke: "#FFFFFF",
          strokeWidth: 0.5,
          strokeOpacity: 0.2,
        },
        hover: {
          fill: "#465FFF",
          cursor: "pointer",
          fillOpacity: 0.8,
        },
      }}
      series={{
        regions: [{
          values: formattedData,
          scale: ["#E6EBFF", "#465FFF"], // Match your brand colors
          normalizeFunction: "polynomial",
          attribute: "fill",
        }]
      }}
      onRegionTipShow={(event, label, code) => {
        // Only show tooltip for US states
        if (code !== 'US') {
          event.preventDefault();
          return;
        }
        
        // Format the tooltip
        const value = formattedData[code.toLowerCase()];
        if (value) {
          if (label instanceof HTMLElement) {
            label.innerHTML = `${label.innerHTML}: ${value.toLocaleString()} Attendees`;
          }
        }
      }}
      selectedRegions={['US']} // Pre-select US
      regionsSelectableOne={true}
      style={{
        width: '100%',
        height: '100%'
      }}
      onRegionClick={(event, code) => {
        // Prevent clicking on non-US regions
        if (code !== 'US') {
          event.preventDefault();
        }
      }}
    />
  );
};

export default USMap;







































