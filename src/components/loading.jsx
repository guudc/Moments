/* Loading modal */
import './loading.css'
import Text from './text';
const Loading = ({ _style={} }) => {
    return (
      <div  style={{...{
            margin:'auto',
            display:'flex',
            alignItems:'center',
            justifyContent:'center',
            width:'100%',
            height:'100%',
            position:'fixed',
            top:'0px',
            left:'0px',
            zIndex:'10',
            backdropFilter:'blur(10px)'
        }, ..._style}}>
            <div className="loader"></div>
        </div>
    );
};

export default Loading;