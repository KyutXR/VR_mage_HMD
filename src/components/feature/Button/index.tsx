import React from "react";
import styles from "./index.module.css";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
}

const Button = ({ children, onClick }: ButtonProps) => {
  return (
    <button type="button" onClick={onClick} className={styles.button}>
      {children}
    </button>
  );
};

export default Button;
