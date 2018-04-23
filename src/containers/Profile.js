import React, { Fragment } from "react";
import { AsyncStorage, StyleSheet, Text, View } from "react-native";
import { Query, Mutation } from "react-apollo";
import gql from "graphql-tag";
import { Button } from "react-native-elements";
import FormTextInput from "../components/form/FormTextInput";
import {
  FONT_REG,
  FONT_BOLD,
  OFF_BLACK,
  BROWN,
  LIGHT_BROWN,
} from "../styles/common";

const TOKEN_KEY = "@CoolBeansApp:userAuthToken";

export class AuthLoading extends React.Component {
  static navigationOptions = {
    header: null,
  };

  async componentDidMount() {
    const { navigation } = this.props;
    let token = await AsyncStorage.getItem(TOKEN_KEY);
    if (token === null) {
      navigation.navigate("SignIn");
    } else {
      navigation.navigate("Profile");
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Auth Loading...</Text>
      </View>
    );
  }
}

export class Profile extends React.Component {
  static navigationOptions = {
    header: null,
  };

  render() {
    const GET_PROFILE = gql`
      {
        userProfile {
          email
          created_at
        }
      }
    `;
    return (
      <View style={styles.container}>
        <Text>My profile</Text>
        <Query query={GET_PROFILE}>
          {({ loading, error, data }) => {
            if (loading) return <Text>Loading</Text>;
            if (error) return <Text>Error :(</Text>;
            return (
              <React.Fragment>
                <Text>Email: {data.userProfile.email}</Text>
                <Text>Created: {data.userProfile.created_at}</Text>
              </React.Fragment>
            );
          }}
        </Query>
        <Button
          title="Log out"
          buttonStyle={styles.buttonStyle}
          onPress={async () => {
            await AsyncStorage.removeItem(TOKEN_KEY);
            this.props.navigation.navigate("AuthLoading");
          }}
        />
      </View>
    );
  }
}

export class SignUp extends React.Component {
  static navigationOptions = {
    header: null,
  };

  state = {
    email: "",
    password: "",
  };

  render() {
    const SIGNUP_MUTATION = gql`
      mutation SignupUser($email: String!, $password: String!) {
        signupUser(email: $email, password: $password) {
          jwt
        }
      }
    `;
    return (
      <View style={styles.formContainer}>
        <FormTextInput
          label="email"
          placeholder="me@coolbeans.io"
          autoCapitalize="none"
          value={this.state.email}
          onChange={email => this.setState({ email })}
        />
        <FormTextInput
          label="password"
          type="password"
          value={this.state.password}
          placeholder="kittens1992"
          onChange={password => this.setState({ password })}
          secureTextEntry
        />
        <Mutation
          mutation={SIGNUP_MUTATION}
          onCompleted={async data => {
            const { jwt } = data.signupUser;
            this.props.navigation.navigate("Profile");
            await AsyncStorage.setItem(TOKEN_KEY, jwt);
          }}
        >
          {(loginUser, { loading, error }) => {
            let errorMsg = null;
            if (error) {
              errorMsg = (
                <View>
                  {error.graphQLErrors.map(({ message }, idx) => (
                    <Text key={idx}>{message}</Text>
                  ))}
                </View>
              );
            }
            return (
              <React.Fragment>
                <Button
                  title="Submit"
                  loading={!!loading}
                  textStyle={{
                    fontFamily: FONT_BOLD,
                    color: "white",
                  }}
                  buttonStyle={styles.submitButtonStyle}
                  onPress={() => {
                    let { email, password } = this.state;
                    loginUser({
                      variables: { email, password },
                    });
                  }}
                />
                {errorMsg}
              </React.Fragment>
            );
          }}
        </Mutation>
        <Button
          title="Already a user? Sign in here"
          textStyle={{ color: BROWN, fontFamily: FONT_REG }}
          buttonStyle={styles.signupButtonStyle}
          onPress={() => this.props.navigation.navigate("SignIn")}
        />
      </View>
    );
  }
}

export class SignIn extends React.Component {
  static navigationOptions = {
    header: null,
  };

  state = {
    email: "",
    password: "",
  };

  render() {
    const LOGIN_MUTATION = gql`
      mutation LoginUser($email: String!, $password: String!) {
        loginUser(email: $email, password: $password) {
          jwt
        }
      }
    `;
    return (
      <View style={styles.formContainer}>
        <FormTextInput
          label="email"
          placeholder="me@coolbeans.io"
          autoCapitalize="none"
          value={this.state.email}
          onChange={email => this.setState({ email })}
        />
        <FormTextInput
          label="password"
          type="password"
          value={this.state.password}
          placeholder="kittens1992"
          onChange={password => this.setState({ password })}
          secureTextEntry
        />
        <Mutation
          mutation={LOGIN_MUTATION}
          onCompleted={async data => {
            const { jwt } = data.loginUser;
            this.props.navigation.navigate("Profile");
            await AsyncStorage.setItem(TOKEN_KEY, jwt);
          }}
        >
          {(loginUser, { loading, error }) => {
            let errorMsg = null;
            if (error) {
              errorMsg = (
                <View>
                  {error.graphQLErrors.map(({ message }, idx) => (
                    <Text key={idx}>{message}</Text>
                  ))}
                </View>
              );
            }
            return (
              <React.Fragment>
                <Button
                  title="Submit"
                  loading={!!loading}
                  textStyle={{
                    fontFamily: FONT_BOLD,
                    color: "white",
                  }}
                  buttonStyle={styles.submitButtonStyle}
                  onPress={() => {
                    let { email, password } = this.state;
                    loginUser({
                      variables: { email, password },
                    });
                  }}
                />
                {errorMsg}
              </React.Fragment>
            );
          }}
        </Mutation>
        <Button
          title="Not a user yet? Sign up"
          textStyle={{ color: BROWN, fontFamily: FONT_REG }}
          buttonStyle={styles.signupButtonStyle}
          onPress={() => this.props.navigation.navigate("SignUp")}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  formContainer: {
    flex: 1,
    padding: 50,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  submitButtonStyle: {
    backgroundColor: BROWN,
    borderRadius: 5,
    marginTop: 20,
  },
  signupButtonStyle: {
    backgroundColor: "white",
    borderRadius: 5,
    marginTop: 20,
  },
});
