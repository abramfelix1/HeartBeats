import React, { useContext } from "react";
import { useDispatch } from "react-redux";
import { ModalContext } from "../../context/ModalContext";
import { ErrorContext } from "../../context/ErrorContext";

export default function Errors() {
  const { setType } = useContext(ModalContext);
  const { errors, setErrors } = useContext(ErrorContext);

  const err = Object.values(errors);
  console.log("ERROR: ", err);

  return (
    <div
      className="min-w-[24rem] max-w-fit h-fit p-8 bg-baby-powder rounded-3xl"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex flex-col gap-y-5">
        <p className="text-xl font-medium">ERROR</p>
        <div className="w-full border-[1px] border-black opacity-5"></div>
        <p className="text-lg">Please fix the following:</p>
        {err.map((error) => (
          <p>
            <span className="font-medium">"</span> {error}{" "}
            <span className="font-medium">"</span>
          </p>
        ))}

        <div className="flex flex-row gap-x-5 justify-end">
          <button
            className="w-fit h-fit p-2 rounded-xl border-[1px] border-black hover:bg-slate-200 "
            onClick={(e) => {
              e.stopPropagation();
              setType(null);
              setErrors(null);
            }}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
