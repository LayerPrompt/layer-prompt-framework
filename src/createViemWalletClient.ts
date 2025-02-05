import { createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { mainnet } from "viem/chains";
import { eip712WalletActions } from "viem/zksync";

export const createViemWalletClient = () => {
  if (!process.env.PRIVATE_KEY) {
    throw new Error("PRIVATE_KEY env is not set");
  }

  const account = privateKeyToAccount(process.env.PRIVATE_KEY as `0x${string}`);

  return createWalletClient({
    account,
    chain: mainnet,
    transport: http(),
  }).extend(eip712WalletActions());
};
