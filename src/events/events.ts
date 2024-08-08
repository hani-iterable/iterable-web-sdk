/* eslint-disable no-param-reassign */
import { AnonymousUserEventManager } from '../anonymousUserTracking/anonymousUserEventManager';
import { canTrackAnonUser } from '../utils/commonFunctions';
import { ENDPOINTS, INITIALIZE_ERROR } from '../constants';
import { baseIterableRequest } from '../request';
import { InAppTrackRequestParams } from './inapp/types';
import { IterableResponse } from '../types';
import { trackSchema } from './events.schema';

export const track = (payload: InAppTrackRequestParams) => {
  /* a customer could potentially send these up if they're not using TypeScript */
  delete (payload as any).userId;
  delete (payload as any).email;
  if (canTrackAnonUser()) {
    const anonymousUserEventManager = new AnonymousUserEventManager();
    anonymousUserEventManager.trackAnonEvent(payload);
    return Promise.reject(INITIALIZE_ERROR);
  }
  return baseIterableRequest<IterableResponse>({
    method: 'POST',
    url: ENDPOINTS.event_track.route,
    data: payload,
    validation: {
      data: trackSchema
    }
  });
};
