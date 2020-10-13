import * as React from 'react';
import { StyleSheet } from 'react-native';
import { List, Layout, Text } from '@ui-kitten/components';
import { connect } from 'react-redux';
import * as Actions from '@actions';
import * as UserSelectors from '@selectors/users';
import * as GroupSelectors from '@selectors/groups';
import { useQuery, useMutation } from '@apollo/client';
import Message from './Message';

function ConversationFeed({ messages }) {
	return (
		<Layout>
			{messages.forEach(message => (
				<Message message={message} />
			))}
		</Layout>
	);
}

export default ConversationFeed;
