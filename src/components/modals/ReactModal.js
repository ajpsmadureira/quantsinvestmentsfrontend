import styles from "./Modals.module.css";
import CloseModalButton from "../buttons/CloseModalButton";
import Modal from "react-bootstrap/Modal";

function ReactModal(props) {
  return (
    <Modal show={true} onHide={props.closeModalHandler}>
      <div id="modal-title" className={`${styles["reactmodal-header"]}`}>
        <CloseModalButton clickHandler={props.closeModalHandler} />
      </div>
      <div id="modal-content" className={`${styles["reactmodal-content"]}`}>
        {props.children}
      </div>
    </Modal>
  );
}

export default ReactModal;
