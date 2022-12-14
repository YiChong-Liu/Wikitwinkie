// Code adapted from https://www.cluemediator.com/create-simple-popup-in-reactjs
import "./Popup.css";

const Popup = (props: {content: JSX.Element, handleClose: () => any}) => {
  return (
    <div className="popup-box">
      <div className="box">
        <span className="close-icon" onClick={props.handleClose}>x</span>
        {props.content}
      </div>
    </div>
  );
};

export default Popup;
