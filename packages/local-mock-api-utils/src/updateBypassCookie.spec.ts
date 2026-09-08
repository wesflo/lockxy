import { describe, expect, it } from 'vitest';

import { updateBypassCookie } from './updateBypassCookie';

describe('updateBypassCookie', () => {
    it('adds and removes individual endpoint ids', () => {
        expect(updateBypassCookie('orders', 'users', true)).toBe('orders|users');
        expect(updateBypassCookie('orders|users', 'orders', false)).toBe('users');
    });
});
