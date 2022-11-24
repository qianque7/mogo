import { Dropdown } from "antd";
import React from "react";
import classNames from "classnames";
import styles from "./index.less";

export type HeaderDropdownProps = {
  overlayClassName?: string;
  menu: React.ReactNode | (() => React.ReactNode) | any;
  placement?:
    | "bottomLeft"
    | "bottomRight"
    | "topLeft"
    | "topCenter"
    | "topRight"
    | "bottomCenter";
};

const HeaderDropdown: React.FC<HeaderDropdownProps> = ({
  overlayClassName: cls,
  ...restProps
}) => (
  <Dropdown
    overlayClassName={classNames(styles.container, cls)}
    {...restProps}
  />
);

export default HeaderDropdown;
