import React, { useContext } from "react";
import { useDispatch } from "react-redux";
import { ModalContext } from "../../context/ModalContext";

export default function Errors() {
  const { setType } = useContext(ModalContext);

  return (
    <div className="min-w-[24rem] max-w-fit h-fit p-8 bg-baby-powder rounded-3xl">
      <div className="flex flex-col gap-y-5">
        <p className="text-xl font-semibold">Confirm Delete</p>
        <div className="w-full border-[1px] border-black opacity-5"></div>
        <p className="text-lg">Are you sure you want to delete:</p>
        <p>
          <span className="font-medium">"</span> ERROR CONTEXT{" "}
          <span className="font-medium">"</span>
        </p>
        <div className="flex flex-row gap-x-5 justify-end">
          <button
            className="w-fit h-fit p-2 rounded-xl border-[1px] border-black hover:bg-slate-200 "
            onClick={() => setType(null)}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
