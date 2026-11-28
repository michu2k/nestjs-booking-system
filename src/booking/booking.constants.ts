import { BookingStatus } from "../prisma/generated/enums";

// Statuses a booking can transition to from its current status
export const STATUS_TRANSITIONS: Record<BookingStatus, BookingStatus[]> = {
  PENDING: [BookingStatus.CONFIRMED, BookingStatus.CANCELLED, BookingStatus.EXPIRED],
  CONFIRMED: [BookingStatus.COMPLETED, BookingStatus.CANCELLED, BookingStatus.NO_SHOW],
  CANCELLED: [],
  EXPIRED: [],
  COMPLETED: [],
  NO_SHOW: []
};

// Time conditions a booking must meet to transition to the target status
// e.g. CANCELLED: a booking can be changed to CANCELLED only before it starts (from > now)
export const STATUS_TIME_GUARDS: Partial<
  Record<BookingStatus, (booking: { from: Date; to: Date }, now: Date) => boolean>
> = {
  CONFIRMED: ({ from }, now) => from > now,
  CANCELLED: ({ from }, now) => from > now,
  COMPLETED: ({ to }, now) => to <= now,
  NO_SHOW: ({ from }, now) => from <= now
};
