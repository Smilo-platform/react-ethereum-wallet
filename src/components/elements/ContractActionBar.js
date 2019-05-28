import React, { Component } from 'react';
import { connect } from 'react-redux';

import { CopyToClipboard } from 'react-copy-to-clipboard';

import ActionBarItem from './ActionBarItem';

import {
  displayGlobalNotification,
  updateQRCode,
  displayModal,
  updateJSON,
} from '../../actions/actions';

export class ContractActionBar extends Component {
  displayCopiedNotification(e) {
    e.preventDefault();
    this.props.displayGlobalNotification({
      display: true,
      type: 'info',
      msg: 'Copied to clipboad',
    });
  }

  displayAndSetQRCode(e) {
    this.props.updateQRCode(this.props.contract.address);
    this.props.displayModal('displayQRCode');
  }

  displayAndSetJSON(e) {
    this.props.updateJSON(this.props.contract.jsonInterface);
    this.props.displayModal('displayJSONInterface');
  }

  render() {
    const address = this.props.contract.address;
    const transferEtherAddress = `/send/${address}`;
    const etherScanAddress = `https://etherscan.io/address/${address}`;
    return (
      <aside className="dapp-actionbar">
        <nav>
          <ul>
            <ActionBarItem
              href={transferEtherAddress}
              title={address}
              icon="icon-arrow-down"
              text=" Transfer Ether &amp; Tokens"
            />
            <ActionBarItem
              href={etherScanAddress}
              icon="icon-info"
              text="View on Etherscan"
            />
            <CopyToClipboard text={address}>
              <li>
                <button
                  className="copy-to-clipboard-button"
                  onClick={e => this.displayCopiedNotification(e)}
                >
                  <i className="icon-docs" />
                  Copy address
                </button>
              </li>
            </CopyToClipboard>
            <li>
              <button
                className="qrcode-button"
                onClick={e => this.displayAndSetQRCode(e)}
              >
                <i className="icon-camera" />
                Show QR-Code
              </button>
            </li>
            <li>
              <button
                className="interface-button"
                onClick={e => this.displayAndSetJSON('displayJSONInterface')}
              >
                <i className="icon-settings" />
                Show Interface
              </button>
            </li>
          </ul>
        </nav>
      </aside>
    );
  }
}
const mapStateToProps = state => {
  return state;
};

export default connect(
  mapStateToProps,
  {
    displayGlobalNotification,
    updateQRCode,
    displayModal,
    updateJSON,
  }
)(ContractActionBar);
