import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../store/store";
import { getFullCourseTimeTable } from "../../../../store/admin/todaySessionsSlide";
import { Empty, Skeleton, Table, Tag } from "antd";
import type { ColumnsType, ColumnType } from "antd/es/table";
import type { ISessionDto } from "../../../../store/teacher/timeTableForWeek";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import {
  checkClassTimeStatus,
  getClassSessionStatus,
} from "../../../teacher/pages/TimeTable/TimeTableDaily";
import { EClassSessionStatus } from "../../../../store/admin/classDetails";

const TodaySessionsComponent = () => {
  const dispatch = useAppDispatch();
  const state = useAppSelector((state) => state.admin.todaySessions);
  const navigate = useNavigate();
  const [statusMode, setStatusMode] = useState<"NOT_YET" | "DONE" | "OTHER" | "ALL">("ALL");
  const [filteredSessions, setFilteredSessions] = useState<ISessionDto[]>([]);
  useEffect(() => {
    dispatch(getFullCourseTimeTable());
  }, [dispatch]);

  useEffect(() => {
    switch (statusMode) {
      case "NOT_YET":
        setFilteredSessions(
          state.sessions.filter(
            (session) => session.status === EClassSessionStatus.NOT_YET
          )
        );
        break;
      case "DONE":
        setFilteredSessions(
          state.sessions.filter(
            (session) => session.status === EClassSessionStatus.DONE
          )
        );
        break;
      case "OTHER":
        setFilteredSessions(
          state.sessions.filter(
            (session) =>
              session.status !== EClassSessionStatus.DONE &&
              session.status !== EClassSessionStatus.NOT_YET
          )
        );
        break;
      default:
        setFilteredSessions(state.sessions);
    }
  }, [statusMode, state.sessions]);

  const columns: ColumnsType<ISessionDto> = [
    {
      title: "#",
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
      render: (clazz) => <span className="text-gray-800">{clazz.name}</span>,
      className: "min-w-[200px]",
    },

    {
         title: "Room",
         dataIndex: "room",
         className: "min-w-[200px]",
         render: (room: ISessionDto["room"]) => (
           <div>
            <h4>{room?.name || "Unknown Room"}</h4>
          <h4>{room?.branch?.address || "Unknown Branch"}</h4>
           </div>
         ),
       },
    {
      title: "Conduct",
      dataIndex: "conduct",
      key: "conduct",
      render: (_, record) => {
        const timeStatus = checkClassTimeStatus(
          record.date,
          record.startTime,
          record.endTime
        );
        return (
          <Tag
            color={
              timeStatus === "Future"
                ? "blue"
                : timeStatus === "Past"
                ? "red"
                : "green"
            }
          >
            {timeStatus}
          </Tag>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const colorMap: Record<string, string> = {
          NOT_YET: "orange",
          DONE: "purple",
        };
        return (
          <Tag color={colorMap[status] || "default"}>
            {getClassSessionStatus(status)}
          </Tag>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record: ISessionDto) => {
        if (record.status === "NOT_YET") {
          return (
            <div className="flex gap-2">
              <button
                onClick={() => navigate(`/admin/classes/details/${record.clazz.id}/sessions/${record.id}/attendance`)}
                className="bg-teal-600 !text-white px-3 py-1 rounded hover:bg-teal-700 transition duration-200 cursor-pointer"
              >
                Teaching
              </button>
            </div>
          );
        } else if (record.status === "DONE") {
          return (
            <div className="flex gap-2">
              <button
                onClick={() => navigate(`/teacher/attendance/${record.id}`)}
                className="bg-blue-600 !text-white px-3 py-1 rounded hover:bg-blue-700 transition duration-200 cursor-pointer"
              >
                Attendance
              </button>
            </div>
          );
        }
        return null; // Hide button for other statuses
      },
    },
  ];

  return (
    <div>
      <div className="min-h-max bg-white shadow rounded-lg">
        <div className="bg-green-950 px-4 py-2 rounded-t-lg">
          <h1 className="text-white text-xl">Today's lessons</h1>
          <h4 className="text-gray-300 text-sm">
            Here is the list of classes for today in the system
          </h4>
        </div>
        <div>
          {state.loading.getFullCourseTimeTableLoading ? (
            <Skeleton.Node active={true} className="!w-full !h-[30vh]" />
          ) : (
            <>
              <div>
                <h4 className="p-4 text-gray-600">{`Total session of your system today: ${
                  state.sessions.length || 0
                }`}</h4>
                <div className="flex gap-4 items-center mb-4 px-4">
                  <button
                    className={`cursor-pointer py-2 px-4 rounded transition duration-300 transform hover:scale-105 
      ${
        statusMode === "ALL"
          ? "bg-blue-500 !text-white shadow-md"
          : "bg-gray-200"
      }`}
                    onClick={() => setStatusMode("ALL")}
                  >
                    All 
                  </button>

                  <button
                    className={`cursor-pointer py-2 px-4 rounded transition duration-300 transform hover:scale-105
      ${
        statusMode === "NOT_YET"
          ? "bg-yellow-500 !text-white shadow-md"
          : "bg-gray-200"
      }`}
                    onClick={() => setStatusMode("NOT_YET")}
                  >
                    Not yet
                  </button>
                  <button
                    className={`cursor-pointer py-2 px-4 rounded transition duration-300 transform hover:scale-105
      ${
        statusMode === "DONE"
          ? "bg-purple-500 !text-white shadow-md"
          : "bg-gray-200"
      }`}
                    onClick={() => setStatusMode("DONE")}
                  >
                    Done
                  </button>
                                <button
                    className={`cursor-pointer py-2 px-4 rounded transition duration-300 transform hover:scale-105
      ${
        statusMode === "OTHER"
          ? "bg-black !text-white shadow-md"
          : "bg-gray-200"
      }`}
                    onClick={() => setStatusMode("OTHER")}
                  >
                    Other
                  </button>
                </div>
              </div>
              <Table
                columns={columns}
                dataSource={filteredSessions || []}
                pagination={false}
                 scroll={{
                  y: 400,
                }}
                rowKey="id"
                className="rounded-b-lg overflow-x-auto"
                locale={{
                  emptyText: (
                    <Empty
                      image={Empty.PRESENTED_IMAGE_DEFAULT}
                      description="Today you have no sessions"
                    />
                  ),
                }}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TodaySessionsComponent;
