import { GrammarlyEditorPlugin } from "@grammarly/editor-sdk-react";
import React from "react";
import { useField } from "formik";

export const Error = ({ children }: { children: React.ReactNode }) => (
  <p className="text-base text-red-400">{children}</p>
);

export const Input = (props: any) => {
  const [field, meta] = useField(props.name);
  const isMyError = meta.error && meta.touched;
  const inputStyle = `w-full bg-amber-200 mb-2 border-0 rounded-sm pt-1 pb-1 pl-2 focus:outline focus:outline-offset  focus:outline-indigo-400 ${
    props.customstyle
  } ${isMyError ? " outline outline-offset outline-red-400" : ""}`;

  return (
    <div className={`grid ${props.type === "textarea" ? "" : "h-42"}`}>
      {props.label && (
        <label className="w-36" htmlFor={props.name}>
          {props.label}
        </label>
      )}
      {props.type === "textarea" ? (
        <GrammarlyEditorPlugin clientId="client_3qMp9dapxvbwsnzv53xKGg">
          <textarea className={inputStyle} {...field} {...props} />
        </GrammarlyEditorPlugin>
      ) : (
        <input className={inputStyle} {...field} {...props} />
      )}

      {!props.shownoerr && (
        <div className="h-6">
          {meta.error && meta.touched && <Error>{meta.error}</Error>}
        </div>
      )}
    </div>
  );
};
