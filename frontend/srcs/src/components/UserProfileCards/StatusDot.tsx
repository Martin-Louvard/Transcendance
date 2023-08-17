import React from "react";

enum colors{
    "ONLINE" = '#4cd06d',
    "INGAME" = 'orange',
    "OFFLINE" = 'red'
}

interface StatusDotProps{
    status: string
}

const StatusDot: React.FC<StatusDotProps> = (user) => {
    const color = colors[user.status as keyof typeof colors]
    const styles = { backgroundColor: color };
  
    return color ? (
      <>
        <span className="status-indicator" style={styles} />
      </>
    ) : null;
  };
  
export default StatusDot;