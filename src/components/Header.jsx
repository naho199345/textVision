// Header.js
import React from "react";

const Header = () => {
  return (
    <head>
      <link
        rel="stylesheet"
        href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css"
      />
      <style>
        {`
          .container {
            max-width: 900px;
            margin-top: 2rem;
          }
          .jumbotron {
            padding: 2rem 2rem;
            background-color: #f7f7f7;
            border-radius: 0.3rem;
          }
          .jumbotron h2 {
            color: #007bff;
          }
          .jumbotron h6 {
            color: #ff6f91;
            margin-left: 1rem;
          }
        `}
      </style>
    </head>
  );
};

export default Header;
