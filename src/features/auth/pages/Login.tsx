import type { FormProps } from "antd";
import { Button, Form, Input } from "antd";

import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../store/store";
import { login } from "../../../store/authSlide";


const Login = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const onFinish: FormProps<{email: string, password: string}>["onFinish"] = (values) => {
    console.log("Login values:", values);
    dispatch(login(values)).unwrap().then(() => {
      navigate("/");
    });
  };

//   const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
//     errorInfo
//   ) => {
//     console.log("Failed:", errorInfo);
//   };
  return (
    <div>
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        // onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: "Please input your email!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item label={null}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
