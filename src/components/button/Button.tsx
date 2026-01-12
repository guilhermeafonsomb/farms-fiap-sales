import type React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const Button = ({ children, ...props }: ButtonProps) => {
  return (
    <button
      className="bg-primary-500 p-3 rounded-lg text-center text-white font-semibold"
      {...props}
    >
      {children}
    </button>
  );
};
