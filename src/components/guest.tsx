import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { CopyToClipboard } from "react-copy-to-clipboard";
import TextareaAutosize from "react-textarea-autosize";
import { useForm, SubmitHandler } from "react-hook-form";
import arrow from "../images/ic_r_b_3x.png";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../fbase";

const modalStyles = {
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    width: "100%",
    zIndex: 100,
  },
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    padding: "32px 24px",
    border: "none",
    borderRadius: "none",
    width: "80%",
    maxWidth: "340px",
  },
};

interface IAttendForm {
  name: string;
  relation: string;
  count: number;
}

interface ICommentForm {
  name: string;
  relation: string;
  message: string;
}

interface IGuestProps {
  maleAccounts: string[];
  femaleAccounts: string[];
}

export const Guest: React.FC<IGuestProps> = ({
  maleAccounts,
  femaleAccounts,
}) => {
  const [moneyModalIsOpen, setMoneyModalIsOpen] = useState(false);
  const [commentModalIsOpen, setCommentModalIsOpen] = useState(false);
  const [attendModalIsOpen, setAttendModalIsOpen] = useState(false);

  const {
    register: attendRegister,
    handleSubmit: attendHandleSubmit,
    formState: { errors: attendErrors },
  } = useForm<IAttendForm>();

  const {
    register: commentRegister,
    handleSubmit: commentHandleSubmit,
    formState: { errors: commentErrors },
  } = useForm<ICommentForm>();

  const getFormatDate = () => {
    const today = new Date();
    var year: any = today.getFullYear();
    year = (year + "").slice(2);
    let month: any = 1 + today.getMonth();
    month = month >= 10 ? month : "0" + month;
    var day: any = today.getDate();
    day = day >= 10 ? day : "0" + day;
    return year + "." + month + "." + day;
  };

  const handleAttendFormSubmit: SubmitHandler<IAttendForm> = async ({
    name,
    relation,
    count,
  }) => {
    try {
      const docRef = await addDoc(collection(db, "attend"), {
        name,
        relation,
        count,
      });
      console.log("Document written with ID: ", docRef.id);
      closeAttendModal();
      alert("?????????????????????.");
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const handleCommentFormSubmit: SubmitHandler<ICommentForm> = async ({
    name,
    relation,
    message,
  }) => {
    try {
      const createdAt = getFormatDate();
      const docRef = await addDoc(collection(db, "message"), {
        name,
        relation,
        message,
        createdAt,
      });
      console.log("Document written with ID: ", docRef.id);
      closeCommentModal();
      alert("???????????? ?????????????????????.");
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  function openMoneyModal() {
    setMoneyModalIsOpen(true);
  }

  function afterOpenMoneyModal() {}

  function closeMoneyModal() {
    setMoneyModalIsOpen(false);
  }

  function openCommentModal() {
    setCommentModalIsOpen(true);
  }

  function afterOpenCommentModal() {}

  function closeCommentModal() {
    setCommentModalIsOpen(false);
  }

  function openAttendModal() {
    setAttendModalIsOpen(true);
  }

  function afterOpenAttendModal() {}

  function closeAttendModal() {
    setAttendModalIsOpen(false);
  }

  const copyAccount = () => {
    alert("??????????????? ?????????????????????.");
  };
  useEffect(() => {
    Modal.setAppElement("body");
  }, []);
  return (
    <section className="guest">
      <div className="guest__title">
        <span>Guest book</span>
      </div>
      <div className="guest__text">
        <span>????????? ?????? ????????? ????????? ???????????????.</span>
      </div>
      <div className="guest__box" onClick={openAttendModal}>
        <span>????????? ?????? ?????? ??????</span>
        <img src={arrow} alt="" />
      </div>

      <div className="guest__box" onClick={openCommentModal}>
        <span>?????? ????????? ?????????</span>
        <img src={arrow} alt="" />
      </div>
      <div className="guest__box" onClick={openMoneyModal}>
        <span>????????? ?????????</span>
        <img src={arrow} alt="" />
      </div>
      <div>
        <Modal
          isOpen={moneyModalIsOpen}
          onAfterOpen={afterOpenMoneyModal}
          onRequestClose={closeMoneyModal}
          style={modalStyles}
          contentLabel="Money Modal"
        >
          <div className="guest__modal__title">Gift</div>
          <div className="guest__modal__coment">
            ??????????????? ????????? ????????? ???????????? ???????????????. <br />
            ??????????????? ??????????????? ???????????????.
          </div>
          <div className="guest__modal__contents">
            <div className="guest__modal__contents__title">
              <span>????????? ????????????</span>
            </div>
            {maleAccounts.map((account, index) => (
              <div className="guest__modal__contents__text" key={index}>
                <CopyToClipboard onCopy={copyAccount} text={account}>
                  <span>{account}</span>
                </CopyToClipboard>
              </div>
            ))}
          </div>
          <div className="guest__modal__contents">
            <div className="guest__modal__contents__title">
              <span>????????? ????????????</span>
            </div>
            {femaleAccounts.map((account, index) => (
              <div className="guest__modal__contents__text" key={index}>
                <CopyToClipboard onCopy={copyAccount} text={account}>
                  <span>{account}</span>
                </CopyToClipboard>
              </div>
            ))}
          </div>
          <div className="guest__modal__button" onClick={closeMoneyModal}>
            <span>??????</span>
          </div>
        </Modal>
      </div>
      <div>
        <Modal
          isOpen={commentModalIsOpen}
          onAfterOpen={afterOpenCommentModal}
          onRequestClose={closeCommentModal}
          style={modalStyles}
          contentLabel="Comment Modal"
        >
          <div className="guest__modal__title">Message</div>
          <div className="guest__modal__coment">
            ?????? ??????????????? ???????????? ??????????????????.
          </div>
          <form
            className="guest__modal__form"
            onSubmit={commentHandleSubmit(handleCommentFormSubmit)}
          >
            <div className="guest__modal__contents__title black">
              <span>
                ?????? <span style={{ color: "#EEAA25" }}>*</span>
              </span>
            </div>
            <input
              {...commentRegister("name", { required: true })}
              type="text"
              placeholder="????????? ??????????????????."
              className={`guest__modal__form__input ${
                commentErrors.name && "error"
              }`}
            />

            {commentErrors.name && (
              <div className="guest__modal__form__error">
                ????????? ????????? ??????????????????.
              </div>
            )}

            <div className="guest__modal__contents__title black">
              <span>
                ?????? <span style={{ color: "#EEAA25" }}>*</span>
              </span>
            </div>
            <div className="guest__modal__form__genders">
              <div
                className={`guest__modal__form__genders__gender ${
                  commentErrors.relation && "error"
                }`}
              >
                <input
                  {...commentRegister("relation", { required: true })}
                  type="radio"
                  id="gender_male"
                  name="relation"
                  value="?????? ???"
                />
                <label htmlFor="gender_male">?????? ???</label>
              </div>
              <div
                className={`guest__modal__form__genders__gender ${
                  commentErrors.relation && "error"
                }`}
              >
                <input
                  {...commentRegister("relation", { required: true })}
                  type="radio"
                  id="gender_female"
                  name="relation"
                  value="?????? ???"
                />
                <label htmlFor="gender_female">?????? ???</label>
              </div>
            </div>
            {commentErrors.relation && (
              <div className="guest__modal__form__error">
                ????????? ??????????????????.
              </div>
            )}
            <div className="guest__modal__contents__title black">
              <span>
                ?????? ????????? <span style={{ color: "#EEAA25" }}>*</span>
              </span>
            </div>
            <TextareaAutosize
              maxRows={3}
              className={`guest__modal__form__textarea ${
                commentErrors.message && "error"
              }`}
              placeholder="????????? ??????????????????."
              {...commentRegister("message", { required: true })}
            />
            {commentErrors.message && (
              <div className="guest__modal__form__error">
                ???????????? ??????????????????.
              </div>
            )}
            <button className="guest__modal__submit" type="submit">
              <span>??????</span>
            </button>
          </form>
        </Modal>
      </div>
      <div>
        <Modal
          isOpen={attendModalIsOpen}
          onAfterOpen={afterOpenAttendModal}
          onRequestClose={closeAttendModal}
          style={modalStyles}
          contentLabel="Attend Modal"
        >
          <div className="guest__modal__title">Attend</div>
          <div className="guest__modal__coment">
            ???????????? ???????????? ?????? ?????? ????????? ??????????????????.
          </div>
          <form
            className="guest__modal__form"
            onSubmit={attendHandleSubmit(handleAttendFormSubmit)}
          >
            <div className="guest__modal__contents__title black">
              <span>
                ????????? ?????? <span style={{ color: "#EEAA25" }}>*</span>
              </span>
            </div>
            <input
              {...attendRegister("name", { required: true })}
              className={`guest__modal__form__input ${
                attendErrors.name && "error"
              }`}
              type="text"
              placeholder="????????? ??????????????????."
              name="name"
            />
            {attendErrors.name && (
              <div className="guest__modal__form__error">
                ????????? ????????? ??????????????????.
              </div>
            )}
            <div className="guest__modal__contents__title black">
              <span>
                ?????? <span style={{ color: "#EEAA25" }}>*</span>
              </span>
            </div>
            <div className="guest__modal__form__genders">
              <div
                className={`guest__modal__form__genders__gender ${
                  attendErrors.relation && "error"
                }`}
              >
                <input
                  {...attendRegister("relation", { required: true })}
                  type="radio"
                  id="gender_male"
                  name="relation"
                  value="?????? ???"
                />
                <label htmlFor="gender_male">?????? ???</label>
              </div>
              <div
                className={`guest__modal__form__genders__gender ${
                  attendErrors.relation && "error"
                }`}
              >
                <input
                  {...attendRegister("relation", { required: true })}
                  type="radio"
                  id="gender_female"
                  name="relation"
                  value="?????? ???"
                />
                <label htmlFor="gender_female">?????? ???</label>
              </div>
            </div>
            {attendErrors.relation && (
              <div className="guest__modal__form__error">
                ????????? ??????????????????.
              </div>
            )}
            <div className="guest__modal__contents__title black">
              <span>
                ??? ?????? <span style={{ color: "#EEAA25" }}>*</span>
              </span>
            </div>
            <input
              {...attendRegister("count", {
                pattern: /^[0-9]+$/i,
                required: true,
              })}
              className={`guest__modal__form__input mb-0 ${
                attendErrors.count && "error"
              }`}
              type="text"
              placeholder="????????? ????????? ??? ?????? ?????? ??????????????????."
              name="count"
            />
            {attendErrors.count?.type === "required" && (
              <div className="guest__modal__form__error">
                ??? ?????? ?????? ??????????????????.
              </div>
            )}
            {attendErrors.count?.type === "pattern" && (
              <div className="guest__modal__form__error">
                ????????? ??????????????????.
              </div>
            )}
            <button className="guest__modal__submit" type="submit">
              <span>??????</span>
            </button>
          </form>
        </Modal>
      </div>
    </section>
  );
};
