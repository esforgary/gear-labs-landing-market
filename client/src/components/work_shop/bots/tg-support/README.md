# TG Support

Local, synthetic Telegram-style support demo. The phone stays Russian; catalog and presentation controls support `ru`, `en`, `de`, `fr`, `it`, `pl`, `cz`, and `sk`.

- The phone is one continuous Telegram-style conversation with a permanent composer. Command buttons send visible slash commands; the bot replies with inline choices. Old keyboards cannot trigger stale actions.
- Customer: `/new` asks for topic, subject and details as chat replies; `/tickets` lists own tickets. `/ticket ID` opens history, plain text sends a reply, `/close ID` and `/reopen ID` change availability.
- Administrator: `/queue`, `/filter`, `/take ID`, `/status ID`, `/clarify ID`, close/reopen and plain-text replies. `/cancel` returns to the menu from any step. Role histories remain separate while the preview is open; ticket histories are shared and persisted.
- Both roles share ticket history. Administrator replies set “waiting”; customer follow-ups return waiting tickets to “in progress” (or “new” when unassigned). Closed tickets must be reopened before sending messages.
- There are no automatic operator replies, requests, authentication, or real Telegram connection. Role checks are demo behavior, not a security boundary.

State uses the independent `gearlabs.tg-support.demo.v1` localStorage key. Invalid or incompatible saved data resets to synthetic examples; storage failures are reported and leave the session usable. Reset requires confirmation. The pure model validates input, ownership, timestamps, stored records and bounded history without mutating input state.

Run model tests from the repository root with a Node version supporting TypeScript type stripping:

```powershell
node --experimental-strip-types --test client/src/components/work_shop/bots/tg-support/support-model.test.mjs
```

The preview reuses `AppPreviewCopy`, `PhoneStatusBar`, `.mobile-app-preview` and `.app-phone-frame`. All bot-specific styling and assets live here; there are no TG Market imports.
