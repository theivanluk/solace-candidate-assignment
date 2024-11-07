import { PropsWithChildren } from "react";

export const TableData = ({ children }: PropsWithChildren) => {
  return <td className="p-2 text-center align-middle border border-solid border-gray">{children}</td>;
};
