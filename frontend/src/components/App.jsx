import React from "react";
import Loader from "tui-components/lib/atoms/Loader/Loader";
import Button, { ButtonTypes } from "tui-components/lib/atoms/Button/Button";
import "./App.scss";

export default () => {
  return (
    <>
      <Loader />
      <Button type={ButtonTypes.primary}>THE APP!</Button>
    </>
  );
};
