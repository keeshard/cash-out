export const CASH_OUT_ABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_rifToken",
        type: "address",
      },
      {
        internalType: "address",
        name: "_usdToken",
        type: "address",
      },
      {
        internalType: "address",
        name: "_relayer",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "businessAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "metadata",
        type: "string",
      },
    ],
    name: "BusinessCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "business",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "BusinessCreditLimitUpgraded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "InvoiceClaimCompleted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "creator",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "business",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "InvoiceClaimTriggered",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "creator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "InvoiceClaimed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "business",
        type: "address",
      },
    ],
    name: "InvoiceRejected",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "business",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "InvoiceSettled",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "userAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "metadata",
        type: "string",
      },
    ],
    name: "UserCreated",
    type: "event",
  },
  {
    inputs: [],
    name: "RIF_TOKEN",
    outputs: [
      {
        internalType: "contract IERC20",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "USD_TOKEN",
    outputs: [
      {
        internalType: "contract IERC20",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "businesses",
    outputs: [
      {
        internalType: "string",
        name: "metadata",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "creditLimit",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "availableCredit",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "exists",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_account",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_invoiceId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_amountInUsd",
        type: "uint256",
      },
    ],
    name: "completeInvoiceClaim",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_metadata",
        type: "string",
      },
    ],
    name: "createBusiness",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_metadata",
        type: "string",
      },
    ],
    name: "createUser",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "invoiceCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "invoices",
    outputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "creator",
        type: "address",
      },
      {
        internalType: "address",
        name: "business",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        internalType: "string",
        name: "metadata",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "claimedAt",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "settledAt",
        type: "uint256",
      },
      {
        internalType: "enum CashOut.InvoiceStatus",
        name: "status",
        type: "uint8",
      },
      {
        internalType: "bytes32",
        name: "dataHash",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "relayer",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_relayer",
        type: "address",
      },
    ],
    name: "setRelayer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_invoiceId",
        type: "uint256",
      },
    ],
    name: "settleInvoice",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_business",
        type: "address",
      },
      {
        internalType: "address",
        name: "_token",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "_metadata",
        type: "string",
      },
    ],
    name: "triggerInvoiceClaim",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_account",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "upgradeLimit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "users",
    outputs: [
      {
        internalType: "string",
        name: "metadata",
        type: "string",
      },
      {
        internalType: "bool",
        name: "exists",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

export const TWITTER_WEB_PROOF_ABI = [
  {
    type: "function",
    name: "DATA_URL",
    inputs: [],
    outputs: [{ name: "", type: "string", internalType: "string" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "main",
    inputs: [
      {
        name: "webProof",
        type: "tuple",
        internalType: "struct WebProof",
        components: [
          {
            name: "webProofJson",
            type: "string",
            internalType: "string",
          },
        ],
      },
      { name: "account", type: "address", internalType: "address" },
    ],
    outputs: [
      {
        name: "",
        type: "tuple",
        internalType: "struct Proof",
        components: [
          {
            name: "seal",
            type: "tuple",
            internalType: "struct Seal",
            components: [
              {
                name: "verifierSelector",
                type: "bytes4",
                internalType: "bytes4",
              },
              {
                name: "seal",
                type: "bytes32[8]",
                internalType: "bytes32[8]",
              },
              {
                name: "mode",
                type: "uint8",
                internalType: "enum ProofMode",
              },
            ],
          },
          {
            name: "callGuestId",
            type: "bytes32",
            internalType: "bytes32",
          },
          { name: "length", type: "uint256", internalType: "uint256" },
          {
            name: "callAssumptions",
            type: "tuple",
            internalType: "struct CallAssumptions",
            components: [
              {
                name: "proverContractAddress",
                type: "address",
                internalType: "address",
              },
              {
                name: "functionSelector",
                type: "bytes4",
                internalType: "bytes4",
              },
              {
                name: "settleChainId",
                type: "uint256",
                internalType: "uint256",
              },
              {
                name: "settleBlockNumber",
                type: "uint256",
                internalType: "uint256",
              },
              {
                name: "settleBlockHash",
                type: "bytes32",
                internalType: "bytes32",
              },
            ],
          },
        ],
      },
      { name: "", type: "string", internalType: "string" },
      { name: "", type: "address", internalType: "address" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "proof",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "tuple",
        internalType: "struct Proof",
        components: [
          {
            name: "seal",
            type: "tuple",
            internalType: "struct Seal",
            components: [
              {
                name: "verifierSelector",
                type: "bytes4",
                internalType: "bytes4",
              },
              {
                name: "seal",
                type: "bytes32[8]",
                internalType: "bytes32[8]",
              },
              {
                name: "mode",
                type: "uint8",
                internalType: "enum ProofMode",
              },
            ],
          },
          {
            name: "callGuestId",
            type: "bytes32",
            internalType: "bytes32",
          },
          { name: "length", type: "uint256", internalType: "uint256" },
          {
            name: "callAssumptions",
            type: "tuple",
            internalType: "struct CallAssumptions",
            components: [
              {
                name: "proverContractAddress",
                type: "address",
                internalType: "address",
              },
              {
                name: "functionSelector",
                type: "bytes4",
                internalType: "bytes4",
              },
              {
                name: "settleChainId",
                type: "uint256",
                internalType: "uint256",
              },
              {
                name: "settleBlockNumber",
                type: "uint256",
                internalType: "uint256",
              },
              {
                name: "settleBlockHash",
                type: "bytes32",
                internalType: "bytes32",
              },
            ],
          },
        ],
      },
    ],
    stateMutability: "pure",
  },
  {
    type: "function",
    name: "setBlock",
    inputs: [{ name: "blockNo", type: "uint256", internalType: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setChain",
    inputs: [
      { name: "chainId", type: "uint256", internalType: "uint256" },
      { name: "blockNo", type: "uint256", internalType: "uint256" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  { type: "error", name: "FailedCall", inputs: [] },
];

export const CASH_OUT_PROVER_ABI = [
  {
    type: "constructor",
    inputs: [
      { name: "_owner", type: "address", internalType: "address" },
      {
        name: "_supportedTokens",
        type: "address[]",
        internalType: "address[]",
      },
      {
        name: "chainIds",
        type: "uint256[]",
        internalType: "uint256[]",
      },
      {
        name: "priceFeedIds",
        type: "bytes32[]",
        internalType: "bytes32[]",
      },
      { name: "decimals", type: "uint8[]", internalType: "uint8[]" },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "BINANCE_DATA_URL",
    inputs: [],
    outputs: [{ name: "", type: "string", internalType: "string" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "BLOCK_INTERVAL",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "BYBIT_DATA_URL",
    inputs: [],
    outputs: [{ name: "", type: "string", internalType: "string" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "ITERATIONS",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "configureSupportedTokens",
    inputs: [
      {
        name: "_supportedTokens",
        type: "address[]",
        internalType: "address[]",
      },
      {
        name: "priceFeedIds",
        type: "bytes32[]",
        internalType: "bytes32[]",
      },
      { name: "decimals", type: "uint8[]", internalType: "uint8[]" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "getUsdValue",
    inputs: [
      { name: "token", type: "address", internalType: "address" },
      { name: "amount", type: "uint256", internalType: "uint256" },
    ],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "owner",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "proof",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "tuple",
        internalType: "struct Proof",
        components: [
          {
            name: "seal",
            type: "tuple",
            internalType: "struct Seal",
            components: [
              {
                name: "verifierSelector",
                type: "bytes4",
                internalType: "bytes4",
              },
              {
                name: "seal",
                type: "bytes32[8]",
                internalType: "bytes32[8]",
              },
              {
                name: "mode",
                type: "uint8",
                internalType: "enum ProofMode",
              },
            ],
          },
          {
            name: "callGuestId",
            type: "bytes32",
            internalType: "bytes32",
          },
          { name: "length", type: "uint256", internalType: "uint256" },
          {
            name: "callAssumptions",
            type: "tuple",
            internalType: "struct CallAssumptions",
            components: [
              {
                name: "proverContractAddress",
                type: "address",
                internalType: "address",
              },
              {
                name: "functionSelector",
                type: "bytes4",
                internalType: "bytes4",
              },
              {
                name: "settleChainId",
                type: "uint256",
                internalType: "uint256",
              },
              {
                name: "settleBlockNumber",
                type: "uint256",
                internalType: "uint256",
              },
              {
                name: "settleBlockHash",
                type: "bytes32",
                internalType: "bytes32",
              },
            ],
          },
        ],
      },
    ],
    stateMutability: "pure",
  },
  {
    type: "function",
    name: "proveBalance",
    inputs: [
      {
        name: "_tokens",
        type: "address[2]",
        internalType: "address[2]",
      },
      {
        name: "_chains",
        type: "uint256[2]",
        internalType: "uint256[2]",
      },
      {
        name: "_startBlocks",
        type: "uint256[2]",
        internalType: "uint256[2]",
      },
      { name: "_owner", type: "address", internalType: "address" },
    ],
    outputs: [
      {
        name: "",
        type: "tuple",
        internalType: "struct Proof",
        components: [
          {
            name: "seal",
            type: "tuple",
            internalType: "struct Seal",
            components: [
              {
                name: "verifierSelector",
                type: "bytes4",
                internalType: "bytes4",
              },
              {
                name: "seal",
                type: "bytes32[8]",
                internalType: "bytes32[8]",
              },
              {
                name: "mode",
                type: "uint8",
                internalType: "enum ProofMode",
              },
            ],
          },
          {
            name: "callGuestId",
            type: "bytes32",
            internalType: "bytes32",
          },
          { name: "length", type: "uint256", internalType: "uint256" },
          {
            name: "callAssumptions",
            type: "tuple",
            internalType: "struct CallAssumptions",
            components: [
              {
                name: "proverContractAddress",
                type: "address",
                internalType: "address",
              },
              {
                name: "functionSelector",
                type: "bytes4",
                internalType: "bytes4",
              },
              {
                name: "settleChainId",
                type: "uint256",
                internalType: "uint256",
              },
              {
                name: "settleBlockNumber",
                type: "uint256",
                internalType: "uint256",
              },
              {
                name: "settleBlockHash",
                type: "bytes32",
                internalType: "bytes32",
              },
            ],
          },
        ],
      },
      { name: "", type: "address", internalType: "address" },
      { name: "", type: "uint256", internalType: "uint256" },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "proveBasic",
    inputs: [
      { name: "token", type: "address", internalType: "address" },
      { name: "chainId", type: "uint256", internalType: "uint256" },
      { name: "startBlock", type: "uint256", internalType: "uint256" },
      { name: "_owner", type: "address", internalType: "address" },
    ],
    outputs: [
      {
        name: "",
        type: "tuple",
        internalType: "struct Proof",
        components: [
          {
            name: "seal",
            type: "tuple",
            internalType: "struct Seal",
            components: [
              {
                name: "verifierSelector",
                type: "bytes4",
                internalType: "bytes4",
              },
              {
                name: "seal",
                type: "bytes32[8]",
                internalType: "bytes32[8]",
              },
              {
                name: "mode",
                type: "uint8",
                internalType: "enum ProofMode",
              },
            ],
          },
          {
            name: "callGuestId",
            type: "bytes32",
            internalType: "bytes32",
          },
          { name: "length", type: "uint256", internalType: "uint256" },
          {
            name: "callAssumptions",
            type: "tuple",
            internalType: "struct CallAssumptions",
            components: [
              {
                name: "proverContractAddress",
                type: "address",
                internalType: "address",
              },
              {
                name: "functionSelector",
                type: "bytes4",
                internalType: "bytes4",
              },
              {
                name: "settleChainId",
                type: "uint256",
                internalType: "uint256",
              },
              {
                name: "settleBlockNumber",
                type: "uint256",
                internalType: "uint256",
              },
              {
                name: "settleBlockHash",
                type: "bytes32",
                internalType: "bytes32",
              },
            ],
          },
        ],
      },
      { name: "", type: "address", internalType: "address" },
      { name: "", type: "uint256", internalType: "uint256" },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "proveBinanceFunds",
    inputs: [
      {
        name: "webProof",
        type: "tuple",
        internalType: "struct WebProof",
        components: [
          {
            name: "webProofJson",
            type: "string",
            internalType: "string",
          },
        ],
      },
      { name: "account", type: "address", internalType: "address" },
    ],
    outputs: [
      {
        name: "",
        type: "tuple",
        internalType: "struct Proof",
        components: [
          {
            name: "seal",
            type: "tuple",
            internalType: "struct Seal",
            components: [
              {
                name: "verifierSelector",
                type: "bytes4",
                internalType: "bytes4",
              },
              {
                name: "seal",
                type: "bytes32[8]",
                internalType: "bytes32[8]",
              },
              {
                name: "mode",
                type: "uint8",
                internalType: "enum ProofMode",
              },
            ],
          },
          {
            name: "callGuestId",
            type: "bytes32",
            internalType: "bytes32",
          },
          { name: "length", type: "uint256", internalType: "uint256" },
          {
            name: "callAssumptions",
            type: "tuple",
            internalType: "struct CallAssumptions",
            components: [
              {
                name: "proverContractAddress",
                type: "address",
                internalType: "address",
              },
              {
                name: "functionSelector",
                type: "bytes4",
                internalType: "bytes4",
              },
              {
                name: "settleChainId",
                type: "uint256",
                internalType: "uint256",
              },
              {
                name: "settleBlockNumber",
                type: "uint256",
                internalType: "uint256",
              },
              {
                name: "settleBlockHash",
                type: "bytes32",
                internalType: "bytes32",
              },
            ],
          },
        ],
      },
      { name: "", type: "address", internalType: "address" },
      { name: "", type: "uint256", internalType: "uint256" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "proveBybitFunds",
    inputs: [
      {
        name: "webProof",
        type: "tuple",
        internalType: "struct WebProof",
        components: [
          {
            name: "webProofJson",
            type: "string",
            internalType: "string",
          },
        ],
      },
      { name: "account", type: "address", internalType: "address" },
    ],
    outputs: [
      {
        name: "",
        type: "tuple",
        internalType: "struct Proof",
        components: [
          {
            name: "seal",
            type: "tuple",
            internalType: "struct Seal",
            components: [
              {
                name: "verifierSelector",
                type: "bytes4",
                internalType: "bytes4",
              },
              {
                name: "seal",
                type: "bytes32[8]",
                internalType: "bytes32[8]",
              },
              {
                name: "mode",
                type: "uint8",
                internalType: "enum ProofMode",
              },
            ],
          },
          {
            name: "callGuestId",
            type: "bytes32",
            internalType: "bytes32",
          },
          { name: "length", type: "uint256", internalType: "uint256" },
          {
            name: "callAssumptions",
            type: "tuple",
            internalType: "struct CallAssumptions",
            components: [
              {
                name: "proverContractAddress",
                type: "address",
                internalType: "address",
              },
              {
                name: "functionSelector",
                type: "bytes4",
                internalType: "bytes4",
              },
              {
                name: "settleChainId",
                type: "uint256",
                internalType: "uint256",
              },
              {
                name: "settleBlockNumber",
                type: "uint256",
                internalType: "uint256",
              },
              {
                name: "settleBlockHash",
                type: "bytes32",
                internalType: "bytes32",
              },
            ],
          },
        ],
      },
      { name: "", type: "address", internalType: "address" },
      { name: "", type: "uint256", internalType: "uint256" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "proveEvmCrosschainBalance",
    inputs: [
      {
        name: "_tokens",
        type: "tuple[]",
        internalType: "struct CashOutProver.Erc20Token[]",
        components: [
          { name: "chainId", type: "uint256", internalType: "uint256" },
          {
            name: "startBlock",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "addrs",
            type: "address[]",
            internalType: "address[]",
          },
        ],
      },
      { name: "_owner", type: "address", internalType: "address" },
    ],
    outputs: [
      {
        name: "",
        type: "tuple",
        internalType: "struct Proof",
        components: [
          {
            name: "seal",
            type: "tuple",
            internalType: "struct Seal",
            components: [
              {
                name: "verifierSelector",
                type: "bytes4",
                internalType: "bytes4",
              },
              {
                name: "seal",
                type: "bytes32[8]",
                internalType: "bytes32[8]",
              },
              {
                name: "mode",
                type: "uint8",
                internalType: "enum ProofMode",
              },
            ],
          },
          {
            name: "callGuestId",
            type: "bytes32",
            internalType: "bytes32",
          },
          { name: "length", type: "uint256", internalType: "uint256" },
          {
            name: "callAssumptions",
            type: "tuple",
            internalType: "struct CallAssumptions",
            components: [
              {
                name: "proverContractAddress",
                type: "address",
                internalType: "address",
              },
              {
                name: "functionSelector",
                type: "bytes4",
                internalType: "bytes4",
              },
              {
                name: "settleChainId",
                type: "uint256",
                internalType: "uint256",
              },
              {
                name: "settleBlockNumber",
                type: "uint256",
                internalType: "uint256",
              },
              {
                name: "settleBlockHash",
                type: "bytes32",
                internalType: "bytes32",
              },
            ],
          },
        ],
      },
      { name: "", type: "address", internalType: "address" },
      { name: "", type: "uint256", internalType: "uint256" },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setBlock",
    inputs: [{ name: "blockNo", type: "uint256", internalType: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setChain",
    inputs: [
      { name: "chainId", type: "uint256", internalType: "uint256" },
      { name: "blockNo", type: "uint256", internalType: "uint256" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "supportedTokens",
    inputs: [{ name: "", type: "address", internalType: "address" }],
    outputs: [
      { name: "chainId", type: "uint256", internalType: "uint256" },
      { name: "priceFeedId", type: "bytes32", internalType: "bytes32" },
      { name: "decimals", type: "uint8", internalType: "uint8" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "usdBalanceParser",
    inputs: [{ name: "btcValuation", type: "string", internalType: "string" }],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  { type: "error", name: "FailedCall", inputs: [] },
  { type: "error", name: "StringsInvalidChar", inputs: [] },
];

export const EMAIL_PROVER_ABI = [
  {
    type: "function",
    name: "AUTHORIZED_EMAIL",
    inputs: [],
    outputs: [{ name: "", type: "string", internalType: "string" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "claims",
    inputs: [{ name: "", type: "address", internalType: "address" }],
    outputs: [
      { name: "email", type: "string", internalType: "string" },
      { name: "hackathonName", type: "string", internalType: "string" },
      { name: "projectName", type: "string", internalType: "string" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "proof",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "tuple",
        internalType: "struct Proof",
        components: [
          {
            name: "seal",
            type: "tuple",
            internalType: "struct Seal",
            components: [
              {
                name: "verifierSelector",
                type: "bytes4",
                internalType: "bytes4",
              },
              {
                name: "seal",
                type: "bytes32[8]",
                internalType: "bytes32[8]",
              },
              {
                name: "mode",
                type: "uint8",
                internalType: "enum ProofMode",
              },
            ],
          },
          {
            name: "callGuestId",
            type: "bytes32",
            internalType: "bytes32",
          },
          { name: "length", type: "uint256", internalType: "uint256" },
          {
            name: "callAssumptions",
            type: "tuple",
            internalType: "struct CallAssumptions",
            components: [
              {
                name: "proverContractAddress",
                type: "address",
                internalType: "address",
              },
              {
                name: "functionSelector",
                type: "bytes4",
                internalType: "bytes4",
              },
              {
                name: "settleChainId",
                type: "uint256",
                internalType: "uint256",
              },
              {
                name: "settleBlockNumber",
                type: "uint256",
                internalType: "uint256",
              },
              {
                name: "settleBlockHash",
                type: "bytes32",
                internalType: "bytes32",
              },
            ],
          },
        ],
      },
    ],
    stateMutability: "pure",
  },
  {
    type: "function",
    name: "proveInvoiceEmail",
    inputs: [
      {
        name: "unverifiedEmail",
        type: "tuple",
        internalType: "struct UnverifiedEmail",
        components: [
          { name: "email", type: "string", internalType: "string" },
          {
            name: "dnsRecord",
            type: "tuple",
            internalType: "struct DnsRecord",
            components: [
              { name: "name", type: "string", internalType: "string" },
              {
                name: "recordType",
                type: "uint8",
                internalType: "uint8",
              },
              { name: "data", type: "string", internalType: "string" },
              { name: "ttl", type: "uint64", internalType: "uint64" },
            ],
          },
          {
            name: "verificationData",
            type: "tuple",
            internalType: "struct VerificationData",
            components: [
              {
                name: "validUntil",
                type: "uint64",
                internalType: "uint64",
              },
              {
                name: "signature",
                type: "bytes",
                internalType: "bytes",
              },
              { name: "pubKey", type: "bytes", internalType: "bytes" },
            ],
          },
        ],
      },
    ],
    outputs: [
      {
        name: "",
        type: "tuple",
        internalType: "struct Proof",
        components: [
          {
            name: "seal",
            type: "tuple",
            internalType: "struct Seal",
            components: [
              {
                name: "verifierSelector",
                type: "bytes4",
                internalType: "bytes4",
              },
              {
                name: "seal",
                type: "bytes32[8]",
                internalType: "bytes32[8]",
              },
              {
                name: "mode",
                type: "uint8",
                internalType: "enum ProofMode",
              },
            ],
          },
          {
            name: "callGuestId",
            type: "bytes32",
            internalType: "bytes32",
          },
          { name: "length", type: "uint256", internalType: "uint256" },
          {
            name: "callAssumptions",
            type: "tuple",
            internalType: "struct CallAssumptions",
            components: [
              {
                name: "proverContractAddress",
                type: "address",
                internalType: "address",
              },
              {
                name: "functionSelector",
                type: "bytes4",
                internalType: "bytes4",
              },
              {
                name: "settleChainId",
                type: "uint256",
                internalType: "uint256",
              },
              {
                name: "settleBlockNumber",
                type: "uint256",
                internalType: "uint256",
              },
              {
                name: "settleBlockHash",
                type: "bytes32",
                internalType: "bytes32",
              },
            ],
          },
        ],
      },
      { name: "", type: "bytes32", internalType: "bytes32" },
      { name: "", type: "address", internalType: "address" },
      { name: "", type: "uint256", internalType: "uint256" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "registerClaim",
    inputs: [
      {
        name: "targetWallet",
        type: "address",
        internalType: "address",
      },
      { name: "email", type: "string", internalType: "string" },
      { name: "hackathonName", type: "string", internalType: "string" },
      { name: "projectName", type: "string", internalType: "string" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setBlock",
    inputs: [{ name: "blockNo", type: "uint256", internalType: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setChain",
    inputs: [
      { name: "chainId", type: "uint256", internalType: "uint256" },
      { name: "blockNo", type: "uint256", internalType: "uint256" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  { type: "error", name: "FailedCall", inputs: [] },
];

export const CASH_OUT_VERIFIER_ABI = [
  {
    type: "constructor",
    inputs: [
      {
        name: "_cashOutProver",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "PROVE_INVOICE_EMAIL_SELECTOR",
    inputs: [],
    outputs: [{ name: "", type: "bytes4", internalType: "bytes4" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "_setTestVerifier",
    inputs: [
      {
        name: "newVerifier",
        type: "address",
        internalType: "contract IProofVerifier",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "binanceVerifiedUsdAmount",
    inputs: [{ name: "", type: "address", internalType: "address" }],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "businessInvoiceProvers",
    inputs: [{ name: "", type: "address", internalType: "address" }],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "bybitVerifiedUsdAmount",
    inputs: [{ name: "", type: "address", internalType: "address" }],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "cashOutProver",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "claimInvoiceAmount",
    inputs: [
      {
        name: "proofOutput",
        type: "tuple",
        internalType: "struct CashOutVerifier.ProofOutput",
        components: [
          {
            name: "proof",
            type: "tuple",
            internalType: "struct Proof",
            components: [
              {
                name: "seal",
                type: "tuple",
                internalType: "struct Seal",
                components: [
                  {
                    name: "verifierSelector",
                    type: "bytes4",
                    internalType: "bytes4",
                  },
                  {
                    name: "seal",
                    type: "bytes32[8]",
                    internalType: "bytes32[8]",
                  },
                  {
                    name: "mode",
                    type: "uint8",
                    internalType: "enum ProofMode",
                  },
                ],
              },
              {
                name: "callGuestId",
                type: "bytes32",
                internalType: "bytes32",
              },
              {
                name: "length",
                type: "uint256",
                internalType: "uint256",
              },
              {
                name: "callAssumptions",
                type: "tuple",
                internalType: "struct CallAssumptions",
                components: [
                  {
                    name: "proverContractAddress",
                    type: "address",
                    internalType: "address",
                  },
                  {
                    name: "functionSelector",
                    type: "bytes4",
                    internalType: "bytes4",
                  },
                  {
                    name: "settleChainId",
                    type: "uint256",
                    internalType: "uint256",
                  },
                  {
                    name: "settleBlockNumber",
                    type: "uint256",
                    internalType: "uint256",
                  },
                  {
                    name: "settleBlockHash",
                    type: "bytes32",
                    internalType: "bytes32",
                  },
                ],
              },
            ],
          },
          {
            name: "bodyHash",
            type: "bytes32",
            internalType: "bytes32",
          },
          { name: "account", type: "address", internalType: "address" },
          {
            name: "usdAmount",
            type: "uint256",
            internalType: "uint256",
          },
        ],
      },
      { name: "prover", type: "address", internalType: "address" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "crosschainVerifiedUsdAmount",
    inputs: [{ name: "", type: "address", internalType: "address" }],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "invoiceClaimed",
    inputs: [{ name: "", type: "bytes32", internalType: "bytes32" }],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "owner",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "registerBusinessInvoiceProver",
    inputs: [{ name: "prover", type: "address", internalType: "address" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "verifier",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "contract IProofVerifier",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "verifyBinanceFunds",
    inputs: [
      {
        name: "proof",
        type: "tuple",
        internalType: "struct Proof",
        components: [
          {
            name: "seal",
            type: "tuple",
            internalType: "struct Seal",
            components: [
              {
                name: "verifierSelector",
                type: "bytes4",
                internalType: "bytes4",
              },
              {
                name: "seal",
                type: "bytes32[8]",
                internalType: "bytes32[8]",
              },
              {
                name: "mode",
                type: "uint8",
                internalType: "enum ProofMode",
              },
            ],
          },
          {
            name: "callGuestId",
            type: "bytes32",
            internalType: "bytes32",
          },
          { name: "length", type: "uint256", internalType: "uint256" },
          {
            name: "callAssumptions",
            type: "tuple",
            internalType: "struct CallAssumptions",
            components: [
              {
                name: "proverContractAddress",
                type: "address",
                internalType: "address",
              },
              {
                name: "functionSelector",
                type: "bytes4",
                internalType: "bytes4",
              },
              {
                name: "settleChainId",
                type: "uint256",
                internalType: "uint256",
              },
              {
                name: "settleBlockNumber",
                type: "uint256",
                internalType: "uint256",
              },
              {
                name: "settleBlockHash",
                type: "bytes32",
                internalType: "bytes32",
              },
            ],
          },
        ],
      },
      { name: "account", type: "address", internalType: "address" },
      { name: "usdAmount", type: "uint256", internalType: "uint256" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "verifyBybitFunds",
    inputs: [
      {
        name: "proof",
        type: "tuple",
        internalType: "struct Proof",
        components: [
          {
            name: "seal",
            type: "tuple",
            internalType: "struct Seal",
            components: [
              {
                name: "verifierSelector",
                type: "bytes4",
                internalType: "bytes4",
              },
              {
                name: "seal",
                type: "bytes32[8]",
                internalType: "bytes32[8]",
              },
              {
                name: "mode",
                type: "uint8",
                internalType: "enum ProofMode",
              },
            ],
          },
          {
            name: "callGuestId",
            type: "bytes32",
            internalType: "bytes32",
          },
          { name: "length", type: "uint256", internalType: "uint256" },
          {
            name: "callAssumptions",
            type: "tuple",
            internalType: "struct CallAssumptions",
            components: [
              {
                name: "proverContractAddress",
                type: "address",
                internalType: "address",
              },
              {
                name: "functionSelector",
                type: "bytes4",
                internalType: "bytes4",
              },
              {
                name: "settleChainId",
                type: "uint256",
                internalType: "uint256",
              },
              {
                name: "settleBlockNumber",
                type: "uint256",
                internalType: "uint256",
              },
              {
                name: "settleBlockHash",
                type: "bytes32",
                internalType: "bytes32",
              },
            ],
          },
        ],
      },
      { name: "account", type: "address", internalType: "address" },
      { name: "usdAmount", type: "uint256", internalType: "uint256" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "verifyCrosschainBalance",
    inputs: [
      { name: "account", type: "address", internalType: "address" },
      { name: "usdAmount", type: "uint256", internalType: "uint256" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "event",
    name: "BinanceFundsVerified",
    inputs: [
      {
        name: "account",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "usdAmount",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "BybitFundsVerified",
    inputs: [
      {
        name: "account",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "usdAmount",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "CrosschainWalletBalanceVerified",
    inputs: [
      {
        name: "account",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "usdAmount",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "VerifiedInvoice",
    inputs: [
      {
        name: "bodyHash",
        type: "bytes32",
        indexed: true,
        internalType: "bytes32",
      },
      {
        name: "account",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "usdAmount",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  { type: "error", name: "InvalidChainId", inputs: [] },
];

export const CASH_OUT_PROVER_ADDRESS =
  "0x9Fdd1aBd04EfB20dfcB96F104a478Cff4070c6a2";

export const CASH_OUT_VERIFIER_ADDRESS =
  "0x30759F7Ea3f39E8d4C05ACC238f39e91353Dc048";

export const CASH_OUT_ADDRESS = "0x9b7a42bFE8f8Df9d43f368Baf9480fB7193Cf06a";

export const TOKEN_ADDRESSES = {
  31: {
    RIF: "0x19f64674D8a5b4e652319F5e239EFd3bc969a1FE",
    USDC: "0x08AC2b69feB202b34aD7c65E5Ac876E901CA6216",
  },
  84532: {
    USDC: "0x4393eD225A2F48C27eA6CeBec139190cb8EA8A5F",
    WBTC: "0x8611bbb8395d3333622A9D65dcaB2e4b1fE644b5",
    LINK: "0xE4aB69C077896252FAFBD49EFD26B5D171A32410",
  },
  11155420: {
    USDC: "0x5fd84259d66Cd46123540766Be93DFE6D43130D7",
    WBTC: "0xC14b762bD6b4C7f40bB06E5613d0C2A1cB0f7E9c",
    LINK: "0x35BFcbcFEb65db335e65256690677eF26fE8da88",
  },
};

export const TWITTER_WEB_PROVER_ADDRESS =
  "0x513F5406f1C40874f3c0cD078E606897DC29F67b";
