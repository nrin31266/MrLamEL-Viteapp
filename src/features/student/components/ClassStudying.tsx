import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import { useNavigate } from "react-router-dom";
import { Empty, Skeleton, Table } from "antd";
import { fetchClassesStudying } from "../../../store/student/classStudying";
import type { ColumnsType } from "antd/es/table";
import type { IClassSchedule, IClazz } from "../../../store/admin/classManagement";
import dayjs from "dayjs";
const ClassStudying = () => {
  const dispatch = useAppDispatch();
  const state = useAppSelector((state) => state.student.classStudying);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchClassesStudying());
  }, [dispatch]);

  const columns: ColumnsType<IClazz> = [
     {
      title: "#",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Class Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Schedules",
      dataIndex: "schedules",
      render: (schedules) => (
        <div>
          {schedules ? schedules.map((schedule: IClassSchedule) => (
            <div key={schedule.id}>
              <span>{schedule.dayOfWeek}</span> <span>{schedule.startTime}</span> - <span>{schedule.endTime}</span>
            </div>
          )) : <span>No schedule available</span>}
        </div>
      ),
    },
    {
        dataIndex: "",
        title: "Time",
        render: (_, record: IClazz) => (
          <div>
            <span>{dayjs(record.startDate).format("DD/MM/YYYY")} </span> <br />
            <span>{record.endDate ? dayjs(record.endDate).format("DD/MM/YYYY") : "Unknown"}</span>
          </div>
        ),
    },
    {
      dataIndex: "actions",
      title: "Actions",
      render: (_, record: IClazz) => (
        <div>
          <button
            onClick={() => navigate(`/student/class-progress/${record.id}`)}
            className="bg-teal-600 !text-white px-3 py-1 rounded hover:bg-teal-700 transition duration-200 cursor-pointer"
          >
            Study progress
          </button>
        </div>
      ),
    }
  ];

  return (
    <div className="bg-white shadow rounded-lg border border-gray-200">
      <div className="px-4 py-2 bg-indigo-950 rounded-t-lg">
        <h1 className="text-xl text-white">Other days</h1>
        <p className="text-gray-300 text-sm">
          Below are the classes you are currently enrolled in.
        </p>
      </div>
      <div className="px-2 py-2">
        {state.loading.fetchClassesStudying ? (
          <Skeleton.Node active={true} className="!w-full !h-[30vh]" />
        ) : (
          <>
            <Table
              columns={columns}
              dataSource={state.classesStudying}
              rowKey="id"
              loading={state.loading.fetchClassesStudying}
              pagination={false}
              locale={{
                  emptyText: (
                    <Empty
                      image={Empty.PRESENTED_IMAGE_DEFAULT}
                      description="Today you have no classes"
                    />
                  ),
                }}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default ClassStudying;
