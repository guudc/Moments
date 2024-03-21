/* Text component */

const Text = ({_style={}, children }) => {
    return (
      <span style={{...{color:'var(--primary)'}, ..._style}}>{children}</span>
    );
};

export default Text;