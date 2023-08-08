import * as R from "ramda";
import cookie from "react-cookies";
import React, { Suspense } from "react";
import Alert from "mgr/components/alert/Alert";
// const Alert = React.lazy(() => import('common/components/Alert'));
import bowser from "bowser"; //브라우저 감지
import { encryption } from "./crypto";
// import { quantile } from './quantile';

// error handling 없이 무조건 null return
const checkTC = (fn) => {
  try {
    return fn();
  } catch (e) {
    return null;
  }
};

export const getOption = (option) => {
  return checkTC(() => JSON.parse(sessionStorage.getItem(option)));
};

export const getStringOption = (option) => {
  // console.log("session", sessionStorage.getItem(option));
  // console.log(checkTC(() => sessionStorage.getItem(option)));
  return checkTC(() => sessionStorage.getItem(option));
};

export const setOption = (name, option) => {
  const oldOption = getOption(name);
  const options = { ...oldOption, ...option };

  sessionStorage.setItem(name, JSON.stringify(options));
};

export const setStringOption = (name, option) => {
  // console.log(name, option);
  if (typeof option === "string" || option instanceof String) {
    sessionStorage.setItem(name, option);
  }
  if (option === null) {
    sessionStorage.removeItem(name);
  }
};

export const clearOption = (names) => {
  names.forEach((name) => {
    sessionStorage.removeItem(name);
  });
};

// LOCAL STORAGE
export const getLocalOption = (option) => {
  return checkTC(() => JSON.parse(localStorage.getItem(option)));
};

export const setLocalOption = (name, option) => {
  const oldOption = getOption(name);
  const options = { ...oldOption, ...option };
  localStorage.setItem(name, JSON.stringify(options));
};

export const getStringLocalOption = (option) => {
  return checkTC(() => localStorage.getItem(option));
};

export const setStringLocalOption = (name, option) => {
  if (typeof option === "string" || option instanceof String) {
    localStorage.setItem(name, option);
  }
};

export const isNull = (val) => {
  return String(val) === "NULL" ? null : val;
};

export const isBoolean = (val) => {
  return String(val) === "0" ? false : String(val) === "1";
};

export const getCookie = (name) => {
  return checkTC(() => {
    const value = "; " + document.cookie;
    const parts = value.split("; " + name + "=");
    if (parts.length === 2) return parts.pop().split(";").shift();
  });
};
export const readCookie = (key) => {
  return checkTC(() => {
    const token = cookie.load(key);
    if (!token) {
      return null;
    }
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace("-", "+").replace("_", "/");
    const loginInfo = JSON.parse(window.atob(base64));
    loginInfo.userID = unescape(loginInfo.userID);
    loginInfo.loginIdx = unescape(loginInfo.loginIdx);

    return loginInfo;
  });
};

export const removeCookie = (key) => {
  // console.log(cookie);
  cookie.remove(key, { path: "/" });
};

export const auth = (params) => {
  return "";
};

// data sorting
// * array JSON 형식의 데이터를 요청한 컬럼들을 기준으로 정렬하여 리턴
// ex) dSort(["AColumn", "BColumn"], arrayJson);
// return => [{"AColumn": 1, "BColumn": 1}, {"AColumn": 1, "BColumn": 2}, {"AColumn": 2, "BColumn": 1}]
export const dSort = (columns, data) => {
  return R.pipe(R.sortBy(R.props(columns)))(data);
};

// data sorting + asc, desc 기능 추가
// * array JSON 형식의 데이터를 요청한 컬럼들을 기준으로 정렬하여 리턴
// 컬럼명 끝에 :R 을 추가 시 해당 컬럼은 desc 처리
// ex) dSortWith(["AColumn:D", "BColumn"], arrayJson);
export const dSortWith = (columns, data) => {
  const colItems = columns.map((item, i) => {
    return item.indexOf(":D") === -1
      ? R.ascend(R.prop(item))
      : R.descend(R.prop(item.replace(":D", "")));
  });

  return R.sortWith(colItems, data);
};

