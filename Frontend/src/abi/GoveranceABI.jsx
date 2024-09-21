const abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_router",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_governanceChainSelector",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_governanceToken",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "InvalidLength",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidMessageSender",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "chainSelector",
        type: "uint256",
      },
    ],
    name: "InvalidPeer",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "router",
        type: "address",
      },
    ],
    name: "InvalidRouter",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "OwnableInvalidOwner",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "OwnableUnauthorizedAccount",
    type: "error",
  },
  {
    inputs: [],
    name: "RouterAddressCannotBeZero",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    inputs: [],
    name: "GovernanceChainSelector",
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
    inputs: [],
    name: "GovernanceToken",
    outputs: [
      {
        internalType: "contract IERC721",
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
        name: "_proposer",
        type: "address",
      },
      {
        internalType: "string",
        name: "_description",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "deadline_in_days",
        type: "uint256",
      },
    ],
    name: "createProposal",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "getAllProposals",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "id",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "proposer",
            type: "address",
          },
          {
            internalType: "string",
            name: "description",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "votesFor",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "votesAgainst",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "executed",
            type: "bool",
          },
          {
            internalType: "uint256",
            name: "deadline",
            type: "uint256",
          },
        ],
        internalType: "struct Governance.Proposal[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "chainSelector",
        type: "uint256",
      },
    ],
    name: "getPeer",
    outputs: [
      {
        components: [
          {
            internalType: "bytes32",
            name: "lower",
            type: "bytes32",
          },
          {
            internalType: "bytes32",
            name: "upper",
            type: "bytes32",
          },
        ],
        internalType: "struct bytes64",
        name: "",
        type: "tuple",
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
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "peers",
    outputs: [
      {
        internalType: "bytes32",
        name: "lower",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "upper",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "proposalCount",
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
    name: "proposals",
    outputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "proposer",
        type: "address",
      },
      {
        internalType: "string",
        name: "description",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "votesFor",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "votesAgainst",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "executed",
        type: "bool",
      },
      {
        internalType: "uint256",
        name: "deadline",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "blockNumber",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "sourceChainSelector",
            type: "uint256",
          },
          {
            components: [
              {
                internalType: "bytes32",
                name: "lower",
                type: "bytes32",
              },
              {
                internalType: "bytes32",
                name: "upper",
                type: "bytes32",
              },
            ],
            internalType: "struct bytes64",
            name: "sender",
            type: "tuple",
          },
          {
            internalType: "uint256",
            name: "destinationChainSelector",
            type: "uint256",
          },
          {
            components: [
              {
                internalType: "bytes32",
                name: "lower",
                type: "bytes32",
              },
              {
                internalType: "bytes32",
                name: "upper",
                type: "bytes32",
              },
            ],
            internalType: "struct bytes64",
            name: "receiver",
            type: "tuple",
          },
          {
            internalType: "bytes32",
            name: "hashedData",
            type: "bytes32",
          },
        ],
        internalType: "struct EquitoMessage",
        name: "message",
        type: "tuple",
      },
      {
        internalType: "bytes",
        name: "messageData",
        type: "bytes",
      },
    ],
    name: "receiveMessage",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256[]",
        name: "chainSelectors",
        type: "uint256[]",
      },
      {
        internalType: "address[]",
        name: "addresss",
        type: "address[]",
      },
    ],
    name: "setPeers",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256[]",
        name: "chainSelectors",
        type: "uint256[]",
      },
      {
        components: [
          {
            internalType: "bytes32",
            name: "lower",
            type: "bytes32",
          },
          {
            internalType: "bytes32",
            name: "upper",
            type: "bytes32",
          },
        ],
        internalType: "struct bytes64[]",
        name: "addresses",
        type: "tuple[]",
      },
    ],
    name: "setPeers",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "proposalId",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "isAcceptedProposal",
        type: "bool",
      },
    ],
    name: "vote",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "voteThreshold",
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
];
export default abi;
