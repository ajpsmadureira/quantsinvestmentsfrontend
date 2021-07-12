import styles from "./Item.module.css";

function Item(props) {
  return (
    <li onClick={props.clickHandler} key={props.itemKey} className="nav-item">
      <button className={styles.button}> {props.content} </button>
    </li>
  );
}

export default Item;
