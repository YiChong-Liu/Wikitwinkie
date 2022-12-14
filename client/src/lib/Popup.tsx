import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

const Popup = (props: {
  trigger: React.RefObject<HTMLElement>,
  title: string,
  children: React.ReactNode,
  closeText: string,
  confirmText: string,
  onConfirm: () => any
}) => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (props.trigger.current === null) {
      throw new Error("Popup trigger cannot be null");
    }
    props.trigger.current.onclick = () => setShow(true)
  }, [props.trigger]);
  return <>
    {/* <Button variant="primary" onClick={() => setShow(true)}>
      {props.buttonText}
    </Button> */}
    <Modal show={show} onHide={() => setShow(false)}>
      <Modal.Header closeButton>
        <Modal.Title>{props.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{props.children}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShow(false)}>
          {props.closeText}
        </Button>
        <Button variant="primary" onClick={() => { setShow(false); props.onConfirm(); }}>
          {props.confirmText}
        </Button>
      </Modal.Footer>
    </Modal>
  </>;
};

export default Popup;
