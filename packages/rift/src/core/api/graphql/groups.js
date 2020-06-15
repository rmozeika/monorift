import client from '../apollo';
import { gql } from '@apollo/client';
// export const GROUP_MEMBERS = gql`
// 	query($gid: Int!) {
// 		groupMembers(gid: $gid) {
// 			group {
// 				gid
// 				name
// 			}
// 			members {
// 				uids
// 				users {
// 					oauth_id
// 					username
// 				}
// 			}
// 		}
// 	}
// `;

export const GROUP_MEMBERS_ONLY_IDS = gql`
	query($gid: Int) {
		groupMembers(gid: $gid) {
			group {
				gid
				name
				creator
			}
			members {
				oauth_ids
			}
		}
	}
`;

export const GROUPS = gql`
	query($creator: Int) {
		groups(creator: $creator) {
			data {
				gid
				name
				creator_oauth_id
			}
			lists {
				master
			}
		}
	}
`;

export const ALL_GROUPS = gql`
	{
		groups {
			data {
				gid
				name
			}
			lists {
				master
			}
		}
	}
`;
export async function getGroupMembersIds(gid = 1) {
	try {
		const res = await client.query({
			query: GROUP_MEMBERS_ONLY_IDS,
			variables: { gid }
		});
		return groupMembersData(res);
	} catch (e) {
		console.error(e);
		return e;
	}
}
export function groupMembersData(raw) {
	const { group, members } = raw.data.groupMembers;
	return {
		gid: group.gid,
		group,
		members: members.oauth_ids
	};
}
// export async function getGroupMembers(gid = 1) {
// 	try {
// 		const res = await client.query({
// 			query: GROUP_MEMBERS,
// 			variables: { gid }
// 		});
// 		return res;
// 	} catch (e) {
// 		console.error(e);
// 		return e;
// 	}
// }

export async function getAllGroups(creator) {
	try {
		const res = await client.query({
			query: ALL_GROUPS
			//variables: { gid }
		});
		return allGroupsData(res);
	} catch (e) {
		console.error(e);
		return e;
	}
}
export function allGroupsData(raw) {
	const { data, lists } = raw.data.groups;

	return { data, lists };
}
