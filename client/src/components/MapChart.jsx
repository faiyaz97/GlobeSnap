import React from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Graticule,
  Annotation,
  ZoomableGroup,
  Marker,
} from "react-simple-maps";
import { useTheme, Tooltip } from "@mui/material";
import ColorHash from "color-hash";

const MapChart = ({ user }) => {
  const countryVisited = user.countryVisited;
  const colorHash = new ColorHash();
  const geoUrl =
    "https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json";
  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;
  const neutralMedium = theme.palette.neutral.medium;
  const neutralDark = theme.palette.neutral.dark;
  const dark = theme.palette.neutral.dark;
  const background = theme.palette.background.default;
  const primaryDark = theme.palette.primary.dark;
  const primaryLight = theme.palette.primary.light;
  const primaryMain = theme.palette.primary.main;
  const alt = theme.palette.background.alt;
  return (
    <ComposableMap
      viewBox="0 0 800 400"
      height={400}
      projectionConfig={{ scale: 147 }}
    >
      <ZoomableGroup>
        <Graticule stroke={primaryLight} />
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const country = countryVisited.find((c) => c.id === geo.id);
              return (
                <React.Fragment key={geo.rsmKey}>
                  {country ? (
                    <Tooltip title={geo.properties.name}>
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        style={{
                          default: {
                            fill: colorHash.hex(geo.id),
                            stroke: neutralLight,
                            outline: "none",
                          },
                          hover: {
                            fill: primaryDark,
                            outline: "none",
                          },
                          pressed: {
                            fill: primaryLight,
                            outline: "none",
                          },
                        }}
                      />
                    </Tooltip>
                  ) : (
                    <Tooltip title={geo.properties.name}>
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        style={{
                          default: {
                            fill: neutralMedium,
                            stroke: neutralLight,
                            outline: "none",
                          },
                          hover: {
                            fill: primaryDark,
                            outline: "none",
                          },
                          pressed: {
                            fill: primaryLight,
                            outline: "none",
                          },
                        }}
                      />
                    </Tooltip>
                  )}
                </React.Fragment>
              );
            })
          }
        </Geographies>

        <Annotation
          subject={[user.location.coordinates[1], user.location.coordinates[0]]}
          dx={-40}
          dy={-20}
          connectorProps={{
            stroke: neutralDark,
            strokeWidth: 2,
            strokeLinecap: "round",
          }}
        >
          <text
            x="-4"
            textAnchor="end"
            alignmentBaseline="middle"
            fill={neutralDark}
          >
            {"Home"}
          </text>
        </Annotation>
      </ZoomableGroup>
    </ComposableMap>
  );
};

export default MapChart;
