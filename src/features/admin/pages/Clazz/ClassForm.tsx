import { Button, Form, Input, message, Select, Upload, type UploadFile, type UploadProps } from "antd";
import { useForm } from "antd/es/form/Form";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAppDispatch, useAppSelector } from "../../../../store/store";
import {
  createClazz,
  fetchSelectCourses,
  fetchSelectRooms,
} from "../../../../store/admin/classManagement";
import { CurrencyUtils } from "../../../../utils/CurrencyUtils";
import { useLocale } from "antd/es/locale";
import { useLocation, useNavigate } from "react-router-dom";
import { uploadAntDImage } from "../../../firebase/uploadImage";

const ClassForm = () => {
  const [form] = useForm();
  
  const dispatch = useAppDispatch();
  const rooms = useAppSelector((state) => state.admin.classManagement.rooms);
    const [isUploading, setIsUploading] = useState(false);
  const courses = useAppSelector(
    (state) => state.admin.classManagement.courses
  );
  const location = useLocation();
  const navigate = useNavigate();
  const {
    create: creatingClass,
    fetchCourses,
    fetchRooms,
  } = useAppSelector((state) => state.admin.classManagement.loadings);
  const { create: createError } = useAppSelector(
    (state) => state.admin.classManagement.errors
  );

  const [fileList, setFileList] = useState<UploadFile[]>([]);
const onFinish = async (values: any) => {
    console.log("Form values:", values);
    try {
      setIsUploading(true);
      if (fileList.length > 0) {
        const avatarUrl = await uploadAntDImage(fileList[0]);
        values.avatarUrl = avatarUrl;
        setFileList((pre)=>[{...pre[0], url: avatarUrl}]);
      }
    } catch (error) {
      message.error("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
    await dispatch(createClazz(values)).unwrap().then((data) => {
      message.success("Class created successfully");
      navigate(`/admin/classes/details/${data.id}`);
    }).catch(() => {
      message.error("Failed to create class");
    });
  };
  const uploadProps: UploadProps = {
      beforeUpload: (file: any) => {
        setFileList([
          {
            uid: file.uid,
            name: file.name,
            status: "done",
            originFileObj: file,
            thumbUrl: URL.createObjectURL(file),
          },
        ]);
        return false;
      },
      fileList,
      onRemove: (file: UploadFile) => {
        const index = fileList.indexOf(file);
        const newFileList = fileList.slice();
        newFileList.splice(index, 1);
        setFileList(newFileList);
      },
      accept: ".png, .jpg, .jpeg",
      maxCount: 1,
      listType: "picture-card",
    };
  useEffect(() => {
    if (fetchCourses === undefined) {
      dispatch(fetchSelectCourses());
    }

    if (fetchRooms === undefined) {
      dispatch(fetchSelectRooms());
    }
  }, [dispatch]);
  const roomId = Form.useWatch("roomId", form);
  const courseId = Form.useWatch("courseId", form);
  useEffect(() => {
    if (roomId) {
       form.setFieldsValue({ maxSeats: rooms.filter(room => room.id === roomId)[0]?.capacity });
    }
  }, [roomId]);
  useEffect(() => {
    if (courseId) {
      form.setFieldsValue({ totalSessions: courses.filter(course => course.id === courseId)[0]?.totalSessions });
    }
  }, [courseId]);
  const isLoading = creatingClass || isUploading;
  return (
    <div className=" bg-white container p-4 max-w-[63rem] mx-auto space-y-6">
      <div>
        <Button type="default" onClick={() => navigate(-1)}>
          Back
        </Button>
      </div>
      <div>
        <h1 className="text-2xl font-bold text-gray-800 text-center">
          Create Class
        </h1>
      </div>
      <Form
        size="large"
        form={form}
        layout="vertical"
        onFinish={onFinish}
        className=""
        initialValues={{
          remember: true,
          status: "OK", // Set initial value for status here
        }}
        requiredMark={false}
        name="userForm"
      >
        <div className="grid grid-cols-12 gap-x-4">
             <Form.Item
             className="col-span-12"
          name="avatarUrl"

        >
          <Upload {...uploadProps}>
            <span className="text-gray-500">
              {fileList.length > 0 ? "Change Avatar" : "Upload Avatar"}
            </span>
          </Upload>
        </Form.Item>
          <Form.Item
            className="col-span-12"
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please enter the name!" }]}
          >
            <Input placeholder="Enter name" />
          </Form.Item>

          <Form.Item
            className="col-span-8"
            label="Room"
            name="roomId"
            rules={[{ required: true, message: "Please select the room!" }]}
          >
            <Select placeholder="Select room">
              {rooms.map((room) => (
                <Select.Option key={room.id} value={room.id}>
                  <div className="flex justify-between items-center gap-2">
                    <div>
                      <span className="font-semibold">{room.code}</span>{" "}
                      {"_" + room.name}
                    </div>
                    <div>Capacity: {room.capacity}</div>
                  </div>
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            className="col-span-4"
            label="Max Seats"
            name="maxSeats"
            rules={[
              { required: true, message: "Please enter the maxSeats!" },
              () => ({
                validator(_, value) {
                  const capacity = rooms.find(
                    (room) => room.id === roomId
                  )?.capacity;
                  if (!value) return Promise.resolve();
                  const numValue = Number(value);
                  if (capacity && numValue > capacity) {
                    return Promise.reject(
                      `Cannot exceed room capacity (${capacity})!`
                    );
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <Input
              disabled={!roomId}
              type="number"
              placeholder="Enter maxSeats"
            />
          </Form.Item>

          <Form.Item
            className="col-span-8"
            label="Course"
            name="courseId"
            rules={[{ required: true, message: "Please select the course!" }]}
          >
            <Select placeholder="Select course">
              {courses.map((course) => (
                <Select.Option
                  label={`${course.code} - ${course.name}`}
                  key={course.id}
                  value={course.id}
                >
                  <div className="flex justify-between items-center gap-2">
                    <div>
                      <span className="font-semibold">{course.code}</span>{" "}
                      {"_" + course.name}
                    </div>

                    <div>{CurrencyUtils.formatVND(course.fee)}</div>
                  </div>
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            className="col-span-4"
            label="Total Sessions"
            name="totalSessions"
            rules={[
              { required: true, message: "Please enter the totalSessions!" },
            ]}
          >
            <Input
              disabled={!courseId}
              type="number"
              placeholder="Enter totalSessions"
            />
          </Form.Item>
        </div>
      </Form>
      {
        createError ? (<div className="error">{createError}</div>) : null
      }
     <div className="mt-5">
       <Button loading={isLoading} size="large" className="w-full" type="primary" onClick={() => form.submit()}>
        Submit
      </Button>
     </div>
    </div>
  );
};

export default ClassForm;
