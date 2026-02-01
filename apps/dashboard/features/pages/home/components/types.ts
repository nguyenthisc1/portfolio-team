import * as z from 'zod'

// Define the schema based on home.json structure
export const homeContentSchema = z.object({
    seo: z.object({
        title: z.string().min(1, 'Title is required'),
        description: z.string().min(1, 'Description is required'),
        image: z.string().optional(),
        keywords: z.array(z.string()).min(1, 'At least one keyword is required'),
    }),
    hero: z.object({
        title: z.string().min(1, 'Title is required'),
        description: z.string().min(1, 'Description is required'),
    }),
    philosophy: z.object({
        text: z.string().min(1, 'Philosophy text is required'),
    }),
    projects: z.object({
        title: z.string().min(1, 'Title is required'),
        description: z.string().min(1, 'Description is required'),
        projectList: z.array(
            z.object({
                category: z.string().min(1, 'Category is required'),
                items: z.array(
                    z.object({
                        image: z.string().min(1, 'Image is required'),
                        name: z.string().min(1, 'Name is required'),
                        link: z.string().optional(),
                    }),
                ),
            }),
        ),
    }),
    skills: z.array(
        z.object({
            title: z.string().min(1, 'Title is required'),
            name: z.string().min(1, 'Name is required'),
            skills: z.array(z.string()).min(1, 'At least one skill is required'),
        }),
    ),
    about: z.object({
        title: z.string().min(1, 'Title is required'),
        description: z.string().min(1, 'Description is required'),
        teamMembers: z.array(
            z.object({
                image: z.string().min(1, 'Image is required'),
                name: z.string().min(1, 'Name is required'),
                position: z.string().min(1, 'Position is required'),
                experience: z.number().min(0, 'Experience must be 0 or greater'),
                projects: z.number().min(0, 'Projects must be 0 or greater'),
                customers: z.number().min(0, 'Customers must be 0 or greater'),
            }),
        ),
    }),
})

export type HomeContentForm = z.infer<typeof homeContentSchema>
