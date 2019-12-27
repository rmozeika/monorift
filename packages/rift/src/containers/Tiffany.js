import React, { Component } from 'react'
import { Layout, Text, Button, styled, withStyles, Input } from 'react-native-ui-kitten';
import { connect } from 'react-redux';
import { StyleSheet, Linking, Platform, ScrollView } from 'react-native';
import RICIBs from 'react-individual-character-input-boxes';
import { tiffany } from '../actions';
import styledComponents from 'styled-components/native'
import { Fireworks } from 'fireworks/lib/react';

const { SET_ANSWER } = tiffany;
const Actions = { setAnswer: tiffany.setAnswer, SET_ANSWER };
const styles = StyleSheet.create({
	container: {
		flex: 1,
		// padding: 16,
		// flexDirection: 'row',
        alignItems: 'center',
        height: '100%',
        overflowX: 'scroll'
	},
	row: {
		// flex: 1
        //backgroundColor: 'red',
        width: '100%',
        padding: 15,
        backgroundColor: 'transparent'
	},
	bigBlue: {
		//backgroundColor: 'blue',
		flexGrow: 5
    },
    button: {
        margin: 8,
        // color: 'black'
    },
    // buttonText: {
    //     // color: 'black'
    // },
	video: {
		backgroundColor: 'blue',
		width: 200,
		height: 200
    },
    text: {
        margin: 8,
        textAlign: 'center'
    },
    inputOne: {
        width: '40px',
        margin: 4,
        overflow: 'hidden'
    },
    questionOneRow: {
        flexDirection: 'row',
        justifyContent: 'center'
    },
    textStyle: {
        width: '15px'
    },
    scrollView: {
        height: '50px'
    }
});
class Tiffany extends React.Component {
     constructor(props) {
        super(props);
        this.inputOneRef = React.createRef();
        this.inputTwoRef = React.createRef();
        this.bottomScroll = React.createRef();
     }
     handleOutput(event) {
         console.log(event);
     }
     scrollToBottom() {
        this.bottomScroll.scrollIntoView({ behavior: "smooth" });
      }
      
