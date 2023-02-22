// 関連するライブラリとコンポーネントをインポート
import React, { useState, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import Menu from "../../menu/Menu";
import Navi from "../../navi/Navi";
// redux のcrudCategorySliceスライスから関数をインポート
import {
  changeCategoryCheckbox,
  changeEditModal,
  setEditModal,
  changeInsertModal,
  clearInsertModal,
  crudCategoryData,
  fetchAsyncGetCategory,
  setAllChecked,
  setAllUnchecked,
} from "../crudCategorySlice";
// redux のmessageSliceスライスから関数をインポート
import {
  insertAsyncCategory,
  deleteAsyncCategory,
  editAsyncCategory,
  messageClear,
} from "../maintResult/messageSlice";
import MaintResult from "../maintResult/MaintResult"; //MaintResultコンポーネントのインポート
import insertJson from "../crudLegalCategory/insertCategory.json"; // データを追加する際に必要なJSONデータ定義
import deleteJson from "../crudLegalCategory/deleteCategory.json"; // データを削除する際に必要なJSONデータ定義
import editJson from "../crudLegalCategory/editCategory.json"; // データを編集する際に必要なJSONデータ定義

const CrudLegalCategory: React.FC = () => {
  const data = useAppSelector(crudCategoryData);
  const dispatch = useAppDispatch();
  const [allCheckCheckbox, setAllCheckCheckbox] = useState(false); // 全選択チェックボックスの選択/未選択のための状態を管理する
  const [deleteIds, setDeleteIds] = useState("なし"); //削除するIDを格納する状態を管理する
  const [multiple, setMultiple] = useState("single"); // 複数選択を管理する状態を管理する

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
    dispatch(changeCategoryCheckbox(Number(e.target.dataset.id)));
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
      categoryname: data.columnTitles[1].value,
      sortorder: data.columnTitles[2].value,
      color: data.columnTitles[3].value,
      currentPage: data.specifiedPage,
    };
    (insertClose.current as HTMLButtonElement).click(); // 追加モーダルを閉じる
    async function execInsert() {
      await dispatch(insertAsyncCategory(thisInsertData)); //データを追加
      await dispatch(fetchAsyncGetCategory(data.specifiedPage)); //データを再取得
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
    const ids: number[] = [];
    data.details.map((detail) => {
      if (detail.checkbox === true) {
        ids.push(detail.id);
      }
      return ids;
    });
    let strIds = "";
    if (ids.length) {
      strIds = ids.join();
    } else {
      strIds = "なし";
    }
    setDeleteIds(strIds);
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
    (deleteClose.current as HTMLButtonElement).click(); // 編集モーダルを閉じる
    async function execDelete() {
      await dispatch(deleteAsyncCategory(thisDeleteData)); //データを編集
      await dispatch(fetchAsyncGetCategory(data.specifiedPage)); //データを編集
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
      categoryname: data.columnTitlesModal[0].value,
      sortorder: data.columnTitlesModal[1].value,
      color: data.columnTitlesModal[2].value,
      currentPage: data.specifiedPage,
    };
    (editClose.current as HTMLButtonElement).click(); // 編集モーダルを閉じる
    async function execEdit() {
      await dispatch(editAsyncCategory(thisEditData)); //データを編集
      await dispatch(fetchAsyncGetCategory(data.specifiedPage)); //データを再取得
    }
    execEdit();
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
                      <td>
                        <svg
                          className="bd-placeholder-img mr-1 rounded"
                          width="16"
                          height="16"
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
                            fill={detail.color}
                          />
                          <text x="50%" y="50%" fill={detail.color} dy=".3em">
                            32x32
                          </text>
                        </svg>
                        {detail.color}
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
                          dispatch(fetchAsyncGetCategory(prev.page));
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
                          dispatch(fetchAsyncGetCategory(nation.page));
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
                          dispatch(fetchAsyncGetCategory(nation.page));
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
                          dispatch(fetchAsyncGetCategory(next.page));
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
                    let insertDom = <></>;
                    if (columnTitle.Field === "color") {
                      insertDom = (
                        <div className="form-group">
                          <label>{columnTitle.Field}&nbsp;</label>
                          <table>
                            <td width={50}>
                              <input
                                type="color"
                                className="form-control form-control-color"
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
                            </td>
                            <td width={500}>
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
                            </td>
                          </table>
                        </div>
                      );
                    } else if (columnTitle.Field === "id") {
                      insertDom = (
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
                      insertDom = (
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
                    return insertDom;
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
                    let editDom = <></>;
                    if (columnTitlesModal.Field === "color") {
                      editDom = (
                        <div className="form-group">
                          <label>{columnTitlesModal.Field}&nbsp;</label>
                          <table>
                            <td width={50}>
                              <input
                                type="color"
                                className="form-control form-control-color"
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
                            </td>
                            <td width={500}>
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
                            </td>
                          </table>
                        </div>
                      );
                    } else {
                      editDom = (
                        <div className="form-group">
                          <label>{columnTitlesModal.Field}</label>
                          <input
                            type="text"
                            className="form-control"
                            id={`${columnTitlesModal.Field}Edit`}
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
                    return editDom;
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

export default CrudLegalCategory;
