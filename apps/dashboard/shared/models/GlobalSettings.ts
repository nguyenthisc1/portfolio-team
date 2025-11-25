import { Schema, model, models, type InferSchemaType } from 'mongoose'

const GlobalSettingsSchema = new Schema(
    {
        _id: { type: String, default: 'global_settings' },
        siteName: { type: String, required: true },
        logo: { type: String },
        footerText: { type: String },
        socialLinks: {
            type: Map,
            of: String,
            default: {},
        },
    },
    {
        collection: 'settings',
        timestamps: true,
        minimize: false,
    },
)

export type GlobalSettingsDocument = InferSchemaType<typeof GlobalSettingsSchema>

export const GlobalSettingsModel =
    models.GlobalSettings || model<GlobalSettingsDocument>('GlobalSettings', GlobalSettingsSchema)
