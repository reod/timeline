import { Event, EventGroup as EventGroupModel } from "./../../domain";
import css from "classnames";
import styles from "./index.module.css";
import React from "react";
import { Popover } from "antd";

export interface EventGroupProps {
  group: EventGroupModel;
}

export const EventGroup: React.FC<EventGroupProps> = ({ group }) => {
  const eventsWithContent = group.events.filter((e) => e.name !== "");
  const hasEvents = eventsWithContent.length > 0;
  const passed = group.events.some((e) => e.passed);
 
  const tile = (
    <div
      className={css(styles.eventGroup, {
        [styles.withEvents]: hasEvents,
        [styles.passed]: passed,
      })}
    ></div>
  );

  if (!hasEvents) {
    return tile;
  }

  const content = eventsWithContent.map((event: Event) => {
    return (
      <div className={styles.event}>
        {event.date} - {event.name}
      </div>
    );
  });

  const title = `${group.events[0].date} - ${
    group.events[group.events.length - 1].date
  }`;

  return (
    <Popover content={content} title={title}>
      {tile}
    </Popover>
  );
};
