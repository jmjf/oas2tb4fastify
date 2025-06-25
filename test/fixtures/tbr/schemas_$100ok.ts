import {type Static, Type, SchemaOptions, Clone, Kind, TypeRegistry, TSchema, TUnion} from "@sinclair/typebox"
import { Value } from "@sinclair/typebox/value";


export const $100OkSchema = Type.String({"title":"$100ok"})
export type $100Ok = Static<typeof $100OkSchema>
