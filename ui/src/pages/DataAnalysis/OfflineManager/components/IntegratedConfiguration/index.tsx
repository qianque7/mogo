import FileTitle, {
  FileTitleType,
} from "@/pages/DataAnalysis/components/FileTitle";
import IntegratedConfigs from "@/pages/DataAnalysis/OfflineManager/components/IntegratedConfiguration/IntegratedConfigs";
import { Form, Spin } from "antd";
import { useEffect, useMemo, useState } from "react";
import { useModel } from "@@/plugin-model";
import { DataSourceTypeEnums } from "@/pages/DataAnalysis/OfflineManager/config";
import message from "antd/es/message";
import { BigDataSourceType } from "@/services/bigDataWorkflow";
import { parseJsonObject } from "@/utils/string";
import styles from "@/pages/DataAnalysis/OfflineManager/components/IntegratedConfiguration/index.less";
import { useIntl } from "umi";
import { OpenTypeEnums } from "@/models/dataanalysis/useIntegratedConfigs";

export interface IntegratedConfigurationProps {
  currentNode: any;
  currentPaneActiveKey: string;
}
const IntegratedConfiguration = ({
  currentNode,
  currentPaneActiveKey,
}: IntegratedConfigurationProps) => {
  const i18n = useIntl();
  const [form] = Form.useForm();
  const [nodeInfo, setNodeInfo] = useState<any>();
  const [isChangeForm, setIsChangeForm] = useState<boolean>(false);
  const {
    updateNode,
    getNodeInfo,
    doLockNode,
    doUnLockNode,
    doRunCodeNode,
    doStopCodeNode,
    doGetColumns,
    doMandatoryGetFileLock,
  } = useModel("dataAnalysis", (model) => ({
    doGetColumns: model.integratedConfigs.doGetColumns,
    updateNode: model.manageNode.doUpdatedNode,
    getNodeInfo: model.manageNode.doGetNodeInfo,
    doLockNode: model.manageNode.doLockNode,
    doUnLockNode: model.manageNode.doUnLockNode,
    doRunCodeNode: model.manageNode.doRunCodeNode,
    doStopCodeNode: model.manageNode.doStopCodeNode,
    doMandatoryGetFileLock: model.manageNode.doMandatoryGetFileLock,
  }));

  const [source, setSource] = useState<any[]>([]);
  const [target, setTarget] = useState<any[]>([]);
  const [mapping, setMapping] = useState<any[]>([]);
  // 最初的mappingData
  const [defaultMappingData, setDefaultMappingData] = useState<any[]>([]);
  const [openVisible, setOpenVisible] = useState<boolean>(false);
  const [openType, setOpenType] = useState<OpenTypeEnums | undefined>();
  const [tableName, setTableName] = useState<string | undefined>();
  // 是否加载过
  const [isLoad, setIsLoad] = useState<Boolean>(false);

  const handleSubmit = (fields: any) => {
    const sourceForm = fields.source;
    const targetForm = fields.target;
    const params = {
      source: {
        typ: DataSourceTypeEnums[sourceForm.type].toLowerCase(),
        sourceId: sourceForm.datasource,
        cluster: sourceForm.cluster,
        database: sourceForm.database,
        table: sourceForm.table,
        sourceFilter: sourceForm.sourceFilter,
      },
      target: {
        typ: DataSourceTypeEnums[targetForm.type]?.toLowerCase(),
        sourceId: targetForm.datasource,
        cluster: targetForm.cluster,
        database: targetForm.database,
        table: targetForm.table,
        targetBefore: targetForm.targetBefore,
        targetAfter: targetForm.targetAfter,
        targetAfterList: targetForm.targetAfterList,
        targetBeforeList: targetForm.targetBeforeList,
      },
      mapping,
    };
    updateNode
      .run(currentNode.id, {
        name: currentNode.name,
        content: JSON.stringify(params),
      })
      .then((res) => {
        if (res?.code !== 0) return;
        message.success("节点保存成功");
      });
  };

  const doGetNodeInfo = (id: number) => {
    setIsLoad(true);
    getNodeInfo.run(id).then((res) => {
      if (res?.code !== 0) return;
      setNodeInfo(res.data);
      const formData = parseJsonObject(res.data.content);
      if (!formData) return;
      const sourceType =
        formData.source?.typ ===
        DataSourceTypeEnums[DataSourceTypeEnums.ClickHouse].toLowerCase()
          ? DataSourceTypeEnums.ClickHouse
          : DataSourceTypeEnums.MySQL;
      const targetType =
        formData.target?.typ ===
        DataSourceTypeEnums[DataSourceTypeEnums.ClickHouse].toLowerCase()
          ? DataSourceTypeEnums.ClickHouse
          : DataSourceTypeEnums.MySQL;
      const targetBeforeList: string[] = formData.target?.targetBeforeList || [
        formData.target?.targetBefore || "",
      ];
      const targetAfterList: string[] = formData.target?.targetAfterList || [
        formData.target?.targetAfter || "",
      ];
      form.setFieldsValue({
        source: {
          ...formData.source,
          type: sourceType,
          datasource: formData.source.sourceId,
        },
        target: {
          ...formData.target,
          type: targetType,
          datasource: formData.target.sourceId,
          targetBeforeList: targetBeforeList,
          targetAfterList: targetAfterList,
        },
      });
      setMapping(formData.mapping);
      setDefaultMappingData(formData.mapping);
      handleSetMapping(formData);
    });
  };

  const handleSetMapping = (formData: any) => {
    const source =
      formData.source?.typ ===
      DataSourceTypeEnums[DataSourceTypeEnums.ClickHouse].toLowerCase()
        ? {
            id: currentNode.iid,
            source: BigDataSourceType.instances,
            database: formData.source?.database,
            table: formData.source?.table,
          }
        : {
            id: formData.source?.sourceId,
            source: BigDataSourceType.source,
            database: formData.source?.database,
            table: formData.source?.table,
          };

    const target =
      formData.target?.typ ===
      DataSourceTypeEnums[DataSourceTypeEnums.ClickHouse].toLowerCase()
        ? {
            id: currentNode.iid,
            source: BigDataSourceType.instances,
            database: formData.target?.database,
            table: formData.target?.table,
          }
        : {
            id: formData.target?.sourceId,
            source: BigDataSourceType.source,
            database: formData.target?.database,
            table: formData.target?.table,
          };

    if (
      !source.table ||
      !source.database ||
      !target.database ||
      !target.table
    ) {
      return;
    }
    doGetColumns
      .run(source.id, source.source, {
        database: source.database,
        table: source.table,
      })
      .then((res: any) => {
        if (res?.code !== 0) return;
        setSource(res.data);
      });
    doGetColumns
      .run(target.id, target.source, {
        database: target.database,
        table: target.table,
      })
      .then((res: any) => {
        if (res?.code !== 0) return;
        setTarget(res.data);
      });
  };

  const handleSave = () => {
    form.submit();
    setIsChangeForm(false);
  };
  const handleLock = (file: any) => {
    setIsChangeForm(false);
    doLockNode.run(file.id).then((res: any) => {
      if (res.code !== 0) return;
      doGetNodeInfo(file.id);
    });
  };

  const handleUnlock = (file: any) => {
    setIsChangeForm(false);
    doUnLockNode.run(file.id).then((res: any) => {
      if (res.code !== 0) return;
      doGetNodeInfo(file.id);
    });
  };

  const handleRun = (file: any) => {
    doRunCodeNode.run(file.id).then((res) => {
      if (res?.code !== 0) return;
      doGetNodeInfo(file.id);
    });
  };

  const handleStop = (file: any) => {
    doStopCodeNode.run(file.id).then((res) => {
      if (res?.code !== 0) return;
      doGetNodeInfo(file.id);
    });
  };

  const handleGrabLock = (file: any) => {
    doMandatoryGetFileLock.run(file?.id).then((res: any) => {
      if (res.code != 0) return;
      doGetNodeInfo(file.id);
      message.success(
        i18n.formatMessage({
          id: "bigdata.components.FileTitle.grabLockSuccessful",
        })
      );
    });
  };

  const handleChangeForm = (changedValues: any, allValues: any) => {
    setIsChangeForm(true);
  };

  useMemo(() => {
    if (currentNode?.id == currentPaneActiveKey) doGetNodeInfo(currentNode.id);
  }, []);

  // 看板打开修改key会慢初始化一步，从看板打开的文件的key初始化是看板的key
  useEffect(() => {
    if (currentNode?.id == currentPaneActiveKey && !nodeInfo && !isLoad)
      doGetNodeInfo(currentNode.id);
  }, [currentPaneActiveKey, currentNode?.id]);

  const iid = useMemo(() => currentNode.iid, [currentNode.iid]);

  if (!nodeInfo) {
    return (
      <div
        style={{
          flex: 1,
          minHeight: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Spin spinning={getNodeInfo.loading} />
      </div>
    );
  }

  return (
    <div className={styles.integratedConfigMain}>
      {/* 
          getNodeInfo.loading || doUnLockNode.loading || updateNode.loading
       */}
      <FileTitle
        type={FileTitleType.node}
        isChange={isChangeForm}
        file={nodeInfo}
        onSave={handleSave}
        onLock={handleLock}
        onUnlock={handleUnlock}
        onRun={handleRun}
        onStop={handleStop}
        onGrabLock={handleGrabLock}
        node={currentNode}
      />
      <IntegratedConfigs
        onFormChange={handleChangeForm}
        onSubmit={handleSubmit}
        iid={iid}
        form={form}
        file={nodeInfo}
        node={currentNode}
        source={source}
        setSource={setSource}
        target={target}
        setTarget={setTarget}
        mapping={mapping}
        setMapping={setMapping}
        defaultMappingData={defaultMappingData}
        openVisible={openVisible}
        setOpenVisible={setOpenVisible}
        openType={openType}
        setOpenType={setOpenType}
        tableName={tableName}
        setTableName={setTableName}
        currentPaneActiveKey={currentPaneActiveKey}
      />
    </div>
  );
};
export default IntegratedConfiguration;
