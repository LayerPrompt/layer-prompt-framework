import { solidityPacked } from "ethers";
import { createViemWalletClient } from "./createViemWalletClient";
import { createViemPublicClient } from "./createViemPublicClient";
import { AccessList, Address, formatEther, parseEther } from "viem";
const UNISWAP_V3_ROUTER_ADDRESS = "0xE592427A0AEce92De3Edee1F18E0157C05861564";
const UNISWAP_V3_ROUTER_ABI = [
  {
    inputs: [
      { name: "recipient", type: "address" },
      { name: "amountIn", type: "uint256" },
      { name: "amountOutMinimum", type: "uint256" },
      { name: "path", type: "bytes" },
      { name: "deadline", type: "uint256" },
    ],
    name: "exactInput",
    outputs: [{ name: "amountOut", type: "uint256" }],
    stateMutability: "payable",
    type: "function",
  },
] as const;

const buyToken = async (args: {
  tokenAddress: string;
  amountIn: string;
  amountOutMinimum: string;
  recipient: string;
  deadline: number;
}) => {
  try {
    const walletClient = createViemWalletClient();

    const path = solidityPacked(
      ["address", "address"],
      ["0xC02aaa39b223FE8D0A0E5C4F27eAD9083C756Cc2", args.tokenAddress]
    );

    const hash = await walletClient.writeContract({
      address: UNISWAP_V3_ROUTER_ADDRESS,
      abi: UNISWAP_V3_ROUTER_ABI,
      functionName: "exactInput",
      args: [
        args.recipient as `0x${string}`,
        BigInt(args.amountIn),
        BigInt(args.amountOutMinimum),
        path as `0x${string}`,
        BigInt(args.deadline),
      ],
      value: BigInt(args.amountIn),
    });

    return {
      success: true,
      message: `Transaction successful with TxHash: ${hash}`,
    };
  } catch (error) {
    return {
      success: false,
      message: `Trade failed: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    };
  }
};

const getBalance = async (wallet: Address) => {
  const publicClient = createViemPublicClient();
  const balance = await publicClient.getBalance({ address: wallet });
  return formatEther(balance);
};

interface DexScreenerTokenData {
  chainId: string;
  dexId: string;
  url: string;
  pairAddress: string;
  labels: string[];
  baseToken: {
    address: string;
    name: string;
    symbol: string;
  };
  quoteToken: {
    address: string;
    name: string;
    symbol: string;
  };
  priceNative: string;
  priceUsd: string;
  txns: {
    m5: {
      buys: number;
      sells: number;
    };
    h1: {
      buys: number;
      sells: number;
    };
    h6: {
      buys: number;
      sells: number;
    };
    h24: {
      buys: number;
      sells: number;
    };
  };
  volume: {
    h24: number;
    h6: number;
    h1: number;
    m5: number;
  };
  priceChange: {
    m5: number;
    h1: number;
    h6: number;
    h24: number;
  };
  liquidity: {
    usd: number;
    base: number;
    quote: number;
  };
  fdv: number;
  marketCap: number;
  pairCreatedAt: number;
  info: {
    imageUrl: string;
    header: string;
    openGraph: string;
    websites: {
      label: string;
      url: string;
    }[];
    socials: {
      type: string;
      url: string;
    }[];
  };
  boosts: {
    active: number;
  };
}

const fetchDexscreener = async (address: Address) => {
  try {
    const chainId = "ethereum";

    const response = await fetch(
      `https://api.dexscreener.com/tokens/v1/${chainId}/${address}`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch dexscreener: ${response.statusText}`);
    }

    const data = (await response.json()) as DexScreenerTokenData[];

    if (data.length === 0) {
      return {
        success: true,
        message: `No results found for token: "${address}"`,
      };
    }

    return data;
  } catch (error) {
    return {
      success: false,
      message: `Failed to get token data: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    };
  }
};

const getWalletAddress = async (): Promise<Address> => {
  const walletClient = createViemWalletClient();
  const [address] = await walletClient.getAddresses();
  return address;
};

const readContract = async (
  contract: Address,
  functionName: string,
  args: any[],
  abi: any[]
) => {
  const publicClient = createViemPublicClient();
  const result = (await publicClient.readContract({
    address: contract,
    abi,
    functionName,
    args,
  })) as string | number | bigint | boolean | object;

  if (typeof result === "bigint") {
    return result.toString();
  }

  return result;
};

const sellToken = async (args: {
  tokenAddress: string;
  amountIn: string;
  amountOutMinimum: string;
  recipient: string;
  deadline: number;
}) => {
  try {
    const walletClient = createViemWalletClient();

    const path = solidityPacked(
      ["address", "address"],
      [args.tokenAddress, "0xC02aaa39b223FE8D0A0E5C4F27eAD9083C756Cc2"]
    );

    const hash = await walletClient.writeContract({
      address: UNISWAP_V3_ROUTER_ADDRESS,
      abi: UNISWAP_V3_ROUTER_ABI,
      functionName: "exactInput",
      args: [
        args.recipient as `0x${string}`,
        BigInt(args.amountIn),
        BigInt(args.amountOutMinimum),
        path as `0x${string}`,
        BigInt(args.deadline),
      ],
    });

    return {
      success: true,
      message: `Transaction successful with TxHash: ${hash}`,
    };
  } catch (error) {
    return {
      success: false,
      message: `Trade failed: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    };
  }
};

interface SendTransactionArgs {
  to: Address;
  value?: string;
  data?: `0x${string}`;
  nonce?: number;
  gasPrice?: string;
  accessList?: AccessList;
  factoryDeps?: `0x${string}`[];
  paymaster?: Address;
  paymasterInput?: `0x${string}`;
}

const sendTransaction = async ({
  to,
  value,
  data,
  nonce,
  gasPrice,
  accessList,
  factoryDeps,
  paymaster,
  paymasterInput,
}: SendTransactionArgs) => {
  try {
    const walletClient = createViemWalletClient();

    const hash = await walletClient.sendTransaction({
      to,
      value: value ? parseEther(value) : undefined,
      data,
      nonce: nonce || undefined,
      gasPrice: gasPrice ? parseEther(gasPrice) : undefined,
      accessList: accessList || undefined,
      customData: {
        factoryDeps: factoryDeps || undefined,
        paymaster: paymaster || undefined,
        paymasterInput: paymasterInput || undefined,
      },
    });

    return {
      success: true,
      hash,
      message: `Transaction sent successfully. Hash ${hash}`,
    };
  } catch (error) {
    return {
      success: false,
      hash: null,
      message: `Failed to send transaction: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    };
  }
};