// data grouping
// * 특정컬럼들을 추출하여 grouping 하여 array JSON 형식으로 리턴
// ex) dGroup(["AColumn", "BColumn"], arrayJson);
// ex2) dGroup(["AColumn", "BColumn"], arrayJson, ["AColumn"]);
// return => [{"AColumn": 5, "BColumn": 6}, {"AColumn": 4, "BColumn": 2}, {"AColumn": 3, "BColumn": 8}]
export const dGroup = (columns, data, sort) => {
  const result = R.pipe(
    R.map(R.props(columns)),
    R.map(JSON.stringify),
    R.uniq,
    R.map(JSON.parse),
    R.map(R.zipObj(columns))
  )(data);
  if (typeof sort === "undefined") return result;
  return dSortWith(sort, result);
};

// data Filter
// * AND 연산으로 컬럼의 벨류값들이 정확히 일치하는 행을 array JSON 형식으로 리턴
// ex) dFilter([{"AColumn": "a"}, {"BColumn": "b"}], arrayJson);
// return => [{"AColumn" : "a", "BColumn": "b", "CColumn" : "c"}]
export const dFilter = (fieldName, data) => {
  let tmpData = data;
  fieldName.forEach((item) => {
    if (item[Object.keys(item)[0]] !== "") {
      tmpData = R.filter(
        R.propEq(Object.keys(item)[0], item[Object.keys(item)[0]])
      )(tmpData);
    }
  });

  return tmpData;
};

// data Fillter IN
// * IN 연산으로 벨류값을 array내 벨류값을 포함하면 해당값을 리턴
// ex) dFilterIn("FailType", [1, 2, 3], userList);
// return => [{SuhumNo: "BOAA10004", ApplicantName: "***", DisplayName: "진리_전자_473", SelTypeCode: "O", SelTypeName: "진리자유전형",…}]
export const dFilterIn = (fieldName, fieldArr, data) => {
  let tmpData = data;
  if (fieldArr.length > 0) {
    tmpData = R.filter(R.compose(R.flip(fieldArr), R.prop(fieldName)), tmpData);
  }
  return tmpData;
};

// data Filter not in
// ex) dFilterNotIn("FailType", [1, 2, 3], userList);
export const dFilterNotIn = (fieldName, fieldArr, data) => {
  let tmpData = data;
  if (fieldArr.length > 0) {
    tmpData = R.reject(R.compose(R.flip(fieldArr), R.prop(fieldName)), tmpData);
  }
  return tmpData;
};

// data Filter LIKE
// * AND 연산으로 컬럼의 벨류값들이 LIKE로 일치하는 행을 array JSON 형식으로 리턴
// ex) dFilter([{"AColumn": "a"}, {"BColumn": "b"}], arrayJson);
// return => [{"AColumn" : "a", "BColumn": "b", "CColumn" : "c"}]
export const dFilterLike = (fieldName, data) => {
  let tmpData = data;
  fieldName.forEach((item) => {
    if (item[Object.keys(item)[0]] !== "") {
      tmpData = R.filter(
        R.where({
          [Object.keys(item)[0]]: item[Object.keys(item)[0]],
        })
      )(tmpData);
    }
  });
  return tmpData;
};

// data Duplication
export const dDuplicate = R.reduce(R.concat, []);

//숫자형 데이터인 경우 1000단위 ","를 넣어서 리턴
// ex) comma("2000")
// return "2,000"
export const comma = (value) => {
  //Number.isInteger(value)
  return typeof value === "number"
    ? value.toLocaleString(navigator.language, { minimumFractionDigits: 0 })
    : value;
};

