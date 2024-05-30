import React from 'react';
import { Form, Input, Button, Checkbox } from 'antd';
import { CreateAccountForm } from '../types';
import { ValidateErrorEntity } from 'rc-field-form/lib/interface';

const CreateAccount: React.FC = () => {
  const onFinish = (values: CreateAccountForm) => {
    console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo: ValidateErrorEntity<CreateAccountForm>) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-1">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-sm font-bold mb-6 text-center">Create Account</h2>
        <Form
          name="createAccount"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          layout="vertical"
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input autoComplete="username" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password autoComplete="new-password" />
          </Form.Item>

          <Form.Item name="remember" valuePropName="checked">
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <Form.Item>
            <a href="#" className="text-blue-500">Forgot password?</a>
          </Form.Item>

          <Form.Item className="text-center">
            <Button type="primary" htmlType="submit" className="w-full text-xs px-2">
              Create Account
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default CreateAccount;