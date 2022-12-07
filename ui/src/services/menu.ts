import { request } from "umi";

// 获取用户有权限的菜单
export async function AccountMenus() {
  return request<API.Res<any[] | any>>(
    process.env.PUBLIC_PATH + `api/v1/menus/list`
  );
}
