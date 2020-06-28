export const FEED_QUERY = gql`
	query($id: Int) {
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
