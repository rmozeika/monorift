import Link from 'next/link'
import { connect } from 'react-redux'
import { StyleSheet, Text, View } from 'react-native'
// import { Button } from 'react-native-elements'

function Page ({
  error,
  lastUpdate,
  light,
  linkTo,
  NavigateTo,
  config,
  title,
  user
}) {
  return (
    <div>
      <h1>{title}</h1>
      <Text accessibilityRole='header'>
        React Native for Web & Next.js
      </Text>
      {/* <Button title={"hello"}></Button> */}
    </div>
  )
}

export default connect(state => state)(Page)
