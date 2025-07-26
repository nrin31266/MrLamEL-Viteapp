import type { FormProps } from "antd";
import { Button, Form, Input } from "antd";

import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../store/store";
import { login, register } from "../../../../store/authSlide";
import { Link } from "react-router-dom";
import { useState } from "react";


const Register = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loadings, errors } = useAppSelector((state) => state.auth);
  const [localError, setLocalError] = useState("");
  const onFinish: FormProps<{email: string, password: string, confirmPassword: string}>["onFinish"] = (values) => {
    setLocalError("");
    if (values.password !== values.confirmPassword) {
        setLocalError("Passwords do not match");
      return;
    }
    dispatch(register(values)).unwrap().then(() => {
      navigate("/");
    });
  };
  return (

     <div className="flex flex-col gap-2 bg-white p-10 rounded-xs shadow-xs">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 text-center">Register</h1>
        <p className="text-gray-600 text-center">Please enter your details to register.</p>
      </div>
       <Form
        name="register"
        // labelCol={{ span: 8 }}
        // wrapperCol={{ span: 16 }}
        className="w-auto md:w-96"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        // onFinishFailed={onFinishFailed}
        // autoComplete="off"
        layout="horizontal"
        disabled={loadings.login}
        size="large"
      >
        <Form.Item
          // label="Email"
          name="email"
          rules={[{ required: true, message: "Please input your email!" }]}
          
        >
          <Input placeholder="Email" type="email" autoComplete="email"/>
        </Form.Item>

        <Form.Item
          // label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password placeholder="Password" />
        </Form.Item>
        <Form.Item
          // label="Password"
          name="confirmPassword"
          rules={[{ required: true, message: "Please confirm your password!" }]}
        >
          <Input.Password placeholder="Confirm Password" />
        </Form.Item>
       
        <Form.Item label={null}>
          <Button loading={loadings.register} type="primary" htmlType="submit" className="w-full" size="large">
            Register
          </Button>
            {localError && <p className="error">{localError}</p>}
          { errors.register && <p className="error break-words">{errors?.register}</p>}
        </Form.Item>
      </Form>
      <div className="grid grid-cols-2 text-gray-600 text-sm">
        <Link to="/auth/login" className="underline text-left">Already have an account?</Link>
        <Link to="/auth/request-password-reset" className="underline text-right">Forgot password?</Link>
      </div>

     </div>

  );
};

export default Register;
