import React from 'react';
import { Modal as AntModal, ModalProps } from 'antd';

export const Modal: React.FC<ModalProps> = (props) => {
  return <AntModal {...props} />;
};
