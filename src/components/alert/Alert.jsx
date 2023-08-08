import React from "react";
import PropTypes from "prop-types";
import styles from "mgr/assets/css/alert.module.scss";
import { getOption } from "utils/helper";

const Alert = ({
  type,
  message,
  description,
  errorCode,
  fnClose,
  fnConfirm,
}) => {
  const handleConfirmYes = (e) => {
    fnConfirm(true);
  };
  const handleConfirmNo = (e) => {
    fnConfirm(false);
  };
  const handleAlertClose = () => {
    fnClose(errorCode);
  };
  // 기본 ClassName = info
  let className = "info";
  if (type === "success") className = "success";
  else if (type === "error") className = "error";
  else if (type === "confirm") className = "confirm";

  if (Number.isInteger(errorCode) && parseInt(errorCode, 10) === 9999)
    className = "error";

  return (
    <div className={`${styles.alert_wrap} ${styles[className]}`}>
      <div className={styles.message}>
        <div dangerouslySetInnerHTML={{ __html: message }} />
        <p
          className={styles.description}
          dangerouslySetInnerHTML={{ __html: description }}
        />
      </div>
      {type === "confirm" ? (
        <p className={styles.alert_btn}>
          <a id="chkBtn" data-value={true} onClick={handleConfirmYes}>
            예
          </a>
          <a id="chkBtn" data-value={false} onClick={handleConfirmNo}>
            아니오
          </a>
        </p>
      ) : (
        <p className={styles.alert_btn}>
          <a onClick={fnClose}>확인</a>
        </p>
      )}
    </div>
  );
};
Alert.propTypes = {
  type: PropTypes.string,
  message: PropTypes.string,
  description: PropTypes.string,
  fnClose: PropTypes.any,
  fnConfirm: PropTypes.any,
  errorCode: PropTypes.any,
};
export default Alert;
