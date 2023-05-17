import * as React from "react";
import styles from "./styles.module.css";

export const Header = () => {
  return (
    <header className={styles.header}>
      <a>Home</a>
      <a>Contact</a>
    </header>
  );
};
