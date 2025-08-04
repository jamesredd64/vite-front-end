export type ShowcaseRole = 'showcase_attendee' | 'showcase_agent' | 'showcase_team' | 'showcase_admin';

interface Auth0User {
  email: string;
  name?: string;
  given_name?: string;
  family_name?: string;
  [key: string]: any;
}

interface ExtraMetadata {
  adBudget?: number;
  roiTarget?: number;
  preferredCuisine?: string;
}

export function buildUserMetadata(user: Auth0User, extras: ExtraMetadata = {}) {
  const firstName = user.given_name || user.name?.split(' ')[0] || '';
  const lastName = user.family_name || user.name?.split(' ')[1] || '';
  const role: ShowcaseRole = user['https://dev-rq8rokyotwtjem12.jr.com/roles']?.[0] || 'showcase_attendee';

  return {
    email: user.email,
    firstName,
    lastName,
    role,
    ...extras,
  };
}
