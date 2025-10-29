import dayjs from "dayjs";
import { WEEK_DAYS } from "../constants/week-days";

/**
 * Groups appointments by day of the week.
 * @param {Array} appointments - Array of appointment objects with a 'date' property.
 * @return {Array} Array of objects with 'label' (day name) and 'count' (number of appointments).
 */
export const groupAppointmentsByDay = (appointments) =>
  WEEK_DAYS.map((label, i) => {
    const count = appointments.filter(
      (a) => dayjs(a.date).day() === (i + 1) % 7
    ).length;
    return { label, count };
  });
