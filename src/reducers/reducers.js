export const initialState = {
  displayAlertMessage: false,
  alertKey: 'alert_20171104-hidden',
  peerCountIntervalId: null,
  currency: 'ETHER',
  totalBalance: 0.0,
  Wallets: {},
  ObservedContracts: {},
  ObservedTokens: {},
  CustomContracts: {},
  Transactions: {},
  WalletContracts: {},
  PendingConfirmations: {},
  ContractsPendingConfirmations: {},
  Events: {},
  Tokens: {},
  peerCount: 0,
  blockHeader: 0,
  timeSinceLastBlock: 0,
  network: '',
  provider: '',
  modals: {
    displayWatchContract: false,
    displayWatchToken: false,
    displayDeleteToken: false,
    displaySendTransaction: false,
    displayTransaction: false,
    displayJSONInterface: false,
    displayQRCode: false,
    displayEventInfo: false,
  },
  ContractToWatch: {},
  TokenToWatch: {},
  TokenToDelete: '',
  GasStats: {},
  TransactionToSend: {},
  globalNotification: {
    display: false,
  },
  DeployContractForm: {
    simpleChecked: true,
    multisigChecked: false,
    importWalletChecked: false,
    importWalletAddress: '',
    multiSigContract: {
      ownerCount: 3,
      confirmationAddressesRequired: 1,
      dailyLimitAmount: 10,
      MainOwnerAddress: '',
      owners: [],
    },
  },
  balancesAutoScanChecked: 0,
  errorsAutoScanReceived: 0,
  SelectedEvent: {},
  qrCode: '',
  JSONInterface: '',
  SelectedFunction: {},
  Web3Initializer: {},
};

