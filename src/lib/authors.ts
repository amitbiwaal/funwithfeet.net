/**
 * Editorial author profiles for the blog author box.
 *
 * The CMS `author_name` field is a plain string, so profiles are matched by
 * name here. Posts whose author_name doesn't match any profile fall back to
 * the default editorial box (logo mark + generic bio) in
 * src/app/(site)/blog/[slug]/page.tsx.
 */
export type AuthorProfile = {
  name: string
  role: string
  bio: string
  avatar: string
}

export const AUTHORS: AuthorProfile[] = [
  {
    name: 'Naina Verma',
    role: 'Pricing & Earnings Editor',
    bio: 'Naina covers the money side of selling feet pics: price menus, bundles, custom rates, and what actually moves earnings. Her pieces are data-first — real ranges, no hype, and a soft spot for killing underselling habits.',
    avatar: '/authors/naina-verma.png',
  },
  {
    name: 'Maya Sinclair',
    role: 'Photography & Styling Editor',
    bio: "Maya writes about the craft side of feet content: lighting, angles, phone settings, and styling. If a photo has ever made you wonder 'why does this look flat,' she has probably answered it in a post.",
    avatar: '/authors/maya-sinclair.png',
  },
  {
    name: 'Jess Malone',
    role: 'Safety & Privacy Editor',
    bio: 'Jess writes the protective stuff: scam red flags, staying anonymous, watermarking, and what to never share. Calm, practical, slightly paranoid — exactly what you want in a safety writer.',
    avatar: '/authors/jess-malone.png',
  },
]

/** Case-insensitive lookup by the CMS author_name value. */
export function findAuthor(name: string | null | undefined): AuthorProfile | undefined {
  if (!name) return undefined
  const clean = name.trim().toLowerCase()
  return AUTHORS.find((a) => a.name.toLowerCase() === clean)
}
