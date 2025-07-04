export const testRefParametersQueryAndHeaderRouteOptions = {
	url: '/testRefParametersQueryAndHeader',
	method: 'GET',
	operationId: 'testRefParametersQueryAndHeader',
	tags: ['Users', 'Other'],
	schema: {
		headers: { type: 'object', properties: { 'x-test-header': { type: 'string' } } },
		querystring: {
			type: 'object',
			properties: {
				userId: { type: 'number', minimum: 1 },
				userNm: { type: 'string', minLength: 3 },
				inline: { type: 'string', minLength: 1 },
			},
			required: ['userId', 'userNm'],
			additionalProperties: false,
		},
		response: {
			'200': {
				content: {
					'application/json': {
						schema: {
							type: 'array',
							items: {
								type: 'object',
								properties: {
									userId: { type: 'number', minimum: 1 },
									userNm: { type: 'string', minLength: 3 },
									emailAddrTx: { type: 'string', format: 'email' },
									'x-dashes': { type: 'string' },
									$100ok: { type: 'string' },
									x𒐗: { type: 'number' },
									testBoolean: { type: 'boolean' },
									testUnionType: { type: ['string', 'number', 'null', 'object', 'array'] },
								},
							},
						},
					},
				},
				headers: { 'x-test-header': { schema: { type: 'string' } } },
			},
			'4xx': {},
		},
	},
};
