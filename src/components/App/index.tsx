import React, { useReducer } from "react";

import "./index.module.css";
import "antd/dist/antd.css";

import styles from "./index.module.css";

import { EventGroup } from "../EventGroup";
import { events } from "./../../data";
import { applyEvents, groupEvents } from "./../../services";
import { Resolution } from "./../../domain";
import { Radio } from "antd";

export interface AppState {
  resolution: Resolution;
}

export interface Action {
  type: string;
  payload: any;
}

const initialState: AppState = { resolution: Resolution.Month };

const reducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case "SET_RESOLUTION":
      return { ...state, resolution: action.payload };
  }

  return initialState;
};

export const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const allDays = applyEvents(events);

  const handleResolutionChange = (e: any) => {
    dispatch({ type: "SET_RESOLUTION", payload: e.target.value });
  };

  return (
    <div className={styles.app}>
      <div>
        <Radio.Group value={state.resolution} onChange={handleResolutionChange}>
          <Radio.Button value={Resolution.Week}>weeks</Radio.Button>
          <Radio.Button value={Resolution.Month}>months</Radio.Button>
          <Radio.Button value={Resolution.Year}>years</Radio.Button>
        </Radio.Group>
      </div>

      <div className={styles.days}>
        {groupEvents(allDays, state.resolution).map((eventGroup) => (
          <EventGroup key={eventGroup.name} group={eventGroup} />
        ))}
      </div>
    </div>
  );
};
