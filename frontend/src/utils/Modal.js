import React, { useContext, useEffect } from "react";
import { ModalContext } from "../context/ModalContext";
import "./modal.css";
import DeleteConfirmation from "../components/ModalPages/DeleteConfirmation";
import Errors from "../components/ModalPages/Errors";

export default function Modal(props) {
  const { type, setType } = useContext(ModalContext);

  let content = null;

  const handleContent = () => {
    setType(null);
  };

  // Allows ESC key to close modal
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27) handleContent();
    };
    window.addEventListener("keydown", handleEsc);

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, []);

  if (type) {
    content = (
      <div className="font-poppins modalWrapper">
        <div className="modalContent">
          <div className="closeButtonWrapper"></div>
          {type === "DELETE" && <DeleteConfirmation />}
          {type === "ERROR" && <Errors />}
        </div>
        <div className="modalBackdrop" onClick={handleContent} />
      </div>
    );
  }
  return <>{content}</>;
}
