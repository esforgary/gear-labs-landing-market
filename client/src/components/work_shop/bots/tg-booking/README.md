# TG Booking

Local Telegram-style appointment demo for the workshop catalog. `tg-booking.tsx` exports the preview; `cover.tsx` exports `TgBookingCover`. Shared presentation/status components are reused, with all booking styles scoped to this directory. External copy and catalog metadata support ru/en/de/fr/it/pl/cz/sk; the phone UI stays Russian.

Customer: choose service, specialist, day and time; send name and contact through the persistent message composer; confirm a request; inspect, reschedule or cancel future appointments. Administrator: filter all requests, confirm or cancel them, complete finished visits, and open/close 30-minute availability slots. A seeded visit from yesterday makes completion immediately testable.

Everything happens in the Telegram-style conversation, without a mini-app overlay. Main actions send visible slash commands; every selection becomes an outgoing reply followed by the bot's next question and inline keyboard. Typed names, service/staff names, dates (`DD.MM`), times, and commands work too. `/book`, `/bookings`, `/slots` (admin), `/booking 1001`, `/back`, `/cancel`, `/start`, and `/help` are supported. The two roles keep separate in-memory histories; shared booking updates arrive as bot messages in the other role. Previous keyboards remain visible but inert. `booking-conversation.ts` owns the pure, tested conversation transitions.

The pure model checks full service durations, specialist and customer overlap, working hours, future times, role/status transitions and atomic rescheduling. Cancellation releases slots. Confirmed rescheduled bookings require confirmation again. Dates are relative to today over a 14-day horizon; valid persisted history is retained.

Data stays in this browser under `gearlabs:tg-booking:demo:v1`. Restore validates the entire payload; invalid snapshots fall back to synthetic defaults with a notice. Storage failures leave the current session usable. Reset requires inline confirmation. Other tabs receive storage updates. No Telegram API, network, authentication, payments or real notifications are used.

Run focused tests from the repository root with Node supporting TypeScript stripping:

```sh
node --experimental-strip-types --test client/src/components/work_shop/bots/tg-booking/booking-model.test.mjs
node --experimental-strip-types --test client/src/components/work_shop/bots/tg-booking/booking-conversation.test.mjs
```
