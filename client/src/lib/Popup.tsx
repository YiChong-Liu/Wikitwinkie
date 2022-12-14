import React, { useState } from 'react';
import "./Popup.css";

// Code adapted from https://www.cluemediator.com/create-simple-popup-in-reactjs
// const Popup = (props: {content: JSX.Element, handleClose: () => any}) => {
//   return <div className="popup-box">
//     <div className="box">
//       <span className="close-icon" onClick={props.handleClose}>x</span>
//       {props.content}
//     </div>
//   </div>;
// };

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const Popup = (props: {buttonText: string}) => {
  const [show, setShow] = useState(false);
  return <>
    <Button variant="primary" onClick={() => setShow(true)}>
      {props.buttonText}
    </Button>
    <Modal show={show} onHide={() => setShow(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Modal heading</Modal.Title>
      </Modal.Header>
      <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShow(false)}>
          Close
        </Button>
        <Button variant="primary" onClick={() => setShow(false)}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  </>;
};

export default Popup;
