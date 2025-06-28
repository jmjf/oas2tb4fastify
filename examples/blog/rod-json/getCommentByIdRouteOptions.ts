export const getCommentByIdRouteOptions = {
	url: '/comments/:commentId/:testParam',
	method: 'GET',
	operationId: 'getCommentById',
	tags: ['Other'],
	schema: {
		params: {
			type: 'object',
			properties: { commentId: { type: 'number', minimum: 1 }, testParam: { type: 'string' } },
			required: ['commentId'],
		},
		response: {
			'200': {
				content: {
					'application/json': {
						schema: {
							type: 'object',
							properties: {
								commentId: { type: 'number', minimum: 1 },
								commentTx: { type: 'string', minLength: 1, maxLength: 256 },
								commenter: {
									type: 'object',
									properties: {
										userId: { type: 'number', minimum: 1 },
										userNm: { type: 'string', minLength: 3 },
										emailAddrTx: { type: 'string', format: 'email' },
										'x-dashes': { type: 'string' },
										$100ok: { type: 'string' },
										x𒐗: { type: 'number' },
									},
								},
							},
						},
					},
					'application/xml': {
						schema: {
							type: 'object',
							properties: {
								commentId: { type: 'number', minimum: 1 },
								commentTx: { type: 'string', minLength: 1, maxLength: 256 },
								commenter: {
									type: 'object',
									properties: {
										userId: { type: 'number', minimum: 1 },
										userNm: { type: 'string', minLength: 3 },
										emailAddrTx: { type: 'string', format: 'email' },
										'x-dashes': { type: 'string' },
										$100ok: { type: 'string' },
										x𒐗: { type: 'number' },
									},
								},
							},
						},
					},
				},
			},
			'404': {},
			'500': {},
			'4xx': {},
		},
	},
};
