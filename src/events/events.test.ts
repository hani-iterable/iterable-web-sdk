import MockAdapter from 'axios-mock-adapter';
import { baseAxiosRequest } from '../request';
import {
  trackEmbeddedReceived,
  trackEmbeddedClick,
  trackEmbeddedSession
} from './embedded/events';
import { track } from './events';
import {
  trackInAppClick,
  trackInAppClose,
  trackInAppConsume,
  trackInAppDelivery,
  trackInAppOpen
} from './in-app/events';
import { WEB_PLATFORM } from '../constants';
import { createClientError } from '../utils/testUtils';
import { config } from '../utils/config';

const mockRequest = new MockAdapter(baseAxiosRequest);
const localStorageMock = {
  setItem: jest.fn(),
  getItem: jest.fn()
};

jest.mock('../utils/anonymousUserEventManager', () => {
  return jest.fn().mockImplementation(() => ({
    trackAnonEvent: jest.fn()
  }));
});

describe('Events Requests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    config.setConfig({ enableAnonTracking: true });
  });

  beforeAll(() => {
    mockRequest.onPost('/events/track').reply(200, {
      userId: 'user',
      msg: 'hello'
    });
    mockRequest.onPost('/events/trackInAppClick').reply(200, {
      msg: 'hello'
    });
    mockRequest.onPost('/events/trackInAppClose').reply(200, {
      msg: 'hello'
    });
    mockRequest.onPost('/events/inAppConsume').reply(200, {
      msg: 'hello'
    });
    mockRequest.onPost('/events/trackInAppDelivery').reply(200, {
      msg: 'hello'
    });
    mockRequest.onPost('/events/trackInAppOpen').reply(200, {
      msg: 'hello'
    });
    mockRequest.onPost('/embedded-messaging/events/received').reply(200, {
      msg: 'hello'
    });
    mockRequest.onPost('/embedded-messaging/events/click').reply(200, {
      msg: 'hello'
    });
    mockRequest.onPost('/embedded-messaging/events/session').reply(200, {
      msg: 'hello'
    });

    global.window = Object.create({});
    Object.defineProperty(window, 'location', {
      value: {
        hostname: 'example.com'
      }
    });
  });

  it('should throw an error if payload is empty', () => {
    expect(() => {
      track({} as any);
    }).toThrow();
  });

  it('should throw an error if payload is empty', () => {
    expect(() => {
      track({ eventName: 'test' });
    }).toThrow();
  });

  it('return the correct payload for track with userId', async () => {
    const response = await track({ userId: 'user', eventName: 'test' });
    expect(JSON.parse(response.config.data).eventName).toBe('test');
  });

  it('return the correct payload for track with email', async () => {
    const response = await track({
      email: 'user@email.com',
      eventName: 'test'
    });
    expect(JSON.parse(response.config.data).eventName).toBe('test');
    expect(response.data.msg).toBe('hello');
  });

  it('should reject track on bad params', async () => {
    try {
      await track({ userId: 'user' } as any);
    } catch (e: any) {
      expect(e).toEqual(
        createClientError([
          {
            error: 'eventName is a required field',
            field: 'eventName'
          }
        ])
      );
    }
  });

  it('return the correct payload for trackInAppClick', async () => {
    const response = await trackInAppClick({
      messageId: '123',
      deviceInfo: { appPackageName: 'my-lil-site' }
    });

    expect(JSON.parse(response.config.data).messageId).toBe('123');
    expect(JSON.parse(response.config.data).deviceInfo.appPackageName).toBe(
      'my-lil-site'
    );
    expect(JSON.parse(response.config.data).deviceInfo.platform).toBe(
      WEB_PLATFORM
    );
    expect(response.data.msg).toBe('hello');
  });

  it('should reject trackInAppClick on bad params', async () => {
    try {
      await trackInAppClick({} as any);
    } catch (e) {
      expect(e).toEqual(
        createClientError([
          {
            error: 'messageId is a required field',
            field: 'messageId'
          },
          {
            error: 'deviceInfo.appPackageName is a required field',
            field: 'deviceInfo.appPackageName'
          }
        ])
      );
    }
  });

  it('return the correct payload for trackInAppClose', async () => {
    const response = await trackInAppClose({
      messageId: '123',
      deviceInfo: { appPackageName: 'my-lil-site' }
    });

    expect(JSON.parse(response.config.data).messageId).toBe('123');
    expect(JSON.parse(response.config.data).deviceInfo.appPackageName).toBe(
      'my-lil-site'
    );
    expect(JSON.parse(response.config.data).deviceInfo.platform).toBe(
      WEB_PLATFORM
    );
    expect(response.data.msg).toBe('hello');
  });

  it('should reject trackInAppClose on bad params', async () => {
    try {
      await trackInAppClose({} as any);
    } catch (e) {
      expect(e).toEqual(
        createClientError([
          {
            error: 'messageId is a required field',
            field: 'messageId'
          },
          {
            error: 'deviceInfo.appPackageName is a required field',
            field: 'deviceInfo.appPackageName'
          }
        ])
      );
    }
  });

  it('return the correct payload for trackInAppConsume', async () => {
    const response = await trackInAppConsume({
      messageId: '123',
      deviceInfo: { appPackageName: 'my-lil-site' }
    });

    expect(JSON.parse(response.config.data).messageId).toBe('123');
    expect(JSON.parse(response.config.data).deviceInfo.appPackageName).toBe(
      'my-lil-site'
    );
    expect(JSON.parse(response.config.data).deviceInfo.platform).toBe(
      WEB_PLATFORM
    );
    expect(response.data.msg).toBe('hello');
  });

  it('should reject trackInAppConsume on bad params', async () => {
    try {
      await trackInAppConsume({} as any);
    } catch (e) {
      expect(e).toEqual(
        createClientError([
          {
            error: 'messageId is a required field',
            field: 'messageId'
          },
          {
            error: 'deviceInfo.appPackageName is a required field',
            field: 'deviceInfo.appPackageName'
          }
        ])
      );
    }
  });

  it('return the correct payload for trackInAppDelivery', async () => {
    const response = await trackInAppDelivery({
      messageId: '123',
      deviceInfo: { appPackageName: 'my-lil-site' }
    });

    expect(JSON.parse(response.config.data).messageId).toBe('123');
    expect(JSON.parse(response.config.data).deviceInfo.appPackageName).toBe(
      'my-lil-site'
    );
    expect(JSON.parse(response.config.data).deviceInfo.platform).toBe(
      WEB_PLATFORM
    );
    expect(response.data.msg).toBe('hello');
  });

  it('should reject trackInAppDelivery on bad params', async () => {
    try {
      await trackInAppDelivery({} as any);
    } catch (e) {
      expect(e).toEqual(
        createClientError([
          {
            error: 'messageId is a required field',
            field: 'messageId'
          },
          {
            error: 'deviceInfo.appPackageName is a required field',
            field: 'deviceInfo.appPackageName'
          }
        ])
      );
    }
  });

  it('return the correct payload for trackInAppOpen', async () => {
    const response = await trackInAppOpen({
      messageId: '123',
      deviceInfo: { appPackageName: 'my-lil-site' }
    });

    expect(JSON.parse(response.config.data).messageId).toBe('123');
    expect(JSON.parse(response.config.data).deviceInfo.appPackageName).toBe(
      'my-lil-site'
    );
    expect(JSON.parse(response.config.data).deviceInfo.platform).toBe(
      WEB_PLATFORM
    );
    expect(response.data.msg).toBe('hello');
  });

  it('should reject trackInAppOpen on bad params', async () => {
    try {
      await trackInAppOpen({} as any);
    } catch (e) {
      expect(e).toEqual(
        createClientError([
          {
            error: 'messageId is a required field',
            field: 'messageId'
          },
          {
            error: 'deviceInfo.appPackageName is a required field',
            field: 'deviceInfo.appPackageName'
          }
        ])
      );
    }
  });

  it('return the correct payload for embedded message received', async () => {
    const response = await trackEmbeddedReceived('abc123', 'packageName');
    expect(JSON.parse(response.config.data).messageId).toBe('abc123');
  });

  it('return the correct payload for embedded message click', async () => {
    const payload = {
      messageId: 'abc123',
      campaignId: 1
    };

    (global as any).localStorage = localStorageMock;
    const buttonIdentifier = 'button-123';
    const clickedUrl = 'https://example.com';
    const appPackageName = 'my-lil-site';
    const response = await trackEmbeddedClick({
      messageId: payload.messageId,
      buttonIdentifier,
      clickedUrl,
      appPackageName
    });

    expect(JSON.parse(response.config.data).messageId).toBe('abc123');
  });

  it('return the correct payload for embedded message received', async () => {
    const response = await trackEmbeddedSession({
      session: {
        id: '123',
        start: 18686876876876,
        end: 1008083828723
      },
      impressions: [
        {
          messageId: 'abc123',
          displayCount: 3,
          displayDuration: 10,
          placementId: 1
        },
        {
          messageId: 'def456',
          displayCount: 2,
          displayDuration: 8,
          placementId: 1
        }
      ],
      appPackageName: 'my-lil-site'
    });

    expect(JSON.parse(response.config.data).session.id).toBe('123');
  });

  it('should reject embedded message received on bad params', async () => {
    try {
      await trackEmbeddedSession({} as any);
    } catch (e) {
      expect(e).toEqual(
        createClientError([
          {
            error: 'session.id is a required field',
            field: 'session.id'
          },
          {
            error: 'session.start is a required field',
            field: 'session.start'
          },
          {
            error: 'session.end is a required field',
            field: 'session.end'
          },
          {
            error: 'deviceInfo.appPackageName is a required field',
            field: 'deviceInfo.appPackageName'
          }
        ])
      );
    }
  });

  it('should not send up passed email or userId params', async () => {
    (global as any).localStorage = localStorageMock;
    const trackResponse = await track({
      email: 'hello@gmail.com',
      userId: '1234',
      eventName: 'my-event',
      deviceInfo: { appPackageName: 'my-lil-site' }
    } as any);
    const trackClickResponse = await trackInAppClick({
      email: 'hello@gmail.com',
      userId: '1234',
      messageId: 'fdsafd',
      deviceInfo: { appPackageName: 'my-lil-site' }
    } as any);
    const trackCloseResponse = await trackInAppClose({
      email: 'hello@gmail.com',
      userId: '1234',
      messageId: 'fdsafd',
      deviceInfo: { appPackageName: 'my-lil-site' }
    } as any);
    const trackConsumeResponse = await trackInAppConsume({
      email: 'hello@gmail.com',
      userId: '1234',
      messageId: 'fdsafd',
      deviceInfo: { appPackageName: 'my-lil-site' }
    } as any);
    const trackDeliveryResponse = await trackInAppDelivery({
      email: 'hello@gmail.com',
      userId: '1234',
      messageId: 'fdsafd',
      deviceInfo: { appPackageName: 'my-lil-site' }
    } as any);
    const trackOpenResponse = await trackInAppOpen({
      email: 'hello@gmail.com',
      userId: '1234',
      messageId: 'fdsafd',
      deviceInfo: { appPackageName: 'my-lil-site' }
    } as any);
    const trackEmMsgRecvdResponse = await trackEmbeddedReceived(
      'abc123',
      'packageName'
    );
    const trackEmClickResponse = await trackEmbeddedClick({
      messageId: 'abc123',
      buttonIdentifier: 'button-123',
      clickedUrl: 'https://example.com',
      appPackageName: 'my-lil-site'
    });
    const trackSessionResponse = await trackEmbeddedSession({
      session: {
        id: '123',
        start: 18686876876876,
        end: 1008083828723
      },
      impressions: [
        {
          messageId: 'abc123',
          displayCount: 3,
          duration: 10,
          placementId: 1,
          displayDuration: 10
        },
        {
          messageId: 'def456',
          displayCount: 2,
          duration: 8,
          placementId: 1,
          displayDuration: 8
        }
      ],
      appPackageName: 'my-lil-site'
    } as any);

    expect(JSON.parse(trackResponse.config.data).email).toEqual(
      'hello@gmail.com'
    );
    expect(JSON.parse(trackResponse.config.data).userId).toEqual('1234');
    expect(
      JSON.parse(trackResponse.config.data).deviceInfo.appPackageName
    ).toBe('my-lil-site');

    expect(JSON.parse(trackClickResponse.config.data).email).toBeUndefined();
    expect(JSON.parse(trackClickResponse.config.data).userId).toBeUndefined();
    expect(
      JSON.parse(trackClickResponse.config.data).deviceInfo.appPackageName
    ).toBe('my-lil-site');
    expect(JSON.parse(trackClickResponse.config.data).deviceInfo.platform).toBe(
      WEB_PLATFORM
    );

    expect(JSON.parse(trackCloseResponse.config.data).email).toBeUndefined();
    expect(JSON.parse(trackCloseResponse.config.data).userId).toBeUndefined();
    expect(
      JSON.parse(trackCloseResponse.config.data).deviceInfo.appPackageName
    ).toBe('my-lil-site');
    expect(JSON.parse(trackCloseResponse.config.data).deviceInfo.platform).toBe(
      WEB_PLATFORM
    );

    expect(JSON.parse(trackConsumeResponse.config.data).email).toBeUndefined();
    expect(JSON.parse(trackConsumeResponse.config.data).userId).toBeUndefined();
    expect(
      JSON.parse(trackConsumeResponse.config.data).deviceInfo.appPackageName
    ).toBe('my-lil-site');
    expect(
      JSON.parse(trackConsumeResponse.config.data).deviceInfo.platform
    ).toBe(WEB_PLATFORM);

    expect(JSON.parse(trackDeliveryResponse.config.data).email).toBeUndefined();
    expect(
      JSON.parse(trackDeliveryResponse.config.data).userId
    ).toBeUndefined();
    expect(
      JSON.parse(trackDeliveryResponse.config.data).deviceInfo.appPackageName
    ).toBe('my-lil-site');
    expect(
      JSON.parse(trackDeliveryResponse.config.data).deviceInfo.platform
    ).toBe(WEB_PLATFORM);

    expect(JSON.parse(trackOpenResponse.config.data).email).toBeUndefined();
    expect(JSON.parse(trackOpenResponse.config.data).userId).toBeUndefined();
    expect(
      JSON.parse(trackOpenResponse.config.data).deviceInfo.appPackageName
    ).toBe('my-lil-site');
    expect(JSON.parse(trackOpenResponse.config.data).deviceInfo.platform).toBe(
      WEB_PLATFORM
    );

    expect(
      JSON.parse(trackEmMsgRecvdResponse.config.data).email
    ).toBeUndefined();
    expect(
      JSON.parse(trackEmMsgRecvdResponse.config.data).userId
    ).toBeUndefined();

    expect(JSON.parse(trackEmClickResponse.config.data).email).toBeUndefined();
    expect(JSON.parse(trackEmClickResponse.config.data).userId).toBeUndefined();

    expect(JSON.parse(trackSessionResponse.config.data).email).toBeUndefined();
    expect(JSON.parse(trackSessionResponse.config.data).userId).toBeUndefined();
  });
});
