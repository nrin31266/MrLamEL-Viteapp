import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import dayjs from "dayjs";
import type { IClassSchedule, IClazz } from "./classManagement";
import type { IHolidaySolarDto } from "../common/holidaysSlide";

export interface IPreviewSessions {
  date: string;
  startTime: string;
  endTime: string;
}

// map DayOfWeek backend (MONDAY=1,...SUNDAY=7) sang dayjs day() (Sunday=0)
const dayOrder: Record<string, number> = {
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
  SUNDAY: 0,
};

interface IPreViewSessionsState {
  previewData: IPreviewSessions[];
  unavailableDates: string[];
  clazz: IClazz | null;
}

const initialState: IPreViewSessionsState = {
  previewData: [],
  unavailableDates: [],
  clazz: null,
};

const preViewSessions = createSlice({
  name: "preViewSessions",
  initialState,
  reducers: {
    setPreviewData: (
      state,
      action: PayloadAction<{ clazz: IClazz; holidays: IHolidaySolarDto[]; startDate: string }>
    ) => {
      const { clazz, holidays, startDate } = action.payload;
      if (!clazz) return;

      // sort schedules: ngày trong tuần + giờ bắt đầu
      const schedules = [...(clazz.schedules || [])].sort((a, b) => {
        const dayCompare =
          (dayOrder[a.dayOfWeek] ?? 0) - (dayOrder[b.dayOfWeek] ?? 0);
        if (dayCompare !== 0) return dayCompare;
        return (a.startTime ?? "").localeCompare(b.startTime ?? "");
      });

      const holidayDates = (holidays || []).map((h) => h.date);
      const unavailable = state.unavailableDates || [];

      const totalSessions = clazz.totalSessions || 0;
      const sessions: IPreviewSessions[] = [];
      let currentDate = dayjs(startDate);

      while (sessions.length < totalSessions) {
        const currentDayOfWeek = currentDate.day(); // 0=Sunday ... 6=Saturday

        for (const schedule of schedules) {
          if (sessions.length >= totalSessions) break;
          const scheduleDay = dayOrder[schedule.dayOfWeek] ?? -1;
          if (scheduleDay !== currentDayOfWeek) continue;

          const dateStr = currentDate.format("YYYY-MM-DD");

          if (unavailable.includes(dateStr) || holidayDates.includes(dateStr))
            continue;

          sessions.push({
            date: dateStr,
            startTime: schedule.startTime,
            endTime: schedule.endTime,
          });
        }

        currentDate = currentDate.add(1, "day"); // Tăng 1 ngày
      }

      state.previewData = sessions;
      state.clazz = clazz;
    },

    setUnavailableDates: (state, action: PayloadAction<string[]>) => {
      state.unavailableDates = action.payload;
    },

    resetPreviewData: (state) => {
      state.previewData = [];
      state.unavailableDates = [];
      state.clazz = null;
    },
  },
});

export const { setPreviewData, setUnavailableDates, resetPreviewData } =
  preViewSessions.actions;

export default preViewSessions.reducer;
