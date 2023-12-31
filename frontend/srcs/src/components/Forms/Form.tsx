import React, { ReactNode } from 'react';
import './Forms.scss'

interface FormProps {
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  title: string;
  buttonText: string;
  children: ReactNode;
}

const Form: React.FC<FormProps> = ({ onSubmit, title, buttonText, children }) => {
  return (
    <form onSubmit={onSubmit} >
      <h2>{title}</h2>
      {children}
      <button type="submit">{buttonText}</button>
    </form>
  );
};

export default Form;
