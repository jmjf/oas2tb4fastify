import { Clone, type Static, Type } from '@sinclair/typebox';
import { tbUserId } from './schemasUserId.js';
import { tbUserNm } from './schemasUserNm.js';

export const tbUserQuery = Type.Object({
	userId: Type.Optional(Clone(tbUserId)),
	userNm: Type.Optional(Clone(tbUserNm)),
});
export type TbUserQuery = Static<typeof tbUserQuery>;
