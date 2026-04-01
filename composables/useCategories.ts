// composables/useCategories.ts
export interface Category {
  slug: string
  name: string
  description: string
}

export const CATEGORIES: Category[] = [
  { slug: 'eligibility',  name: 'Eligibility & Academics', description: 'GPA, test scores, NCAA clearinghouse' },
  { slug: 'timelines',    name: 'Recruiting Timelines',    description: 'When to start, what to do each year' },
  { slug: 'outreach',     name: 'Contacting Coaches',      description: 'Emails, calls, and campus visits' },
  { slug: 'showcases',    name: 'Showcases & Camps',       description: 'Which events matter, how to get noticed' },
  { slug: 'scholarships', name: 'Scholarships & Aid',      description: 'Athletic scholarships, NLI, roster limits' },
  { slug: 'divisions',    name: 'Division Levels',         description: 'D1 / D2 / D3 / NAIA / JUCO differences' },
  { slug: 'commitments',  name: 'Offers & Commitments',    description: 'Verbal commitments and NLI signing' },
  { slug: 'ncaa-rules',   name: 'NCAA Rules',              description: 'Contact restrictions and compliance' },
]

export function useCategories() {
  function getCategoryBySlug(slug: string): Category | undefined {
    return CATEGORIES.find(c => c.slug === slug)
  }

  return { categories: CATEGORIES, getCategoryBySlug }
}
