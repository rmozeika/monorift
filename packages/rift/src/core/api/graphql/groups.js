import client from '../apollo';
import { gql } from '@apollo/client';
export const GROUP_MEMBERS = gql`
	query($gid: Int!) {
		groupMembers(gid: $gid) {
			group {
				gid
				name
			}
			members {
				uids
				users {
					oauth_id
					username
				}
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

export async function getGroupMembers(gid = 1) {
	try {
		const res = await client.query({
			query: GROUP_MEMBERS,
			variables: { gid }
		});
		return res;
	} catch (e) {
		console.error(e);
		return e;
	}
}

export async function getAllGroups(creator) {
	try {
		const res = await client.query({
			query: ALL_GROUPS
			//variables: { gid }
		});
		debugger; //remove
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
