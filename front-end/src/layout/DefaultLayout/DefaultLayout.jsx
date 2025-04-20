import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

import classNames from "classnames/bind";

import styles from "./DefaultLayout.module.scss";

const cx = classNames.bind(styles);

function DefaultLayout({ children }) {
  const location = useLocation();
  const [isHeaderHidden, setIsHeaderHidden] = useState(false);

  useEffect(() => {
    if (location.pathname === "/" || location.pathname === "/movies") {
      setIsHeaderHidden(true);
    } else {
      setIsHeaderHidden(false);
    }
  }, [location.pathname]);

  return (
    <div>
      {isHeaderHidden ? (
        <Header isHeaderHidden />
      ) : (
        <Header isHeaderHidden={false} />
      )}

      <div className={cx("container")}>{children}</div>
      <Footer />
    </div>
  );
}

export default DefaultLayout;
