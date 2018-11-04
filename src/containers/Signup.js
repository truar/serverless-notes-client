import React, { Component } from "react";
import {
    Alert,
  HelpBlock,
  FormGroup,
  FormControl,
  ControlLabel
} from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import "./Signup.css";
import { Auth } from "aws-amplify";

export default class Signup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      email: "",
      password: "",
      confirmPassword: "",
      confirmationCode: "",
      userAlreadyExists: false,
      resendSignUp: false,
      newUser: null
    };
  }

  userAlreadyExists() {
      return this.state.userAlreadyExists === true;
  }

  error() {
      if(this.state.userAlreadyExists === true) {
          return "error";
      }
      return null;
  }

  isSignupResent() {
      return this.state.resendSignUp;
  }

  validateForm() {
    return (
      this.state.email.length > 0 &&
      this.state.password.length > 0 &&
      this.state.password === this.state.confirmPassword
    );
  }

  validateConfirmationForm() {
    return this.state.confirmationCode.length > 0;
  }

  handleChange = event => {
        let userAlreadyExists = this.state.userAlreadyExists;
        if(event.target.id === 'email') {
            userAlreadyExists = false;
        }
    this.setState({
      [event.target.id]: event.target.value,
      userAlreadyExists: userAlreadyExists
    });
  }

  handleClick = async event => {
    event.preventDefault();

    try {
        await Auth.resendSignUp(this.state.email);
        this.setState({ resendSignUp: true });
    } catch (e) {
        alert(e);
    }
  }

  handleSubmit = async event => {
    event.preventDefault();
  
    this.setState({ isLoading: true });
  
    try {
      const newUser = await Auth.signUp({
        username: this.state.email,
        password: this.state.password
      });
      this.setState({
        newUser
      });
    } catch (e) {
        if(e.code === 'UsernameExistsException') {
            this.state.userAlreadyExists = true;
        } else {
            alert(e.message);
        }
    }
  
    this.setState({ isLoading: false });
  }
  
  handleConfirmationSubmit = async event => {
    event.preventDefault();
  
    this.setState({ isLoading: true });
  
    try {
      await Auth.confirmSignUp(this.state.email, this.state.confirmationCode);
      await Auth.signIn(this.state.email, this.state.password);
  
      this.props.userHasAuthenticated(true);
      this.props.history.push("/");
    } catch (e) {
        alert(e);
      this.setState({ isLoading: false });
    }
  }

  renderConfirmationForm() {
    return (
      <form onSubmit={this.handleConfirmationSubmit}>
        { this.state.resendSignUp && 
            <Alert bsStyle="info">
                <strong>Confirmation code resent!</strong> Check out your emails
            </Alert>
        }
        <FormGroup controlId="confirmationCode" bsSize="large">
          <ControlLabel>Confirmation Code</ControlLabel>
          <FormControl
            autoFocus
            type="tel"
            value={this.state.confirmationCode}
            onChange={this.handleChange}
          />
          <HelpBlock>Please check your email for the code.</HelpBlock>
          <HelpBlock>You didn't receive the email ? <a onClick={this.handleClick}>Ask for a new code</a></HelpBlock>
        </FormGroup>
        <LoaderButton
          block
          bsSize="large"
          disabled={!this.validateConfirmationForm()}
          type="submit"
          isLoading={this.state.isLoading}
          text="Verify"
          loadingText="Verifying…"
        />
      </form>
    );
  }

  renderForm() {
    return (
      <form onSubmit={this.handleSubmit}>
        <FormGroup controlId="email" bsSize="large" validationState={this.error()}>
          <ControlLabel>{ this.userAlreadyExists() === true ? 'Email already in used!' : 'Email' }</ControlLabel>
          <FormControl
            autoFocus
            type="email"
            value={this.state.email}
            onChange={this.handleChange}
          />
        </FormGroup>
        <FormGroup controlId="password" bsSize="large">
          <ControlLabel>Password</ControlLabel>
          <FormControl
            value={this.state.password}
            onChange={this.handleChange}
            type="password"
          />
        </FormGroup>
        <FormGroup controlId="confirmPassword" bsSize="large">
          <ControlLabel>Confirm Password</ControlLabel>
          <FormControl
            value={this.state.confirmPassword}
            onChange={this.handleChange}
            type="password"
          />
        </FormGroup>
        <LoaderButton
          block
          bsSize="large"
          disabled={!this.validateForm()}
          type="submit"
          isLoading={this.state.isLoading}
          text="Signup"
          loadingText="Signing up…"
        />
      </form>
    );
  }

  render() {
    return (
      <div className="Signup">
        {this.state.newUser === null
          ? this.renderForm()
          : this.renderConfirmationForm()}
      </div>
    );
  }
}