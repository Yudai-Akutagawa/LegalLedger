import React from "react";
import { useAppSelector } from "../../../app/hooks";
import { messageData } from "../messageSlice";

const MaintResult: React.FC = () => {
  const message = useAppSelector(messageData);
  let resultMessageHtml = <></>;

  switch (message.messageText) {
    case "正常に追加されました":
      resultMessageHtml = <strong>{message.messageText}</strong>;
      break;
    case "追加しようとしたidが重複しています":
      resultMessageHtml = (
        <strong className="text-danger">{message.messageText}</strong>
      );
      break;
    case "削除が完了しました":
      resultMessageHtml = <strong>{message.messageText}</strong>;
      break;
    case "削除対象が存在しません":
      resultMessageHtml = (
        <strong className="text-danger">{message.messageText}</strong>
      );
      break;
    case "更新が完了しました":
      resultMessageHtml = <strong>{message.messageText}</strong>;
      break;
    default:
      resultMessageHtml = (
        <strong className="text-danger">{message.messageText}</strong>
      );
  }

  return <>{resultMessageHtml}</>;
};

export default MaintResult;
