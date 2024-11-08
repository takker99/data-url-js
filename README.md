# @takker/data-url

[![JSR](https://jsr.io/badges/@takker/data-url)](https://jsr.io/@takker/data-url)
[![test](https://github.com/takker99/data-url-js/workflows/ci/badge.svg)](https://github.com/takker99/data-url-js/actions?query=workflow%3Aci)

Convert [`Blob`](https://developer.mozilla.org/docs/Web/API/Blob) to
[Data URL](https://developer.mozilla.org/docs/Web/URI/Schemes/data) in Deno/Web
browsers

## Usage

```ts
import { assertEquals } from "@std/assert/equals";
import { toDataURL } from "@takker/data-url";

const blob = new Blob(["Test data"], { type: "text/plain" });
const result = await toDataURL(blob);
assertEquals(result, "data:text/plain;base64,VGVzdCBkYXRh");
```

Abort a covertion before it completes:

```ts
import { assertRejects } from "@std/assert/rejects";
import { toDataURL } from "@takker/data-url";

const controller = new AbortController();
const blob = new Blob(["Test data"], { type: "text/plain" });
const promise = toDataURL(blob, controller.signal);
controller.abort();
await assertRejects(() => promise, controller.signal.reason);
```
