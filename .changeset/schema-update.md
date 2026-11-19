---
"@datocms/cma-client": minor
---

Sync generated code with the latest DatoCMS API schema (ApiTypes, RawApiTypes).

The types of the editing sessions change. The editing sessions are a private resource: only the DatoCMS interface uses them.

- An editing session has `locks` (the fields, each in one locale, and the full locales that the session has locked in its active record) and no `locked_at`.
- `PUT /editing-sessions/:id` has the calls on one field (`editing_session_lock_field`, `editing_session_unlock_field`, `editing_session_take_over_field`), on a full locale (`editing_session_lock_locale`, `editing_session_unlock_locale`, `editing_session_take_over_locale`) and `editing_session_kick_out_others`. The calls on the full record (`editing_session_lock_item`, `editing_session_take_over_item`) do not exist anymore.
- The `FormData` types (the unsaved values of another editor) do not exist anymore.
