import React from 'react';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router';
import SelectNode from 'components/SelectNode';
import CreatePassword from 'components/CreatePassword';
import Splash from 'components/Splash';
import { cryptoActions } from 'modules/crypto';
import { AppState } from 'store/reducers';

interface StateProps {
  password: AppState['crypto']['password'];
}

interface DispatchProps {
  generateSalt: typeof cryptoActions['generateSalt'];
  setPassword: typeof cryptoActions['setPassword'];
}

type Props = StateProps & DispatchProps & RouteComponentProps;

enum STEP {
  SPLASH = 'SPLASH',
  NODE = 'NODE',
  PASSWORD = 'PASSWORD',
}

interface State {
  step: STEP;
}

class OnboardingPage extends React.Component<Props, State> {
  state: State = {
    step: STEP.SPLASH,
  };

  componentDidMount() {
    this.props.generateSalt();
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.password !== this.props.password) {
      this.props.history.replace('/');
    }
  }

  render() {
    const { step } = this.state;
    switch (step) {
      case STEP.SPLASH:
        return <Splash handleContinue={() => this.changeStep(STEP.NODE)} />;
      case STEP.NODE:
        return <SelectNode onConfirmNode={() => this.changeStep(STEP.PASSWORD)} />;
      case STEP.PASSWORD:
        return <CreatePassword onCreatePassword={this.props.setPassword} />;
    }
  }

  private changeStep = (step: STEP) => {
    this.setState({ step });
  };
}

const ConnectedOnboardingPage = connect<StateProps, DispatchProps, {}, AppState>(
  state => ({
    password: state.crypto.password,
  }),
  {
    generateSalt: cryptoActions.generateSalt,
    setPassword: cryptoActions.setPassword,
  },
)(OnboardingPage);

export default withRouter(ConnectedOnboardingPage);
