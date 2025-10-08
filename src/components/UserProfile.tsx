import React, { useState } from "react";
import { Button, Typography, Switch } from "antd";
import { UserOutlined, CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { userInfo, constants } from "@utils/constants";

import { UserProfileProps, UserPopoverProps } from "../types/types";

const popoverContainerStyle: React.CSSProperties = {
  minWidth: 280,
  padding: 28,
  background: "#232634",
  borderRadius: 14,
  boxShadow: "0 4px 32px rgba(0,0,0,0.45)",
  textAlign: "center",
  color: "#f5f6fa",
  border: "1px solid #2e3244",
  position: "relative",
};

const logoutButtonStyle: React.CSSProperties = {
  background: "#e74c3c",
  borderColor: "#e74c3c",
  color: "#fff",
  fontWeight: 500,
  borderRadius: 8,
};

const cancelButtonStyle: React.CSSProperties = {
  marginTop: 10,
  background: "transparent",
  border: "1px solid #35394a",
  color: "#b0b4c1",
  borderRadius: 8,
};

const dividerStyle: React.CSSProperties = {
  margin: "20px 0 16px 0",
  borderTop: "1px solid #35394a",
};

const themeSwitchStyle: React.CSSProperties = {
  marginLeft: 8,
  marginTop: 16,
  display: "inline-block",
};

const UserProfile = ({ onLogout, onThemeToggle, theme }: UserProfileProps) => {
  const [visible, setVisible] = useState(false);

  const handleOpen = () => setVisible(true);
  const handleClose = () => setVisible(false);

  const UserPopover = ({
    userInfo,
    onLogout,
    onCancel,
    onThemeToggle,
    theme,
  }: UserPopoverProps) => (
    <div style={popoverContainerStyle}>
      <Typography.Text strong style={{ fontSize: 18, color: "#f5f6fa" }}>
        {userInfo.name}
      </Typography.Text>
      <br />
      <Typography.Text type="secondary" style={{ fontSize: 14, color: "#b0b4c1" }}>
        {userInfo.email}
      </Typography.Text>
      <div style={dividerStyle} />
      <div style={{ marginBottom: 16, fontSize: 15, color: "#b0b4c1" }}>
        {constants.loginData.doYouWantToLogout}
      </div>
      <Button
        type="primary"
        block
        style={logoutButtonStyle}
        onClick={() => {
          onCancel();
          onLogout();
        }}>
        {constants.loginData.logoutButton}
      </Button>
      <Button block style={cancelButtonStyle} onClick={onCancel}>
        {constants.loginData.cancelButton}
      </Button>

      {onThemeToggle && (
        <div style={themeSwitchStyle}>
          <Switch
            checkedChildren={<CheckOutlined />}
            unCheckedChildren={<CloseOutlined />}
            checked={theme === "dark"}
            onChange={onThemeToggle}
          />
          <span style={{ marginLeft: 8, color: "#b0b4c1", fontSize: 14 }}>
            {theme === "dark" ? "Light" : "Dark"} {constants.loginData.themeToggleLabel}
          </span>
        </div>
      )}
    </div>
  );

  return (
    <div className="top-bar">
      <div style={{ marginLeft: "auto" }}>
        <Button
          className="user-profile-button"
          shape="circle"
          icon={<UserOutlined />}
          onClick={handleOpen}
        />
      </div>

      {visible && (
        <div className="user-popover-backdrop" role="presentation" onClick={handleClose}>
          <div style={{ pointerEvents: "auto" }} onClick={(e) => e.stopPropagation()}>
            <UserPopover
              userInfo={userInfo}
              onLogout={onLogout}
              onCancel={handleClose}
              onThemeToggle={onThemeToggle}
              theme={theme}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