// downLoad
// 엑셀 다운로드시 활용
export const downLoad = (data, fileName) => {
  let url = null;
  if (bowser.msie || bowser.msedge)
    window.navigator.msSaveOrOpenBlob(new Blob([data]), fileName);
  else {
    url = window.URL.createObjectURL(new Blob([data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
  }
};

// 데이터(학생부 비교과나 자기소개서 등에 쓰이는)\n 반영해 화면에 보여주는 함수
export const enterData = (data, fontSize) => {
  if (data === null) {
    return <p />;
  } else {
    return data.split(/(♨|\n)/).map((item, i) => {
      return (
        <p key={i} style={{ fontSize: fontSize }}>
          {item}
        </p>
      );
    });
  }
};

export const enterToBr = (data) => {
  if (data) {
    //console.log(data.indexOf(/(\n)/));
  }
  return data ? data.replace(/(\n|♨|\/EOR\/)/gi, "<br />") : "";
};

export const bindKeyword = (keyword, originalData) => {
  if (!originalData) return "";

  let rtnData = originalData;

  keyword.forEach((item, i) => {
    if (item.Keyword.trim() !== "") {
      // 공백이 업로드된경우 시스템 먹통됨을 방지
      // enterToBr해줘야 한다.(동일고비교 때문에...)
      const Keyword = enterToBr(item.Keyword).replace(
        /([()[{*+.$^\\|?])/g,
        "\\$1"
      );
      const filter = new RegExp(Keyword, "g");
      // id='${item.Area}' <--키워드검색 replace로 태그 손상됨. danny
      const replaceValue = `<keyword style='${item.Style}'>${item.Keyword}</keyword>`;
      rtnData = rtnData.replace(filter, replaceValue);
    }
  });
  return rtnData;
};

export const bindKeyword_Total = (
  keyword,
  HSProfileLinkHeader,
  spanArray,
  originalData
) => {
  if (!originalData) return "";

  let rtnData = originalData;
  let rpReData = [];
  let rpSpanData = [];

  // Span 태그(시작과 끝)을 배열로 변경 후 나중에 다시 치환해준다.
  spanArray.forEach(function (spanItem, i) {
    let spanSplit = spanItem.outerHTML.split(spanItem.outerText);
    rtnData = rtnData.replace(spanSplit[0], "!" + i + "0!");
    rtnData = rtnData.replace(spanSplit[1], "!" + i + "1!");
    rpSpanData.push({ key: "!" + i + "0!", val: spanSplit[0] });
    rpSpanData.push({ key: "!" + i + "1!", val: spanSplit[1] });
  });

  keyword.forEach((item, i) => {
    if (item.Keyword.trim() !== "") {
      // 공백이 업로드된경우 시스템 먹통됨을 방지
      // enterToBr해줘야 한다.(동일고비교 때문에...)
      const Keyword = enterToBr(item.Keyword).replace(
        /([()[{*+.$^\\|?])/g,
        "\\$1"
      );
      const filter = new RegExp(Keyword, "g");
      // id='${item.Area}' <--키워드검색 replace로 태그 손상됨. danny
      const replaceValue =
        item.KeywordGubun === "HiProfile"
          ? `<keyword class='tag_link' title='${HSProfileLinkHeader[0].C03} : ${item.C03}
      \n${HSProfileLinkHeader[0].C05}: ${item.C05}
      \n${HSProfileLinkHeader[0].C06}: ${item.C06}
      \n${HSProfileLinkHeader[0].C07}: ${item.C07}
      '>${item.Keyword}</keyword>`
          : `<keyword style='${item.Style}'>${item.Keyword}</keyword>`;

      // 키워드의 중복을 막기 위해([이상한나라] > [한나라] > [나라] 중첩키워드 방지)
      rtnData = rtnData.replace(filter, "%" + i + "%");
      rpReData.push({ key: "%" + i + "%", val: replaceValue });
    }
  });
  rpReData.concat(rpSpanData).forEach((rpArray) => {
    const filter = new RegExp(rpArray.key, "gi");
    rtnData = rtnData.replace(filter, rpArray.val);
  });
  return rtnData;
};
/*
export const bindClub = (HSProfileLinkHeader, HSProfileLink, originalData) => {
  if (!originalData) return "";

  // keyword태그 삭제
  // let myRegExp1 = /<(\/span|span)([^>]*)>/gi;
  // let myRegExp2 = /<(\/keyword|keyword)([^>]*)>/gi;
  let rtnData = originalData;
  //.replace(myRegExp1, "").replace(myRegExp2, "");
  let rpReData = [];
  HSProfileLink.map((item, i) => {
    if (item.C04 !== undefined) {
      if (item.C04.trim() !== "" && item.C04.trim().length > 2) {
        //임시로 동아리명 3글자 이상만..
        //공백이 업로드된경우 시스템 먹통됨을 방지
        // {C02 : 동아리코드, C03 : 동아리구분, C04 : 동아리명, C05 : 동아리인원, C06 : 동아리설명, C07 : 해당연도}
        // enterToBr해줘야 한다.(동일고비교 때문에...)
        const Keyword = item.C04.replace(/([()[{*+.$^\\|?])/g, "\\$1");
        const filter = new RegExp(Keyword, "gi");
        const replaceValue = `<keyword class="tag_link" title='${
          HSProfileLinkHeader[0].C03
        } : ${item.C03}
      \n${HSProfileLinkHeader[0].C05}: ${item.C05}
      \n${HSProfileLinkHeader[0].C06}: ${item.C06}
      \n${HSProfileLinkHeader[0].C07}: ${item.C07}
      '>${item.C04}</keyword>`;
      rtnData = rtnData.replace(filter, "_" + item.RowsIdx + "_");
      rpReData.push({ key: "_" + item.RowsIdx + "_", val: replaceValue });
    }
  });
  //replace 한 데이터를 반복적으로 replace하는 문제를 해결하기 위한 노력 - danny 2019.08.15
  rpReData.map(rpArray => {
    const filter = new RegExp(rpArray.key, "gi");
    rtnData = rtnData.replace(filter, rpArray.val);
  });
  return rtnData;
};
*/
// stateJsonCopy
// state의 json array를 copy시 사용
export const stateJsonCopy = (data) => {
  return JSON.parse(JSON.stringify(data));
};

// 글씨 크기 조절 함수
export const fnFontSize = (state, fsize, ftext) => {
  let fSize = fsize.split("em")[0];
  let fText = ftext;
  fSize = parseFloat(fSize);
  if (state === "up" && fSize <= parseFloat(1.7)) {
    fSize = fSize + 0.2;

    fText = fText + 20;
  } else if (state === "down" && fSize >= parseFloat(0.5)) {
    fSize = fSize - 0.2;
    fText = fText - 20;
  } else if (state === "default") {
    fSize = 1;
    fText = 100;
  }
  fSize = fSize + "em";
  return {
    fSize: fSize,
    fText: fText,
  };
};

// 필수체크
// let val = validation(this.state, { exception: ["evalName"] });
export const validation = (data, opts) => {
  let result = { success: true };
  let opt = opts || {};
  let exception = opt.exception || [];
  let include = opt.include || [];
  let value = opt.value || "";
  for (let key in data) {
    let check = false;

    // console.log(typeof data[key]);
    if (typeof data[key] !== "string") {
      check = true;
      continue;
    }
    //컬럼 제외
    for (let s in exception) {
      if (exception[s] === key) {
        check = true;
        break;
      }
    }
    if (check) continue;

    //컬럼 지정
    let includeCheck = false;
    for (let k in include) {
      if (include[k] === key) {
        includeCheck = true;
        break;
      }
    }
    if (include.length > 0 && !includeCheck) continue;
    //컬럼비교
    if (data[key] === value) {
      result = { success: false, column: key };
      return result;
    }
  }
  return result;
};

//비밀번호 유효성 체크
export const validPassword = (value) => {
  let reg = /^(?=.*?[A-Za-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*_+-]).{9,20}$/;
  if (!reg.test(value)) {
    /* alert("비밀번호는 영문, 숫자, 특수문자 3가지 조합으로 9~20자 입력하여야 합니다.");*/
    return false;
  } else return true;
  //return true;
};

//IP 주소 유효성 체크
export const validIPAddress = (value) => {
  let reg =
    /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  if (value !== "" && value !== "..." && !reg.test(value)) return false;
  else return true;
};

// 데이터 비교
// val = compare(this.state, {compare: ["evalName", "groupName"]});
export const compare = (data, opts) => {
  let opt = opts || {};
  let compare = opt.compare || [];
  let sPre = "";

  if (compare.length < 2) return false;

  for (let i in compare) {
    let s = compare[i];
    if (i > 0 && data[sPre] !== data[s]) {
      return { success: false, column: s };
    }
    sPre = s;
  }
  return { success: true, column: sPre };
};

// json 데이터의 특정 컬럼 bool 체크 유무 확인(1개이상인지)
export const jsonDataChecked = (data, column) => {
  column = column || "check";
  let checked = false;
  for (let i in data) {
    if (data[i][column]) {
      checked = true;
      break;
    }
  }
  return checked;
};

export const maskingText = (text, maskingWord, useLength, appendText, use) => {
  if (use) {
    const maskingArray = new Array(useLength ? useLength : text.length).fill(
      maskingWord || "*"
    );

    let rtnText = maskingArray.join("");

    if (appendText) rtnText = rtnText + appendText;

    return rtnText;
  }
  return text;
};

// Alert - type : 타입, fnClose : 확인 클릭, message : 메세지, description : 하단 설명, errorCode : 오류코드
export const alertLayer = (type, fnClose, message, description, errorCode) => {
  return (
    <Alert
      type={type}
      message={message}
      description={description}
      fnClose={fnClose}
      errorCode={errorCode}
    />
  );
};

// Confirm - fnConfirm : 예, 아니오 클릭, message : 메세지, description : 하단 설명
export const confirmLayer = (fnConfirm, message, description) => {
  // console.log("fnConfirm", typeof fnConfirm);
  return (
    <Alert
      type={"confirm"}
      message={message}
      description={description}
      fnConfirm={fnConfirm}
    />
  );
};
// fnConfirm={(result) => {
//   fnConfirm(result);
// }}
// Blob -> String 변환
export const parseBlob = async (file) => {
  const reader = new FileReader();
  reader.readAsText(file);
  return await new Promise((resolve, reject) => {
    reader.onload = function (event) {
      resolve(reader.result);
    };
  });
};

// 파일경로 암호화 및 팝업
// defaultPath : "usr/fileopen/public/pdf"
// filePath : "hp/fileName"
// size: "width=767,height=800"
export const fileOpenPopup = (defaultPath, filePath, size) => {
  const encFilePath = encryption(filePath);
  window.open(
    `/${defaultPath}/${encFilePath}`,
    "fileOpen",
    size || "width=767,height=800"
  );
};

export const getAPI = (serviceDI) => {
  if (serviceDI === "1") return "/api/usr";
  else return null;
};

export const getBlindText = (parent, node, isPre, point) => {
  const getNode = (parent, node, isPre) => {
    let fn = isPre ? "previousSibling" : "nextSibling";
    return parent !== node.parentNode ? node.parentNode[fn] : node[fn];
  };

  const params = isPre ? [0, point] : [point, node.textContent.length];
  let text = node.textContent.substring(...params);
  node = getNode(parent, node, isPre, point);

  // 문자열 앞뒤에 공백이 아닌경우 어절을 ++
  let wordCnt = 2;

  let p = point;

  while (node) {
    p = p + node.textContent.length;
    text = isPre ? node.textContent + text : text + node.textContent;
    node = getNode(parent, node, isPre, point);
  }

  // 문자열 앞뒤 공백 OR 문자열 확인
  const firstWord = isPre ? text.substring(p - 1, p) : text.slice(0, 1);
  const wordCheck = firstWord.match(/(\n|\t|\s)/);
  if (!wordCheck) wordCnt++;

  // 앞뒤 문자열에서 공백, 탭, 엔터를 SPACE 로 변경 및 SPACE로 해당 어절 스플릿
  text = text.replace(/(\r|\n|\t)/g, " ");
  let word = text.split(" ");

  // 배열내 공백 값 제거
  word = word.filter((x) => !!x);

  // 앞뒤 어절 wordCnt 개수만큼 추출
  let sLen = isPre ? wordCnt * -1 : 0;
  let eLen = isPre ? word.length : wordCnt;
  word = word.slice(sLen, eLen);

  // 양옆 공백값 생성
  const leftSpace = !isPre && wordCheck ? " " : "";
  const rightSpace = isPre && wordCheck ? " " : "";

  return `${leftSpace}${word.join(" ")}${rightSpace}`;
};

export const bindMasking = (maskingArr, originalData) => {
  if (!originalData) return "";
  if (!maskingArr) return originalData;

  let rtnData = originalData;
  maskingArr.forEach((item, i) => {
    if (item.value.trim() !== "") {
      //공백이 업로드된경우 시스템 먹통됨을 방지
      const bvalue = item.value.replace(/([()[{*+.$^\\|?])/g, "\\$1");
      const filter = new RegExp(bvalue, "g");
      const masking = item.value.replace(/./g, "*");
      //maskingValue가 ***일경우 글자수만큼 * 처리하고 그렇지 않을경우 maskingValue를 사용함 danny 2018.11.20
      rtnData = rtnData.replace(
        filter,
        item.maskingValue === "***" ? masking : item.maskingValue
      );
    }
  });
  return rtnData;
};

export const stdev = (arr) => {
  const n = arr.length;
  if (n === 0) return {};
  const sum = arr.reduce((a, b) => a + b);

  const mean = sum / n;

  let variance = 0.0;
  let v1 = 0.0;
  let v2 = 0.0;
  let stddev = 0.0;

  if (n !== 1) {
    for (let i = 0; i < n; i++) {
      v1 = v1 + (arr[i] - mean) * (arr[i] - mean);
      v2 = v2 + (arr[i] - mean);
    }

    v2 = (v2 * v2) / n;
    variance = (v1 - v2) / (n - 1);
    if (variance < 0) {
      variance = 0;
    }
    stddev = Math.sqrt(variance);
  }

  return {
    mean: Math.round(mean * 1000) / 1000,
    variance: variance,
    deviation: Math.round(stddev * 1000) / 1000,
  };
};

// 소수점 0제거
// decimalZeroRemove("99.20000", 5)
export const decimalZeroRemove = (value, len) => {
  if (len === undefined) len = 5;
  const cipher = parseInt("1" + new Array(len + 1).join("0"), 10);
  if (isNaN(value) || value === "" || value === undefined || value === null) {
    return value;
  } else {
    return (value * cipher) / cipher;
  }
};

export const replaceHTMLTAG = (data) => {
  // 에디터블에서는 원본에 "<,>" 문자가 태그로 인식되어 사라짐
  let ConvertTag = [
    { value: "<", maskingValue: "&lt;" },
    { value: ">", maskingValue: "&gt;" },
  ];

  return data ? bindMasking(ConvertTag, data) : "";
};

export const searchKeyword = (
  materialCode,
  materialShortName,
  keyword,
  originalData
) => {
  if (!originalData) return "";

  let keywordArray = {
    materialCode: materialCode,
    materialShortName: materialShortName,
    keyArray: [],
  };

  keyword.forEach((item, i) => {
    if (item.Keyword.trim() !== "") {
      //공백이 업로드된경우 시스템 먹통됨을 방지
      const Keyword = item.Keyword.replace(/([()[{*+.$^\\|?])/g, "\\$1");

      //if(originalData.includes(Keyword)){
      if (originalData.indexOf(Keyword) > -1) {
        keywordArray.keyArray.push(Keyword);
      }
      //keywordArray.keyArray.push(item.Keyword)
    }
  });

  return keywordArray;
};

export const split_period = (input_data) => {
  // 괄호 패턴 정규식 표현
  let pattern = /\([\s\S]*?\)/g;
  // 통 문장에서 괄호 패턴 조사
  let result = input_data.match(pattern);
  // 통 문장내의 괄호 패턴을 #t#e#idx#m#p# 문구로 치환
  if (result != null) {
    for (let result_idx = 0; result_idx < result.length; result_idx++) {
      input_data = input_data.replace(
        result[result_idx],
        "#t#e#" + result_idx + "#m#p#"
      );
    }
  }
  // 마침표 기준으로 문장 분리
  // let split_data = input_data.split(/(?<=[.])/g); //IE에서 오류남
  let split_data = input_data.split(/\./g);

  // 분리된 문장에서 #t#e#idx#m#p# 문구를 다시 원래 괄호 내용으로 치환
  if (result != null) {
    let result_idx = 0;
    for (let sent_idx = 0; sent_idx < split_data.length; sent_idx++) {
      for (; result_idx < result.length; result_idx++) {
        if (
          split_data[sent_idx].indexOf("#t#e#" + result_idx + "#m#p#") !== -1
        ) {
          split_data[sent_idx] = split_data[sent_idx].replace(
            "#t#e#" + result_idx + "#m#p#",
            result[result_idx]
          );
        } else {
          break;
        }
      }
    }
  }

  return split_data;
};

// 값이 비어있는지 여부 danny 2019.05.07 추가
export const isEmpty = (value) => {
  if (
    value === "" ||
    value === null ||
    value === undefined ||
    (value !== null && typeof value === "object" && !Object.keys(value).length)
  ) {
    return true;
  } else {
    return false;
  }
};

//이미지 리사이징(p:img, max_height)
export const imgResize = (image, max_height) => {
  let canvas = document.getElementById("myCanvas");
  if (image.height > max_height) {
    image.width *= max_height / image.height;
    image.height = max_height;
  }
  let ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  canvas.width = image.width;
  canvas.height = image.height;
  ctx.drawImage(image, 0, 0, image.width, image.height);

  return image;
};
