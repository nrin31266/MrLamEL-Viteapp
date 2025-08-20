import { Button, Empty, Skeleton, Table, Tag, Tooltip } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../store/store";
import { fetchTimeTableForTeacherByDay } from "../../../../store/teacher/timeTableForDay";
import type { ISessionDto } from "../../../../store/teacher/timeTableForWeek";
import type { ColumnProps, ColumnsType } from "antd/es/table";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import { getColorByName } from "../../../../utils/colorUtils";
const checkClassStatus = (date: string, start: string, end: string) => {
  // date: "YYYY-MM-DD", start/end: "HH:mm"
  const now = dayjs();

  // Kết hợp ngày + giờ, parse rõ ràng
  const classStart = dayjs(`${date}T${start}:00`); // ISO 8601
  const classEnd = dayjs(`${date}T${end}:00`);

  if (now.isBefore(classStart)) {
    return "Upcoming"; // Sắp diễn ra
  }

  if (now.isAfter(classEnd)) {
    return "Completed"; // Đã kết thúc
  }

  return "Ongoing"; // Đang diễn ra
};
const TimeTableDaily = () => {
  const { sessions, loading, error } = useAppSelector(
    (state) => state.teacher.timeTableForDay
  );
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const [mode, setMode] = useState<"details" | "grid-view">("details");
  const teacher = useAppSelector((state) => state.auth.user);
  const navigate = useNavigate();
  useEffect(() => {
    if (!teacher) return;
    const fetchData = async () => {
      const date = searchParams.get("date") || dayjs().format("YYYY-MM-DD");
      dispatch(
        fetchTimeTableForTeacherByDay({
          teacherId: teacher.id,
          date: date.toString(),
        })
      );
    };
    fetchData();
  }, [searchParams]);
  const columns: ColumnsType<ISessionDto> = [
    {
      title: "Index",
      render: (_, __, index) => index + 1,
    },
    {
      dataIndex: "",
      title: "Date",
      render: (_, record: ISessionDto) => (
        <div>
          <h4>{dayjs(record.date).format("dddd DD/MM/YYYY")}</h4>
          <h4>
            {dayjs(record.startTime, "HH:mm:ss").format("HH:mm")}-
            {dayjs(record.endTime, "HH:mm:ss").format("HH:mm")}
          </h4>
        </div>
      ),
    },
    {
      title: "Class",
      dataIndex: "clazz",
      render: (clazz) => clazz.name,
    },

    {
      title: "Room",
      dataIndex: "room",
      render: (room: ISessionDto["room"]) => (
        <div>
          <h4>{room.name}</h4>
          <h4>{room.branch.address}</h4>
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status, record: ISessionDto) => {
        const classStatus = checkClassStatus(
          record.date,
          record.startTime,
          record.endTime
        );
        return (
          <Tag
            color={
              classStatus === "Upcoming"
                ? "blue"
                : classStatus === "Ongoing"
                ? "green"
                : "red"
            }
          >
            {classStatus}
          </Tag>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record: ISessionDto) => (
        <div className="flex gap-2">
          <button onClick={() => navigate(`/teacher/attendance/${record.id}`)} className="bg-teal-600 !text-white px-3 py-1 rounded hover:bg-teal-700 transition duration-200 cursor-pointer">
            Attendance
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white shadow rounded-md px-2 py-4">
      <h1 className="text-lg font-semibold">Time Table Daily</h1>
      {loading ? (
        <Skeleton.Node active={true} className="!w-full !h-[30vh]" />
      ) : (
        <div>
          <div className="flex gap-4 items-center mb-4">
            <button
              className={`cursor-pointer py-2 px-4 rounded transition duration-300 transform hover:scale-105 
      ${
        mode === "details" ? "bg-blue-500 !text-white shadow-md" : "bg-gray-200"
      }`}
              onClick={() => setMode("details")}
            >
              Details View
            </button>

            <button
              className={`cursor-pointer py-2 px-4 rounded transition duration-300 transform hover:scale-105
      ${
        mode === "grid-view"
          ? "bg-blue-500 !text-white shadow-md"
          : "bg-gray-200"
      }`}
              onClick={() => setMode("grid-view")}
            >
              Grid View
            </button>
          </div>

          {mode === "details" ? (
            <div>
              <Table
                columns={columns}
                dataSource={sessions || []}
                pagination={false}
                rowKey="id"
                className="rounded-lg overflow-x-auto border border-gray-200"
                locale={{
                  emptyText: (
                    <Empty
                      image={Empty.PRESENTED_IMAGE_DEFAULT}
                      description="Today you have no classes"
                    />
                  ),
                }}
              />
            </div>
          ) : (
            <div>
              <FullCalendar
                plugins={[timeGridPlugin, interactionPlugin, dayGridPlugin]}
                initialView="timeGridDay"
                events={
                  sessions?.map((session) => ({
                    id: session.id.toString(),
                    title: session.id.toString(),
                    start: `${session.date}T${session.startTime}`,
                    end: `${session.date}T${session.endTime}`,
                    overlap: true,
                    color: getColorByName(
                      session.clazz?.name || "Unknown Class"
                    ).backgroundColor,
                    textColor: getColorByName(
                      session.clazz?.name || "Unknown Class"
                    ).textColor,
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
                      <div>
                        📍 Room: {session?.room?.code}{" "}
                        {session?.room.branch.address}
                      </div>
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
                          <h4>
                            {dayjs(session?.startTime, "HH:mm:ss").format(
                              "HH:mm"
                            )}
                          </h4>
                          -
                          <h4>
                            {dayjs(session?.endTime, "HH:mm:ss").format(
                              "HH:mm"
                            )}
                          </h4>
                        </div>
                        <div className="text-[11px] mt-0.5 bg-white/20 px-1 py-0.5 rounded">
                          Room: {session?.room?.code || "?"}
                        </div>
                      </div>
                    </Tooltip>
                  );
                }}
                headerToolbar={{
                  left: "",
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
                    style={{
                      textAlign: "center",
                      fontWeight: "bold",
                      color: "#333",
                    }}
                  >
                    <div>{dateInfo.text.split(",")[0]}</div>
                    <div>{dateInfo.text.split(",")[1]}</div>
                  </div>
                )}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TimeTableDaily;
