import React, { useState } from "react";
import type { IClazz } from "../../../../../store/admin/classManagement";
import {
  Button,
  Input,
  Modal,
  Form,
  Empty,
  message,
  type InputRef,
} from "antd";
import { useAppDispatch, useAppSelector } from "../../../../../store/store";
import {
  empowerClassForTeacher,
  revokeEmpowermentFromClass,
} from "../../../../../store/admin/classPowerSlide";
import { setClazz } from "../../../../../store/admin/classDetails";

interface Props {
  clazz: IClazz;
}

const ManagersForClassSession = ({ clazz }: Props) => {
  const { create: loadingCreate, removeItem: loadingRemoveItem } =
    useAppSelector((state) => state.admin.classPower.loadings);
  const inputRef = React.useRef<InputRef>(null);

  const [adding, setAdding] = useState(false);
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();

  const handleOk = async (values: { email: string }) => {
    try {
      dispatch(
        empowerClassForTeacher({ classId: clazz.id, email: values.email })
      )
        .unwrap()
        .then((data) => {
          form.resetFields();
          setAdding(false);
          dispatch(setClazz({ ...clazz, managers: [...clazz.managers, data] }));
        });
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  const handleRevoke = (id: number) => {
    Modal.confirm({
      title: "Revoke teacher authorization?",
      content: "Are you sure you want to revoke this teacher?",
      okText: "Yes",
      cancelText: "Cancel",
      onOk: async () => {
        await dispatch(
          revokeEmpowermentFromClass({ classId: clazz.id, teacherId: id })
        )
          .unwrap()
          .then(() => {
            dispatch(
              setClazz({
                ...clazz,
                managers: clazz.managers.filter((manager) => manager.id !== id),
              })
            );
            message.success("Teacher revoked successfully");
          });
      },
    });
  };

  return (
    <div className="rounded-xl shadow bg-white">
      {/* Header */}
      <div className="bg-sky-950 px-4 py-2 rounded-t-xl flex items-center justify-between">
        <div>
          <h1 className="text-xl text-white font-bold">
          Teachers have the right to manage the class
        </h1>
        <p className="text-sm text-gray-300">
          This is the person who has the authority to take attendance and assign homework to the class.
        </p>
        </div>
        <div>
          <Button
            type={adding ? "default" : "primary"}
            onClick={() => {
              setAdding(!adding);
              if (!adding) {
                setTimeout(() => {
                  inputRef.current?.focus(); // Ensure focus is applied after state update
                }, 0); // Dùng setTimeout(..., 0) sẽ đẩy việc gọi focus() sang microtask tiếp theo,
                //  sau khi React đã render xong cái Input, đảm bảo ref đã có.
              }
            }}
          >
            {adding ? "Cancel" : "Add Teacher"}
          </Button>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 !space-y-4">
        {/* Danh sách teacher */}
        {adding && (
          <Form
            onFinish={handleOk}
            form={form}
            size="large"
            className=" gap-2 grid grid-cols-[1fr_auto] items-start !p-4 border border-gray-300 rounded-md"
          >
            {adding && (
              <Form.Item
                name="email"
                rules={[
                  { required: true, message: "Email is required" },
                  { type: "email", message: "Please enter a valid email" },
                ]}
              >
                <Input ref={inputRef} placeholder="Enter teacher email" />
              </Form.Item>
            )}
            <Button
              type="primary"
              onClick={form.submit}
              size="large"
              loading={loadingCreate}
            >
              OK
            </Button>
          </Form>
        )}
        {clazz.managers.length > 0 ? (
          <div className="flex flex-wrap gap-2 ">
            {clazz.managers.map((manager) => (
              <div
                key={manager.id}
                className="p-4 border border-gray-300 rounded-md w-full flex  justify-between items-center"
              >
                <div>
                  <span>{manager.email}</span>
                  <span className="text-gray-500"> ({manager.fullName})</span>
                </div>
                <Button
                  className=""
                  onClick={() => handleRevoke(manager.id)}
                  danger
                >
                  Revoke
                </Button>
              </div>
            ))}
          </div>
        ) : (
          !adding && <Empty />
        )}
      </div>
    </div>
  );
};

export default ManagersForClassSession;
