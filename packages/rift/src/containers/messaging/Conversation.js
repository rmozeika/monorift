import * as React from 'react';
import { StyleSheet } from 'react-native';
import { List } from '@ui-kitten/components';
import { connect } from 'react-redux';
import * as Actions from '@actions';
import * as UserSelectors from '@selectors/users';
import * as GroupSelectors from '@selectors/groups';
import { useQuery, useMutation } from '@apollo/client';
import ConversationFeed from './ConversationFeed';
import { FEED_QUERY, FEED_SUBSCRIPTION } from '@core/api/graphql/messages';
function Conversation({ type, id }) {
	const { subscribeToMore, data, fetchMore, ...result } = useQuery(FEED_QUERY, {
		variables: {
			id
			//   type: match.params.type.toUpperCase() || "TOP",
			//   offset: 0,
			//   limit: 10
		},
		fetchPolicy: 'cache-and-network'
	});

	return (
		<ConversationFeed
			entries={data.feed || []}
			onLoadMore={() =>
				fetchMore({
					variables: {
						offset: data.feed.length
					},
					updateQuery: (prev, { fetchMoreResult }) => {
						if (!fetchMoreResult) return prev;
						return Object.assign({}, prev, {
							feed: [...prev.feed, ...fetchMoreResult.feed]
						});
					}
				})
			}
			subscribeToNewMessages={() =>
				subscribeToMore({
					document: FEED_SUBSCRIPTION,
					variables: { lastId: id }
				})
			}
		/>
	);
}

export default Conversation;
