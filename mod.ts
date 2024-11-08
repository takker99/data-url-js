/**
 * Converts a Blob object to a data URL string.
 *
 * @param data The Blob object to convert.
 * @param signal The signal to abort converting process with.
 * @returns A Promise that resolves with the data URL string.
 *
 * @example Basic Usage
 * ```ts
 * import { assertEquals } from "@std/assert/equals";
 *
 * const blob = new Blob(["Test data"], { type: "text/plain" });
 * const result = await toDataURL(blob);
 * assertEquals(result, "data:text/plain;base64,VGVzdCBkYXRh");
 * ```
 *
 * @example Abort covertion
 * ```ts
 * import { assertRejects } from "@std/assert/rejects";
 *
 * const controller = new AbortController();
 * const blob = new Blob(["Test data"], { type: "text/plain" });
 * const promise = toDataURL(blob, controller.signal);
 * controller.abort();
 * await assertRejects(() => promise, controller.signal.reason);
 * ```
 */
export const toDataURL = async (
  data: Blob,
  signal?: AbortSignal,
): Promise<string> => {
  if (signal?.aborted) throw signal.reason;

  const { promise, resolve, reject } = Promise.withResolvers<string>();
  const reader = new FileReader();

  reader.addEventListener(
    "load",
    () => {
      const dataURL = reader.result as string;
      // Remove "; charset=utf-8" from the data URL.
      // This is a workaround for a bug in Firefox.
      const index = dataURL.indexOf(";");
      if (dataURL.startsWith("; charset=utf-8", index)) {
        resolve(`${dataURL.slice(0, index)}${dataURL.slice(index + 15)}`);
      } else {
        resolve(dataURL);
      }
    },
    { signal },
  );
  reader.addEventListener("error", () => reject(reader.error), { signal });
  reader.addEventListener("abort", () => reject(reader.error), { signal });
  const abort = () => {
    reader.abort();
    reject(signal?.reason);
  };
  signal?.addEventListener?.("abort", abort, { once: true });

  reader.readAsDataURL(data);

  try {
    return await promise;
  } finally {
    signal?.removeEventListener?.("abort", abort);
  }
};
