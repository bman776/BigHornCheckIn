import {TimelineEventProps, CalendarUtils} from 'react-native-calendars';

// lib/utils.js
export function formatDate(dateString) {
  // format date nicely
  // example: from this 👉 2025-05-20 to this 👉 May 20, 2025
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export const getDate = (offset = 0) => {
  const date = new Date();
  date.setDate(date.getDate()+offset);
  return CalendarUtils.getCalendarDateString(date)
}