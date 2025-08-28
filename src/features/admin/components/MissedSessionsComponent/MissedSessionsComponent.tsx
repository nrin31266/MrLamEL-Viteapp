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
import { fetchMissedSessions } from "../../../../store/admin/missedSessionsSlide";

const MissedSessionsComponent = () => {
  const dispatch = useAppDispatch();
  const state = useAppSelector((state) => state.admin.missedSessions);
  const navigate = useNavigate();
  const [daysAgo, setDaysAgo] = useState<number>(7);

  useEffect(() => {
    dispatch(fetchMissedSessions({ daysAgo }));
  }, [dispatch, daysAgo]);



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
      dataIndex: "teacher",
      title: "Teacher",
      render: (teacher: ISessionDto["teacher"]) => (
        <div className="text-gray-600 font-mono">
          <h4>{teacher?.fullName || "Unknown Teacher"}</h4>
          <h5>{teacher?.email || "Unknown Email"}</h5>
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
        <div className="bg-red-950 px-4 py-2 rounded-t-lg">
          <h1 className="text-white text-xl">Missed sessions</h1>
          <h4 className="text-gray-300 text-sm">
           Below are the missed sessions in the system for some reason.
          </h4>
        </div>
        <div>
              <div>
                <h4 className="p-4 text-gray-600">{`Total session missed in last ${daysAgo} days: ${
                  state.missedSessions.length || 0
                }`}</h4>
                <div className="flex gap-4 items-center mb-4 px-4">
                 

                  <button
                    className={`cursor-pointer py-2 px-4 rounded transition duration-300 transform hover:scale-105
      ${
        daysAgo === 7
          ? "bg-blue-500 !text-white shadow-md"
          : "bg-gray-200"
      }`}
                    onClick={() => setDaysAgo(7)}
                  >
                    Last 7 days
                  </button>
                  <button
                    className={`cursor-pointer py-2 px-4 rounded transition duration-300 transform hover:scale-105
      ${
        daysAgo === 30
          ? "bg-blue-500 !text-white shadow-md"
          : "bg-gray-200"
      }`}
                    onClick={() => setDaysAgo(30)}
                  >
                    Last 30 days
                  </button>
                                <button
                    className={`cursor-pointer py-2 px-4 rounded transition duration-300 transform hover:scale-105
      ${
        daysAgo === 0
          ? "bg-blue-500 !text-white shadow-md"
          : "bg-gray-200"
      }`}
                    onClick={() => setDaysAgo(0)}
                  >
                    All
                  </button>
     
                </div>
              </div>
          {state.loading.fetchMissedSessions ? (
            <Skeleton.Node active={true} className="!w-full !h-[30vh]" />
          ) : (
            <>
          
              <Table
                columns={columns}
                dataSource={state.missedSessions || []}
                pagination={false}
                rowKey="id"
                scroll={{
                  y: 400,
                }}
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

export default MissedSessionsComponent;
