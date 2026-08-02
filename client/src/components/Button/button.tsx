import React from "react";
import "./button.scss";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  color?: "blue" | "orange";
}

const ButtonWithExplosion: React.FC<ButtonProps> = ({ color = "blue", children, onClick, className = "", ...props }) => {
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
  };

  return (
    <button
      className={`btn ${color === "blue" ? "btn-blue" : "btn-orange"} ${className}`.trim()}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default ButtonWithExplosion;
