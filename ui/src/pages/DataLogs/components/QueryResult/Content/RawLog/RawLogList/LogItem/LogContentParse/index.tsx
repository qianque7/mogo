import classNames from "classnames";
import logItemStyles from "@/pages/DataLogs/components/QueryResult/Content/RawLog/RawLogList/LogItem/index.less";
import { useModel } from "@@/plugin-model";
import JsonView from "@/components/JsonView";
import JsonStringValue from "@/components/JsonView/JsonStringValue";

type LogContentParseProps = {
  logContent: any;
  secondaryIndexKeys?: any[];
  keyItem?: string;
  quickInsertLikeQuery?: (
    key: string,
    extra?: { key?: string; isIndex?: boolean; indexKey?: string }
  ) => void;
  quickInsertLikeExclusion?: (
    key: string,
    extra?: { key?: string; isIndex?: boolean; indexKey?: string }
  ) => void;
  foldingChecked?: boolean;
};

const LogContentParse = ({
  logContent,
  keyItem,
  secondaryIndexKeys,
  quickInsertLikeQuery,
  quickInsertLikeExclusion,
  foldingChecked,
}: LogContentParseProps) => {
  const { highlightKeywords } = useModel("dataLogs");
  const isNullList = ["\n", "\r\n", "", " "];

  let content;
  if (typeof logContent !== "object") {
    if (isNullList.includes(logContent)) {
      content = "";
    } else {
      content = (
        <JsonStringValue
          val={logContent.toString()}
          keyItem={keyItem}
          onClickValue={quickInsertLikeQuery}
          quickInsertLikeExclusion={quickInsertLikeExclusion}
          highLightValue={highlightKeywords}
        />
      );
    }
  } else if (logContent === null) {
    content = "";
  } else {
    content = (
      <>
        <JsonView
          secondaryIndexKeys={secondaryIndexKeys}
          data={logContent}
          onClickValue={quickInsertLikeQuery}
          quickInsertLikeExclusion={quickInsertLikeExclusion}
          highLightValue={highlightKeywords}
          foldingChecked={foldingChecked}
          hierarchy={1}
        />
      </>
    );
  }
  return (
    <span className={classNames(logItemStyles.logContent)}>{content}</span>
  );
};
export default LogContentParse;
