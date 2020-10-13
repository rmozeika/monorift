import * as React from 'react';
import { Button } from '@ui-kitten/components';
import { useMutation } from '@apollo/client';
import {
	JOIN,
	GROUPS_MEMBER_OF,
	GROUP_MEMBERS_ONLY_IDS
} from '@core/api/graphql/groups';
function JoinButton({ gid }) {
	const [join] = useMutation(JOIN, {
		refetchQueries: [
			{
				query: GROUP_MEMBERS_ONLY_IDS,
				variables: { gid: gid }
			},
			{
				query: GROUPS_MEMBER_OF
				// variables: { gid: gid }
			}
		]
	});
	//, {
	// update(cache, { data: res }) {
	//     const { data } = cache.readQuery({ query: GROUPS_MEMBER_OF });
	//     data.memberOfGroups.gids = [ ...data.memberOfGroups.gids, gid ];
	// 	cache.writeQuery({
	// 		query: GROUPS_MEMBER_OF,
	// 		data
	// 	});
	//}
	//});
	return (
		<Button
			onPress={() => {
				const vars = {
					variables: { gid }
				};
				console.log(vars);
				join(vars);
				return;
			}}
			status={'success'}
		>
			Join
		</Button>
	);
}

export default JoinButton;
