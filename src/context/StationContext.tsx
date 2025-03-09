import { createContext, useContext, useState } from "react";

const StationContext = createContext<any>(null);

export const StationProvider = ({ children }: { children: React.ReactNode }) => {
    const [selectedStation, setSelectedStation] = useState<any>(null);

    return (
        <StationContext.Provider value={{ selectedStation, setSelectedStation }}>
            {children}
        </StationContext.Provider>
    );
};

export const useStation = () => useContext(StationContext);
