import { type Static, Type } from '@sinclair/typebox';
import { OneOf } from './OneOf.ts';

export const BookingPaymentSchema = Type.Object(
	{
		id: Type.Optional(Type.String({ format: 'uuid', readOnly: true })),
		amount: Type.Optional(Type.Number({ exclusiveMinimum: 0 })),
		currency: Type.Optional(
			Type.Union([
				Type.Literal('bam'),
				Type.Literal('bgn'),
				Type.Literal('chf'),
				Type.Literal('eur'),
				Type.Literal('gbp'),
				Type.Literal('nok'),
				Type.Literal('sek'),
				Type.Literal('try'),
			]),
		),
		source: Type.Optional(
			OneOf([
				Type.Object({
					object: Type.Optional(Type.Literal('card')),
					name: Type.String(),
					number: Type.String(),
					cvc: Type.String({ minLength: 3, maxLength: 4, writeOnly: true }),
					exp_month: Type.Number({ format: 'int64' }),
					exp_year: Type.Number({ format: 'int64' }),
					address_line1: Type.Optional(Type.String({ writeOnly: true })),
					address_line2: Type.Optional(Type.String({ writeOnly: true })),
					address_city: Type.Optional(Type.String()),
					address_country: Type.String(),
					address_post_code: Type.Optional(Type.String()),
				}),
				Type.Object({
					object: Type.Optional(Type.Literal('bank_account')),
					name: Type.String(),
					number: Type.String(),
					sort_code: Type.Optional(Type.String()),
					account_type: Type.Union([Type.Literal('individual'), Type.Literal('company')]),
					bank_name: Type.String(),
					country: Type.String(),
				}),
			]),
		),
		status: Type.Optional(
			Type.Union([Type.Literal('pending'), Type.Literal('succeeded'), Type.Literal('failed')], { readOnly: true }),
		),
	},
	{ additionalProperties: false },
);
export type BookingPayment = Static<typeof BookingPaymentSchema>;
