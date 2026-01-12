interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = ({ ...props }: InputProps) => {
  return (
    <input
      {...props}
      className="rounded-lg p-3 mb-3 color-black bg-primary-100 text-black"
    />
  );
};
