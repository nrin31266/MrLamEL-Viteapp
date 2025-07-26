import type { FormProps } from "antd";
import { Button, Form, Input } from "antd";

import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../store/store";
import { login } from "../../../../store/authSlide";
import { Link } from "react-router-dom";


const Login = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loadings, errors } = useAppSelector((state) => state.auth);
  const onFinish: FormProps<{email: string, password: string}>["onFinish"] = (values) => {
    console.log("Login values:", values);
    dispatch(login(values)).unwrap().then(() => {
      navigate("/");
    });
  };
  return (

     <div className="flex flex-col gap-2 bg-white p-10 rounded-xs shadow-xs">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 text-center">Login</h1>
        <p className="text-gray-600 text-center">Please enter your credentials to login.</p>
      </div>
       <Form
        name="basic"
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
          <Input placeholder="Email" type="email"/>
        </Form.Item>

        <Form.Item
          // label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password placeholder="Password" />
        </Form.Item>

        <Form.Item label={null}>
          <Button loading={loadings.login} type="primary" htmlType="submit" className="w-full" size="large">
            Login
          </Button>
          { errors.login && <p className="error">{errors?.login}</p>}
        </Form.Item>
      </Form>
      <div className="grid grid-cols-2 text-gray-600 text-sm">
        <Link to="/auth/register" className="underline text-left">Don't have an account?</Link>
        <Link to="/auth/request-password-reset" className="underline text-right">Forgot password?</Link>
      </div>
     </div>

  );
};

export default Login;
