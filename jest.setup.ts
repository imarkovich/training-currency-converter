import "whatwg-fetch";
import "@testing-library/jest-dom";
import { TextDecoder, TextEncoder } from "util";
import { ReadableStream, TransformStream, WritableStream } from "stream/web";

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as typeof global.TextDecoder;

class MockBroadcastChannel {
	close() {}
	postMessage() {}
	addEventListener() {}
	removeEventListener() {}
}

global.BroadcastChannel = MockBroadcastChannel as typeof BroadcastChannel;
global.ReadableStream = ReadableStream as typeof global.ReadableStream;
global.WritableStream = WritableStream as typeof global.WritableStream;
global.TransformStream = TransformStream as typeof global.TransformStream;