     onPress(event) {
         window.location = 'https://youtu.be/Kgjkth6BRRY?t=153';
         console.log(event);
     }
     setValue(question, text) {
         const { setAnswer } = this.props;
         setAnswer(question, text);
         debugger;
         if (question == '1' && text['1']) {
             this.inputTwoRef.current.focus();
         }
     }
     componentDidUpdate() {
        //  if (this.bottomScroll.current) {
        //      setTimeout(() => {
        //         this.bottomScroll.current.scrollToEnd({animated: true}) ;

        //      }, 500);
        //  }
     }
    render() {
        const { style, themedStyle, answers, ...restProps } = this.props;
        const trueStyle = (type, additional) => {
            const sty = styles[type] || {};
            const themed = themedStyle[type] || {};
            const add = (additional) ? styles[additional] : {};
            return StyleSheet.flatten([ themed, sty, add ]);
            // return { ...styles[type], ...themedStyle[type] };
        };
        const repeatNa = (num) => {
            let val = '';
            var i;
            for (i = 0; i < num; i++) {
                val += 'na';
            }
            // for (i = 0; i < num; i++) {
            //     text += "The number is " + i + "<br>";
            //   }
            return val;
        };
        const ans2 = answers['2'];
        let repeatedNa;
        if ( ans2 && typeof ans2.value == 'number') {
            // repeatNa(ans2);
            repeatedNa = repeatNa(ans2.value);
        }
        let fxProps = {
            count: 3,
            interval: 200,
            colors: ['#cc3333', '#4CAF50', '#81C784'],
            calc: (props, i) => ({
              ...props,
              x: (i + 1) * (window.innerWidth / 3) - (i + 1) * 100,
              y: 200 + Math.random() * 100 - 50 + (i === 2 ? -80 : 0)
            })
          };
         
        const question2 = (
            <React.Fragment>
                <Layout style={trueStyle('row')}>
                        <Text style={trueStyle('text')} category='h2'>What is the smallest positive integer that occurs infinitely often as the difference of two primes? </Text>
                        <Text style={trueStyle('text')} category='h2'>Too hard? Just quess!</Text>
                        <Text style={trueStyle('text')} category='h2'>That number will connect that many NA's together. eg. 1 = na, 3 = nanana</Text>

                </Layout>
                <Layout style={trueStyle('row')}>
                    <Input
                        placeholder='Place your Text'
                        onChangeText={ (text) => { return this.setValue('2', text); } }
                        keyboardType='number-pad'
                    />
                </Layout>
                <Layout style={trueStyle('row')}>
                        <Text style={trueStyle('text')} category='h3'>{repeatedNa} </Text>
                </Layout>
            </React.Fragment>
        );
        const question3 = (
            <React.Fragment>
                <Layout style={trueStyle('row')}>
                        <Text style={trueStyle('text')} category='h2'>How does a black man say 'Hi'? </Text>
                </Layout>
                <Layout style={trueStyle('row')}>
                    <Input
                        placeholder='Place your Text'
                        onChangeText={ (text) => { return this.setValue('3', text); } }
                    />
                </Layout>
            </React.Fragment>
        );
        const nextQuestions = () => {
            const arr = [];
            if (answers['1'].correct == true) {
                arr.push(question2);
            }
            if (answers['2'].correct == true) {
                arr.push(question3);
            }
            const ans3 = answers['3'];
            let onCompletedAnswers = '';
            if ( ans3&& ans3.value && typeof ans3.value == 'string' && /yo/i.test(ans3.value)) {
            onCompletedAnswers = (
                <Layout style={trueStyle('row')}>
                    <Text style={trueStyle('text')} category='h1'>NOW PUT IT TOGETHER!!! </Text>
                    <Fireworks {...fxProps} />
                    <Layout style={trueStyle('row')}>
                        <Button
                            appearance='filled'
                            status='basic'
                            style={styles.button}
                            textStyle={trueStyle('buttonText')}
                            onPress={this.onPress}
                        >
                            WINNERS CLICK HERE
                        </Button>
                    </Layout>
                </Layout>
            );
            arr.push(onCompletedAnswers);
        }
            return arr;
        };
        const toMap = nextQuestions();
        
        return (
            <Layout style={trueStyle('container')}>
                <Layout style={trueStyle('row')}>
                    <Text style={trueStyle('text')} category='h2'>Hello, my love. I've always been told its the thought that counts. So here's all my thoughts! Hope you aren't salty its late </Text>
                </Layout>
                <Layout style={trueStyle('row')}>
                    <Text style={trueStyle('text')} category='h2'>What is a metal that is commonly combined with an electrolyte? </Text>
                </Layout>
                <Layout style={trueStyle('row', 'questionOneRow')}>
                    <Input
                        placeholder='F'
                        onChangeText={ (text) => { return this.setValue('1', { [1]: text }); } }
                        maxLength={1}
                        textAlign={'center'}
                        style={styles.inputOne}
                        textStyle={styles.textStyle}
                        ref={this.inputOneRef}
                    />
                    <Input
                        placeholder='e'
                        onChangeText={ (text) => { return this.setValue('1', { [2]: text }); } } 
                        maxLength={1}
                        textAlign={'center'}
                        style={styles.inputOne}
                        textStyle={styles.textStyle}
                        ref={this.inputTwoRef}

                    />
                </Layout>
                <Layout style={trueStyle('row')}>
                    <Text style={trueStyle('text')} category='h6'>Fe, that's iron, but the answer isn't!</Text>
                </Layout>
                {toMap}
            </Layout>
        );
    }
}
const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		setAnswer: (question, answer) => dispatch(Actions.setAnswer(question, answer)),
		
	};
};
const mapStateToProps = (state, ownProps) => {
	
	return {
		answers: state.tiffany.answers
	};
};
const backgroundKey = 'color-primary-500';
const themedTiffany = withStyles(Tiffany, (theme) => ({
    row: {
        //backgroundColor: theme['color-primary-default'],
        //textColor: theme['text-basic-color']
        //color: theme['text-alternate-color']
        //backgroundColor: theme[backgroundKey]
        theme: theme['color-primary-transparent']

    },
    container: {
        backgroundColor: theme[backgroundKey]
    },
    text: {
        //backgroundColor: theme[backgroundKey],

        color: theme['text-alternate-color']
    },
    buttonText: {
        color: theme[backgroundKey]
    }
    // button: {
    //     // backGroundColor: theme['color-info-100'],
    //     // color: theme[backgroundKey]
    // }
}));
export default connect(mapStateToProps, mapDispatchToProps)(themedTiffany);