import React from "react";
import styles from "./ReturnButton.module.css";

interface ReturnButtonProps {
  onReturn: () => void; // Function to call when the button is clicked
}

const ReturnButton: React.FC<ReturnButtonProps> = ({ onReturn }) => {
    return (
        <button className={styles.returnButton} onClick={onReturn}>
            Return 
        </button>
    );
};

export default ReturnButton;