import { Schema, model, models, type InferSchemaType } from 'mongoose'

const UserSchema = new Schema(
    {
        username: { type: String, required: true, unique: true },
        passwordHash: { type: String, required: true },
        name: { type: String },
        role: { type: String, enum: ['admin', 'editor', 'viewer'], default: 'admin' },
    },
    {
        collection: 'users',
        timestamps: true,
    },
)

UserSchema.index({ username: 1 }, { unique: true })

export type UserDocument = InferSchemaType<typeof UserSchema>

export const UserModel = models.User || model<UserDocument>('User', UserSchema)
