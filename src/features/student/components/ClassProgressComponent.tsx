import { useEffect } from "react";
import {
  fetchClassProgress,
  type ILearnedSessionDto,
} from "../../../store/classProgress";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import { Empty, Skeleton, Table } from "antd";
import type { ColumnType } from "antd/es/table";
import dayjs from "dayjs";
interface Props {
  classId: string;
}

const ClassProgressComponent = ({ classId }: Props) => {
  const dispatch = useAppDispatch();
  const state = useAppSelector((state) => state.classProgress);

  useEffect(() => {
    dispatch(fetchClassProgress({ classId }));
  }, [dispatch]);

  const columns: ColumnType<ILearnedSessionDto>[] = [
    {
      title: "#",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Content",
      render: (text, record) => (
        <div>
          <h4>
            <span>{record.session.content}</span>
          </h4>
        </div>
      ),
    },
    {
      title: "Learned time",
      render: (text, record) => (
        <div className="text-sky-600">
          <h4>
            <span>{dayjs(record.session.date).format("ddd DD/MM/YYYY")}</span>
          </h4>
          <h4>
            <span>
              {dayjs(record.session.startTime, "HH:mm:ss").format("HH:mm")}{" "}
            </span>
            {"->"}
            <span>
              {dayjs(record.session.endTime, "HH:mm:ss").format("HH:mm")}
            </span>
          </h4>
        </div>
      ),
    },
    {
      title: "Learning status",
      render: (text, record) => (
        <div>
          {state.classProgress?.learnedSessions.map((session) => {
            if (session.session.id === record.session.id) {
              return (
                <div key={session.session.id} className="space-y-1">
                  {session.absentStudents.length > 0 && (
                    <div className="flex flex-wrap">
                      <span className="font-extralight text-sm text-red-600 mr-1">Absent: </span>
                      {session.absentStudents.map((studentDetails, index) => (
                        <span key={studentDetails} className="block">
                          {index > 0 && ", "}
                          {studentDetails}
                        </span>
                      ))}
                    </div>
                  )}
                  {session.lateStudents.length > 0 && (
                    <div className="flex flex-wrap">
                      <span className="font-extralight text-sm text-yellow-600 mr-1">Late: </span>
                      {session.lateStudents.map((studentDetails, index) => (
                        <span key={studentDetails}>
                          {index > 0 && ", "}
                          {studentDetails}
                        </span>
                      ))}
                    </div>
                  )}
                  {session.excuseStudents.length > 0 && (
                    <div className="flex flex-wrap">
                      <span className="font-extralight text-sm text-blue-600 mr-1">Excused: </span>
                      {session.excuseStudents.map((studentDetails, index) => (
                        <span key={studentDetails} className="block">
                          {index > 0 && ", "}
                          {studentDetails}
                        </span>
                      ))}
                    </div>
                  )}
                  {
                    session.absentStudents.length === 0 &&
                    session.lateStudents.length === 0 &&
                    session.excuseStudents.length === 0 && (
                      <span className="text-green-600 font-extralight text-sm">
                       Full attendance in class
                      </span>
                    )
                  }
                </div>
              );
            }
            return null;
          })}
        </div>
      ),
    },
  ];

  return (
    <div>
      {state.loading.fetchClassProgress ? (
        <div className="space-y-4">
          <Skeleton.Node className="min-w-full !h-[200px]" active />
          <Skeleton.Node className="min-w-full !h-[400px]" active />
        </div>
      ) : state.errors.fetchClassProgress ? (
        <p className="text-red-500">Error: {state.errors.fetchClassProgress}</p>
      ) : state.classProgress ? (
        <>
          <div className="bg-white rounded-lg shadow">
            <div className="bg-sky-950 rounded-t-lg px-4 py-2">
              <h1 className="text-white text-xl overflow-ellipsis whitespace-nowrap overflow-hidden">
                The content that has been taught in class &nbsp;
                <span className="text-white font-bold">
                  {state.classProgress.clazz.name}
                </span>
              </h1>
            </div>
            <div className="p-4">
              <Table
                columns={columns}
                dataSource={state.classProgress.learnedSessions}
                rowKey="id"
                pagination={false}
                bordered
                loading={state.loading.fetchClassProgress}
                direction="ltr"
                 locale={{
                  emptyText: (
                    <Empty
                      image={Empty.PRESENTED_IMAGE_DEFAULT}
                      description="There hasn't been any class yet."
                    />
                  ),
                }}
              />
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default ClassProgressComponent;
