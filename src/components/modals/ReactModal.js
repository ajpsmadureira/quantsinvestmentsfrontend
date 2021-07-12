import styles from "./Modals.module.css";
import CloseModalButton from "../buttons/CloseModalButton";
import Modal from "react-bootstrap/Modal";

function ReactModal(props) {
  return (
    // animation={false} makes an annoying warning disappear
    <Modal show={true} animation={false} onHide={props.closeModalHandler}>
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
