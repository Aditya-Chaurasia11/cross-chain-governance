import { EquitoClient } from "@equito-sdk/client";

let client: EquitoClient;

export const getEquitoClient = async () => {
  if (!client) {
    const wsProvider = import.meta.env.VITE_TESTNET_WS_ENDPOINT;
    const archiveWsProvider = import.meta.env.VITE_TESTNET_ARCHIVE_WS_ENDPOINT;
    if (!wsProvider || !archiveWsProvider) {
      throw new Error(
        "Missing environment variables VITE_TESTNET_WS_ENDPOINT and VITE_TESTNET_ARCHIVE_WS_ENDPOINT for Equito client"
      );
    }

    client = await EquitoClient.create({
      wsProvider,
      archiveWsProvider,
    });
  }

  return client;
};