export const reducers = (state = initialState, action) => {
  switch (action.type) {
    case 'UPDATE_OBSERVED_CONTRACT_NAME':
      return {
        ...state,
        ObservedContracts: {
          ...state.ObservedContracts,
          [action.payload.address]: {
            ...state.ObservedContracts[action.payload.address],
            name: action.payload.name,
          },
        },
        // TODO: testing update logs for selectedContract

        selectedContract: {
          ...state.selectedContract,
          name: action.payload.name,
        },
        // selectedContract: {
        //   ...state.ObservedContracts,
        //   [action.payload.address]: {
        //     ...state.ObservedContracts[action.payload.address],
        //     name: action.payload.name,
        //   }
        // },
      };
    case 'UPDATE_WALLET_CONTRACT_NAME':
      return {
        ...state,
        WalletContracts: {
          ...state.WalletContracts,
          [action.payload.address]: {
            ...state.WalletContracts[action.payload.address],
            name: action.payload.name,
          },
        },
        selectedContract: {
          ...state.selectedContract,
          name: action.payload.name,
        },
        // selectedContract: {
        //   ...state.WalletContracts,
        //   [action.payload.address]: {
        //     ...state.WalletContracts[action.payload.address],
        //     name: action.payload.name,
        //   }
        // },
      };
    case 'UPDATE_ADDRESS_NAME':
      return {
        ...state,
        Wallets: {
          ...state.Wallets,
          [action.payload.address]: {
            ...state.Wallets[action.payload.address],
            name: action.payload.name,
          },
        },
        selectedWallet: {
          ...state.selectedWallet,
          name: action.payload.name,
        },
      };
    case 'UPDATE_TOKEN_TO_SEND':
      return {
        ...state,
        TransactionToSend: {
          ...state.TransactionToSend,
          sendToken: action.payload.sendToken,
          tokenToSend: action.payload.tokenToSend,
        },
      };
    case 'UPDATE_CONTRACT_TOKEN_BALANCE':
      return {
        ...state,
        WalletContracts: {
          ...state.WalletContracts,
          [action.payload.account]: {
            ...state.WalletContracts[action.payload.account],
            tokens: {
              ...state.WalletContracts[action.payload.account].tokens,
              [action.payload.tokenAddress]: action.payload.value,
            },
          },
        },
      };
    case 'UPDATE_ACCOUNT_TOKEN_BALANCE':
      return {
        ...state,
        Wallets: {
          ...state.Wallets,
          [action.payload.account]: {
            ...state.Wallets[action.payload.account],
            tokens: {
              ...state.Wallets[action.payload.account].tokens,
              [action.payload.tokenAddress]: action.payload.value,
            },
          },
        },
      };
    case 'SET_ETHEREUM_PROVIDER_CONFIG':
      return {
        ...state,
        Web3Initializer: action.payload,
      };
    case 'UPDATE_WALLET_CONTRACT':
      return {
        ...state,
        WalletContracts: Object.assign({}, state.WalletContracts, {
          [action.payload.name]: action.payload.value,
        }),
      };
    case 'DELETE_PENDING_CONTRACT':
      return {
        ...state,
        ContractsPendingConfirmations: Object.assign(
          {},
          ...Object.entries(state.ContractsPendingConfirmations)
            .filter(([k]) => k !== action.payload)
            .map(([k, v]) => ({ [k]: v }))
        ),
      };
    case 'UPDATE_PENDING_CONTRACTS':
      return {
        ...state,
        ContractsPendingConfirmations: Object.assign(
          {},
          state.ContractsPendingConfirmations,
          {
            [action.payload.name]: action.payload.value,
          }
        ),
      };

    case 'UPDATE_INITIAL_DEPLOYED_CONTRACT_METHOD_OUTPUTS':
      return {
        ...state,
        WalletContracts: {
          ...state.WalletContracts,
          [action.payload.contractAddress]: {
            ...state.WalletContracts[action.payload.contractAddress],
            contractConstants: state.WalletContracts[
              action.payload.contractAddress
            ].contractConstants.map((item, ind) => {
              if (item.name === action.payload.name) {
                return {
                  ...item,
                  outputs: [...action.payload.value],
                };
              }
              return item;
            }),
          },
        },
        // TODO: testing update logs for selectedContract
      };

    case 'UPDATE_INITIAL_OBSERVED_CONTRACT_METHOD_OUTPUTS':
      return {
        ...state,
        ObservedContracts: {
          ...state.ObservedContracts,
          [action.payload.contractAddress]: {
            ...state.ObservedContracts[action.payload.contractAddress],
            contractConstants: state.ObservedContracts[
              action.payload.contractAddress
            ].contractConstants.map((item, ind) => {
              if (item.name === action.payload.name) {
                return {
                  ...item,
                  outputs: [...action.payload.value],
                };
              }
              return item;
            }),
          },
        },
        // TODO: testing update logs for selectedContract
      };
    case 'UPDATE_FUNCTION_INPUT':
      return {
        ...state,
        selectedFunction: {
          ...state.selectedFunction,
          inputs: state.selectedFunction.inputs.map((item, ind) => {
            if (parseInt(action.payload.index, 10) === ind) {
              return {
                ...item,
                value: action.payload.value,
              };
            }
            return item;
          }),
        },
      };
    case 'UPDATE_EXECUTING_WALLET':
      return {
        ...state,
        selectedFunction: Object.assign({}, state.selectedFunction, {
          [action.payload.name]: action.payload.value,
        }),
      };
    case 'EMPTY_SELECTED_FUNCTION':
      return {
        ...state,
        selectedFunction: Object.assign({}, {}),
      };
    case 'UPDATE_SELECTED_FUNCTION':
      return {
        ...state,
        selectedFunction: { ...action.payload },
      };
    case 'UPDATE_JSON_INTERFACE':
      return {
        ...state,
        JSONInterface: action.payload,
      };
    case 'UPDATE_QR_CODE':
      return {
        ...state,
        qrCode: action.payload,
      };

    case 'UPDATE_SELECTED_EVENT':
      return {
        ...state,
        SelectedEvent: action.payload,
      };

    case 'ADD_DEPLOYED_CONTRACT_FUNCTIONS':
      return {
        ...state,
        WalletContracts: {
          ...state.WalletContracts,
          [action.payload.address]: {
            ...state.WalletContracts[action.payload.address],
            [action.payload.name]: action.payload.value,
          },
        },
        // TODO: testing
        selectedContract: {
          ...state.selectedContract,
          [action.payload.name]: action.payload.value,
        },
      };
    case 'ADD_DEPLOYED_CONTRACT_CONSTANTS':
      return {
        ...state,
        WalletContracts: {
          ...state.WalletContracts,
          [action.payload.address]: {
            ...state.WalletContracts[action.payload.address],
            [action.payload.name]: action.payload.value,
          },
        },
        // TODO: testing
        selectedContract: {
          ...state.selectedContract,
          [action.payload.name]: action.payload.value,
        },
      };

    case 'ADD_OBSERVED_CONTRACT_FUNCTIONS':
      return {
        ...state,
        ObservedContracts: {
          ...state.ObservedContracts,
          [action.payload.address]: {
            ...state.ObservedContracts[action.payload.address],
            [action.payload.name]: action.payload.value,
          },
        },
        // TODO: testing
        selectedContract: {
          ...state.selectedContract,
          [action.payload.name]: action.payload.value,
        },
      };
    case 'ADD_OBSERVED_CONTRACT_CONSTANTS':
      return {
        ...state,
        ObservedContracts: {
          ...state.ObservedContracts,
          [action.payload.address]: {
            ...state.ObservedContracts[action.payload.address],
            [action.payload.name]: action.payload.value,
          },
        },
        // TODO: testing
        selectedContract: {
          ...state.selectedContract,
          [action.payload.name]: action.payload.value,
        },
      };
    case 'UPDATE_PAST_CONTRACT_LOGS':
      return {
        ...state,
        ObservedContracts: {
          ...state.ObservedContracts,
          [action.payload.address]: {
            ...state.ObservedContracts[action.payload.address],
            logs: [
              ...state.ObservedContracts[action.payload.address].logs,
              action.payload,
            ],
          },
        },
        // TODO: testing update logs for selectedContract
      };
    case 'ADD_PAST_CONTRACT_LOGS':
      return {
        ...state,
        ObservedContracts: {
          ...state.ObservedContracts,
          [action.payload.address]: {
            ...state.ObservedContracts[action.payload.address],
            logs: action.payload,
          },
        },
        // TODO: testing update logs for selectedContract
      };
    case 'UPDATE_BALANCE_CHECKED':
      return {
        ...state,
        balancesAutoScanChecked: action.payload,
      };
    case 'UPDATE_ERR_CHECKED':
      return {
        ...state,
        errorsAutoScanReceived: action.payload,
      };
    case 'UPDATE_DCF_RADIO':
      return {
        ...state,
        DeployContractForm: Object.assign(
          {},
          state.DeployContractForm,
          action.payload
        ),
      };
    case 'UPDATE_MAIN_DCF': {
      return {
        ...state,
        DeployContractForm: Object.assign({}, state.DeployContractForm, {
          [action.payload.name]: action.payload.value,
        }),
      };
    }
    case 'UPDATE_MAIN_CONTRACT_ADDRESS': {
      return {
        ...state,
        DeployContractForm: Object.assign(
          {},
          state.DeployContractForm,
          action.payload
        ),
      };
    }
    case 'UPDATE_DEPLOY_CONTRACT_FORM':
      return {
        ...state,
        DeployContractForm: {
          ...state.DeployContractForm,
          multiSigContract: {
            ...action.payload,
          },
        },
      };
    case 'UPDATE_SELECTED_TRANSACTION':
      return {
        ...state,
        SelectedTransaction: action.payload,
      };
    case 'CLEAR_TRANSACTION_TO_SEND':
      return {
        ...state,
        TransactionToSend: {},
      };
    case 'UPDATE_TRANSACTION_CONFIRMATION':
      return {
        ...state,
        Transactions: {
          ...state.Transactions,
          [action.payload.name]: {
            ...state.Transactions[action.payload.name],
            confirmationNumber: action.payload.value,
          },
        },
      };
    case 'UPDATE_TRANSACTION':
      return {
        ...state,
        Transactions: {
          ...state.Transactions,
          [action.payload.name]: {
            ...state.Transactions[action.payload.name],
            ...action.payload.value,
          },
        },
      };
    case 'ADD_TRANSACTION':
      return {
        ...state,
        Transactions: Object.assign({}, state.Transactions, {
          [action.payload.hash]: action.payload.value,
        }),
      };
    case 'DISPLAY_GLOBAL_NOTIFICATION':
      return {
        ...state,
        globalNotification: Object.assign(
          {},
          state.globalNotification,
          action.payload
        ),
      };
    case 'UPDATE_TRANSACTION_TO_SEND':
      return {
        ...state,
        TransactionToSend: Object.assign({}, state.TransactionToSend, {
          [action.payload.name]: action.payload.value,
        }),
      };
    // case RECEIVED_GAS_ERROR:
    case 'RECEIVE_GAS_STATS':
      return {
        ...state,
        GasStats: Object.assign({}, action.payload),
      };
    case 'EMPTY_SELECTED_CONTRACT':
      return {
        ...state,
        selectedContract: '',
      };
    case 'SET_SELECTED_CONTRACT':
      return {
        ...state,
        selectedContract: action.payload,
      };
    case 'SET_TOKEN_TO_DELETE':
      return {
        ...state,
        TokenToDelete: action.payload,
      };
    case 'DELETE_TOKEN':
      return {
        ...state,
        ObservedTokens: Object.assign(
          {},
          ...Object.entries(state.ObservedTokens)
            .filter(([k]) => k !== action.payload)
            .map(([k, v]) => ({ [k]: v }))
        ),
        TokenToDelete: '',
      };
    case 'ADD_OBSERVED_TOKEN':
      // overwrites if already existed
      return {
        ...state,
        ObservedTokens: Object.assign({}, state.ObservedTokens, {
          [action.payload.address]: action.payload.value,
        }),
      };
    case 'CANCEL_TOKEN_TO_WATCH':
      return {
        ...state,
        TokenToWatch: {},
      };
    case 'UPDATE_TOKEN_TO_WATCH':
      return {
        ...state,
        TokenToWatch: Object.assign({}, state.TokenToWatch, {
          [action.payload.name]: action.payload.value,
        }),
      };
    case 'ADD_OBSERVED_CONTRACT':
      return {
        ...state,
        ObservedContracts: Object.assign(
          {},
          state.ObservedContracts,
          action.payload
        ),
      };
    case 'CANCEL_CONTRACT_TO_WATCH':
      return {
        ...state,
        ContractToWatch: {},
      };
    case 'UPDATE_CONTRACT_TO_WATCH':
      return {
        ...state,
        ContractToWatch: Object.assign({}, state.ContractToWatch, {
          [action.payload.name]: action.payload.value,
        }),
      };
    case 'CLOSE_MODAL':
      return {
        ...state,
        modals: Object.assign({}, ...state.modals, {
          [action.payload]: false,
        }),
      };
    case 'DISPLAY_MODAL':
      return {
        ...state,
        modals: Object.assign({}, ...state.modals, {
          [action.payload]: true,
        }),
      };
    case 'CREATE_INIT_WALLET_CONTRACT':
      return {
        ...state,
        Wallet: action.payload,
      };
    case 'UPDATE_EXCHANGE_RATES':
      return {
        ...state,
        exchangeRates: action.payload,
      };
    case 'UPDATE_ETHER_PRICES':
      return {
        ...state,
        prices: action.payload,
      };
    case 'EMPTY_SELECTED_WALLET':
      return {
        ...state,
        selectedWallet: '',
      };
    case 'SET_SELECTED_WALLET':
      return {
        ...state,
        selectedWallet: action.payload,
      };
    case 'UPDATE_DISPLAY_VALUE':
      return {
        ...state,
        displayValue: action.payload,
      };
    case 'UPDATE_TOTAL_BALANCE':
      return {
        ...state,
        totalBalance: action.payload,
      };
    // case 'SET_WALLETS':
    //   return {
    //     ...state,
    //     Wallets: Object.assign({}, state.Wallets, {
    //       [action.payload.account]: action.payload.balance,
    //     }),
    //   };
    // Wallets: {
    //       ...state.Wallets,
    //       [action.payload.account]: {
    //         ...state.Wallets[action.payload.account],
    //         balance: action.balance,
    //       },
    //     },

    case 'SET_WALLETS':
      return {
        ...state,
        Wallets: {
          ...state.Wallets,
          [action.payload.account]: {
            ...state.Wallets[action.payload.account],
            balance: action.payload.balance,
          },
        },
      };
    case 'UPDATE_PROVIDER':
      return {
        ...state,
        provider: action.payload,
      };
    case 'UPDATE_BLOCKHEADER':
      return {
        ...state,
        blockHeader: action.payload,
      };
    case 'UPDATE_PEERCOUNT':
      return {
        ...state,
        peerCount: action.payload,
      };
    case 'UPDATE_CURRENCY_UNIT':
      return {
        ...state,
        currency: action.payload,
      };
    case 'UPDATE_CONNECTED_NETWORK':
      return {
        ...state,
        network: action.payload,
      };
    default:
      return state;
  }
};

export default reducers;
