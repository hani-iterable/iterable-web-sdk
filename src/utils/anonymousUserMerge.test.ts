import {
  ENDPOINT_GET_USER_BY_EMAIL,
  ENDPOINT_GET_USER_BY_USERID,
  ENDPOINT_MERGE_USER
} from '../constants';
import { baseIterableRequest } from '../request';
import { AnonymousUserMerge } from './AnonymousUserMerge';

const localStorageMock = {
  getItem: jest.fn()
};

jest.mock('../request', () => ({
  baseIterableRequest: jest.fn()
}));

describe('AnonymousUserMerge', () => {
  let anonymousUserMerge: AnonymousUserMerge;

  beforeEach(() => {
    anonymousUserMerge = new AnonymousUserMerge();
    (global as any).localStorage = localStorageMock;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should merge users using user ID', async () => {
    localStorageMock.getItem.mockReturnValueOnce('sourceUserId');
    const destinationUserId = 'destinationUserId';
    const response = {
      status: 200,
      data: { user: {} }
    };
    (baseIterableRequest as jest.Mock).mockResolvedValueOnce(response);

    anonymousUserMerge.mergeUserUsingUserId(destinationUserId);

    expect(baseIterableRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: ENDPOINT_GET_USER_BY_USERID,
      params: { userId: destinationUserId }
    });
  });

  it('should merge users using email', async () => {
    localStorageMock.getItem.mockReturnValueOnce('sourceEmail');
    const destinationEmail = 'destinationEmail';
    const response = {
      status: 200,
      data: { user: {} }
    };
    (baseIterableRequest as jest.Mock).mockResolvedValueOnce(response);

    anonymousUserMerge.mergeUserUsingEmail(destinationEmail);

    expect(baseIterableRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: ENDPOINT_GET_USER_BY_EMAIL,
      params: { email: destinationEmail },
      validation: {}
    });
  });

  it('should merge users using callMergeApi method', async () => {
    const sourceEmail = 'source@example.com';
    const sourceUserId = 'sourceUserId';
    const destinationEmail = 'destination@example.com';
    const destinationUserId = 'destinationUserId';

    const response = {
      status: 200
    };
    (baseIterableRequest as jest.Mock).mockResolvedValueOnce(response);

    anonymousUserMerge['callMergeApi'](
      sourceEmail,
      sourceUserId,
      destinationEmail,
      destinationUserId
    );

    expect(baseIterableRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: ENDPOINT_MERGE_USER,
      data: {
        sourceEmail: sourceEmail,
        sourceUserId: sourceUserId,
        destinationEmail: destinationEmail,
        destinationUserId: destinationUserId
      }
    });
  });
});
