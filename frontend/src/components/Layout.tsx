import React, { useState } from "react";
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
import { Layout, Menu, theme } from "antd";
import { Link } from "react-router-dom";

const { Content, Footer, Sider } = Layout;

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleMenuClick = () => {
    setCollapsed(true);
  };

  const items: MenuProps["items"] = [
    {
      key: "0",
      icon: <UserAddOutlined style={{ fontSize: '12px' }} />,
      label: <Link to="/" style={{ fontSize: '12px' }} onClick={handleMenuClick}>Accueil</Link>,
    },
    {
      key: "1",
      icon: <UserAddOutlined style={{ fontSize: '12px' }} />,
      label: <Link to="/create-account" style={{ fontSize: '12px' }} onClick={handleMenuClick}>Créer un compte</Link>,
    },
    {
      key: "2",
      icon: <UserOutlined style={{ fontSize: '12px' }} />,
      label: <Link to="/login" style={{ fontSize: '12px' }} onClick={handleMenuClick}>Login</Link>,
    },
    {
      key: "3",
      icon: <PlusCircleOutlined style={{ fontSize: '12px' }} />,
      label: <Link to="/add-item" style={{ fontSize: '12px' }} onClick={handleMenuClick}>Ajouter un article</Link>,
    },
    {
      key: "4",
      icon: <DeleteOutlined style={{ fontSize: '12px' }} />,
      label: <Link to="/remove-item" style={{ fontSize: '12px' }} onClick={handleMenuClick}>Supprimer un article</Link>,
    },
    {
      key: "5",
      icon: <AppstoreOutlined style={{ fontSize: '12px' }} />,
      label: <Link to="/create-list" style={{ fontSize: '12px' }} onClick={handleMenuClick}>Créer une liste</Link>,
    },
    {
      key: "6",
      icon: <ShopOutlined style={{ fontSize: '12px' }} />,
      label: <Link to="/remove-list" style={{ fontSize: '12px' }} onClick={handleMenuClick}>Supprimer une liste</Link>,
    },
    {
      key: "7",
      icon: <TeamOutlined style={{ fontSize: '12px' }} />,
      label: <Link to="/share-list" style={{ fontSize: '12px' }} onClick={handleMenuClick}>Partager une liste</Link>,
    },
    {
      key: "8",
      icon: <BellOutlined style={{ fontSize: '12px' }} />,
      label: <Link to="/notifications" style={{ fontSize: '12px' }} onClick={handleMenuClick}>Notifications</Link>,
    },
    {
      key: "9",
      icon: <ProfileOutlined style={{ fontSize: '12px' }} />,
      label: <Link to="/profile" style={{ fontSize: '12px' }} onClick={handleMenuClick}>Profil</Link>,
    },
    {
      key: "10",
      icon: <SettingOutlined style={{ fontSize: '12px' }} />,
      label: <Link to="/settings" style={{ fontSize: '12px' }} onClick={handleMenuClick}>Paramètres</Link>,
    },
    {
      key: "11",
      icon: <LogoutOutlined style={{ fontSize: '12px' }} />,
      label: <Link to="/logout" style={{ fontSize: '12px' }} onClick={handleMenuClick}>Déconnexion</Link>,
    },
  ];

  return (
    <Layout className="full-height">
      <Sider
        className="full-height"
        breakpoint="lg"
        collapsedWidth="0"
        collapsed={collapsed}
        width={collapsed ? 80 : "100%"}
        style={{ height: '100vh' }}
        onBreakpoint={(broken) => {
          console.log(broken);
          setCollapsed(broken);
        }}
        onCollapse={(collapsed, type) => {
          console.log(collapsed, type);
          setCollapsed(collapsed);
        }}
      >
        <div className="demo-logo-vertical" />
        <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']} items={items} />
      </Sider>
      <Layout>
        <Content style={{ margin: '24px 16px 0' }}>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <div className="text-center bg-white rounded-lg shadow-lg">
              {children}
            </div>
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
