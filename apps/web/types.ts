// Types for the homepage CMS response

export type HeroSection = {
    title: string
    description: string
}

export type PhilosophySection = {
    text: string
}

export type Project = {
    category: string
    items: {
        image: string
        name: string
        link: string
    }[]
}

export type ProjectsSection = {
    title: string
    description: string
    projectList: Project[]
}

export type SEOSection = {
    title: string
    description: string
    image: string
    keywords: string[]
}

export type SkillCategory = {
    title: string
    name: string
    skills: string[]
}

export type AboutSection = {
    title: string
    description: string
    teamMembers: {
        image: string
        name: string
        position: string
        experience: number
        projects: number
        customers: number
    }[]
}

export type HomePageData = {
    _id: string
    __v: number
    createdAt: Date | string
    updatedAt: Date | string
    hero: HeroSection
    philosophy: PhilosophySection
    projects: ProjectsSection
    about: AboutSection
    seo: SEOSection
    skills: SkillCategory[]
}
