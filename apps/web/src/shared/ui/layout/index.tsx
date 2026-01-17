import React from 'react';
import { Layout as AntLayout, LayoutProps } from 'antd';

export const Layout: React.FC<LayoutProps> = (props) => {
  return <AntLayout {...props} />;
};
