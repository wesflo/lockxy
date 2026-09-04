import { css } from 'lit';

import { theme } from '../theme.style.js';

export const endpointsStyle = [
    theme,
    css`
        :host {
            display: block;
            padding: 14px 16px 24px;
        }

        .master-toggle {
            display: flex;
            min-height: 62px;
            padding: 12px 14px;
            gap: 12px;
            align-items: center;
            border: 1px solid #cce6f2;
            border-radius: 10px;
            background: #f5fbfe;
        }

        .search {
            position: relative;
            display: block;
            margin: 12px 0;
        }

        .search wf-icon {
            position: absolute;
            top: 50%;
            left: 13px;
            color: #667085;
            transform: translateY(-50%);
            pointer-events: none;
        }

        .search input {
            width: 100%;
            height: 42px;
            padding: 0 12px 0 40px;
            color: var(--wf-mock-color-ink);
            border: 1px solid #d9e1e9;
            border-radius: 9px;
            background: #fff;
        }

        .search input::placeholder {
            color: #7d899b;
        }

        .endpoint-list {
            overflow: hidden;
            border: 1px solid #e0e6ed;
            border-radius: 10px;
            background: #fff;
        }

        .endpoint {
            padding: 12px 13px;
            border-bottom: 1px solid #e9edf2;
        }

        .endpoint:last-child {
            border-bottom: 0;
        }

        .endpoint.inactive {
            color: #98a2b3;
            background: #fafbfc;
        }

        .endpoint-heading {
            display: flex;
            min-width: 0;
            margin-bottom: 8px;
            gap: 10px;
            align-items: center;
        }

        .method {
            width: 48px;
            flex: 0 0 auto;
            font-size: 12px;
            font-weight: 750;
        }

        .method.get {
            color: #087dee;
        }

        .method.post {
            color: #16a05d;
        }

        .method.put,
        .method.patch {
            color: #e77b12;
        }

        .method.delete {
            color: #e5484d;
        }

        .path {
            min-width: 0;
            overflow: hidden;
            font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
            font-size: 12px;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .endpoint-control {
            display: grid;
            gap: 10px;
            align-items: center;
            grid-template-columns: minmax(0, 1fr) auto;
        }

        select {
            width: 100%;
            height: 36px;
            padding: 0 31px 0 10px;
            color: #344054;
            border: 1px solid #d8e0e8;
            border-radius: 7px;
            background: #fff;
        }

        select:disabled {
            color: #98a2b3;
            background: #f7f8fa;
        }

        .status,
        .empty {
            padding: 28px 16px;
            color: var(--wf-mock-color-muted);
            text-align: center;
        }

        .status.error {
            color: #b42318;
        }

        .retry {
            margin-top: 10px;
            padding: 7px 12px;
            border: 1px solid #d6dee7;
            border-radius: 7px;
            background: #fff;
            cursor: pointer;
        }
    `,
];
