import { PostRequestBodySchema } from '../tbr/requestBodies_PostRequestBody.ts';
import { PostsResponseSchema } from '../tbr/schemas_PostsResponse.ts';

export const putPostsRouteOptions = {
	url: '/posts',
	method: 'POST',
	operationId: 'putPosts',
	tags: ['Posts'],
	schema: {
		body: {
			content: {
				'application/json': { schema: PostRequestBodySchema },
				'application/xml': { schema: PostRequestBodySchema },
			},
		},
		response: { '200': { content: { 'application/json': { schema: PostsResponseSchema } } }, '4xx': {} },
	},
};
