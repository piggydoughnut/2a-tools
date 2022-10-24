import { GrammarlyEditorPlugin } from "@grammarly/editor-sdk-react";
import React from "react";
import { useField } from "formik";

export const Error = ({ children }: { children: React.ReactNode }) => (
  <p className="text-base text-red-400">{children}</p>
);

export const Input = (props: any) => {
  const [field, meta] = useField(props.name);
  const isMyError = meta.error && meta.touched;
  const inputStyle = `shadow-inner w-full bg-white-100 mb-2 border border-slate-700 rounded-lg pl-4 pr-4 pt-2 pb-2 focus:outline focus:outline-offset  focus:outline-indigo-400 ${
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
        <GrammarlyEditorPlugin clientId={process.env.NEXT_PUBLIC_GRAMMARLY}>
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
