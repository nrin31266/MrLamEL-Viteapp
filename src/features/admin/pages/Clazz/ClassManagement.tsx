
import { Button, Table, Tag } from 'antd';
import ClassControlPanel from './components/ClassControlPanel'
import { useLocation, useNavigate, useSearchParams  } from 'react-router-dom';
import { fetchClazzes, type IClazz } from '../../../../store/admin/classManagement';
import { useAppDispatch, useAppSelector } from '../../../../store/store';
import type { ColumnProps } from 'antd/es/table';
import { useEffect } from 'react';
import { SiTask } from "react-icons/si";
import { CurrencyUtils } from '../../../../utils/CurrencyUtils';
import type { ICourseDto } from '../../../../store/admin/courseSlide';
import type { IRoomDto } from '../../../../store/admin/roomSlide';

// Trả về giá trị, label, mã màu hex cho đẹp
// "DRAFT" | "READY" | "OPEN" | "ONGOING" | "FINISHED" | "CANCELLED"
export const getClassStatusValue = (status: string) => {
  switch (status) {
    case "DRAFT":
      return { value: "Draft", color: "#FFA500" }; // Orange
    case "READY":
      return { value: "Ready", color: "#008000" }; // Green
    case "OPEN":
      return { value: "Open", color: "#0000FF" }; // Blue
    case "ONGOING":
      return { value: "Ongoing", color: "#FFFF00" }; // Yellow
    case "FINISHED":
      return { value: "Finished", color: "#808080" }; // Gray
    case "CANCELLED":
      return { value: "Cancelled", color: "#FF0000" }; // Red
    default:
      return { value: "Unknown", color: "#000000" }; // Black
  }
};

const ClassManagement = () => {
    // You can manage searchParams and setSearchParams here if needed
    const [searchParams, setSearchParams] = useSearchParams();
  const page= useAppSelector((state) => state.admin.classManagement.page);
  const loading = useAppSelector((state) => state.admin.classManagement.loadings.fetch);
  const dispatch = useAppDispatch();
  useEffect(() => {
    // Fetch classes data when the component mounts or searchParams change
    dispatch(fetchClazzes({ ...Object.fromEntries(searchParams) }));
  }, [searchParams]);
  const navigate = useNavigate();
  const location = useLocation();
  const columns : ColumnProps<IClazz>[] = [
     {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 60,
    },
    {
      title: "Avatar",
      dataIndex: "avatarUrl",
      key: "avatarUrl",
      render: (avatarUrl: string) => <img src={avatarUrl} alt="Avatar" style={{ width: 40, height: 40, borderRadius: '50%' }} />,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: 200,
    },
    {
      title: "Course",
      dataIndex: "course",
      key: "course",
      render: (course: ICourseDto) => (
        <div>
          <span className="font-semibold">{course.code}</span> 
          <br />
          <span>{course.name}</span>
          <br/>
          <span>{CurrencyUtils.formatVND(course.fee)}</span>

        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const { value, color } = getClassStatusValue(status);
        return <Tag className={`status-${status.toLowerCase()} !text-[0.85rem]`}  color={color}>{value}</Tag>;
      },
    },
    {
      title: "Actions",
      key: "actions",
      width: 100,
      render: (_, record) => (
        <div>
          <Button type='primary'  onClick={() => navigate(`/admin/classes/details/${record.id}`, { state: { from: location.pathname + location.search } })}>Manager</Button>
        </div>
      ),
    },
  ];
  return (
    <div>
        <ClassControlPanel searchParams={searchParams} setSearchParams={setSearchParams} />
        <div className='bg-white p-4 rounded-lg shadow-md mb-6'>
           <Table<IClazz>
          columns={columns}
          dataSource={page.content}
          loading={loading}
          className="ant-table-striped"
          rowClassName={(_, index) =>
            index % 2 === 0 ? "bg-gray-100" : "bg-white"
          }
          rowKey="id"
          pagination={{
            current: page.currentPage + 1 || 1,
            pageSize: page.currentSize,
            total: page.totalElements,
            onChange: (page, pageSize) => {
              setSearchParams({
                ...Object.fromEntries(searchParams),
                page: page.toString(),
                size: pageSize.toString(),
              });
            },
            showLessItems: true,
            showSizeChanger: true,
            pageSizeOptions: ["1", "5", "10", "20"],
          }}
          // scroll={{ x: "max-content" }}
          // locale={{
          //   emptyText: errors.fetch || "No users found",
          // }}
        />
      </div>
        
    </div>
  )
}

export default ClassManagement