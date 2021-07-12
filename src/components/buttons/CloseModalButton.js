import styles from "./CloseModalButton.module.css";

function CloseModalButton(props) {
  return (
    <button className={styles.button} onClick={props.clickHandler}>
      &times;
    </button>
  );
}

export default CloseModalButton;
