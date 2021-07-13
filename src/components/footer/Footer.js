import styles from "./Footer.module.css";
import logo from "../../images/logo.svg";

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="row align-items-center">
        <div className="col-lg-4">
          <p className={`${styles["p_copyright"]}`}>
            Copyright &copy; 2021 Quants.Investments All Rights Reserved
          </p>
        </div>
        <div className="col-lg-4">
          <img
            className={styles.img_logo}
            src={logo}
            alt="Quants.Investments logo"
          />
        </div>
        <div className="col-lg-4">
          <p className={styles["p_footer"]}>
            <a
              className={styles.a_contactus}
              href="mailto: no-reply@quants.investments"
            >
              Contact Us
            </a>
          </p>
        </div>
      </div>
      <div className="row align-items-center">
        <p
          style={{
            marginTop: "4rem",
            textAlign: "center",
            fontSize: "8pt",
            color: "var(--color-gray)",
          }}
        >
          Legal Disclaimer: The information on this site is provided by
          Quants.Investments and it is not to be construed as an offer or
          solicitation for the purchase or sale of any financial instrument or
          the provision of an offer to provide investment services. Information,
          opinions and comments contained on this site are not under the scope
          of investment advisory services. Investment advisory services are
          given according to the investment advisory contract, signed between
          the intermediary institutions, portfolio management companies,
          investment banks and the clients. Opinions and comments contained in
          this site reflect the personal views of the analysts who supplied
          them. The investments discussed or recommended in this report may
          involve significant risk, may be iliquid and may not be suitable for
          all investors. Therefore, making decisions with respect to the
          information in this report may cause inappropriate results.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
