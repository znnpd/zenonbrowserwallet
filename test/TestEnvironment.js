const Environment = require('jest-environment-jsdom');

/**
 * A custom environment to set the TextEncoder that is required by TensorFlow.js.
 */
module.exports = class CustomTestEnvironment extends Environment {
    constructor(config) {
        super(
            Object.assign({}, config, {
                globals: Object.assign({}, config.globals, {
                    Uint32Array: Uint32Array,
                    Uint8Array: Uint8Array,
                    ArrayBuffer: ArrayBuffer,
                }),
            }),
        );
    }

    async setup() {
        await super.setup();
        if (typeof this.global.TextEncoder === 'undefined') {
            const { TextEncoder } = require('util');
            this.global.TextEncoder = TextEncoder;
        }
        if (typeof this.global.TextDecoder === 'undefined') {
            const { TextDecoder } = require('util');
            this.global.TextDecoder = TextDecoder;
        }
    }
}
