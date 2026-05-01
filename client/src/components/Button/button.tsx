import React from "react";
import "./button.scss";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  color?: "blue" | "orange";
}

const ButtonWithExplosion: React.FC<ButtonProps> = ({ color = "blue", children, ...props }) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    for (let i = 0; i < 15; i++) {
      const circle = document.createElement("span");
      circle.className = "explosion-circle";
      circle.style.background = color === "blue" ? "var(--blue)" : "var(--orange)";

      const size = Math.random() * 3 + 3 + "px";
      circle.style.width = size;
      circle.style.height = size;

      // относительное положение внутри кнопки
      const offsetX = (Math.random() - 0.5) * rect.width;
      const offsetY = (Math.random() - 0.5) * rect.height;

      circle.style.left = centerX + offsetX + "px";
      circle.style.top = centerY + offsetY + "px";

      button.appendChild(circle);

      const angle = Math.random() * 2 * Math.PI;
      const distance = Math.random() * 30 + 10;

      const translateX = Math.cos(angle) * distance;
      const translateY = Math.sin(angle) * distance;

      circle.animate(
        [
          { transform: "translate(0,0)", opacity: 1 },
          { transform: `translate(${translateX}px, ${translateY}px)`, opacity: 0 }
        ],
        {
          duration: 600 + Math.random() * 300,
          easing: "ease-out"
        }
      );

      setTimeout(() => circle.remove(), 1000);
    }
  };

  return (
    <button
      className={`btn ${color === "blue" ? "btn-blue" : "btn-orange"}`}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default ButtonWithExplosion;
