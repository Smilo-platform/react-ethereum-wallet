import React, { Component } from 'react';
import { connect } from 'react-redux';

import shortid from 'shortid';

import compose from 'recompose/compose';
import { withStyles } from '@material-ui/core/styles';

import { Identicon } from 'ethereum-react-components';
import * as Actions from '../../actions/actions';
import { displayPriceFormatter } from '../../utils/utils';
import { combineWallets, sortByBalance } from '../../utils/helperFunctions';

const styles = theme => ({
  keyIcon: {
    width: '3%',
    display: 'inline-block',
    WebkitTransform: 'rotate(45deg)',
    MozTransform: 'rotate(45deg)',
    MsTransform: 'rotate(45deg)',
    OTransform: 'rotate(45deg)',
    transform: 'rotate(45deg)',
  },
});

export class WalletDropdown extends Component {
  constructor(props) {
    super(props);

    const { Wallets, WalletContracts } = this.props.reducers;
    const WalletsCombined = combineWallets(Wallets, WalletContracts);

    this.state = {
      Wallets: WalletsCombined,
      fromWallet: WalletsCombined[0].address,
      dropdownConfig: this.props.dropdownConfig,
    };
    this.props.updateMainDCF({
      name: 'MainOwnerAddress',
      value: this.state.fromWallet,
    });
    // let msc = this.props.reducers.DeployContractForm.multiSigContract;
    const owners = this.props.reducers.DeployContractForm.multiSigContract
      .owners;
    owners[0] = this.state.fromWallet;
    const obj = {
      ...this.props.reducers.DeployContractForm.multiSigContract,
      MainOwnerAddress: this.state.fromWallet,
      owners,
    };
    this.props.updateDeployContractForm(obj);
    this.chooseWallet = this.chooseWallet.bind(this);
  }

  // shouldComponentUpdate(prevProps, prevState) {
  //   if(this.props.disabled !== prevProps.disabled) {
  //     return true;
  //   }
  //   if(this.props.fromWallet !== prevProps.fromWallet) {
  //     return true;
  //   }
  //   return false;
  // }

  chooseWallet(e) {
    this.setState({ fromWallet: e.target.value });

    if (this.state.dropdownConfig.component === 'deployToken') {
      this.props.returnDeployTokenAddress(e);
    }

    if (this.state.dropdownConfig.component === 'Send') {
      this.props.updateTransactionToSend({
        name: e.target.getAttribute('name'),
        value: e.target.value,
      });
      return;
    }

    if (this.state.dropdownConfig.component === 'DeployContractForm') {
      this.props.updateMainDCF({
        name: 'MainOwnerAddress',
        value: e.target.value,
      });

      // let msc = this.props.reducers.DeployContractForm.multiSigContract;
      const owners = this.props.reducers.DeployContractForm.multiSigContract
        .owners;
      owners[0] = e.target.value;
      const obj = {
        ...this.props.reducers.DeployContractForm.multiSigContract,
        MainOwnerAddress: e.target.value,
        owners,
      };
      this.props.updateDeployContractForm(obj);
      return;
    }

    if (this.state.dropdownConfig.component === 'ExecuteFunctions') {
      this.props.updateExecutingWallet({
        name: 'executingWallet',
        value: e.target.value,
      });
    }
  }

  render() {
    const wallets = this.state.Wallets;
    const config = this.state.dropdownConfig;
    return (
      <React.Fragment>
        <select
          className={config.selectClassName}
          name={config.selectName}
          onChange={e => this.chooseWallet(e)}
          value={this.state.fromWallet}
          disabled={this.props.disabled}
        >
          {wallets.map(w => {
            return (
              <option key={shortid.generate()} value={w.address}>
                {w.addressType === 'walletAddress' ? '🔑 ' : null}
                {Number(
                  displayPriceFormatter(this.props, w.balance, 'ETHER')
                ).toFixed(2)}
                &nbsp; - &nbsp; ETHER
              </option>
            );
          })}
        </select>
        <Identicon
          classes="dapp-identicon dapp-small"
          title
          size="small"
          address={this.state.fromWallet}
        />
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  ...state,
});

export default compose(
  withStyles(styles, { name: 'WalletDropdown' }),
  connect(
    mapStateToProps,
    { ...Actions }
  )
)(WalletDropdown);
