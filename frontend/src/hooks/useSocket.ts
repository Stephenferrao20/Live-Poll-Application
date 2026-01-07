import { useContext, useEffect } from "react";
import { SocketContext } from "../context/SocketContext";
import type { Socket } from "socket.io-client";

export function useSocket(event: string, callback: (...args: any[]) => void) {
  const socket = useContext(SocketContext) as Socket | null;

  useEffect(() => {
    if(socket){
      socket.on(event, callback);
    return () => {
      socket.off(event);
    };
    }
  }, [event, callback, socket]);
}
