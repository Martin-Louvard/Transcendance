import React from "react";

interface NotifDotProps{
    number: number
}

const NotifDot: React.FC<NotifDotProps | undefined> = (props) => {
    const styles = { backgroundColor: "red" };
  
    return props?.number ? (
      <>
        <span className="indicator" style={styles} >{props.number}</span>
      </>
    ) : null;
  };
  
export default NotifDot;