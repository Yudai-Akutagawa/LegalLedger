import React from "react";
import { useAppDispatch } from "../../app/hooks";
import { selectCategory, selectDetail, selectList } from "./menuSelectSlice";

const Menu: React.FC = () => {
  const dispatch = useAppDispatch();
  return (
    <div>
      <p></p>
      <div className="py-4 m-3">
        <section id="buttons" className="mt-3">
          <div className="container text-center">
            <div className="row ">
              <div className="col-md-12 col-lg-12">
                <div
                  className="btn-group btn-group-toggle mt-1"
                  data-toggle="buttons"
                >
                  <button
                    className="btn btn-primary "
                    type="button"
                    onClick={() => dispatch(selectList())}
                  >
                    法規制管理台帳
                  </button>
                  <button
                    className="btn btn-info "
                    type="button"
                    onClick={() => dispatch(selectCategory())}
                  >
                    カテゴリーテーブル・メンテ
                  </button>
                  <button
                    className="btn btn-success "
                    type="button"
                    onClick={() => dispatch(selectDetail())}
                  >
                    明細テーブル・メンテ
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Menu;
