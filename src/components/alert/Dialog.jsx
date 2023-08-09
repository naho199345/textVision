import React from "react";
import Modal from "react-modal";
import PropTypes from "prop-types";
import styles from "assets/css/default.module.scss";

const Dialog = ({ dialog, onClose }) => {
  return (
    <Modal
      className={styles.dim}
      isOpen={dialog ? true : false}
      style={styles}
      onRequestClose={onClose}
      ariaHideApp={false}
    >
      {dialog}
    </Modal>
  );
};
Dialog.propTypes = {
  dialog: PropTypes.any,
  onClose: PropTypes.func,
  alert: PropTypes.bool,
};
export default Dialog;
