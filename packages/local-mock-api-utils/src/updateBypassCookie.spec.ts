import { describe, expect, it } from 'vitest';

import { updateBypassCookie } from './updateBypassCookie';

describe('updateBypassCookie', () => {
    it('adds and removes individual endpoint ids', () => {
        expect(updateBypassCookie('orders', 'users', true)).toBe('orders|users');
        expect(updateBypassCookie('orders|users', 'orders', false)).toBe('users');
    });

    it('starts without an existing cookie and supports allowed id separators', () => {
        expect(updateBypassCookie(undefined, 'Orders-V2_details', true)).toBe('Orders-V2_details');
    });

    it('does not duplicate an existing endpoint', () => {
        expect(updateBypassCookie('orders|profile', 'orders', true)).toBe('orders|profile');
    });

    it('sanitizes malformed existing entries while updating several endpoints', () => {
        let value = 'invalid:id|orders';
        value = updateBypassCookie(value, 'profile-v2', true);
        value = updateBypassCookie(value, 'user_details', true);

        expect(value).toBe('orders|profile-v2|user_details');
    });

    it('treats removal from the global bypass marker as an empty individual selection', () => {
        expect(updateBypassCookie('*', 'orders', false)).toBe('');
    });
});
