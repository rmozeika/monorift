module.exports = {
	$jsonSchema: {
		required: ['email', 'username', 'oauth_id'],
		properties: {
			email: {
				bsonType: 'string',
				description: 'must be a string and is required'
			},
			username: {
				bsonType: 'string',
				description: 'must be a string and is required'
			},
			oauth_id: {
				bsonType: 'string',
				description: 'id used globally: must be a string and is required'
			},
			src: {
				bsonType: 'object',
				required: [],
				properties: {
					firstname: { bsonType: 'string' },
					lastname: { bsonType: 'string' },
					// 'email': { bsonType: 'string' },
					displayName: { bsonType: 'string' },
					email: { bsonType: 'string' },
					gravatar: { bsonType: 'object' }
				}
			},
			mocked: {
				bsonType: 'boolean'
			},
			bit_id: {
				bsonType: 'integar'
			}
		}
	}
};
