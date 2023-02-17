import React from "react";
import { useAppSelector } from "../../../app/hooks";
import { legalControlLedgerData } from "../legalControlLedgerSlice";
import Navi from "../../navi/Navi";
import Menu from "../../menu/Menu";

const LegalControlLedger: React.FC = () => {
  const data = useAppSelector(legalControlLedgerData);
  return (
    <>
      <Navi />
      <Menu />
      {/* classはJSX記法中ではclassNameに書き換える */}
      <div>
        <main role="main" className="container">
          {/* 一覧のタイトル部分 */}
          <div className="d-flex align-items-center p-3 my-3 text-white-50 bg-purple rounded shadow-sm">
            <img
              className="mr-3"
              src="./images/hokushin_logo_1.png"
              alt=""
              width="48"
              height="48"
            />
            <div className="lh-100">
              <h6 className="mb-0 text-white lh-100">{data.pageTitle}</h6>
              <small>Since 2020/2/1</small>
            </div>
          </div>
          {data.ledgers.map((ledger) => {
            return (
              <>
                {/* categoryのまとまり、1つ目のループ */}
                <div className="my-3 p-3 bg-white rounded shadow-sm">
                  <h6 className="border-bottom border-gray pb-2 mb-0">
                    {ledger.categoryName}
                  </h6>
                  {/* detailのまとまり、2つ目のループ */}
                  {ledger.detail.map((legal) => {
                    return (
                      <>
                        <div className="media text-muted pt-3">
                          <svg
                            className="bd-placeholder-img mr-2 rounded"
                            width="32"
                            height="32"
                            xmlns="http://www.w3.org/2000/svg"
                            preserveAspectRatio="xMidYMid slice"
                            focusable="false"
                            role="img"
                            aria-label="Placeholder: 32x32"
                          >
                            <title>Placeholder</title>
                            <rect
                              width="100%"
                              height="100%"
                              fill={ledger.categoryColor}
                            />
                            <text
                              x="50%"
                              y="50%"
                              fill={ledger.categoryColor}
                              dy=".3em"
                            >
                              32x32
                            </text>
                          </svg>
                          <p className="media-body pb-3 mb-0 small lh-125 border-bottom border-gray">
                            <strong className="d-block text-gray-dark">
                              <a href={legal.url}>{legal.title}</a>
                            </strong>
                            {legal.effectivedate}
                          </p>
                        </div>
                      </>
                    );
                  })}
                </div>
              </>
            );
          })}
        </main>
        <footer className="py-1 bg-dark text-light">
          <div className="container text-center">
            <p>
              <small>
                Copyright &copy;2022 HOKUSHIN SYSTEM, All Rights Reserved.
              </small>
            </p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default LegalControlLedger;
