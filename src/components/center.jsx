/* Center component */

const Centered = ({ type, _style={}, children }) => {
    return (
      <div className={type} style={{...{
            margin:'auto',
            display:'flex',
            alignItems:'center',
            justifyContent:'center',
        }, ..._style}}>
        {children} 
      </div>
    );
};

export default Centered;