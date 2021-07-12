import Logo from "./../images/logo.svg";
import * as Config from "./../config";
import styles from "./StockLogo.module.css";

function StockLogo(props) {
  return (
    <div
      className={styles["img-circular"]}
      style={{
        backgroundImage: `url(${
          props.filename
            ? Config.BACKEND_SERVER_URL + "/rest/logo/" + props.filename
            : Logo
        })`,
      }}
    ></div>
  );
}

export default StockLogo;
