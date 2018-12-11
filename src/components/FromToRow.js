import React, { Component } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import WalletDropdown from '../components/elements/WalletDropdown.js';
import { updateTransactionToSend } from '../actions/actions.js';

import { Identicon } from 'ethereum-react-components';

import * as Utils from '../utils/utils.js';

import Web3 from 'web3';
let web3 = new Web3();

export class Send extends Component {
  //TODO replace fromWallet with the from field from reducer TransactionToSend
  constructor(props) {
    super(props);
    let defaultWallet;
    let wallets = this.props.Wallets;
    for (var prop in wallets) {
      defaultWallet = prop;
      break;
    }
    this.props.updateTransactionToSend({
      name: 'from',
      value: defaultWallet,
    });
    this.state = {
      fromWallet: defaultWallet,
      switchChecked: true,
      checkbox: false,
      standardFee: false,
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.checkIsAddress = this.checkIsAddress.bind(this);
  }
  handleInputChange(e) {
    // TODO:validate inputs here
    let target = e.target.getAttribute('name');
    let targetValue = e.target.value;

    if (target === 'value' && targetValue) {
      targetValue = web3.utils.toWei(targetValue, 'ETHER');
    }

    this.setState({ toAddress: targetValue });

    this.checkIsAddress();

    this.props.updateTransactionToSend({
      name: target,
      value: targetValue,
    });
  }

  checkIsAddress() {
    let isAddress =
      this.state.toAddress !== '' && this.state.toAddress !== undefined
        ? web3.utils.isAddress(this.state.toAddress)
        : this.state.toAddress !== '' || this.state.toAddress !== undefined
        ? null
        : false;
    this.setState({ toIsAddress: isAddress });
  }

  renderFrom() {
    let dropdownConfig = {
      component: 'Send',
      selectClassName: 'send-from',
      selectName: 'from',
    };
    return (
      <div className="col col-6 mobile-full from">
        <h3>From</h3>
        <div className="dapp-select-account send-from">
          <WalletDropdown dropdownConfig={dropdownConfig} />
        </div>
      </div>
    );
  }

  renderIcon() {
    return (
      <React.Fragment>
        {this.state.toIsAddress &&
        typeof this.state.toIsAddress === typeof true ? (
          <Identicon
            classes="dapp-identicon dapp-tiny"
            title
            size="tiny"
            seed={this.state.toAddress}
          />
        ) : this.state.toIsAddress === null ||
          this.state.toIsAddress === undefined ? null : (
          <i className="icon-shield" />
        )}
      </React.Fragment>
    );
  }

  renderTo() {
    let cn = require('classnames');
    let newClasses = cn({
      to: true,
      'dapp-error': this.state.toIsAddress === false,
    });
    return (
      <div className="col col-6 mobile-full">
        <h3>To</h3>
        <div className="dapp-address-input">
          <input
            type="text"
            name="to"
            placeholder="0x000000.."
            className={newClasses}
            autoFocus={true}
            // value={tx.to}
            onChange={e => this.handleInputChange(e)}
            onKeyUp={e => this.handleInputChange(e)}
          />
          {this.renderIcon()}
        </div>
      </div>
    );
  }

  render() {
    let dropdownConfig = {
      component: 'Send',
      selectClassName: 'send-from',
      selectName: 'from',
    };
    return (
      <div className="row clear from-to">
        {this.renderFrom()}
        {this.renderTo()}
        <div className="dapp-clear-fix" />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  TransactionToSend: state.reducers.TransactionToSend,
  Wallets: state.reducers.Wallets,
});

export default connect(
  mapStateToProps,
  { updateTransactionToSend }
)(Send);
