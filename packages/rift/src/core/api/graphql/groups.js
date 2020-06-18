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
				gravatar
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
				gravatar
			}
			lists {
				master
			}
		}
	}
`;

export const GROUPS_MEMBER_OF = gql`
	{
		memberOfGroups {
			gids
			data {
				gid
				name
				creator_oauth_id
				gravatar
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
				gravatar
				creator_oauth_id
			}
			lists {
				master
			}
		}
	}
`;

export const JOIN = gql`
	mutation Join($gid: Int!) {
		join(gid: $gid) {
			success
			payload {
				members {
					uids
				}
				group {
					gid
					name
				}
			}
			error
		}
	}
`;
export async function join(gid = 1) {
	try {
		const res = await client.mutation({
			mutation: JOIN,
			variables: { gid }
		});
		return groupMembersData(res);
	} catch (e) {
		console.error(e);
		return e;
	}
}
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

export async function getGroupsMemberOf() {
	try {
		const res = await client.query({
			query: GROUPS_MEMBER_OF
		});
		return myGroupsData(res);
	} catch (e) {
		console.error(e);
		return e;
	}
}

export function myGroupsData(raw) {
	const { data, gids } = raw.data.memberOfGroups;

	return { data, lists: { memberOf: gids } };
}
