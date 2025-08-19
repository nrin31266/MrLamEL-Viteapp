import React, { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../../../store/store";
import { useSearchParams } from "react-router-dom";
import { fetchTimeTableForWeek } from "../../../../store/teacher/timeTableForWeek";
import { Spin, Tooltip } from "antd";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import dayjs from "dayjs";
import { getColorByName } from "../../../../utils/colorUtils";
import LoadingOverlay from "../../../../components/common/LoadingOverlay";

const TimeTableWeekly = () => {
  const dispatch = useAppDispatch();
  const { loading, sessions, weekEndDate, weekStartDate, weekNumber } =
    useAppSelector((state) => state.teacher.timeTableForWeek);
  const [searchParams, setSearchParams] = useSearchParams();
  const teacher = useAppSelector((state) => state.auth.user);

  const calendarRef = useRef<FullCalendar | null>(null);

  useEffect(() => {
    if (!teacher) return;
    let weekNumber: number = Number(searchParams.get("weekNumber"));
    if (!weekNumber || isNaN(weekNumber)) {
      weekNumber = 0;
    }
    dispatch(fetchTimeTableForWeek({ teacherId: teacher.id, weekNumber }));
  }, [searchParams]);

  // Move gotoDate outside React's rendering lifecycle
  useEffect(() => {
    if (weekStartDate) {
      setTimeout(() => {
        if (calendarRef.current) {
          const api = calendarRef.current.getApi();
          api.gotoDate(new Date(weekStartDate));
        }
      }, 0); // Schedule the update outside React's rendering lifecycle
    }
  }, [weekStartDate]);

  const changeWeekNumber = (newWeekNumber: number) => {
    setSearchParams({ weekNumber: newWeekNumber.toString() });
  };

  return (
    <div className="relative bg-white px-1 py-4 rounded-md shadow">
      {loading && (
        <LoadingOverlay/>
      )}
      <h1 className="text-2xl font-semibold">
        {weekNumber === 0
          ? "Current Week"
          : weekNumber === 1
          ? "Next Week"
          : weekNumber === -1
          ? "Previous Week"
          : weekNumber > 1
          ? `The next ${weekNumber} weeks`
          : `The previous ${-weekNumber} weeks`}
        {" (" +
          dayjs(weekStartDate).format("DD/MM/YYYY") +
          " - " +
          dayjs(weekEndDate).format("DD/MM/YYYY") +
          ")"}
      </h1>
      <div
        style={{ overflowX: "auto", minWidth: "1400px", maxWidth: "100%" }}
        className="bg-white"
      >
        <FullCalendar
          ref={calendarRef}
          plugins={[timeGridPlugin, interactionPlugin, dayGridPlugin]}
          initialView="timeGridWeek"
          events={
            sessions?.map((session) => ({
              id: session.id.toString(),
              title: session.id.toString(),
              start: `${session.date}T${session.startTime}`,
              end: `${session.date}T${session.endTime}`,
              overlap: true,
              color: getColorByName(session.clazz?.name || "Unknown Class")
                .backgroundColor,
              textColor: getColorByName(session.clazz?.name || "Unknown Class")
                .textColor,
            })) || []
          }
          eventContent={(arg) => {
            const session = sessions.find(
              (s) => s.id.toString() === arg.event.id
            );

            const content = (
              <div>
                <div>
                  <b>{session?.clazz?.name}</b>
                </div>
                <div>📍 Room: {session?.room?.code} {session?.room.branch.address}</div>
                <div>
                  🕒 {session?.startTime} - {session?.endTime}
                </div>
                <div>📅 {session?.date}</div>
              </div>
            );

            return (
              <Tooltip title={content} placement="top">
                <div className="flex flex-col items-center justify-center text-white px-2 py-1 rounded-md">
                  <div className="text-sm font-bold truncate w-full text-center">
                    {session?.clazz?.name || "Unknown Class"}
                  </div>
                  <div className="mt-0.5 italic opacity-90 flex">
                    <h4>{dayjs(session?.startTime, "HH:mm:ss").format("HH:mm")}</h4>-
                    <h4>{dayjs(session?.endTime, "HH:mm:ss").format("HH:mm")}</h4>
                  </div>
                  <div className="text-[11px] mt-0.5 bg-white/20 px-1 py-0.5 rounded">
                    Room: {session?.room?.code || "?"}
                  </div>
                </div>
              </Tooltip>
            );
          }}
          headerToolbar={{
            left: "customPrev customNext customToday",
            right: "",
          }}
          editable={false}
          selectable={false}
          eventDisplay="block"
          height="auto"
          contentHeight="auto"
          weekNumberCalculation="ISO"
          firstDay={1}
          dayHeaderContent={(dateInfo) => (
            <div
              style={{ textAlign: "center", fontWeight: "bold", color: "#333" }}
            >
              <div>{dateInfo.text.split(",")[0]}</div>
              <div>{dateInfo.text.split(",")[1]}</div>
            </div>
          )}
          customButtons={{
            customToday: {
              text: "Go to current Week",
              click: () => changeWeekNumber(0),
            },
            customPrev: {
              text: "< Previous Week",
              click: () =>
                changeWeekNumber(Number(searchParams.get("weekNumber")) - 1),
            },
            customNext: {
              text: "Next Week >",
              click: () =>
                changeWeekNumber(Number(searchParams.get("weekNumber")) + 1),
            },
          }}
        />
      </div>
    </div>
  );
};

export default TimeTableWeekly;
