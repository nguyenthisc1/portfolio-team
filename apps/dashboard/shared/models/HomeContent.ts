import { Schema, model, models, type InferSchemaType } from 'mongoose'

const seoSchema = new Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        image: { type: String },
        keywords: [{ type: String, required: true }],
    },
    { _id: false },
)

const heroSchema = new Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
    },
    { _id: false },
)

const philosophySchema = new Schema(
    {
        text: { type: String, required: true },
    },
    { _id: false },
)

const projectItemSchema = new Schema(
    {
        image: { type: String, required: true },
        name: { type: String, required: true },
        link: { type: String, default: '' },
    },
    { _id: false },
)

const projectCategorySchema = new Schema(
    {
        category: { type: String, required: true },
        items: { type: [projectItemSchema], default: [] },
    },
    { _id: false },
)

const projectsSchema = new Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        projectList: { type: [projectCategorySchema], default: [] },
    },
    { _id: false },
)

const skillSectionSchema = new Schema(
    {
        title: { type: String, required: true },
        name: { type: String, required: true },
        skills: [{ type: String, required: true }],
    },
    { _id: false },
)

const HomeContentSchema = new Schema(
    {
        _id: { type: String, default: 'home' },
        seo: { type: seoSchema, required: true },
        hero: { type: heroSchema, required: true },
        philosophy: { type: philosophySchema, required: true },
        projects: { type: projectsSchema, required: true },
        skills: { type: [skillSectionSchema], default: [] },
    },
    {
        collection: 'home_content',
        timestamps: true,
        minimize: false,
    },
)

export type HomeContentDocument = InferSchemaType<typeof HomeContentSchema>

export const HomeContentModel =
    models.HomeContent || model<HomeContentDocument>('HomeContent', HomeContentSchema)
