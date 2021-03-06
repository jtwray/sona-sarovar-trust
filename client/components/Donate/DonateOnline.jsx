import React, {Component} from 'react';
import {isEmail, isFloat, isNumeric, isMobilePhone} from 'validator';
import PropTypes from 'prop-types';
import axios from 'axios';

const checkIfInputCanBeNumber = value => {
  return isFloat(value) || (value.endsWith('.') && isFloat(value + '0'));
};

class DonateOnline extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tentativeAmount: '',
      amount: '',
      amountError: '',
      name: '',
      nameError: '',
      email: '',
      emailError: '',
      contactNumber: '',
      contactNumberError: '',
      redirecting: false
    };

    this.updateName = this.updateName.bind(this);
    this.updateEmail = this.updateEmail.bind(this);
    this.updateContactNumber = this.updateContactNumber.bind(this);
    this.updateAmount = this.updateAmount.bind(this);
    this.updateTentativeAmount = this.updateTentativeAmount.bind(this);
    this.donate = this.donate.bind(this);
  }

  updateTentativeAmount(e) {
    const value = e.target.value;
    if (checkIfInputCanBeNumber(value) || value === '') {
      this.setState({tentativeAmount: value});
    }
  }

  updateName(e) {
    this.setState({name: e.target.value});
  }

  updateEmail(e) {
    this.setState({email: e.target.value});
  }

  updateContactNumber(e) {
    const value = e.target.value;
    if (isNumeric(value) || value === '') {
      this.setState({contactNumber: value});
    }
  }

  donate(e) {
    e.preventDefault();
    if (!this.validate()) return;

    this.setState({redirecting: true});

    axios.post('/api/payment/start', {
      amount: this.state.amount,
      purpose: 'SonaSarovarDonation',
      buyer_name: this.state.name,
      email: this.state.email,
      phone: this.state.contactNumber,
      redirect_url: window.location.href + '/done'
    }).then(res => {
      const {paymentRequestUrl} = res.data;
      window.location = paymentRequestUrl;
    }).catch(e => {
      console.log(e);
    });
  }

  updateAmount(e) {
    this.setState({amount: e.target.value});
  }

  clearValidation() {
    this.setState({
      nameError: '',
      emailError: '',
      amountError: '',
      contactNumberError: ''
    });
  }

  validate() {
    this.clearValidation();

    const {amount, name, email, contactNumber} = this.state;

    if (!amount) {
      this.setState({amountError: 'Amount cannot be empty.'});
      return false;
    }

    if (!isFloat(amount)) {
      this.setState({amountError: 'Must be a number.'});
      return false;
    }

    if (Number(amount) < 9) {
      this.setState({amountError: 'Must be at least ₹9.'});
      return false;
    }

    if (!name) {
      this.setState({nameError: 'Name cannot be empty.'});
      return false;
    }

    if (!email) {
      this.setState({emailError: 'Email cannot be empty.'});
      return false;
    }

    if (!isEmail(email)) {
      this.setState({emailError: 'Must be a valid email.'});
      return false;
    }

    if (!contactNumber) {
      this.setState({contactNumberError: 'Contact Number cannot be empty.'});
      return false;
    }

    if (!isNumeric(contactNumber)) {
      this.setState({contactNumberError: 'Contact Number must be a number.'});
      return false;
    }

    if (!isMobilePhone(contactNumber, 'en-IN')) {
      this.setState({contactNumberError: 'Must be a valid mobile phone number.'});
      return false;
    }

    return true;
  }

  render() {
    return (
      <DonateOnlineView
        {...this.state}
        updateName={this.updateName}
        updateEmail={this.updateEmail}
        updateContactNumber={this.updateContactNumber}
        updateAmount={this.updateAmount}
        updateTentativeAmount={this.updateTentativeAmount}
        donate={this.donate}
      />
    );
  }
}


const DonateOnlineView = ({
  donate,
  tentativeAmount, updateTentativeAmount,
  amount, amountError, name, nameError, email, emailError,
  contactNumber, contactNumberError,
  updateName, updateEmail, updateContactNumber,
  updateAmount, redirecting
}) => (
  <div className="donate-online">
    <h1>Donate Online</h1>
    <div className="page-content">
      <div className="donation-amount-form">
        <div className="donate-piggy">
          <img alt="" src="/static/img/donate.png" />
        </div>

        <div className="input-field">
          <div className="label">
            <label htmlFor="donation-amount">DONATE ANY AMOUNT</label>
          </div>
          <div className="input">
            <input
              className={`${amountError ? 'input-error' : ''}`}
              value={tentativeAmount}
              onChange={updateTentativeAmount}
              onBlur={updateAmount}
              id="donation-amount"
              type="text"
            />
          </div>
          <div className={`error ${amountError ? 'show' : ''}`}>
            <span>{amountError}</span>
          </div>
        </div>
      </div>

      <div className="donor-info-form">
        <form>
          <h4>YOUR DONATION AMOUNT</h4>
          <h2>₹ {amount || 0}</h2>

          <div className="input">
            <input
              value={name}
              onChange={updateName}
              className="small-input"
              type="text"
              placeholder="Name *"
            />
          </div>

          <div className={`error ${nameError ? 'show' : ''}`}>
            <span>{nameError}</span>
          </div>

          <div className="input">
            <input
              value={email}
              onChange={updateEmail}
              className="small-input"
              type="text"
              placeholder="Email Address *"
            />
          </div>

          <div className={`error ${emailError ? 'show' : ''}`}>
            <span>{emailError}</span>
          </div>

          <div className="input">
            <input
              value={contactNumber}
              onChange={updateContactNumber}
              className="small-input"
              type="text"
              placeholder="Contact Number *"
            />
          </div>

          <div className={`error ${contactNumberError ? 'show' : ''}`}>
            <span>{contactNumberError}</span>
          </div>

          <div className="button-holder">
            <button onClick={donate} className="button">
              <span>Donate Now</span>
              <i
                style={{display: redirecting ? 'initial' : 'none'}}
                className="fa fa-spinner fa-spin"
              />
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
);

DonateOnlineView.propTypes = {
  donate: PropTypes.func.isRequired,
  tentativeAmount: PropTypes.string.isRequired,
  updateTentativeAmount: PropTypes.func.isRequired,
  amount: PropTypes.string.isRequired,
  amountError: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  nameError: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  emailError: PropTypes.string.isRequired,
  contactNumber: PropTypes.string.isRequired,
  contactNumberError: PropTypes.string.isRequired,
  updateName: PropTypes.func.isRequired,
  updateEmail: PropTypes.func.isRequired,
  updateContactNumber: PropTypes.func.isRequired,
  updateAmount: PropTypes.func.isRequired,
  redirecting: PropTypes.bool.isRequired
};

export default DonateOnline;
