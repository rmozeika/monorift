import { Platform } from 'react-native';

export const originLink = () => {
    if (Platform.OS == 'web') { 
        return 'robertmozeika.com';//window.location.origin
    }
    return 'robertmozeika.com';
}