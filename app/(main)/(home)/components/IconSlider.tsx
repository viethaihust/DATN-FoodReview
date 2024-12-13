"use client";
import React from "react";
import "./IconWrapper.css";
import { FrownOutlined, SmileOutlined } from "@ant-design/icons";
import { Slider } from "antd";

interface IconSliderProps {
  max: number;
  min: number;
  value?: number;
  onChange?: (value: number) => void;
}

const IconSlider: React.FC<IconSliderProps> = (props) => {
  const { max, min, value = 0, onChange } = props;
  const mid = Number(((max - min) / 2).toFixed(5));
  const preColorCls = value >= mid ? "" : "icon-wrapper-active";
  const nextColorCls = value >= mid ? "icon-wrapper-active" : "";

  return (
    <div className="icon-wrapper">
      <FrownOutlined className={preColorCls} />
      <Slider min={min} max={max} onChange={onChange} value={value} />
      <SmileOutlined className={nextColorCls} />
    </div>
  );
};

export default IconSlider;
