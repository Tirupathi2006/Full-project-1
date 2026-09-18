import React, { createContext, useContext, useState } from "react";

const RideContext = createContext(null);

export function RideProvider({ children }) {
  const [pickup, setPickup] = useState(null); // {lat,lng,label}
  const [drop, setDrop] = useState(null);
  const [route, setRoute] = useState(null); // {driving:{distanceKm,durationMin,coords}, cycling:{...}}
  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState(null);

  function reset() {
    setPickup(null);
    setDrop(null);
    setRoute(null);
    setOptions([]);
    setSelected(null);
  }

  return (
    <RideContext.Provider
      value={{ pickup, setPickup, drop, setDrop, route, setRoute, options, setOptions, selected, setSelected, reset }}
    >
      {children}
    </RideContext.Provider>
  );
}

export function useRide() {
  return useContext(RideContext);
}
