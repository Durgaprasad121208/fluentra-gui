import React from 'react';
import { Button as AntButton } from 'antd';
import type { ButtonProps } from 'antd';
import './CustomButton.css';

export interface CustomButtonProps extends ButtonProps {
  title?: string;
}

export const SubmitButton: React.FC<CustomButtonProps> = ({
  title,
  children,
  className = '',
  ...props
}) => {
  return (
    <AntButton
      type="primary"
      {...props}
      className={`submit-btn ${className}`}
    >
      {children || title}
    </AntButton>
  );
};

export const CancelButton: React.FC<CustomButtonProps> = ({
  title,
  children,
  className = '',
  ...props
}) => {
  return (
    <AntButton
      {...props}
      className={`cancel-btn ${className}`}
    >
      {children || title}
    </AntButton>
  );
};

export default SubmitButton;
