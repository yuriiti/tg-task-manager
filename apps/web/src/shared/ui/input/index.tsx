import React from 'react';
import { Input as AntInput, InputProps } from 'antd';

export const Input: React.FC<InputProps> = (props) => {
  return <AntInput {...props} />;
};
