import React from "react";
import { Input } from 'react-native-ui-kitten';
import { connect } from "react-redux";
import { StyleSheet, Text, ImageProps, Linking } from "react-native";
import {
  ThemeContext,
  ThemeContextType,
  ThemeKey,
  themes,
  ThemeStore,
  ThemeService,
} from '../core/themes';
import { originLink } from '../core/utils';
import { 
  withStyles,
  ThemedComponentProps,
  ThemeType,
  StyledComponentProps
 } from 'react-native-ui-kitten/theme';
import {
    Icon,
    TopNavigation,
    TopNavigationAction,
    TopNavigationActionProps,
    TopNavigationProps,
    IconProps
} from 'react-native-ui-kitten';
// his
interface Auth {
  loggedIn: boolean,
  user: User
}
interface User {
  displayName?: string,
  picture?: string,
  nickname?: boolean
}

interface NavBarProps {
  auth: Auth
}
  
type NavProps = NavBarProps & ThemedComponentProps;
  // ThemeService.select({'Eva Light': null}, "Eva Light")
  // const history = useHistory();

class NavBar extends React.Component<NavProps, {}> {

    private renderSigninIcon = (style): React.ReactElement<ImageProps> => {
      const { themedStyle } = this.props;
      // const { signinButton } = themedStyle;
      return (
        <Icon name='sign-in-alt' style={{...style }} solid />
      );
    }
    private renderSignoutIcon = (style): React.ReactElement<ImageProps> => {
      return (
        <Icon name='sign-out-alt' style={{...style }} solid />
      )
    }
    private renderMenuIcon = (style): React.ReactElement<ImageProps> => {
      const { themedStyle } = this.props;
      return (
        <Icon name='bars' style={{...style }} solid />
      );
    }

    private onSignin(): void {
      Linking.openURL(originLink('login')).catch((err) => {
        debugger;
        console.error('An error occurred', err);
      })
    }
    // private onTiffany(): void {
    //   // Linking.openURL(originLink('login')).catch((err) => {
    //   //   debugger;
    //   //   console.error('An error occurred', err);
    //   // })
    //   // history.push('/tiffany');
    // }
    private onSignout(): void {
      Linking.openURL(originLink('logout')).catch((err) => {
        debugger
        console.error('An error occurred', err);
      });
    }
    private openMenu(): void {
      // Linking.openURL(window.location.origin + '/auth/logout').catch((err) => console.error('An error occurred', err))
    }
    private renderLeftControls(): React.ReactElement<TopNavigationActionProps> {
      const { themedStyle, auth } = this.props;
      let icon = this.renderMenuIcon;
      let onPress = this.openMenu;
      if (!auth.loggedIn) {
        icon = this.renderSigninIcon;
        onPress = this.onSignin
      }
      return (
        <TopNavigationAction 
            icon={icon}
            style={themedStyle.action}
            onPress={onPress}
          />
      )
      
    } 
    private renderRightControls(): React.ReactElement<TopNavigationActionProps> {
      const { themedStyle, auth } = this.props;
      // if (!auth.loggedIn) return;
      const icon = this.renderSignoutIcon;
      const onPress = this.onSignout;
      return (
        <TopNavigationAction
          icon={icon}
          onPress={onPress}
          style={themedStyle.action}
        />
      )
    }
  
    public render(): React.ReactNode {
          const { themedStyle, auth } = this.props;
          const { user } = auth;
          const title = auth.loggedIn ? `Welcome ${user.nickname}` : 'Sign in'
          return (
              <TopNavigation
                  // style={themedStyle.container}
                  title={title}
                  // subtitle='Subtitle'
                  leftControl={this.renderLeftControls()}
                  rightControls={this.renderRightControls()}
                  // titleStyle={styles.title}
                  // subtitleStyle={styles.subtitle}
              />
          );
      }
}

const mapStateToProps = state => {
    return {
      auth: state.auth
    }
}
const styles = StyleSheet.create({
    topNavigation: { backgroundColor: '#1A2138' },
    title: { color: '#EDF1F7' },
    subtitle: { color: '#C5CEE0' },
  });

// const mapDispatchToProps = (dispatch, ownProps) => {
//     return {
//       initCode: ({ name, code }) => {
//         dispatch(setCode({ name, code}));
//       }
//     };
//   };
export const NavBarWithStyles = withStyles(NavBar, (theme: ThemeType) => ({
  signinButton: { backgroundColor: theme['color-primary-100'] },
  icons: { backgroundColor: theme['color-primary-100'] },
  container: { backgroundColor: '#1A2138' },
  action: { marginHorizontal: 4 }
}));

export default connect(mapStateToProps, {})(NavBarWithStyles);
