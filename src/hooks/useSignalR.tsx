"use client";
import { useEffect, useState } from "react";
import { API_URL } from "@/constants";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";

const useSignalR = () => {
  const [connection, setConnection] = useState<null | HubConnection>(null);

  useEffect(() => {
    const connect = async () => {
      let signalRConnection = new HubConnectionBuilder()
        .withUrl(`${API_URL}/ws`)
        .build();
      if (signalRConnection) {
        setConnection(signalRConnection)
      }

      await signalRConnection.start()

      return () => signalRConnection.stop()
    };

    connect()
  }, []);

  return connection;
};

export default useSignalR;
