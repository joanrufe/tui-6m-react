import "./App.scss";
import React from "react";
import Loader from "tui-components/lib/atoms/Loader/Loader";
import Button from "tui-components/lib/atoms/Button/Button";

export default () => {
  return (
    <>
      <Loader />
      <Button>THE APP!</Button>
    </>
  );
};
