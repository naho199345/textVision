import React from "react";
import Header from "components/Header";
import Nav from "components/Nav";

const TextVision = () => {
  return (
    <>
      <Header />
      <Nav />
      <div className="container">
        <div className="jumbotron text-center">
          <h2>
            <b>스마트논술</b>
          </h2>
          <br />
          <h6>1. 텍스트 추출 - 문항 이미지별 텍스트 추출</h6>
          <h6>2. 텍스트 재추출 - apiresult에 빈값인 값 재 추출</h6>
        </div>
      </div>
    </>
  );
};

export default TextVision;
