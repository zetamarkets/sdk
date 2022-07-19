export enum Network {
  LOCALNET = "localnet",
  DEVNET = "devnet",
  MAINNET = "mainnet",
}

export function toNetwork(network: string): Network {
  if (network == "localnet") return Network.LOCALNET;
  if (network == "devnet") return Network.DEVNET;
  if (network == "mainnet") return Network.MAINNET;
  throw Error("Invalid network");
}
