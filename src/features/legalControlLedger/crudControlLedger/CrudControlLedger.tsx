// 関連するライブラリとコンポーネントをインポート
import React, { useState, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import Menu from "../../menu/Menu";
import Navi from "../../navi/Navi";
// redux のcrudControlLedgerSliceスライスから関数をインポート
import {
  changeControlLedgerCheckbox,
  changeEditModal,
  setEditModal,
  changeInsertModal,
  clearInsertModal,
  crudControlLedgerData,
  fetchAsyncGetControlLedger,
  setAllChecked,
  setAllUnchecked,
} from "../crudControlLedgerSlice";
// redux のmessageSliceスライスから関数をインポート
import {
  insertAsyncControlLedger,
  deleteAsyncControlLedger,
  editAsyncControlLedger,
  messageClear,
} from "../messageSlice";
import MaintResult from "../maintResult/MaintResult"; //MaintResultコンポーネントのインポート
import insertJson from "../crudControlLedger/insertControlLedger.json"; // データを追加する際に必要なJSONデータ定義
import deleteJson from "../crudControlLedger/deleteControlLedger.json"; // データを削除する際に必要なJSONデータ定義
import editJson from "../crudControlLedger/editControlLedger.json"; // データを編集する際に必要なJSONデータ定義

const CrudControlLedger: React.FC = () => {
  const data = useAppSelector(crudControlLedgerData);
  const dispatch = useAppDispatch();
  const [allCheckCheckbox, setAllCheckCheckbox] = useState(false); // 全選択チェックボックスの選択/未選択のための状態を管理する
  const [deleteIds, setDeleteIds] = useState("なし"); //削除するIDを格納する状態を管理する
  const [multiple, setMultiple] = useState("single"); // 複数選択を管理する状態を管理する
  const [searchText, setSearchText] = useState("");
  const [searchInputText, setSearchInputText] = useState("");

  /* チェックボックス処理用関数 */
  // 全選択チェックボックスクリック時の処理
  const selectAllCheckbox = () => {
    dispatch(messageClear);
    if (allCheckCheckbox) {
      dispatch(setAllUnchecked());
      initCheckboxes();
    } else {
      dispatch(setAllChecked());
      setAllCheckCheckbox(true);
    }
  };
  // 全選択チェックボックスをFALSEに初期化
  const initCheckboxes = () => {
    setAllCheckCheckbox(false);
  };
  // 個別チェックボックスクリック時の処理
  const selectCheckboxes = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(messageClear);
    dispatch(changeControlLedgerCheckbox(Number(e.target.dataset.id)));
    setAllCheckCheckbox(false);
  };

  /* データ追加処理用関数 */
  // データ追加用モーダルを初期化
  const initialAddModal = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    dispatch(messageClear);
    dispatch(clearInsertModal());
  };
  const insertClose: React.RefObject<HTMLButtonElement> = useRef(null); // 追加モーダルを閉じるアクションを代入する変数
  // データ追加用モーダル内でAddを押した際に、APIを通してデータを追加する処理
  const handleInsertSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const thisInsertData: typeof insertJson = {
      id: data.columnTitles[0].value,
      title: data.columnTitles[1].value,
      url: data.columnTitles[2].value,
      effectivedate: data.columnTitles[3].value,
      category: data.columnTitles[4].value,
      valid: data.columnTitles[5].value,
      sortorder: data.columnTitles[6].value,
      currentPage: data.specifiedPage,
    };
    (insertClose.current as HTMLButtonElement).click(); // 追加モーダルを閉じる
    async function execInsert() {
      await dispatch(insertAsyncControlLedger(thisInsertData)); //データを追加
      await dispatch(fetchAsyncGetControlLedger(data.specifiedPage)); //データを再取得
    }
    execInsert();
  };

  /* データ削除処理用関数 */
  // データ削除用モーダルに削除する項目のidをセット（単体選択時）
  const setDeleteModal = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    e.preventDefault();
    dispatch(messageClear);
    const id = e.currentTarget.dataset.id as string;
    setDeleteIds(id);
    setMultiple("single");
  };
  // データ削除用モーダルに削除する項目のidをセット（複数選択時）
  const setDeleteModalSelected = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    e.preventDefault();
    dispatch(messageClear);
    const checkedIds: number[] = [];
    data.details.map((detail) => {
      if (detail.checkbox === true) {
        checkedIds.push(detail.id);
      }
      return checkedIds;
    });
    let DeleteIds = "";
    if (checkedIds.length) {
      DeleteIds = checkedIds.join(); // 配列に格納されたidをカンマで区切った文字列に変換
    } else {
      DeleteIds = "なし";
    }
    setDeleteIds(DeleteIds);
    setMultiple("multiple");
  };
  const deleteClose: React.RefObject<HTMLButtonElement> = useRef(null); // 削除モーダルを閉じるアクションを代入する変数
  // データ削除用モーダル内でdeleteを押した際に、APIを通してデータを削除する処理
  const handleDeleteSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const thisDeleteData: typeof deleteJson = {
      id: deleteIds,
      multiple: multiple,
      currentPage: data.specifiedPage,
    };
    (deleteClose.current as HTMLButtonElement).click(); // 削除モーダルを閉じる
    async function execDelete() {
      await dispatch(deleteAsyncControlLedger(thisDeleteData)); //データを削除
      await dispatch(fetchAsyncGetControlLedger(data.specifiedPage)); //データを再取得
    }
    execDelete();
  };

  /* データ編集処理用関数 */
  const editClose: React.RefObject<HTMLButtonElement> = useRef(null); // 編集モーダルを閉じるアクションを代入する変数
  // データ編集用モーダル内でsaveを押した際に、APIを通してデータを編集する処理
  const handleEditSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const thisEditData: typeof editJson = {
      id: data.columnTitleId.value,
      title: data.columnTitlesModal[0].value,
      url: data.columnTitlesModal[1].value,
      effectivedate: data.columnTitlesModal[2].value,
      category: data.columnTitlesModal[3].value,
      valid: data.columnTitlesModal[4].value,
      sortorder: data.columnTitlesModal[5].value,
      currentPage: data.specifiedPage,
    };
    (editClose.current as HTMLButtonElement).click(); // 編集モーダルを閉じる
    async function execEdit() {
      await dispatch(editAsyncControlLedger(thisEditData)); //データを編集
      await dispatch(fetchAsyncGetControlLedger(data.specifiedPage)); //データを再取得
    }
    execEdit();
  };

  ////長い項目のフル表示
  const popupDetail = (
    e: React.MouseEvent<HTMLTableDataCellElement, MouseEvent>
  ) => {
    alert(e.currentTarget.innerText);
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
                    onClick={setDeleteModalSelected}
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

            <div className="row">
              <div className="col-1">
                <button
                  className="btn btn-primary"
                  type="button"
                  id="button-addon1"
                  onClick={(e) => {
                    setSearchText(searchInputText);
                  }}
                >
                  Search
                </button>
              </div>
              <div className="col-1">
                <button
                  className="btn btn-primary"
                  type="button"
                  id="button-addon1"
                  onClick={() => {
                    setSearchText("");
                    setSearchInputText("");
                  }}
                >
                  Clear
                </button>
              </div>
              <div className="col-12">
                <input
                  type="text"
                  className="form-control"
                  placeholder=""
                  aria-label="Example text with button addon"
                  aria-describedby="button-addon1"
                  value={searchInputText}
                  onChange={(e) => {
                    setSearchInputText(e.target.value);
                  }}
                />
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
                        onChange={selectAllCheckbox}
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
                  let detailDom = <></>;
                  if (
                    detail.title.indexOf(searchText) !== -1 ||
                    detail.url === searchText ||
                    detail.effectivedate.indexOf(searchText) !== -1 ||
                    searchText === ""
                  ) {
                    detailDom = (
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
                        <td className="abbreviation max-width-30">
                          {detail.id}
                        </td>
                        <td
                          className="abbreviation max-width-180"
                          onClick={popupDetail}
                        >
                          {detail.title}
                        </td>
                        <td
                          className="abbreviation max-width-190"
                          onClick={popupDetail}
                        >
                          {detail.url}
                        </td>
                        <td className="abbreviation max-width-80">
                          {detail.effectivedate}
                        </td>
                        <td className="abbreviation max-width-30">
                          {detail.category}
                        </td>
                        <td className="abbreviation max-width-30">
                          {detail.valid}
                        </td>
                        <td className="abbreviation max-width-30">
                          {detail.sortorder}
                        </td>
                        <td>
                          <a
                            href="#editRecordModal"
                            className="edit"
                            data-toggle="modal"
                            id={`${detail.id}Edit`}
                            data-id={`${detail.id}`}
                            onClick={() => {
                              dispatch(messageClear());
                              dispatch(setEditModal(detail.id));
                            }}
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
                            onClick={setDeleteModal}
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
                  }
                  return detailDom;
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
                        onClick={() => {
                          dispatch(fetchAsyncGetControlLedger(prev.page));
                          initCheckboxes();
                          dispatch(messageClear());
                        }}
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
                        onClick={() => {
                          dispatch(fetchAsyncGetControlLedger(nation.page));
                          initCheckboxes();
                          dispatch(messageClear());
                        }}
                      >
                        <a className="page-link">{nation.page}</a>
                      </li>
                    );
                  } else {
                    /* それ以外のページの場合は以下をreturn() */
                    return (
                      <li
                        className="page-item "
                        key={index}
                        onClick={() => {
                          dispatch(fetchAsyncGetControlLedger(nation.page));
                          initCheckboxes();
                          dispatch(messageClear());
                        }}
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
                        onClick={() => {
                          dispatch(fetchAsyncGetControlLedger(next.page));
                          initCheckboxes();
                          dispatch(messageClear());
                        }}
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
                    if (columnTitle.date) {
                      return (
                        <div className="form-group">
                          <label>{columnTitle.Field}</label>
                          <input
                            type="date"
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
                    } else if (columnTitle.category) {
                      return (
                        <div className="form-group">
                          <label>{columnTitle.Field}</label>
                          <select
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
                          >
                            {data.categories.map((category, i) => {
                              return (
                                <option value={`${category.id}`}>
                                  {category.categoryname}
                                </option>
                              );
                            })}
                          </select>
                        </div>
                      );
                    } else if (columnTitle.valid) {
                      return (
                        <div className="form-group">
                          <label>{columnTitle.Field}</label>
                          <select
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
                          >
                            {data.isValid.map((valid, i) => {
                              let validDom;
                              if (i === 0) {
                                validDom = (
                                  <option value={`${valid.value}`} selected>
                                    {valid.title}
                                  </option>
                                );
                              } else {
                                validDom = (
                                  <option value={`${valid.value}`}>
                                    {valid.title}
                                  </option>
                                );
                              }
                              return validDom;
                            })}
                          </select>
                        </div>
                      );
                    } else if (columnTitle.Field === "id") {
                      return (
                        <div className="form-group">
                          <label>{columnTitle.Field}</label>
                          <input
                            type="text"
                            list="datalistOptions"
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
                          <datalist id="datalistOptions">
                            <option value={data.allCount + 1} />
                          </datalist>
                        </div>
                      );
                    } else {
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
                    }
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
              <form onSubmit={(e) => handleDeleteSubmit(e)} id="deleteForm">
                <div className="modal-header">
                  <h4 className="modal-title">レコード削除{data.pageTitle}</h4>
                  <button
                    type="button"
                    className="close"
                    data-dismiss="modal"
                    aria-hidden="true"
                    ref={deleteClose}
                  >
                    &times;
                  </button>
                </div>
                <div className="modal-body">
                  <p>以下のレコードを削除してよろしいですか?</p>
                  <p className="text-warning">
                    <small>
                      id:<span id="deletingTarget">{deleteIds}</span>
                    </small>
                  </p>
                  <input type="hidden" name="id" id="ids" />
                  <input
                    type="hidden"
                    name="multipl"
                    id="multiple"
                    value={multiple}
                  />
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
              <form onSubmit={(e) => handleEditSubmit(e)} id="editForm">
                <div className="modal-header">
                  <h4 className="modal-title">レコード更新 {data.pageTitle}</h4>
                  <button
                    type="button"
                    className="close"
                    data-dismiss="modal"
                    aria-hidden="true"
                    ref={editClose}
                  >
                    &times;
                  </button>
                </div>
                <div className="modal-body">
                  <div className="form-group">
                    <label>{data.columnTitleId.Field}</label>
                    <input
                      type="text"
                      className="form-control"
                      name="id"
                      id={`${data.columnTitleId.Field}Edit`}
                      value={data.columnTitleId.value}
                      readOnly
                    />
                  </div>
                  {/* stateのcolumnTitlesをmapし 各要素をcolmunTitlesModalとして、以下の内容をreturn()する*/}
                  {data.columnTitlesModal.map((columnTitlesModal, index) => {
                    if (columnTitlesModal.date) {
                      return (
                        <div className="form-group">
                          <label>{columnTitlesModal.Field}</label>
                          <input
                            type="date"
                            className="form-control"
                            id={columnTitlesModal.Field}
                            name={columnTitlesModal.Field}
                            value={columnTitlesModal.value}
                            onChange={(e) =>
                              dispatch(
                                changeEditModal({
                                  value: e.target.value,
                                  field: columnTitlesModal.Field,
                                })
                              )
                            }
                            required
                          />
                        </div>
                      );
                    } else if (columnTitlesModal.category) {
                      return (
                        <div className="form-group">
                          <label>{columnTitlesModal.Field}</label>
                          <select
                            className="form-control"
                            id={columnTitlesModal.Field}
                            name={columnTitlesModal.Field}
                            value={columnTitlesModal.value}
                            onChange={(e) =>
                              dispatch(
                                changeEditModal({
                                  value: e.target.value,
                                  field: columnTitlesModal.Field,
                                })
                              )
                            }
                            required
                          >
                            {data.categories.map((category, i) => {
                              return (
                                <option value={`${category.id}`}>
                                  {category.categoryname}
                                </option>
                              );
                            })}
                          </select>
                        </div>
                      );
                    } else if (columnTitlesModal.valid) {
                      return (
                        <div className="form-group">
                          <label>{columnTitlesModal.Field}</label>
                          <select
                            className="form-control"
                            id={columnTitlesModal.Field}
                            name={columnTitlesModal.Field}
                            value={columnTitlesModal.value}
                            onChange={(e) =>
                              dispatch(
                                changeEditModal({
                                  value: e.target.value,
                                  field: columnTitlesModal.Field,
                                })
                              )
                            }
                            required
                          >
                            {data.isValid.map((valid, i) => {
                              return (
                                <option value={`${valid.value}`}>
                                  {valid.title}
                                </option>
                              );
                            })}
                          </select>
                        </div>
                      );
                    } else {
                      return (
                        <div className="form-group">
                          <label>{columnTitlesModal.Field}</label>
                          <input
                            type="text"
                            className="form-control"
                            id={columnTitlesModal.Field}
                            name={columnTitlesModal.Field}
                            value={columnTitlesModal.value}
                            onChange={(e) =>
                              dispatch(
                                changeEditModal({
                                  value: e.target.value,
                                  field: columnTitlesModal.Field,
                                })
                              )
                            }
                            required
                          />
                        </div>
                      );
                    }
                  })}
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

export default CrudControlLedger;
