/* Button component */
import './button.css'
import '../index.css'

const CirularButton = ({width, height, color="primary", onClick, _style={}, children}) => { 
  const styles = {
      width:width || '40px',
      height:height || '40px',
      cursor:'pointer'
  }
  const _class = "button circle " + ((color == 'secondary') ? "button_secondary" : (color == 'primary') ? "button_primary" : (color == 'normal') ? "button_normal" : "button_mai") 
    return (
      <div onClick={onClick} className={_class} style={{...styles, ..._style}} >
       {children} 
      </div>
  );
};

const RectangleButton = ({width, height, color="primary", onClick, _style={}, children}) => { 
  const styles = {
      padding:'5px 15px',
      cursor:'pointer',
      borderRadius:'5px'
  }
  const _class = "button button_rect " + ((color == 'secondary') ? "button_secondary" : (color == 'primary') ? "button_primary" : (color == 'normal') ? "button_normal" : (color == 'error') ? "button_error" : "button_main") 
    return (
      <div onClick={onClick} className={_class} style={{...styles, ..._style}} >
       {children} 
      </div>
  );
};
const CircularButton = CirularButton;
const RectButton = RectangleButton;
export { CircularButton as CirularButton, RectButton as RectButton };