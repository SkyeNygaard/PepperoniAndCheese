import { createContext, useContext, useState } from "react";

interface Point {
	x: number;
	y: number;
}

interface Polygon {
	points: Point[];
	type: "floor" | "unit" | "common";
	name: string;
}

interface FloorPolygons {
	floor: Polygon;
	units: Polygon[];
	common: Polygon[];
}

interface Building {
	floors: FloorPolygons[];
}

interface AppState {
	building: Building;
	rentRates: {
		studio: number;
		oneBed: number;
		twoBed: number;
		threeBed: number;
		fourBed: number;
	};
	rules: {
		requiresElevator: boolean;
		requiresTwoStaircases: boolean;
	};
	currentFloor: number;
	address: string;
	lot: string;
}

interface AppContextType {
	state: AppState;
	setAddress: (address: string) => void;
	setCurrentFloor: (floor: number) => void;
	setBuilding: (building: Building) => void;
	updateRentRates: (rates: AppState["rentRates"]) => void;
	updateRules: (rules: AppState["rules"]) => void;
}

export const AppContext = createContext<AppContextType>({} as AppContextType);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [state, setState] = useState<AppState>({
		building: {
			floors: [{}, {}, {}],
		},
		address: "",
		lot: "",
		currentFloor: 1,
		rentRates: {
			studio: 0,
			oneBed: 0,
			twoBed: 0,
			threeBed: 0,
			fourBed: 0,
		},
		rules: {
			requiresElevator: false,
			requiresTwoStaircases: false,
		},
	});

	const setAddress = (address: string) => {
		setState((prev) => ({ ...prev, address }));
	};

	const setBuilding = (building: Building) => {
		setState((prev) => ({ ...prev, building }));
	};

	const setCurrentFloor = (floor: number) => {
		setState((prev) => ({ ...prev, currentFloor: floor }));
	};

	const updateRentRates = (rentRates: AppState["rentRates"]) => {
		setState((prev) => ({ ...prev, rentRates }));
	};

	const updateRules = (rules: AppState["rules"]) => {
		setState((prev) => ({ ...prev, rules }));
	};

	return (
		<AppContext.Provider
			value={{
				state,
				setAddress,
				setBuilding,
				setCurrentFloor,
				updateRentRates,
				updateRules,
			}}
		>
			{children}
		</AppContext.Provider>
	);
};
