// import Sound from 'react-sound';
import * as React from 'react';
import { Layout, Text, Button, styled } from 'react-native-ui-kitten';

class Audio extends React.Component {
    constructor(props) {
        debugger;
        super(props);
        this.audioRef = React.createRef();
        // this.audioRef2 = React.createRef();

    }
    render() {
        const { props, audioRef } = this;
        const { connName } = props;
        return (
            <Layout>
                <audio id={`audio-${connName}`} controls autoplay ref={audioRef}></audio>
            </Layout>
        );
    }
}

export default Audio;
// export class Audio2 extends React.Component {
//     constructor(props) {
//         super(props);
//     }
//     render() {
//         const { ref }
//         return (
//             <Layout>
//                 <audio id="audio-conn2" controls autoplay ref=()></audio>
//             </Layout>
//         );
//     }
// }
