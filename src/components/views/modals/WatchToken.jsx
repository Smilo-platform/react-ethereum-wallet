import React, { Component } from 'react';
import { connect } from 'react-redux';

import TestInputItem from '../../elements/TestInputItem.jsx';
import * as Actions from '../../../actions/actions.js';

const listInputs = [
  {
    title: 'Token Contract Address',
    divClass: 'dapp-address-input',
    editor: 'input',
    type: 'text',
    name: 'address',
    placeholder: '0x000000',
    className: 'token-address',
  },
  {
    title: 'Token name',
    divClass: 'dapp-token-name-input',
    editor: 'input',
    type: 'string',
    name: 'name',
    placeholder: 'Token name',
    className: 'name',
  },
  {
    title: 'Token symbol',
    divClass: 'dapp-token-symbol-input',
    editor: 'input',
    type: 'string',
    name: 'symbol',
    placeholder: 'Token symbol',
    className: 'symbol',
  },
];

class WatchToken extends Component {
  constructor(props) {
    super(props);
    this.handleOnKeyUp = this.handleOnKeyUp.bind(this);
    this.cancelFunction = this.cancelFunction.bind(this);
    this.submitFunction = this.submitFunction.bind(this);
  }

  shouldComponentUpdate(prevProps, prevState) {
    if (this.props.display !== prevProps.display) {
      return true;
    }
    return false;
  }

  handleOnKeyUp(e) {
    // TODO:validate inputs here
    this.props.updateTokenToWatch({
      name: e.target.getAttribute('name'),
      value: e.target.value,
    });
  }

  cancelFunction(e) {
    this.props.cancelTokenToWatch(); // TODO:reset data values in inputs
    this.props.closeModal('displayWatchToken');
  }

  submitFunction(e) {
    // let token = 'https://etherscan.io/address/0xe41d2489571d322189246dafa5ebde1f4699f498#code'
    let web3;
    let token = this.props.reducers.TokenToWatch;

    if (this.props.web3.web3Instance) {
      web3 = this.props.web3.web3Instance;

      // let newContract = new web3.eth.Contract(
      //   contract.jsonInterface,
      //   contract.address
      // );
      // let con = {};
      // con[contract['contract-name']] = contract;
      // this.props.addObservedContract(con);
    } else {
      // TODO:trigger global notification here
    }
    this.props.closeModal('displayWatchToken');
  }

  render() {
    let divStyle;
    if (!this.props.display) divStyle = { display: 'none' };

    var GeoPattern = require('geopattern');
    var pattern = GeoPattern.generate('0x000', { color: '#CCC6C6' });

    let iconStyle = { backgroundImage: pattern.toDataUrl() };

    return (
      <div className={this.props.display} style={divStyle}>
        <section className="dapp-modal-container modals-add-token">
          <h1>Add Token</h1>

          {listInputs.map((field, i) => (
            <TestInputItem
              key={`token-field-${i}`}
              field={field}
              onKeyUp={e => this.handleOnKeyUp(e)}
            />
          ))}

          <h3>Decimals places of smallest unit</h3>
          <input
            type="number"
            min="0"
            step="1"
            name="division"
            placeholder="2"
            className="decimals"
            onChange={e => this.handleOnKeyUp(e)}
          />
          <br />
          <h3>Preview</h3>
          <button className="wallet-box-tokens" style={iconStyle}>
            <h3 />
            <button className="delete-token">
              <i className="icon-trash" />
            </button>
            <span className="account-balance">
              0.00000000
              <span> </span>
            </span>
            <span className="account-id" />
          </button>

          <div className="dapp-modal-buttons">
            <button className="cancel" onClick={() => this.cancelFunction()}>
              Cancel
            </button>
            <button
              className="ok dapp-primary-button"
              onClick={() => this.submitFunction()}
            >
              OK
            </button>
          </div>
        </section>
      </div>
    );
  }
}
const mapStateToProps = state => {
  return state;
};

export default connect(
  mapStateToProps,
  { ...Actions }
)(WatchToken);