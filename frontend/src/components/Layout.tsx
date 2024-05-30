import React from "react";
import {
  AppstoreOutlined,
  ShopOutlined,
  TeamOutlined,
  UserOutlined,
  UserAddOutlined,
  LogoutOutlined,
  ProfileOutlined,
  SettingOutlined,
  BellOutlined,
  PlusCircleOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Layout, Menu } from "antd";
import { Link } from "react-router-dom";

const { Header, Content, Footer, Sider } = Layout;

const items: MenuProps["items"] = [
  {
    key: "1",
    icon: <UserAddOutlined style={{ fontSize: '24px' }} />,
    label: <Link to="/create-account">Create Account</Link>,
  },
  {
    key: "2",
    icon: <UserOutlined style={{ fontSize: '24px' }} />,
    label: <Link to="/login">Login</Link>,
  },
  {
    key: "3",
    icon: <PlusCircleOutlined style={{ fontSize: '24px' }} />,
    label: <Link to="/add-item">Add Item</Link>,
  },
  {
    key: "4",
    icon: <DeleteOutlined style={{ fontSize: '24px' }} />,
    label: <Link to="/remove-item">Remove Item</Link>,
  },
  {
    key: "5",
    icon: <AppstoreOutlined style={{ fontSize: '24px' }} />,
    label: <Link to="/create-list">Create List</Link>,
  },
  {
    key: "6",
    icon: <ShopOutlined style={{ fontSize: '24px' }} />,
    label: <Link to="/remove-list">Remove List</Link>,
  },
  {
    key: "7",
    icon: <TeamOutlined style={{ fontSize: '24px' }} />,
    label: <Link to="/share-list">Share List</Link>,
  },
  {
    key: "8",
    icon: <BellOutlined style={{ fontSize: '24px' }} />,
    label: <Link to="/notifications">Notifications</Link>,
  },
  {
    key: "9",
    icon: <ProfileOutlined style={{ fontSize: '24px' }} />,
    label: <Link to="/profile">Profile</Link>,
  },
  {
    key: "10",
    icon: <SettingOutlined style={{ fontSize: '24px' }} />,
    label: <Link to="/settings">Settings</Link>,
  },
  {
    key: "11",
    icon: <LogoutOutlined style={{ fontSize: '24px' }} />,
    label: <Link to="/logout">Logout</Link>,
  },
];

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Layout hasSider>
      <Sider className="overflow-auto h-screen fixed left-0 top-0 bottom-0">
        <div className="demo-logo-vertical" />
        <Menu theme="dark" mode="inline" defaultSelectedKeys={["1"]} items={items} />
      </Sider>
      <Layout className="ml-48">
        <Header className="p-0 bg-white shadow-md" />
        <Content className="m-6">
          <div className="p-6 text-center bg-white rounded-lg shadow-lg">
            {children}
          </div>
        </Content>
        <Footer className="text-center">
          Shop-Together ©{new Date().getFullYear()} Created by Matthieu Griffon
        </Footer>
      </Layout>
    </Layout>
  );
};

export default AppLayout;