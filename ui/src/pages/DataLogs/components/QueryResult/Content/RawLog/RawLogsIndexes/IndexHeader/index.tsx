import indexHeaderStyles from "@/pages/DataLogs/components/QueryResult/Content/RawLog/RawLogsIndexes/IndexHeader/index.less";
import IconFont from "@/components/IconFont";
import { Button, Space, Tooltip } from "antd";
import { useModel } from "@@/plugin-model";
import { useIntl } from "umi";
import { QuestionCircleOutlined } from "@ant-design/icons";

const IndexHeader = () => {
  const { onChangeVisibleIndexModal, currentLogLibrary } = useModel("dataLogs");
  const i18n = useIntl();
  return (
    <div className={indexHeaderStyles.indexHeaderMain}>
      <Space>
        <span className={indexHeaderStyles.title}>
          {i18n.formatMessage({ id: "log.index.header.title" })}
        </span>
        <div className={indexHeaderStyles.icon}>
          <Tooltip
            placement={"right"}
            title={i18n.formatMessage({ id: "log.index.help" })}
          >
            <a>
              <QuestionCircleOutlined />
            </a>
          </Tooltip>
        </div>
      </Space>
      {currentLogLibrary?.createType !== 1 && (
        <div className={indexHeaderStyles.icon}>
          <Button
            onClick={() => {
              onChangeVisibleIndexModal(true);
            }}
            type={"link"}
            icon={
              <Tooltip title={i18n.formatMessage({ id: "log.index.manage" })}>
                <IconFont type={"icon-setting"} />
              </Tooltip>
            }
          />
        </div>
      )}
    </div>
  );
};

export default IndexHeader;
