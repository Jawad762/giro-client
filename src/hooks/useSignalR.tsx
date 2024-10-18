"use client";
import { useEffect, useState } from "react";
import { API_URL } from "@/constants";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { useAppSelector } from "@/redux/store";
import { UserType } from "@/types";

const useSignalR = () => {
  const [connection, setConnection] = useState<null | HubConnection>(null);
  const user = useAppSelector(state => state.main.user) as UserType

  useEffect(() => {
    const connect = async () => {
      let signalRConnection = new HubConnectionBuilder()
        .withUrl(`${API_URL}/ws?userId=${user.id}&role=${user.role}`)
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
