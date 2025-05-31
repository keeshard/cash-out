import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-verify";
import { config as dotEnvConfig } from "dotenv";
import { HardhatUserConfig } from "hardhat/config";

dotEnvConfig();

const ROOTSTOCK_TESTNET_RPC_URL = process.env.ROOTSTOCK_TESTNET_RPC_URL || "";
const PRIVATE_KEY = process.env.PRIVATE_KEY || "0x0";

const config: HardhatUserConfig = {
  networks: {
    rootstockTestnet: {
      accounts: [PRIVATE_KEY],
      url: ROOTSTOCK_TESTNET_RPC_URL,
      chainId: 31,
    },
    opSepolia: {
      accounts: [PRIVATE_KEY],
      url: "https://sepolia.optimism.io",
      chainId: 11155420,
    },
    baseSepolia: {
      accounts: [PRIVATE_KEY],
      url: "https://sepolia.base.org",
      chainId: 84532,
    },
  },
  etherscan: {
    apiKey: {
      opSepolia: "N/A",
      rootstockTestnet: "N/A",
      baseSepolia: "N/A",
    },
    customChains: [
      {
        chainId: 31,
        network: "rootstockTestnet",
        urls: {
          apiURL: "https://rootstock.blockscout.com/api",
          browserURL: "https://rootstock.blockscout.com",
        },
      },
      {
        chainId: 11155420,
        network: "opSepolia",
        urls: {
          apiURL: "https://optimism-sepolia.blockscout.com/api",
          browserURL: "https://optimism-sepolia.blockscout.com",
        },
      },
      {
        chainId: 84532,
        network: "baseSepolia",
        urls: {
          apiURL: "https://base-sepolia.blockscout.com/api",
          browserURL: "https://base-sepolia.blockscout.com",
        },
      },
    ],
  },
  sourcify: {
    enabled: false,
  },
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 2000, // or higher, e.g. 10000 for tests
      },
    },
  },
};

export default config;
