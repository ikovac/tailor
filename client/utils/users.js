import { omit } from 'lodash';
import settings from '../settings';

function getRoles(exclude = []) {
  const roles = omit(settings.role, exclude);
  return Object.keys(roles).map(role => roles[role]);
};

export function getRolesForUser(user) {
  let exclude = [];

  if (user.role === settings.role.COURSE_ADMIN.value) {
    exclude = ['GLOBAL_ADMIN'];
  } else if (user.role !== settings.role.GLOBAL_ADMIN.value) {
    exclude = Object.keys(settings.role);
  }

  return getRoles(exclude);
}
