import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getListRequest, postListRequest } from "utils/api";
import img_h1_login from "assets/images/h1_login.png";
import styles from "assets/css/default.module.scss";
import Dialog from "components/alert/Dialog";
import {
  setOption,
  setStringOption,
  alertLayer,
  dFilter,
  getCookie,
} from "utils/helper";

const Login = () => {
  const [univGetCheck, setUnivGetCheck] = useState(false);
  const [univInfo, setUnivInfo] = useState({});
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(false);
  const [capsLockOn, setCapsLockOn] = useState(false);
  const [dialog, setDialog] = useState(null);
  const [cookieId, setCookieId] = useState("");
  const inputUserId = useRef();
  const inputUserPassword = useRef();
  const navigate = useNavigate();

  const { univCode } = useParams();
  const handleChange = (e) => {
    setCookieId(e.target.value);
  };
  const handleCheck = () => {
    setChecked(!checked);
  };
  const handleAlert = (type, fnClose, message, description, errorCode) => {
    setDialog(alertLayer(type, fnClose, message, description, errorCode));
  };
  const handleAlertClose = () => {
    setDialog(null);
  };
  const handleClick = (e) => {
    e.preventDefault();
    const param = {
      isMaster: "0",
      neisCode: univInfo.neisCode,
      userId: inputUserId.current.value,
      passWord: inputUserPassword.current.value,
      checked: checked,
      // univInfo: univInfo,
    };

    postListRequest("/api/login", param).then((response) => {
      if (response.toString().indexOf("Error") > -1) {
        const res = response.response.data;
        handleAlert(
          "info",
          () => {
            handleAlertClose();
          },
          res.response.error,
          res.response.message,
          res.response.statusCode
        );
      } else if (response.data.loginInfo.length > 0) {
        const tmpUserInfo = response.data.loginInfo[0][0];
        const tmpMenuList = response.data.loginInfo[1];
        const tmpIpsiList = response.data.loginInfo[3];
        const tmpSolutionYearList = response.data.loginInfo[3];

        const tmpCurrentSolution = dFilter(
          [{ IpsiYear: tmpSolutionYearList[0].ipsiYear }],
          tmpSolutionYearList
        )[0];

        const tmpIpsiYear =
          tmpIpsiList.length > 0 ? tmpIpsiList[0].ipsiYear : "";
        // const tmpIpsiGubun =
        //   tmpIpsiList.length > 0 ? tmpIpsiList[0].ipsiGubun : "";

        setOption("tv.info", { menuList: tmpMenuList });
        setOption("tv.info", { userInfo: tmpUserInfo });
        setOption("tv.info", { ipsiList: tmpIpsiList });
        setOption("tv.info", { solutionYearList: tmpSolutionYearList });
        setOption("tv.info", { currentSolution: tmpCurrentSolution });
        setStringOption("tv.ipsiYear", tmpIpsiYear);
        navigate(`/main/`);
      }
    });
  };

  useEffect(() => {
    const tmp = location.pathname.split("/");
    if (tmp.length < 4) return;
    window.sessionStorage.setItem("linkTv", tmp[3]);

    const tmpCookie = getCookie("tvSave");
    if (tmpCookie !== undefined) setChecked(true);
    else setChecked(false);
    setCookieId(tmpCookie);
    if (!univGetCheck) {
      getListRequest(`/api/account/baseinfo/${univCode}`)
        .then((response) => {
          if (response.data.data.length > 0 && response.data.success == true) {
            setUnivInfo(response.data.data[0][0]);
            setUnivGetCheck(true);
            let univInfo = response.data.data[0][0];
            setOption("tv.info", { univInfo: univInfo });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, []);

  if (univGetCheck === true) {
    let univName = "진학대학교";
    let logoPath = "/api/images/_ui.gif";
    if (univInfo !== undefined) {
      univName = univInfo.UnivName;
      logoPath = `/api/file/public/images/${univInfo.logoPath}`;
    }

    const alert = "";
    return (
      <div className={`${styles.wrap} ${styles.login}`}>
        <header>
          <div className={styles.core}>
            <p>
              <img src={logoPath} alt={univName} />
            </p>
            <h1>
              <img src={img_h1_login} alt="TextVision 로그인" />
            </h1>
          </div>
        </header>
        <div className={styles.contents}>
          <form>
            {/* <!-- 로그인 --> */}
            <div className={styles.login_form}>
              <legend>로그인</legend>
              <div className={styles.cell_input}>
                <input
                  type="text"
                  id="userID"
                  name="userID"
                  ref={inputUserId}
                  value={cookieId || ""}
                  placeholder={"아이디"}
                  onChange={handleChange}
                  tabIndex="1"
                />
                <div className={styles.save_id}>
                  <input
                    type="checkbox"
                    id="sv_id"
                    name="sv_id"
                    onChange={handleCheck}
                    checked={checked}
                  />
                  <label htmlFor="sv_id">
                    <span className={styles.blind}>아이디</span>
                    저장
                  </label>
                </div>
              </div>
              <div className={styles.cell_input}>
                <input
                  type="password"
                  name="passWord"
                  ref={inputUserPassword}
                  placeholder={"비밀번호"}
                  onKeyPress={(e) => {
                    if (
                      (e.charCode >= 65 && e.charCode <= 90 && !e.shiftKey) ||
                      (e.charCode >= 97 && e.charCode <= 122 && e.shiftKey)
                    ) {
                      setCapsLockOn(true);
                    } else {
                      setCapsLockOn(false);
                    }
                  }}
                  tabIndex="2"
                />
              </div>
              {capsLockOn && <p>CapsLock키가 활성화 되어있습니다.</p>}
              <input
                type="submit"
                onClick={handleClick}
                value="로그인"
                tabIndex="3"
              />
            </div>
          </form>
          <Dialog dialog={dialog} />
        </div>
        <footer>
          <p className={styles.copyright}>Copyright©jinhakapply co.</p>
        </footer>
      </div>
    );
  } else {
    const divStyle = {
      display: "block",
      position: "fixed",
      width: "100%",
      height: "100%",
    };
    const pStyle = {
      maxHeight: "100%",
      fontSize: "24px",
      textAlign: "center",
      margin: "20% 0px",
    };
    return (
      <div style={divStyle}>
        <p style={pStyle}>
          서비스가 존재하지 않습니다.
          <br />
          관리자에게 문의 바랍니다.
        </p>
      </div>
    );
  }
};

export default Login;
