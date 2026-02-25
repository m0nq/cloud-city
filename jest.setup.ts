// jest.setup.ts
import "@testing-library/jest-dom";

// 1. Polyfill TextEncoder/TextDecoder FIRST.
// Undici strictly requires these to exist in the global scope before it can initialize.
if (typeof global.TextEncoder === "undefined") {
    const { TextEncoder, TextDecoder } = require("util");
    global.TextEncoder = TextEncoder;
    global.TextDecoder = TextDecoder;
}

// 2. Undici also expects Web Streams APIs to exist in the global scope.
if (typeof global.ReadableStream === "undefined") {
    const { ReadableStream, WritableStream, TransformStream } = require("node:stream/web");
    global.ReadableStream = ReadableStream;
    global.WritableStream = WritableStream;
    global.TransformStream = TransformStream;
}

if (typeof global.MessagePort === "undefined") {
    if (typeof window !== "undefined" && window.MessagePort) {
        global.MessagePort = window.MessagePort;
    } else {
        const { MessagePort } = require("node:worker_threads");
        global.MessagePort = MessagePort;
    }
}

// 3. Now that the environment is prepared, we can safely load undici
// to restore the Request, Response, and fetch APIs.
if (typeof global.Request === "undefined") {
    const { Request, Response, Headers, fetch } = require("undici");
    global.Request = Request;
    global.Response = Response;
    global.Headers = Headers;
    global.fetch = fetch;
}
