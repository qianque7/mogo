import systemSettingStyles from "@/layouts/SystemSetting/styles/index.less";
import { Outlet } from "umi";

const SystemSetting = () => {
  return (
    <div className={systemSettingStyles.systemSettingMain}>
      <Outlet />
    </div>
  );
};
export default SystemSetting;
