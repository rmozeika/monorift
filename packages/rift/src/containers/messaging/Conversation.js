import * as React from 'react';
import { StyleSheet } from 'react-native';
import { List } from '@ui-kitten/components';
import { connect } from 'react-redux';
import * as Actions from '@actions';
import * as UserSelectors from '@selectors/users';
import * as GroupSelectors from '@selectors/groups';
import { useQuery, useMutation } from '@apollo/react-hooks';
import ConversationFeed from './ConversationFeed';
import { FEED_QUERY } from '@core/api/graphql/messages';
function Conversation({ type, id }) {
	const { data, fetchMore } = useQuery(FEED_QUERY, {
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
		/>
	);
}

export default Conversation;
