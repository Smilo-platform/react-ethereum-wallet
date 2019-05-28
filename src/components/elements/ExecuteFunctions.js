import React, { Component } from 'react';
import { connect } from 'react-redux';
import shortid from 'shortid';
import Inputs from './inputs/Inputs';
import WalletDropdown from './WalletDropdown';
import * as Helpers from '../../utils/helperFunctions';
import * as Actions from '../../actions/actions';

export class ExecuteFunctions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...this.props,
      executingWallet: this.props.reducers.Wallets[0],
      // chosenFunction: 'Pick A Function'
    };
    this.chooseFunction = this.chooseFunction.bind(this);
    this.chooseWallet = this.chooseWallet.bind(this);
    this.executeContractFunction = this.executeContractFunction.bind(this);
  }

  chooseFunction(e) {
    const contract = this.state.reducers.selectedContract.contract;
    const functions = this.state.reducers.ObservedContracts[contract.address];
    if (e.target.value === 'pickFunctionDefault') {
      this.setState({ chosenFunction: 'Pick A Function' });
      this.props.emptySelectedFunction({});
      return;
    }
    const func = functions.contractFunctions[e.target.selectedIndex - 1];
    if (func.name === e.target.value) {
      func.contractAddress = contract.address;
      this.setState({ chosenFunction: e.target.value });
      this.props.updateSelectedFunction(func);
    } else {
      // TODO: global
      /*
      Transaction sent in green
      Returned error: authentication needed: password or unlock
      */
    }
  }

  chooseWallet(e) {
    this.setState({ executingWallet: e.target.value });
    this.props.updateExecutingWallet({
      name: 'executingWallet',
      value: e.target.value,
    });
  }

  executeContractFunction(e) {
    const web3 = this.props.web3 ? this.props.web3.web3Instance : null;
    if (!web3) {
      return;
    }
    const BN = web3.utils.BN;
    const contractInfo = this.props.reducers.selectedContract.contract;
    const jsonInterface = contractInfo.jsonInterface;
    const funcName = this.props.selectedFunction.name;

    const inputs = this.props.selectedFunction.inputs.map(inp => {
      return inp.type.includes('int')
        ? new BN(web3.utils.toWei(inp.value.replace(',', '.')))
        : inp.value;
    });

    const execWallet = this.props.selectedFunction.executingWallet;
    const contract = new web3.eth.Contract(JSON.parse(jsonInterface));
    contract.options.address = contractInfo.contractAddress;

    try {
      contract.methods[funcName](...inputs)
        .send({
          from: execWallet,
        })
        .on('transactionHash', hash => {
          console.log('transactionHash', hash);
        })
        .on('confirmation', (confirmationNumber, receipt) => {
          console.log('confirmationNumber', confirmationNumber);
        })
        .on('receipt', receipt => {
          console.log('receipt', receipt);
        });
    } catch (err) {
      console.warn(err);
      this.props.displayGlobalNotification({
        display: true,
        type: 'error',
        msg: err,
      });
    }
  }

  renderAccountDropdown() {
    const dropdownConfig = {
      component: 'ExecuteFunctions',
      selectClassName: '',
      selectName: 'dapp-select-account',
    };
    return (
      <div className="dapp-select-account">
        <WalletDropdown dropdownConfig={dropdownConfig} />
      </div>
    );
  }

  // snapshotted
  renderSelectFunction() {
    const contract = this.state.reducers.selectedContract.contract;
    const functions = this.state.reducers.ObservedContracts[contract.address]
      .contractFunctions;
    return (
      <React.Fragment>
        <h2>Write to contract</h2>
        <h4>Select Function</h4>
        <select
          className="select-contract-function"
          name="select-contract-function"
          onChange={e => this.chooseFunction(e)}
          defaultValue="Pick A Function"
          value={this.state.chosenFunction}
        >
          <option
            key={shortid.generate()}
            disabled=""
            name="pickFunctionDefault"
            defaultValue="Pick A Function"
            value="pickFunctionDefault"
          >
            Pick a function
          </option>
          {functions
            ? functions.map((c, i) => (
                <option key={shortid.generate()} value={c.name}>
                  {Helpers.toSentence(c.name, true)}
                </option>
              ))
            : ''}
        </select>
      </React.Fragment>
    );
  }

  // snapshotted
  renderFunctionInputs() {
    const contract = this.props.reducers.selectedContract.contract;
    const selectedFunction = this.props.reducers.selectedFunction;
    const inputs =
      selectedFunction !== undefined ? selectedFunction.inputs : [];
    return (
      <React.Fragment>
        {inputs
          ? inputs.map((input, index) => (
              <React.Fragment key={shortid.generate()}>
                <h4>
                  {Helpers.toSentence(input.name)}
                  &nbsp;
                  <em>- {input.type}</em>
                </h4>
                <Inputs data={input} index={index} />
              </React.Fragment>
            ))
          : null}
      </React.Fragment>
    );
  }

  renderIsExecutable() {
    const executable = this.props.reducers.selectedFunction
      ? this.props.reducers.selectedFunction
      : {};
    const bool =
      Object.keys(executable).length === 0 && executable.constructor === Object;
    return (
      <React.Fragment>
        {!bool ? (
          <React.Fragment>
            <hr className="dapp-clear-fix" />
            <h4> Execute from </h4>
            {this.renderAccountDropdown()}
            <button
              className="dapp-block-button execute"
              onClick={e => this.executeContractFunction(e)}
            >
              Execute
            </button>
          </React.Fragment>
        ) : null}
      </React.Fragment>
    );
  }

  render() {
    return (
      <div className="col col-4 mobile-full contract-functions">
        {this.renderSelectFunction()}
        {this.renderFunctionInputs()}
        {this.renderIsExecutable()}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  ...state,
  contract: state.reducers.contract,
  ObservedContracts: state.reducers.ObservedContracts,
  selectedFunction: state.reducers.selectedFunction,
  selectedContract: state.reducers.selectedContract,
  showContractFunctions: state.reducers.showContractFunctions,
  Wallets: state.reducers.Wallets,
});

export default connect(
  mapStateToProps,
  { ...Actions }
)(ExecuteFunctions);
