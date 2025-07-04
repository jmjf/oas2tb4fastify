export const testInvalid_ParamErrorsRouteOptions = {
	url: '/testINVALID_ParamErrors/:authorization',
	method: 'GET',
	operationId: 'testINVALID_ParamErrors',
	schema: {
		params: { type: 'object', properties: { Authorization: { type: 'number' }, objectParam: { type: 'string' } } },
		querystring: { type: 'object', properties: {}, additionalProperties: false },
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
