import { Platform } from 'react-native';

export const originLink = (type) => {
    const paths {
        login: '/auth/login',
        logout: '/auth/logout'
    };
    let path = paths[type];
    let host = 'robertmozeika.com'
    return `${host}${path}`
    // if (Platform.OS == 'web') {
    // }

    // return 'robertmozeika.com';
}