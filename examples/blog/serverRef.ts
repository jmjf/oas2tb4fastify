import Fastify, { type FastifyReply, type FastifyRequest } from 'fastify';

import { getCommentByIdRouteOptions } from './ror/getCommentByIdRouteOptions.ts';
import { getPostByIdRouteOptions } from './ror/getPostByIdRouteOptions.ts';
import { getPostsRouteOptions } from './ror/getPostsRouteOptions.ts';
import { getUserByIdRouteOptions } from './ror/getUserByIdRouteOptions.ts';
import { getUsersByQueryRouteOptions } from './ror/getUsersByQueryRouteOptions.ts';
import { putPostsRouteOptions } from './ror/putPostsRouteOptions.ts';

const fastify = Fastify({
	logger: true,
	ajv: {
		customOptions: {
			keywords: [
				{
					keyword: 'example',
					errors: false,
				},
			],
		},
	},
});

function requestHandler(request: FastifyRequest, reply: FastifyReply) {
	const { id, url, method, query, body, params, headers } = request;
	request.log.info({ id, url, method, query, body, params, headers }, 'RECEIVED');
	reply.send();
}

fastify.route({ ...getCommentByIdRouteOptions, handler: requestHandler });
fastify.route({ ...getPostByIdRouteOptions, handler: requestHandler });
fastify.route({ ...getPostsRouteOptions, handler: requestHandler });
fastify.route({ ...getUserByIdRouteOptions, handler: requestHandler });
fastify.route({ ...getUsersByQueryRouteOptions, handler: requestHandler });
fastify.route({ ...putPostsRouteOptions, handler: requestHandler });

const start = async () => {
	try {
		await fastify.listen({ port: 3080, host: '0.0.0.0' });
	} catch (err) {
		fastify.log.error(err);
		process.exit(1);
	}
};

start();
