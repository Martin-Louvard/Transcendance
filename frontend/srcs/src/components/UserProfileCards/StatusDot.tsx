import React from "react";

enum colors{
    "ONLINE" = '#4cd06d',
    "INGAME" = 'orange',
    "OFFLINE" = 'red'
}

interface StatusDotProps{
    status: string
    style: string
}

const StatusDot: React.FC<StatusDotProps> = (props) => {
    const color = colors[props.status as keyof typeof colors]
    const styles = { backgroundColor: color };
  
    return color ? (
      <>
        <span className={`status-indicator ${props.style}`} style={styles} />
      </>
    ) : null;
  };
  
export default StatusDot;