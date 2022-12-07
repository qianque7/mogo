import userStyles from "@/layouts/User/styles/index.less";
import UserCardHeader from "@/layouts/User/UserCardHeader";
import { Outlet } from "umi";
import { SelectLang } from "umi";

const LoginLayout = () => {
  return (
    <div className={userStyles.userMain}>
      <div className={userStyles.userCard}>
        <UserCardHeader />
        <div className={userStyles.divider} />
        <Outlet />
      </div>
      <SelectLang className={userStyles.lang} reload={false} />
    </div>
  );
};

export default LoginLayout;
