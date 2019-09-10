import React from 'react'
import { connect } from 'react-redux'

// import { loadData, startClock, tickClock } from '../actions'
import { initConfig } from '../actions';

import Page from '../components/page'

class Index extends React.Component {
  static async getInitialProps (props) {
    const { store, isServer, req } = props.ctx
    const { api } = req;
    const { user = {} } = req;
    // store.dispatch(tickClock(isServer))
    // if (isServer) {
    //     const user = await api.repositories.users.findByUsername('darkness94')
        return { user, isServer }
      // return { isServer };
    // }
    // if (!store.getState().config) {
    //   store.dispatch(initConfig())
    // }

    // return { isServer }
  }

  componentDidMount () {
    // this.props.dispatch(startClock())
  }

  render () {
    return <Page user={this.props.user} title='Index Page' linkTo='/other' NavigateTo='Other Page' />
  }
}

export default connect()(Index)
