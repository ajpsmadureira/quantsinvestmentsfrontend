import styles from "./../Panels.module.css";
import { useSelector, useDispatch } from "react-redux";
import * as Config from "../../config";
import panelsSlice from "../../store/panels-slice";
import appSlice from "../../store/app-slice";
import StockLogo from "../StockLogo";
import * as Helpers from "./../../helpers";
import * as Model from "./../../model";

function InvestmentsLargerScreens(props) {
  const investments = props.appData.investments;

  const indexFirstTableElement = useSelector(
    (state) => state.panels.indexFirstTableElement
  );

  const sortedInvestments = Helpers.getSortedInvestments(investments);

  const highlightId = useSelector((state) => state.panels.highlightId);

  const csrfToken = useSelector((state) => state.app.csrfToken);

  const dispatch = useDispatch();

  const highlightClickHandler = function (e) {
    const node = e.target.closest("tbody tr");
    const id = node.childNodes[0].innerHTML;
    dispatch(panelsSlice.actions.highlight(id));
  };

  const clickPreviousPageHandler = function (e) {
    const newIndexFirstTableElement =
      indexFirstTableElement - Config.NUMBER_RESULTS_PER_PAGE < 0
        ? 0
        : indexFirstTableElement - Config.NUMBER_RESULTS_PER_PAGE;
    dispatch(
      panelsSlice.actions.setIndexFirstTableElement(newIndexFirstTableElement)
    );
  };

  const clickNextPageHandler = function (e) {
    const newIndexFirstTableElement =
      indexFirstTableElement + Config.NUMBER_RESULTS_PER_PAGE <
      sortedInvestments.length
        ? indexFirstTableElement + Config.NUMBER_RESULTS_PER_PAGE
        : sortedInvestments.length;
    dispatch(
      panelsSlice.actions.setIndexFirstTableElement(newIndexFirstTableElement)
    );
  };

  const clickGlobalResultsHandler = function (e) {
    dispatch(panelsSlice.actions.highlight(undefined));
  };

  const clickDeleteInvestmentHandler = async function (e) {
    e.stopPropagation();

    let flag = false;
    if (
      e.currentTarget
        .closest("tbody tr")
        .classList.contains(styles["highlight"]) ||
      highlightId === undefined
    )
      flag = true;

    const id = e.currentTarget.closest("tbody tr")?.cells[0].innerHTML;
    await Model.deleteInvestment(id, csrfToken);
    dispatch(appSlice.actions.unsetInvestmentsRetrieved());
    if (flag) dispatch(panelsSlice.actions.highlight(undefined));
  };

  const clickNewInvestmentHandler = async function (e) {
    dispatch(panelsSlice.actions.showNewInvestmentModal());
  };

  const clickSellInvestmentModal = (e) => {
    const investment = e.currentTarget.closest("tbody tr");
    const id = investment.cells[0].innerHTML;
    const symbol = investment.cells[3].innerHTML;
    dispatch(panelsSlice.actions.showSellInvestmentModal({ id, symbol }));
  };

  let innerHTML = (
    <tr key="-2">
      <td colSpan="7">
        <div
          onClick={clickGlobalResultsHandler}
          className={`${styles["div_button--globalresults"]} btn`}
        >
          Global results
        </div>
        <div
          onClick={clickNewInvestmentHandler}
          className={`${styles["div_button--newinvestment"]} btn mr-2`}
        >
          New investment
        </div>
      </td>
    </tr>
  );

  innerHTML = [
    innerHTML,
    <tr key="-1">
      <td style={{ display: "none" }}></td>
      <td className={styles["table_td--dispensable"]}></td>
      <td className={styles["table_td--dispensable"]}></td>
      <td>Symbol</td>
      <td className={styles["table_td--dispensable"]} align="center">
        Buy Date
      </td>
      <td align="center">Shares</td>
      <td align="center">Recom.</td>
      <td align="center">Actions</td>
    </tr>,
  ];

  let count = 0;

  for (let i = indexFirstTableElement; i < sortedInvestments.length; i++) {
    if (count === Config.NUMBER_RESULTS_PER_PAGE) break;

    count++;

    innerHTML = [
      innerHTML,
      <tr
        key={count}
        className={`${styles.clickableRow} ${
          sortedInvestments[i].id === parseInt(highlightId)
            ? styles.highlight
            : ""
        }`}
        onClick={highlightClickHandler}
      >
        <td style={{ display: "none" }}>{sortedInvestments[i].id}</td>
        <td className={styles["table_td--dispensable"]}>
          {indexFirstTableElement + count}
        </td>
        <td className={styles["table_td--dispensable"]}>
          <StockLogo filename={sortedInvestments[i].logo} />
        </td>
        <td>{sortedInvestments[i].symbol}</td>
        <td className={styles["table_td--dispensable"]} align="center">
          {Helpers.getDateStringFromEpoch(
            sortedInvestments[i].buying_timestamp
          )}
        </td>
        <td align="center">{sortedInvestments[i].buying_number}</td>
        <td align="center" style={{ display: "none" }}>
          {sortedInvestments[i].buying_costs}
        </td>
        <td align="center" style={{ display: "none" }}>
          {sortedInvestments[i].buying_price}
        </td>
        <td align="center">
          {Helpers.getRecommendation(sortedInvestments[i].state)}
        </td>
        <td align="center">
          <button
            onClick={clickSellInvestmentModal}
            type="button"
            data-toggle="tooltip"
            data-placement="top"
            title="Close"
            className={`${styles["button_edit"]} btn btn-sm rounded-0`}
            style={{ display: sortedInvestments[i].state === 4 ? "none" : "" }}
          >
            <i className="fa fa-edit"></i>
          </button>
        </td>
        <td align="center">
          <button
            onClick={clickDeleteInvestmentHandler}
            type="button"
            data-toggle="tooltip"
            data-placement="top"
            title="Delete"
            className={`${styles["button_delete"]} ${
              sortedInvestments[i].state === 4 ? "hidden" : ""
            } btn btn-sm rounded-0`}
          >
            <i className="fa fa-trash"></i>
          </button>
        </td>
      </tr>,
    ];
  }

  while (count < Config.NUMBER_RESULTS_PER_PAGE) {
    ++count;

    innerHTML = [
      innerHTML,
      <tr key={count}>
        <td style={{ display: "none" }}> - </td>
        <td className={styles["table_td--dispensable"]}>
          {indexFirstTableElement + count}
        </td>
        <td className={styles["table_td--dispensable"]}></td>
        <td style={{ display: "none" }}> - </td>
        <td className={styles["table_td--dispensable"]} align="center">
          {" "}
          -{" "}
        </td>
        <td style={{ display: "none" }}> - </td>
        <td style={{ display: "none" }}> - </td>
        <td align="center"> - </td>
        <td align="center"> - </td>
      </tr>,
    ];
  }

  innerHTML = [
    innerHTML,
    <tr key={count}>
      <td colSpan="7">
        <div
          onClick={clickPreviousPageHandler}
          className={`${styles["div_previouspage"]} btn`}
          style={{ display: indexFirstTableElement === 0 ? "none" : "block" }}
        >
          &#8592;
          {` Page ${Math.trunc(
            indexFirstTableElement / Config.NUMBER_RESULTS_PER_PAGE
          )}`}
        </div>
        <div
          onClick={clickNextPageHandler}
          className={`${styles["div_nextpage"]} btn`}
          style={{
            display:
              indexFirstTableElement + Config.NUMBER_RESULTS_PER_PAGE >=
              sortedInvestments.length
                ? "none"
                : "block",
          }}
        >
          {` Page ${
            Math.trunc(
              indexFirstTableElement / Config.NUMBER_RESULTS_PER_PAGE
            ) + 2
          }`}{" "}
          &#8594;
        </div>
      </td>
    </tr>,
  ];

  return <tbody>{innerHTML}</tbody>;
}

export default InvestmentsLargerScreens;
