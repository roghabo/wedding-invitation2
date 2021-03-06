import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../fbase";
import PropagateLoader from "react-spinners/PropagateLoader";
import { css } from "@emotion/react";

const override = css`
  display: block;
  margin: 0 auto;
`;
export const GuestMessage = () => {
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState("all");
  const [totalCount, setTotalCount] = useState(0);
  const [messages, setMessages] = useState<any[] | []>([]);
  const getMessages = async (filter: any) => {
    if (filter === "all") {
      const dbMessages = await getDocs(collection(db, "message"));
      dbMessages.forEach((document) => {
        const messageObject = {
          ...document.data(),
          id: document.id,
        };
        setMessages((prev) => [messageObject, ...prev]);
      });
      setTotalCount(dbMessages.size);
    } else {
      const q = query(
        collection(db, "message"),
        where("relation", "==", filter)
      );
      const dbMessages = await getDocs(q);
      dbMessages.forEach((document) => {
        const messageObject = {
          ...document.data(),
          id: document.id,
        };
        setMessages((prev) => [messageObject, ...prev]);
      });
      setTotalCount(dbMessages.size);
    }
  };

  const clickTab = (filter: any) => {
    setMessages([]);
    setActive(filter);
    getMessages(filter);
  };
  useEffect(() => {
    getMessages("all");
    setLoading(false);
  }, []);
  return (
    <>
      <div className="guest_book__title">
        <span>Message</span>
      </div>
      <div className="guest_book__tabs">
        <div
          className={`guest_book__tabs__tab ${active === "all" && "active"}`}
          onClick={() => clickTab("all")}
        >
          <span>전체</span>
        </div>
        <div
          className={`guest_book__tabs__tab ${
            active === "신랑 측" && "active"
          }`}
          onClick={() => clickTab("신랑 측")}
        >
          <span>신랑 측</span>
        </div>
        <div
          className={`guest_book__tabs__tab ${
            active === "신부 측" && "active"
          }`}
          onClick={() => clickTab("신부 측")}
        >
          <span>신부 측</span>
        </div>
      </div>
      <div className="guest_book__totalcount">
        <span>
          <span style={{ color: "#EEAA25" }}>{totalCount}</span>개의 메시지
        </span>
      </div>
      <div className="guest_book__contents">
        {loading ? (
          <div className="guest_book__loader">
            <PropagateLoader
              color={"#1a1a1a"}
              loading={true}
              css={override}
              size={8}
            />
          </div>
        ) : (
          <div>
            {messages.map((message) => (
              <div className="guest_book__message" key={message.id}>
                <div className="guest_book__message__header">
                  <div className="guest_book__message__header__container">
                    <div className="guest_book__message__header__name">
                      {message.name}
                    </div>
                    <div className="guest_book__message__header__date">
                      {message.createdAt}
                    </div>
                  </div>
                  <div className="guest_book__message__header__container">
                    {active === "all" && (
                      <div
                        className={`guest_book__message__header__relation ${
                          message.relation === "신부 측" && "f"
                        }`}
                      >
                        {message.relation}
                      </div>
                    )}
                  </div>
                </div>
                <div className="guest_book__message__content">
                  <span>{message.message}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};
