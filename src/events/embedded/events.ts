import { WEB_PLATFORM, ENDPOINTS } from 'src/constants';
import { baseIterableRequest } from '../../request';
import {
  IterableEmbeddedDismissRequestPayload,
  IterableEmbeddedSessionRequestPayload,
  IterableEmbeddedClickRequestPayload
} from './types';
import { IterableResponse } from '../../types';
import {
  trackEmbeddedSchema,
  trackEmbeddedClickSchema,
  embeddedDismissSchema,
  embeddedSessionSchema
} from './events.schema';

export const trackEmbeddedReceived = async (
  messageId: string,
  appPackageName: string
) =>
  baseIterableRequest<IterableResponse>({
    method: 'POST',
    url: ENDPOINTS.msg_received_event_track.route,
    data: {
      messageId,
      deviceInfo: {
        platform: WEB_PLATFORM,
        deviceId: global.navigator.userAgent || '',
        appPackageName
      }
    },
    validation: {
      data: trackEmbeddedSchema
    }
  });

export const trackEmbeddedClick = async (
  payload: IterableEmbeddedClickRequestPayload
) => {
  const { appPackageName, ...rest } = payload;

  return baseIterableRequest<IterableResponse>({
    method: 'POST',
    url: ENDPOINTS.msg_click_event_track.route,
    data: {
      ...rest,
      deviceInfo: {
        platform: WEB_PLATFORM,
        deviceId: global.navigator.userAgent || '',
        appPackageName
      },
      createdAt: Date.now()
    },
    validation: {
      data: trackEmbeddedClickSchema
    }
  });
};

export const trackEmbeddedDismiss = async (
  payload: IterableEmbeddedDismissRequestPayload
) => {
  const { appPackageName, ...rest } = payload;

  return baseIterableRequest<IterableResponse>({
    method: 'POST',
    url: ENDPOINTS.msg_dismiss.route,
    data: {
      ...rest,
      deviceInfo: {
        platform: WEB_PLATFORM,
        deviceId: global.navigator.userAgent || '',
        appPackageName
      },
      createdAt: Date.now()
    },
    validation: {
      data: embeddedDismissSchema
    }
  });
};

export const trackEmbeddedSession = async (
  payload: IterableEmbeddedSessionRequestPayload
) => {
  const { appPackageName, ...rest } = payload;

  return baseIterableRequest<IterableResponse>({
    method: 'POST',
    url: ENDPOINTS.msg_session_event_track.route,
    data: {
      ...rest,
      deviceInfo: {
        platform: WEB_PLATFORM,
        deviceId: global.navigator.userAgent || '',
        appPackageName
      },
      createdAt: Date.now()
    },
    validation: {
      data: embeddedSessionSchema
    }
  });
};
