import { PostSchema } from '../tb-r/schemas_Post.ts';
import { PostIdSchema } from '../tb-r/schemas_PostId.ts';
const getPostById = {
	url: '/posts/:postId',
	method: 'GET',
	operationId: 'getPostById',
	tags: ['Posts'],
	summary: 'GET post endpoint for tson issue',
	schema: {
		params: { type: 'object', properties: { postId: PostIdSchema } },
		response: {
			'200': { description: 'result', content: { 'application/json': { schema: PostSchema } } },
			'4xx': { description: 'error' },
		},
	},
};
