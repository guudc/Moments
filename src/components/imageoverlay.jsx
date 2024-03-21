/* ImageOverlay component */
import '../index.css'

const ImageOverlay = ({ img ="", _style={}, children }) => {
    const styles = {
      width:'100%',
      height:'100%',
      display:'flex'
    }
    const ostyles = {
      width:'100%',
      height:'100%',
      marginLeft:'-100%',
      zIndex:'1'
    }
     
    return (
      <div style={styles}>
        <div className="fullImage" style={{width:'100%', height:'100%', backgroundImage:`url(${img})`, filter:'opacity(0.05) blur(5px)' }}></div>
        <div style={{...ostyles, ..._style}}>{children}</div>
      </div>
    );
};

export default ImageOverlay;