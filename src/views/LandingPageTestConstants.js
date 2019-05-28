export const providerConstants = {
  // Bluetooth: {
  //   disabled: false,
  //   image: 'mist-150x150.png',
  //   link: '',
  // },
  Geth: {
    disabled: false,
    image: 'smilo.jpg',
    link: 'https://github.com/ethereum/go-ethereum/releases',
  },
  Metamask: {
    disabled: false,
    image: 'metamask-icon.svg',
    link: 'https://metamask.io/',
  },
  Infura: {
    disabled: false,
    image: 'infura-icon.jpeg',
    link: 'https://infura.io/',
  },
  Ganache: {
    disabled: false,
    image: 'ganache-icon.png',
    link: 'https://truffleframework.com/docs/ganache/quickstart',
  },
};

export const networks = {
  MainNet: {
    disabled: false,
    type: 'PoA / Clique',
  },
  Testnet: {
    set provider(prov) {
      this.selectedProvider = prov;
    },
    get disabled() {
      return this.selectedProvider === 'Parity';
    },
    type: 'PoA / Clique',
  },
};
