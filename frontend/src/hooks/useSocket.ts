import { useContext, useEffect } from "react";
import { SocketContext } from "../context/SocketContext";

export function useSocket(event: string, callback: (...args: any[]) => void) {
  const socket = useContext(SocketContext);

  useEffect(() => {
    socket.on(event, callback);
    return () => {
      socket.off(event);
    };
  }, [event, callback, socket]);
}
