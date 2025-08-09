import { Input, Select } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSortAlphaDown } from "react-icons/fa";
interface Props {
  // Define any props if needed
  searchParams: URLSearchParams;
  setSearchParams: React.Dispatch<React.SetStateAction<URLSearchParams>>;
  role: string;
}

const UserControlPanel: React.FC<Props> = ({
  searchParams,
  setSearchParams,
  role,
}) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );
  const changeSearchParams = (key: string, value: string) => {
    // Nếu truyền "" thì xóa key khỏi searchParams
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      if (value === "") {
        newParams.delete(key);
      } else {
        newParams.set(key, value);
      }
      return newParams;
    });
  };
  useEffect(() => {
    const search = async () => {
      console.log(`Searching for: ${searchTerm}`);
      changeSearchParams("search", searchTerm);
    };
    const delayDebounceFn = setTimeout(() => {
      search();
    }, 800); // 800ms delay for debouncing
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);
  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6 flex justify-start items-center gap-4">
      <Select
        size="large"
        labelRender={(value) => (
          <>
            <span className="font-semibold">Role: </span>
            <span className="text-gray-500">{value.label}</span>
          </>
        )}
        disabled
        placeholder="Select a branch"
        value={role}
        style={{ width: 150 }}
        onChange={(value: string) => {
          navigate(
            `/admin/users/${value}` +
              (searchParams.toString() ? `?${searchParams.toString()}` : "")
          );
        }}
      >
        <Select.Option value="students">Student</Select.Option>
        <Select.Option value="teachers">Teacher</Select.Option>
        {/* <Select.Option value="admin">Admin</Select.Option> */}
      </Select>

      <Select
        size="large"
        labelRender={(value) => (
          <>
            <span className="font-semibold">Status: </span>
            <span className="text-gray-500">{value.label}</span>
          </>
        )}
        placeholder="Select a status"
        value={searchParams.get("status") || ""}
        style={{ width: 150 }}
        onChange={(value: string) => {
          changeSearchParams("status", value);
        }}
      >
        {/* // Trống */}
        <Select.Option value="">All</Select.Option>
        <Select.Option value="OK">Ok</Select.Option>
        <Select.Option value="BANNED">Banned</Select.Option>
        <Select.Option value="EXPIRED">Expired</Select.Option>
      </Select>
      <Input
        placeholder="Search by name or email"
        size="large"
        className="!w-80"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
        }}
        allowClear 
        type="text"
      ></Input>

      <div className="border p-4 border-gray-200 rounded-lg flex items-center gap-4">
        <FaSortAlphaDown className="text-gray-500" />
        <div className="flex gap-2">
          <Select
            size="large"
            labelRender={(value) => (
              <>
                <span className="text-gray-500">{value.label}</span>
              </>
            )}
            placeholder="Select a sort"
            value={searchParams.get("sort") || "createdAt"}
            style={{ width: 150 }}
            onChange={(value: string) => {
              changeSearchParams("sort", value);
            }}
          >
            {/* Xếp theo ngày tạo */}
            <Select.Option value="createdAt">Created At</Select.Option>
          </Select>
          <Select
            size="large"
            labelRender={(value) => (
              <>
                <span className="text-gray-500">{value.label}</span>
              </>
            )}
            placeholder="Select a direction"
            value={searchParams.get("direction") || "DESC"}
            style={{ width: 150 }}
            onChange={(value: string) => {
              changeSearchParams("direction", value);
            }}
          >
            <Select.Option value="ASC">Ascending</Select.Option>
            <Select.Option value="DESC">Descending</Select.Option>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default UserControlPanel;
