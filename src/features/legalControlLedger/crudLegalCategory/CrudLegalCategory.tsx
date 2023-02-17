import React, { useState, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import Menu from "../../menu/Menu";
import Navi from "../../navi/Navi";
import {
  changeCategoryCheckbox,
  changeInsertModal,
  clearInsertModal,
  crudCategoryData,
  fetchAsyncGetCategory,
  setAllChecked,
  setAllUnchecked,
} from "../crudCategorySlice";
import MaintResult from "../maintResult/MaintResult";
import { messageClear } from "../messageSlice";
import { insertAsyncCategory } from "../messageSlice";
import insertJson from "../crudLegalCategory/insertCategory.json";

const CrudLegalCategory: React.FC = () => {
  const data = useAppSelector(crudCategoryData);
  const dispatch = useAppDispatch();
  const [allCheckCheckbox, setAllCheckCheckbox] = useState(false);
  const [deleteIds, setDeleteIds] = useState();
  const onClickAllCheckbox = () => {
    dispatch(messageClear);
    if (allCheckCheckbox) {
      dispatch(setAllUnchecked());
      setAllCheckCheckbox(false);
    } else {
      dispatch(setAllChecked());
      setAllCheckCheckbox(true);
    }
  };
  const selectCheckboxes = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(messageClear);
    dispatch(changeCategoryCheckbox(e.target.dataset.id));
    setAllCheckCheckbox(false);
  };
  const insertClose: React.RefObject<HTMLButtonElement> = useRef(null);
  const initialAddModal = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    dispatch(messageClear);
    dispatch(clearInsertModal());
  };
  const handleInsertSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const thisInsertData: typeof insertJson = {
      id: data.columnTitles[0].value,
      categoryname: data.columnTitles[1].value,
      sortorder: data.columnTitles[2].value,
      color: data.columnTitles[3].value,
      currentPage: data.specifiedPage,
    };
    (insertClose.current as HTMLButtonElement).click();
    async function execInsert() {
      await dispatch(insertAsyncCategory(thisInsertData));
      await dispatch(fetchAsyncGetCategory(data.specifiedPage));
    }
    execInsert();
  };

  return (
    <>
      {" "}
      <div>
        <Navi />
        <Menu />
        <div className="container">
          <div className="table-wrapper">
            <div className="table-title">
              <div className="row">
                <div className="col-sm-6">
                  <h2>
                    テーブルメンテナンス <b>{data.pageTitle}</b>
                  </h2>
                </div>
                <div className="col-sm-6">
                  <a
                    href="#addRecordModal"
                    className="btn btn-success"
                    data-toggle="modal"
                    onClick={initialAddModal}
                  >
                    <i className="material-icons">&#xE147;</i>{" "}
                    <span>Add New Record</span>
                  </a>
                  <a
                    href="#deleteRecordModal"
                    id="selectDelete"
                    className="btn btn-warning"
                    data-toggle="modal"
                    // onClick={/* ③ */}
                  >
                    <i className="material-icons">&#xE15C;</i>{" "}
                    <span>Delete</span>
                  </a>
                </div>
              </div>
            </div>

            <div className="row" id="message">
              <div className="col-sm-12 text-warning">
                <p id="messageText">
                  <MaintResult />
                </p>
              </div>
            </div>

            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th>
                    <span className="custom-checkbox">
                      <input
                        type="checkbox"
                        id="selectAll"
                        checked={allCheckCheckbox}
                        onChange={onClickAllCheckbox}
                      />
                      <label htmlFor="selectAll"></label>
                    </span>
                  </th>
                  {/* stateのcolumnTitlesをmapし、表のタイトルを設定 <th key={インデックス}>columnTitlesの各要素.Field</th> を return()する */}
                  {data.columnTitles.map((columnTitle, index) => {
                    return <th key={index}>{columnTitle.Field}</th>;
                  })}
                </tr>
              </thead>
              <tbody>
                {/* stateのdetailsをmapし、各要素をdetailとして、以下の内容をreturn()する*/}
                {data.details.map((detail, index) => {
                  return (
                    <tr key={index}>
                      <td>
                        <span className="custom-checkbox">
                          <input
                            type="checkbox"
                            id={`checkbox${detail.id}`} // id={/*`checkbox${detailのid}`*/}
                            name="options"
                            value={index} // value={/*設定したindex*/}
                            onChange={selectCheckboxes}
                            checked={detail.checkbox} // checked={/*detailのcheckbox*/}
                            data-id={`${detail.id}`} // data-id={/*`${detailのid}`*/}
                          />
                          <label htmlFor={`checkbox${detail.id}`}></label>
                        </span>
                      </td>
                      <td>{detail.id}</td>
                      <td>{detail.categoryname}</td>
                      <td>{detail.sortorder}</td>
                      <td>{detail.color}</td>
                      <td>
                        <a
                          href="#editRecordModal"
                          className="edit"
                          data-toggle="modal"
                          id={`${detail.id}Edit`}
                          data-id={`${detail.id}`}
                          //onClick={/* ⑦ */}
                        >
                          <i
                            className="material-icons"
                            data-toggle="tooltip"
                            title="Edit"
                          >
                            &#xE254;
                          </i>
                        </a>
                        <a
                          href="#deleteRecordModal"
                          className="delete"
                          data-toggle="modal"
                          data-id={`${detail.id}`}
                          // onClick={/* ㉑ */}
                        >
                          <i
                            className="material-icons"
                            data-toggle="tooltip"
                            title="Delete"
                          >
                            &#xE872;
                          </i>
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="clearfix">
              <div className="hint-text">
                全 <b>{data.allCount}</b> 件中 <b>{data.displayCount}</b> 件表示
              </div>
              <ul className="pagination">
                {/* stateのpagePrevをmapし 前のページが存在する場合は以下をreturn() */}
                {data.pagePrev.map((prev) => {
                  if (prev.prev) {
                    return (
                      <li
                        className="page-item"
                        //onClick={/* ⑧ */}
                      >
                        <a>Previous</a>
                      </li>
                    );
                  } else {
                    return (
                      /* 存在しない場合は以下をreturn() */
                      <li className="page-item disabled">
                        <a>Previous</a>
                      </li>
                    );
                  }
                })}
                {/* stateのpageNationをmapし 現在のページ番号の場合は以下をreturn() */}
                {data.pageNation.map((nation, index) => {
                  if (nation.active) {
                    return (
                      <li
                        className="page-item active"
                        key={index}
                        // onClick={/* ⑨ */}
                      >
                        <a className="page-link">{nation.page}</a>
                      </li>
                    );
                  } else {
                    /* それ以外のページの場合は以下をreturn() */
                    return (
                      <li
                        className="page-item"
                        key={index}
                        // onClick={/* ⑩ */}
                      >
                        <a className="page-link">{nation.page}</a>
                      </li>
                    );
                  }
                })}
                {/* stateのpageNextをmapし 後ろのページが存在する場合は以下をretirn() */}
                {data.pageNext.map((next) => {
                  if (next.next) {
                    return (
                      <li
                        className="page-item"
                        // onClick={/* ⑪ */}
                      >
                        <a className="page-link">Next</a>
                      </li>
                    );
                  } else {
                    return (
                      /* 存在しない場合は以下をreturn() */
                      <li className="page-item disabled">
                        <a>Next</a>
                      </li>
                    );
                  }
                })}
              </ul>
            </div>
          </div>
        </div>
        {/* フッター */}
        <footer className="py-1 bg-dark text-light">
          <div className="container text-center">
            <p>
              <small>
                Copyright &copy;2021 HOKUSHIN SYSTEM, All Rights Reserved.
              </small>
            </p>
          </div>
        </footer>
        {/* <!-- Add Modal HTML --> */}
        <div id="addRecordModal" className="modal fade">
          <div className="modal-dialog">
            <div className="modal-content">
              <form onSubmit={(e) => handleInsertSubmit(e)} id="addForm">
                <div className="modal-header">
                  <h4 className="modal-title">レコード追加 {data.pageTitle}</h4>
                  <button
                    type="button"
                    className="close"
                    data-dismiss="modal"
                    aria-hidden="true"
                    ref={insertClose}
                  >
                    &times;
                  </button>
                </div>
                <div className="modal-body">
                  {/* stateのcolumnTitlesをmapし 各要素をcolumnTitleとして、以下の内容をreturn()する */}
                  {data.columnTitles.map((columnTitle, i) => {
                    return (
                      <div className="form-group">
                        <label>{columnTitle.Field}</label>
                        <input
                          type="text"
                          className="form-control"
                          id={columnTitle.Field}
                          name={columnTitle.Field}
                          value={columnTitle.value}
                          onChange={(e) =>
                            dispatch(
                              changeInsertModal({
                                value: e.target.value,
                                field: columnTitle.Field,
                              })
                            )
                          }
                          required
                        />
                      </div>
                    );
                  })}
                </div>
                <div className="modal-footer">
                  <input
                    type="hidden"
                    name="currentPage"
                    value={data.specifiedPage}
                  />
                  <input
                    type="button"
                    className="btn btn-default"
                    data-dismiss="modal"
                    value="Cancel"
                  />
                  <input
                    type="submit"
                    className="btn btn-success"
                    value="Add"
                    id="addButton"
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* <!-- Delete Modal HTML --> */}
        <div id="deleteRecordModal" className="modal fade">
          <div className="modal-dialog">
            <div className="modal-content">
              {/* <form action="/deleteLegalCategory" method="post"> */}
              <form
                //onSubmit={/* ⑮ */}
                id="deleteForm"
              >
                <div className="modal-header">
                  <h4 className="modal-title">
                    レコード削除{/*stateのpageTitle*/}
                  </h4>
                  <button
                    type="button"
                    className="close"
                    data-dismiss="modal"
                    aria-hidden="true"
                    //ref={/*deleteClose*/}
                  >
                    &times;
                  </button>
                </div>
                <div className="modal-body">
                  <p>以下のレコードを削除してよろしいですか?</p>
                  <p className="text-warning">
                    <small>
                      id:<span id="deletingTarget">{/* ⑯ */}</span>
                    </small>
                  </p>
                  <input type="hidden" name="id" id="ids" />
                  <input
                    type="hidden"
                    name="multipl"
                    id="multiple"
                    //  value={/* ⑰ */}
                  />
                </div>
                <div className="modal-footer">
                  <input
                    type="hidden"
                    name="currentPage" //value={/*stateのspecifiedPage*/}
                  />
                  <input
                    type="button"
                    className="btn btn-default"
                    data-dismiss="modal"
                    value="Cancel"
                  />
                  <input
                    type="submit"
                    className="btn btn-danger"
                    value="Delete"
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* <!-- Edit Modal HTML --> */}
        <div id="editRecordModal" className="modal fade">
          <div className="modal-dialog">
            <div className="modal-content">
              <form // onSubmit={/* ⑱ */}
                id="editForm"
              >
                <div className="modal-header">
                  <h4 className="modal-title">
                    レコード更新 {/*stateのpageTitle*/}
                  </h4>
                  <button
                    type="button"
                    className="close"
                    data-dismiss="modal"
                    aria-hidden="true" //ref={/* ⑲ */}
                  >
                    &times;
                  </button>
                </div>
                <div className="modal-body">
                  <div className="form-group">
                    <label>{/*stateのcolumnTitleId.Field*/}</label>
                    <input
                      type="text"
                      className="form-control"
                      name="id"
                      //id={/*`${stateのcolumnTitleId.Field}Edit`*/} value={/*stateのcolumnTitleId.value*/}
                      readOnly
                    />
                  </div>
                  {/* stateのcolumnTitlesをmapし 各要素をcolmunTitlesModalとして、以下の内容をreturn()する*/}
                  <div className="form-group">
                    <label>{/*stateのcolmunTitlesModal.Field*/}</label>
                    <input
                      type="text"
                      className="form-control"
                      //id={/*`${stateのcolmunTitlesModal.Field}Edit`*/} name={/*stateのcolmunTitlesModal.Field*/} value={/*stateのcolmunTitlesModal.value*/} onChange={/* ⑳ */}
                      required
                    />
                  </div>
                  <div className="modal-footer">
                    <input
                      type="hidden"
                      name="currentPage" // value={/*stateのspecifiedPage*/}
                    />
                    <input
                      type="button"
                      className="btn btn-default"
                      data-dismiss="modal"
                      value="Cancel"
                    />
                    <input
                      type="submit"
                      className="btn btn-info"
                      value="Save"
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CrudLegalCategory;
