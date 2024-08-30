import { HTMLProps } from "react";

interface Props extends HTMLProps<HTMLButtonElement> {
  children: string;
}
const EditButton = ({ children, ...rest }: Props) => {
  return (
    <button
      {...rest}
      type="button"
      className="px-6 py-3 bg-green-700 text-white rounded-md shadow-md"
    >
      {children}
    </button>
  );
};

export default EditButton;
