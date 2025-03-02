import { type Static, Type } from '@sinclair/typebox';

export const tbComment = Type.Object(
	{
		commentId: Type.Number({ minimum: 1 }),
		commentTx: Type.String({ minLength: 1, maxLength: 256 }),
		commenter: Type.Object(
			{
				userId: Type.Number({ minimum: 1 }),
				userNm: Type.String({ minLength: 3 }),
				emailAddrTx: Type.Optional(Type.String({ format: 'emailAddr' })),
				'x-dashes': Type.Optional(Type.String()),
				$100ok: Type.Optional(Type.String()),
				x𒐗: Type.Optional(Type.Number()),
			},
			{},
		),
	},
	{},
);
export type TbComment = Static<typeof tbComment>;
