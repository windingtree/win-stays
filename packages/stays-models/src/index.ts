export * as eip712 from './eip712';

import * as ask from './proto/ask';
import * as bidask from './proto/bidask';
import * as date from './proto/date';
import * as facility from './proto/facility';
import * as latlng from './proto/latlng';
import * as photo from './proto/photo';
import * as pingpong from './proto/pingpong';
import * as storage from './proto/storage';
import * as timestamp from './proto/timestamp';
import * as token from './proto/token';

export const proto = {
  ask,
  bidask,
  date,
  facility,
  latlng,
  photo,
  pingpong,
  storage,
  timestamp,
  token
};
