import { useModel } from "@@/plugin-model";
import Files from "@/pages/Configure/components/Menu/Files";
import Publish from "@/pages/Configure/components/Menu/Publish";

const Menu = () => {
  const { activeMenu } = useModel("configure");

  switch (activeMenu) {
    case "files":
      return <Files />;
    case "publish":
      return <Publish />;
    default:
      return <></>;
  }
};

export default Menu;
