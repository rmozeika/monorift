export const FEED_QUERY = gql`
	query MessageFeed($id: Int) {
		feed(id: $id) {
			group {
				gid
				name
				creator
				gravatar
			}
			members {
				uids
			}
		}
	}
`;

export const FEED_SUBSCRIPTION = gql`
	subscription MessageSubscription($id: Int, $lastId: String) {
		feedMessages(id: $id, lastId: $lastId) {
			messages {
				payload
			}
			lastId
		}
	}
`;
