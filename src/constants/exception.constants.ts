export const EXCEPTION_MESSAGE = {
  BAD_REQUEST_EXCEPTION: {
    INVALID_DATA: 'Incorrect data in request',
    NOT_FOUND_BY_ID: (entity: string) => `Not found by id (${entity})`,
    NOT_FOUND: 'Not found, entity does not exists',
    ALREADY_EXISTS: 'Entity already exists',
    SOMETHING_GO_WRONG: 'Something go wrong',
    NO_PHOTOS: 'No photos in request',
    DISTRICT_NO_EXISTS: 'District do not exists',
    CONFIRM_CODE_WRONG: 'Confirm code is wrong',
  },
  UNAUTHORIZED_EXCEPTION: {
    INVALID_CREDENTIALS: 'Invalid credentials',
    USER_IS_NOT_AUTHORIZED: 'User is not authorized',
  },
  FORBIDDEN_EXCEPTION: {
    NO_RULES_TO_GET: 'You dont have permission to do this',
  },
};