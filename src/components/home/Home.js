import styles from "./Home.module.css";
import loader from "../../components/Loader.module.css";
import { useMediaPredicate } from "react-media-hook";
import { useSelector, useDispatch } from "react-redux";
import homeSlice from "../../store/home-slice";
import { useEffect, useRef, Fragment } from "react";
import * as Model from "../../model";
import Chart from "../Chart";
import offerInvestments from "../../images/offerInvestments.png";
import offerDailyPicks from "../../images/offerDailyPicks.png";
import offerNews from "../../images/offerNews.png";
import offerMarkets from "../../images/offerMarkets.jpg";
import Carousel from "react-bootstrap/Carousel";

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

    chart.options.axisY.logarithmic = true;

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
      "Stock portfolio backtest performance following Quants.Investments advice (WIP)"
    );

    // const performanceYield = Math.round(
    //   (performance[performance.length - 1].y * 100) / performance[0].y
    // );

    // chart.subtitles[0].set(
    //   "text",
    //   `Yield: ${performanceYield >= 0 ? "+" : "-"}${performanceYield}%`
    // );
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
      <div className={`${styles["div_offer"]} d-xs-block d-md-none`}>
        <div className="container">
          <div className="align-items-center">
            <h2 className="text-center mb-5">Product Offer</h2>
            <div className="text-center">
              <div className={`${styles.icon} text-center`}>
                <i className="fab fa-buffer"></i>
              </div>
              <h4 className="info-title">Daily Best Stock Picks</h4>
              <p className="description px-0">
                Our algorithms work around-the-clock to provide to you daily a
                selection of the best stocks
              </p>
            </div>
            <div className="text-center">
              <div className={`${styles.icon} text-center`}>
                <i className="fas fa-solar-panel"></i>
              </div>
              <h4 className="info-title">Investments Panel</h4>
              <p className="description px-0">
                Register your investments to receive hold/sell management advice
                about them
              </p>
            </div>
            <div className="text-center">
              <div className={`${styles.icon} text-center`}>
                <i className="far fa-newspaper"></i>
              </div>
              <h4 className="info-title">Most Relevant News</h4>
              <p className="description px-0">
                Our algorithms cut through media clutter and provide relevant
                news to augment our advice
              </p>
            </div>
            <div className="text-center">
              <div className={`${styles.icon} text-center`}>
                <i className="fas fa-exchange-alt"></i>
              </div>
              <h4 className="info-title">Most Dynamic Markets</h4>
              <p className="description px-0">
                We work with selected stocks from NYSE and NASDAQ and will keep
                adding high potential assets
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className={`${styles["div_offer"]} d-none d-md-block`}>
        <div className="container">
          <div className="align-items-center row">
            <div className="p-sm-0 col-lg-12">
              <h2 className="title text-center mb-5">Product Offer</h2>
              <Carousel fade style={{ height: "450px" }}>
                <Carousel.Item>
                  <img
                    className="d-block w-50"
                    src={offerDailyPicks}
                    alt="First slide"
                    style={{ margin: "auto" }}
                  />
                  <Carousel.Caption
                    style={{ position: "initial", textAlign: "center" }}
                  >
                    <h3>Daily Best Stock Picks</h3>
                    <p>
                      Our algorithms work around-the-clock to provide to you
                      daily a selection of the best stocks
                    </p>
                  </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                  <img
                    className="d-block w-50"
                    src={offerInvestments}
                    alt="Second slide"
                    style={{ margin: "auto" }}
                  />
                  <Carousel.Caption
                    style={{ position: "initial", textAlign: "center" }}
                  >
                    <h3>Investments Panel</h3>
                    <p>
                      Register your investments to receive hold/sell management
                      advice about them
                    </p>
                  </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                  <img
                    className="d-block w-50"
                    src={offerNews}
                    alt="Third slide"
                    style={{ margin: "auto" }}
                  />
                  <Carousel.Caption
                    style={{ position: "initial", textAlign: "center" }}
                  >
                    <h3>Most Relevant News</h3>
                    <p>
                      Our algorithms cut through media clutter and provide
                      relevant news to augment our advice
                    </p>
                  </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                  <img
                    className="d-block w-50"
                    src={offerMarkets}
                    alt="Fourth slide"
                    style={{ margin: "auto" }}
                  />
                  <Carousel.Caption
                    style={{ position: "initial", textAlign: "center" }}
                  >
                    <h3>Most Dynamic Markets</h3>
                    <p>
                      We work with selected stocks from NYSE and NASDAQ and will
                      keep adding high potential assets
                    </p>
                  </Carousel.Caption>
                </Carousel.Item>
              </Carousel>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default Home;
