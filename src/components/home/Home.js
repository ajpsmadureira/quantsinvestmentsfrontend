import styles from "./Home.module.css";
import loader from "../../components/Loader.module.css";
import { useMediaPredicate } from "react-media-hook";
import { useSelector, useDispatch } from "react-redux";
import homeSlice from "../../store/home-slice";
import { useEffect, useRef, Fragment } from "react";
import * as Model from "../../model";
import Chart from "../Chart";
import * as Config from "../../config";

let chart;

const setChartReference = (ref) => {
  chart = ref;
};

function Home(props) {
  const biggerThan767 = useMediaPredicate("(min-width: 767px)");

  const registering = useSelector((state) => state.home.registering);

  const registered = useSelector((state) => state.home.registered);

  const emailInputRef = useRef();

  const csrfToken = useSelector((state) => state.app.csrfToken);

  const dispatch = useDispatch();

  const registerEmail = () => {
    dispatch(homeSlice.actions.setRegistering());
  };

  useEffect(() => {
    if (!registering) return;

    async function registerEmail() {
      try {
        await Model.registerEmail(emailInputRef.current.value, csrfToken);
      } catch (err) {}
      dispatch(homeSlice.actions.setRegistered());
    }
    registerEmail();
  }, [dispatch, csrfToken, registering]);

  useEffect(() => {
    if (props.performanceData === undefined) return;

    const performance = props.performanceData[0];

    const sp500 = props.performanceData[1];

    const dji = props.performanceData[2];

    chart.options.data = [];

    chart.options.data.push({
      type: "line",
      dataPoints: performance,
      color: "#1d8cf8",
      xValueType: "dateTime",
      showInLegend: true,
      legendText: "Quants.Investments",
    });

    chart.options.data.push({
      type: "line",
      dataPoints: sp500,
      color: "rgb(253, 89, 98)",
      xValueType: "dateTime",
      showInLegend: true,
      legendText: "S&P500",
    });

    chart.options.data.push({
      type: "line",
      dataPoints: dji,
      color: "#77ec75",
      xValueType: "dateTime",
      showInLegend: true,
      legendText: "DJI",
    });

    chart.render();

    chart.title.set(
      "text",
      "Actual stock portfolio performance following Quants.Investments advice"
    );

    const performanceYield = Math.round(
      (performance[performance.length - 1].y * 100) /
        Config.PERFORMANCE_BOOK_VALUE
    );

    chart.subtitles[0].set(
      "text",
      `Book Value: $${
        Config.PERFORMANCE_BOOK_VALUE
      }         Return: $${Math.round(
        performance[performance.length - 1].y
      )}         Yield: ${
        performanceYield >= 0 ? "+" : "-"
      }${performanceYield}%`
    );
  }, [props.performanceData]);

  return (
    <Fragment>
      <h1
        className={`${biggerThan767 ? styles.largescreen : styles.smallscreen}`}
      >
        Quants.Investments
      </h1>
      <h2 className={styles.largescreen}>
        Providing Stock Market Best Investment Advice Using Quants Methods
      </h2>
      <h3 className={styles.smallscreen}>
        Providing Stock Market Best Investment Advice Using Quants Methods
      </h3>
      <div className={styles.chartContainerHomeScreenOuter}>
        <div className={styles.chartContainerHomeScreenInner}>
          <Chart setChartReference={setChartReference} />
        </div>
      </div>
      <div className={styles["div_offer"]}>
        <div className="container">
          <div className="align-items-center row">
            <div className="p-sm-0 col-lg-12">
              <h2 className="title text-center mb-5">
                Cutting Edge Technologies Applied To Investment Decision Making
              </h2>
              <div className="row">
                <div className="col-md-4">
                  <div className="text-center">
                    <div className={`${styles.icon} text-center`}>
                      <i className="fas fa-brain"></i>
                    </div>
                    <h4 className="">Analysis Beyond Human Capacity</h4>
                    <p className="description px-0">
                      Algorithms analyze a large group of assets and investment
                      decisions at a pace impossible for traditional human-based
                      analysis
                    </p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="text-center">
                    <div className={`${styles.icon} text-center`}>
                      <i className="fas fa-database"></i>
                    </div>
                    <h4 className="info-title">
                      Process Massive Amounts of Data
                    </h4>
                    <p className="description px-0">
                      Algorithms are trained and analyze years of market and
                      investment data, actual and synthetic, to maximize returns
                      and minimize risks
                    </p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="text-center">
                    <div className={`${styles.icon} text-center`}>
                      <i className="fas fa-cloud"></i>
                    </div>
                    <h4 className="info-title">
                      Cloud Infrastructure for Agility and Scalability
                    </h4>
                    <p className="description px-0">
                      Solution hosted in the Cloud to respond quickly to
                      changing context and needs, particularly in regards to
                      amounts of data, integrations, and security
                    </p>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-4">
                  <div className="text-center">
                    <div className={`${styles.icon} text-center`}>
                      <i className="fas fa-file-code"></i>
                    </div>
                    <h4 className="info-title">
                      Developer APIs for Sharing and Improving
                    </h4>
                    <p className="description px-0">
                      Selected core functionalities are provided through APIs
                      and shared with other companies to trigger cycles of
                      usage, feedback and improvements
                    </p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="text-center">
                    <div className={`${styles.icon} text-center`}>
                      <i className="fas fa-chart-line"></i>
                    </div>
                    <h4 className="info-title">
                      Transparent Performance And Results
                    </h4>
                    <p className="description px-0">
                      Algorithms are our core intellectual property but their
                      performance, results, and key premises are presented
                      transparently and updated daily
                    </p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="text-center">
                    <div className={`${styles.icon} text-center`}>
                      <i className="fas fa-project-diagram"></i>
                    </div>
                    <h4 className="info-title">
                      Integration With Top Notch Financial Providers
                    </h4>
                    <p className="description px-0">
                      Outsourced basic functionalities, such as primary data
                      collection, to the best financial service providers
                      guarantee that our solution dependencies are reliable
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles["div_email"]}>
        <div className="container">
          <div className="row">
            <div className="col-lg-5">
              <h4 className="title text-center">Register now</h4>
              <p className="description text-center">
                To become one of our pilot users and access our functionalities
                before they become available to the general public
              </p>
            </div>
            <div className="col-lg-7">
              <div
                className={`${styles["div_email--body"]} card-plain card-form-horizontal card`}
              >
                <div className="card-body">
                  <div className="row">
                    <div
                      className={`${styles["div_emailRegistration--firstcolumn"]} my-auto`}
                    >
                      <div className={`input-group ${styles["input-group"]}`}>
                        <div className="input-group-prepend">
                          <span
                            className={`${styles["span_email-icon"]} input-group-text`}
                          >
                            <i className="far fa-envelope"></i>
                          </span>
                        </div>
                        <input
                          autoComplete="off"
                          placeholder="Your Email..."
                          name="email"
                          type="text"
                          className={`${styles["input_email"]} form-control`}
                          ref={emailInputRef}
                          disabled={!registered && !registering ? false : true}
                        />
                      </div>
                    </div>
                    <div
                      className={`${styles["div_emailRegistration--secondcolumn"]} my-auto`}
                    >
                      {registering && (
                        <div className={`${loader.loader}`}></div>
                      )}
                      {!registering && !registered && (
                        <button
                          type="button"
                          className={`${styles["button_register--email"]} btn btn-block`}
                          onClick={registerEmail}
                        >
                          Register
                        </button>
                      )}
                      {registered && (
                        <span
                          className={`${styles["span_email--registeredok"]}`}
                        >
                          Email registered!
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default Home;
