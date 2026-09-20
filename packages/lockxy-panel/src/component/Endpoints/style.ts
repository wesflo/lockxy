import { css } from 'lit';

import { theme } from '../theme.style.js';

export const endpointsStyle = [
    theme,
    css`
        :host {
            display: block;
            padding: var(--wf-gap-l) var(--wf-gap-l) var(--wf-gap-l);
        }

        .master-toggle {
            display: flex;
            min-height: 62px;
            padding: var(--wf-gap-m) var(--wf-gap-l);
            gap: var(--wf-gap-m);
            align-items: center;
            border: 1px solid var(--wf-line);
            border-radius: 10px;
            background: var(--wf-surface-soft);
        }

        .search {
            position: relative;
            display: block;
            margin: var(--wf-gap-m) 0;
        }

        .search wf-icon {
            position: absolute;
            top: 50%;
            left: 14px;
            color: var(--wf-muted);
            transform: translateY(-50%);
            pointer-events: none;
        }

        .search input {
            width: 100%;
            height: 42px;
            padding: 0 var(--wf-gap-m) 0 var(--wf-gap-xl);
            color: var(--wf-ink);
            border: 1px solid var(--wf-line);
            border-radius: 10px;
            background: var(--wf-white);
        }

        .search input::placeholder {
            color: var(--wf-muted);
        }

        .endpoint-list {
            overflow: hidden;
            border: 1px solid var(--wf-line);
            border-radius: 10px;
            background: var(--wf-white);
        }

        .endpoint {
            padding: var(--wf-gap-m) var(--wf-gap-l);
            border-bottom: 1px solid var(--wf-line-soft);
        }

        .endpoint:last-child {
            border-bottom: 0;
        }

        .endpoint.controlled {
            color: var(--wf-muted-light);
            background: var(--wf-surface);
        }

        .endpoint.controlled .method {
            color: var(--wf-muted-light);
        }

        .endpoint-heading {
            display: flex;
            min-width: 0;
            margin-bottom: var(--wf-gap-m);
            gap: var(--wf-gap-m);
            align-items: center;
        }

        .methods {
            display: inline-flex;
            min-width: 48px;
            gap: var(--wf-gap-m);
            flex: 0 0 auto;
        }

        .method {
            font-size: var(--wf-font-size-xs);
            font-weight: 750;
        }

        .method.get {
            color: var(--wf-method-get);
        }

        .method.post {
            color: var(--wf-method-post);
        }

        .method.put {
            color: var(--wf-method-put);
        }

        .method.patch {
            color: var(--wf-method-patch);
        }

        .method.delete {
            color: var(--wf-method-delete);
        }

        .endpoint-name {
            min-width: 0;
            overflow: hidden;
            font-size: var(--wf-font-size-xs);
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .endpoint-name.path {
            direction: rtl;
            font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
            text-align: left;
        }

        .endpoint-control {
            display: grid;
            gap: var(--wf-gap-m);
            align-items: center;
            grid-template-columns: minmax(0, 1fr) auto;
        }

        .scenario-value {
            font-size: var(--wf-font-size-s);
        }

        .manifest-control {
            color: var(--wf-danger);
            font-size: var(--wf-font-size-s);
            font-weight: 650;
            text-decoration: none;
        }

        .manifest-control:hover {
            text-decoration: underline;
        }

        .manifest-control:focus-visible {
            border-radius: var(--wf-radius-s);
            outline: 2px solid var(--wf-focus);
            outline-offset: 2px;
        }

        .root-manifest-control {
            display: grid;
            min-height: 180px;
            padding: var(--wf-gap-xl);
            place-items: center;
            text-align: center;
        }

        select {
            width: 100%;
            height: 36px;
            padding: 0 var(--wf-gap-xl) 0 var(--wf-gap-m);
            color: var(--wf-ink-soft);
            border: 1px solid var(--wf-line);
            border-radius: 8px;
            background: var(--wf-white);
            font-size: var(--wf-font-size-s);
        }

        select:disabled {
            color: var(--wf-muted-light);
            background: var(--wf-surface-soft);
        }

        .status,
        .empty {
            padding: var(--wf-gap-xl) var(--wf-gap-l);
            color: var(--wf-muted);
            text-align: center;
        }

        .status.error {
            color: var(--wf-danger);
        }

        .retry {
            margin-top: var(--wf-gap-m);
            padding: var(--wf-gap-m) var(--wf-gap-m);
            border: 1px solid var(--wf-line);
            border-radius: 8px;
            background: var(--wf-white);
            cursor: pointer;
        }

        .footer {
            display: flex;
            margin-top: var(--wf-gap-l);
            gap: var(--wf-gap-m);
            align-items: center;
            flex-direction: column;
        }

        .footer a {
            color: var(--wf-muted);
            font-size: var(--wf-font-size-xs);
            text-decoration: none;
        }

        .footer a:hover {
            color: var(--wf-primary-dark);
            text-decoration: underline;
        }

        .footer a:focus-visible {
            border-radius: var(--wf-radius-s);
            outline: 2px solid var(--wf-focus);
            outline-offset: 2px;
        }
    `,
];
