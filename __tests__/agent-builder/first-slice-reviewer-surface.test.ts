import { execFileSync } from 'child_process';
import fs from 'fs';
import { createRequire } from 'module';
import path from 'path';

import { getByRole, getByText, queryByRole, within } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';

import { formatFirstSliceReviewerEvidence } from '../../src/agent-builder/first-slice-reviewer/evidence';
import type { FirstSliceReviewerFixture } from '../../src/agent-builder/first-slice-reviewer/schema';
import {
    initializeFirstSliceReviewerSurface,
    renderFirstSliceReviewerBlockedDocument,
    renderFirstSliceReviewerDocument
} from '../../src/agent-builder/first-slice-reviewer/surface';
import { validateFirstSliceReviewerFixture } from '../../src/agent-builder/first-slice-reviewer/validation';

const fixturePath = path.resolve(
    __dirname,
    '../../fixtures/agent-builder/first-slice-reviewer/valid_later_bounded_l2_candidate.synthetic.json'
);

type ArtifactWindow = Window & typeof globalThis & { close: () => void };

type JsdomRuntime = {
    JSDOM: new (
        html: string,
        options: { runScripts: 'dangerously'; url: string; virtualConsole: JsdomVirtualConsole }
    ) => { window: ArtifactWindow };
    VirtualConsole: new () => JsdomVirtualConsole;
};

type JsdomVirtualConsole = {
    on: (event: 'jsdomError', listener: (error: Error) => void) => void;
};

const requireFromJestEnvironment = createRequire(require.resolve('jest-environment-jsdom/package.json'));
const { JSDOM, VirtualConsole } = requireFromJestEnvironment('jsdom') as JsdomRuntime;

const renderThroughRepositoryTsx = () => {
    const rendererProgram = [
        "import fs from 'fs';",
        "import { renderFirstSliceReviewerDocument } from './src/agent-builder/first-slice-reviewer/surface.ts';",
        `const fixture = JSON.parse(fs.readFileSync(${JSON.stringify(fixturePath)}, 'utf8'));`,
        "const html = renderFirstSliceReviewerDocument({ fixture, nonce: 'artifact-test-nonce' });",
        "process.stdout.write(Buffer.from(html, 'utf8').toString('base64'));"
    ].join('\n');
    const encodedHtml = execFileSync(path.resolve(process.cwd(), 'node_modules/.bin/tsx'), ['--eval', rendererProgram], {
        cwd: process.cwd(),
        encoding: 'utf8'
    });

    return Buffer.from(encodedHtml.trim(), 'base64').toString('utf8');
};

const executeRenderedArtifact = (html: string) => {
    const scriptErrors: string[] = [];
    const virtualConsole = new VirtualConsole();
    virtualConsole.on('jsdomError', error => {
        scriptErrors.push(error.message);
    });

    const dom = new JSDOM(html, {
        runScripts: 'dangerously',
        url: 'http://127.0.0.1:4317/',
        virtualConsole
    });

    return { dom, scriptErrors };
};

const loadFixture = (): FirstSliceReviewerFixture => {
    const report = validateFirstSliceReviewerFixture(JSON.parse(fs.readFileSync(fixturePath, 'utf8')) as unknown);

    if (!report.fixture) {
        throw new Error('Expected the test fixture to satisfy the first-slice contract.');
    }

    return report.fixture;
};

const mountSurface = (fixture: FirstSliceReviewerFixture = loadFixture()) => {
    document.open();
    document.write(renderFirstSliceReviewerDocument({ fixture, nonce: 'test-nonce' }));
    document.close();
    initializeFirstSliceReviewerSurface(window, fixture);
};

afterEach(() => {
    document.documentElement.innerHTML = '<head></head><body></body>';
});

describe('first-slice reviewer evidence preview', () => {
    it('formats only the approved repo-first evidence fields', () => {
        const fixture = loadFixture();
        const evidence = formatFirstSliceReviewerEvidence(fixture, {
            classification: 'later bounded L2 candidate',
            reason: 'The invented context fits later bounded planning.',
            boundaryAcknowledged: true
        });

        expect(evidence).toBe(
            [
                'Fixture ID: SFR-LATER-L2',
                'Synthetic planning reference: Synthetic planning note Alpha',
                'Planning classification: later bounded L2 candidate',
                'Rationale: The invented context fits later bounded planning.',
                'Boundary acknowledgement: acknowledged — planning classification only',
                'Derived repo path: docs/agent-builder/review-evidence/SFR-LATER-L2.md',
                `Non-approval reminder: ${fixture.non_approval_reminder}`
            ].join('\n')
        );
        expect(evidence).not.toContain(fixture.workflow_title);
        expect(evidence).not.toContain(fixture.planning_purpose);
        expect(evidence).not.toContain('expected');
    });

    it('labels a hold reason without changing reviewer text', () => {
        const evidence = formatFirstSliceReviewerEvidence(loadFixture(), {
            classification: 'hold / clarify',
            reason: '<script>alert("inert")</script> & clarify\u2028next\u2029step',
            boundaryAcknowledged: true
        });

        expect(evidence).toContain('Hold reason: <script>alert("inert")</script> & clarify\u2028next\u2029step');
        expect(evidence).not.toContain('\nRationale:');
    });
});

describe('first-slice reviewer surface', () => {
    it('executes the tsx-transformed rendered artifact and supports validation and preview behavior', async () => {
        const html = renderThroughRepositoryTsx();
        const { dom, scriptErrors } = executeRenderedArtifact(html);

        try {
            const artifactDocument = dom.window.document;
            const artifactBody = artifactDocument.body;

            expect(scriptErrors).toEqual([]);
            expect(artifactDocument.getElementById('fixture-id')).toHaveTextContent('SFR-LATER-L2');
            expect(artifactDocument.querySelector('script:not([type])')).toHaveAttribute(
                'nonce',
                'artifact-test-nonce'
            );
            expect(artifactDocument.querySelector('script[src]')).toBeNull();
            expect(html).not.toMatch(
                /localStorage|sessionStorage|indexedDB|caches\.|document\.cookie|serviceWorker|fetch\(|XMLHttpRequest|WebSocket|EventSource|sendBeacon|SharedWorker|Worker\(|BroadcastChannel|postMessage/i
            );

            const user = userEvent.setup({ document: artifactDocument });
            await user.click(getByRole(artifactBody, 'button', { name: 'Preview evidence' }));

            const errorSummary = getByRole(artifactBody, 'alert');
            expect(errorSummary).toHaveFocus();
            expect(errorSummary).toHaveTextContent('Choose one planning classification.');

            await user.click(getByRole(artifactBody, 'radio', { name: 'later bounded L2 candidate' }));
            await user.type(
                artifactDocument.getElementById('reason') as HTMLTextAreaElement,
                'The invented context fits later bounded planning.'
            );
            await user.click(
                getByRole(artifactBody, 'checkbox', { name: /acknowledge the planning-only boundary/i })
            );
            await user.click(getByRole(artifactBody, 'button', { name: 'Preview evidence' }));

            expect(getByRole(artifactBody, 'heading', { name: 'Evidence preview' })).toHaveFocus();
            expect(artifactDocument.getElementById('evidence-preview')).toHaveTextContent(
                'Planning classification: later bounded L2 candidate'
            );
            expect(html).not.toContain('__name(');
            expect(html).not.toMatch(/\beval\s*\(|\bnew Function\b/);
        } finally {
            dom.window.close();
        }
    });

    it('renders the planning-only posture and native semantic controls', () => {
        mountSurface();

        expect(document.querySelectorAll('main')).toHaveLength(1);
        expect(document.querySelectorAll('h1')).toHaveLength(1);
        expect(getByRole(document.body, 'heading', { level: 1 })).toHaveTextContent('First-slice planning reviewer');

        const reminder = getByText(document.body, /Planning classification only; no implementation/);
        const form = getByRole(document.body, 'form', { name: 'Planning classification review' });

        expect(reminder.compareDocumentPosition(form) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
        expect(getByRole(document.body, 'group', { name: 'Choose one planning classification' })).toBeVisible();
        expect(getByRole(document.body, 'radio', { name: 'later bounded L2 candidate' })).not.toBeChecked();
        expect(getByRole(document.body, 'checkbox', { name: /acknowledge the planning-only boundary/i })).not.toBeChecked();
        expect(document.body).toHaveTextContent(
            /After you terminate the CLI or confirm the loopback URL is unavailable, this document is stale/i
        );
        expect(document.querySelector('[data-external-asset]')).toBeNull();
    });

    it('uses system colors and non-color error indicators in dark and forced-colors modes', () => {
        const html = renderFirstSliceReviewerDocument({ fixture: loadFixture(), nonce: 'test-nonce' });

        expect(html).toContain('.error { color: CanvasText;');
        expect(html).toContain('border-inline-start: 0.25rem solid Highlight;');
        expect(html).toContain('@media (forced-colors: active) { .error { color: CanvasText;');
        expect(html).not.toContain('color: #a40000');
    });

    it('focuses a concise error summary and preserves associated field errors', async () => {
        mountSurface();
        const user = userEvent.setup();

        await user.click(getByRole(document.body, 'button', { name: 'Preview evidence' }));

        const summary = getByRole(document.body, 'alert');
        expect(summary).toHaveFocus();
        expect(summary).toHaveTextContent('Choose one planning classification.');
        expect(summary).toHaveTextContent('Enter one concise rationale or hold reason.');
        expect(summary).toHaveTextContent('Acknowledge the planning-only boundary.');
        expect(getByRole(document.body, 'group', { name: 'Choose one planning classification' })).toHaveAttribute(
            'aria-invalid',
            'true'
        );
        expect(document.getElementById('reason')).toHaveAttribute('aria-invalid', 'true');
        expect(document.getElementById('boundary-acknowledgement')).toHaveAttribute('aria-invalid', 'true');
    });

    it('supports preview, return-to-edit, hold, and completion focus transitions', async () => {
        mountSurface();
        const user = userEvent.setup();
        const previewButton = getByRole(document.body, 'button', { name: 'Preview evidence' });

        await user.click(getByRole(document.body, 'radio', { name: 'hold / clarify' }));
        await user.type(document.getElementById('reason') as HTMLTextAreaElement, 'The invented context needs one clarification.');
        await user.click(
            getByRole(document.body, 'checkbox', { name: /acknowledge the planning-only boundary/i })
        );
        await user.click(previewButton);

        const previewHeading = getByRole(document.body, 'heading', { name: 'Evidence preview' });
        expect(previewHeading).toHaveFocus();
        expect(document.getElementById('evidence-preview')).toHaveTextContent(
            'Hold reason: The invented context needs one clarification.'
        );
        expect(getByRole(document.body, 'status')).toHaveTextContent('Hold / clarify evidence preview ready.');

        await user.click(getByRole(document.body, 'button', { name: 'Edit planning classification' }));
        expect(previewButton).toHaveFocus();
        expect(getByRole(document.body, 'radio', { name: 'hold / clarify' })).toBeChecked();

        await user.click(previewButton);
        await user.click(getByRole(document.body, 'button', { name: 'Complete for manual transfer' }));

        expect(getByRole(document.body, 'heading', { name: 'Complete for manual transfer' })).toHaveFocus();
        expect(getByRole(document.body, 'status')).toHaveTextContent(
            'Interaction complete for manual human transfer only.'
        );
        expect(document.getElementById('preview-panel')).not.toHaveAttribute('hidden');
        expect(document.getElementById('evidence-preview')).toBeVisible();
        expect(queryByRole(document.body, 'button', { name: 'Edit planning classification' })).toBeNull();
        expect(queryByRole(document.body, 'button', { name: 'Complete for manual transfer' })).toBeNull();
        expect(
            within(document.getElementById('preview-panel') as HTMLElement).queryByRole('button', {
                name: 'Reset review'
            })
        ).toBeNull();
        expect(document.body).toHaveTextContent(
            /do not rely on, copy, or manually transfer evidence from it, and close the tab before continuing review/i
        );
        expect(document.body).not.toHaveTextContent(/until reset, reload, navigation, tab close, or CLI termination/i);
        expect(document.body).not.toHaveTextContent(/approved|submitted|saved|published|released/i);
    });

    it('confirms reset, restores focus on cancel, and clears state on confirmation', async () => {
        mountSurface();
        const user = userEvent.setup();
        const resetButton = getByRole(document.body, 'button', { name: 'Reset review' });

        await user.click(getByRole(document.body, 'radio', { name: 'later bounded L2 candidate' }));
        await user.type(document.getElementById('reason') as HTMLTextAreaElement, 'Temporary reason');
        await user.click(resetButton);

        const dialog = getByRole(document.body, 'dialog', { name: 'Reset this review?' });
        expect(dialog).toHaveAttribute('aria-modal', 'false');
        expect(dialog).toHaveAttribute('aria-describedby', 'reset-dialog-description');
        expect(getByRole(document.body, 'heading', { name: 'Reset this review?' })).toHaveFocus();
        await user.click(getByRole(document.body, 'button', { name: 'Cancel reset' }));
        expect(resetButton).toHaveFocus();
        expect(document.getElementById('reason')).toHaveValue('Temporary reason');

        await user.click(resetButton);
        await user.click(getByRole(document.body, 'button', { name: 'Confirm reset' }));

        expect(getByRole(document.body, 'heading', { level: 1 })).toHaveFocus();
        expect(document.getElementById('reason')).toHaveValue('');
        expect(getByRole(document.body, 'radio', { name: 'later bounded L2 candidate' })).not.toBeChecked();
        expect(getByRole(document.body, 'status')).toHaveTextContent('Review state cleared.');
    });

    it('clears document-memory state on pagehide and persisted pageshow', async () => {
        mountSurface();
        const user = userEvent.setup();
        const reason = document.getElementById('reason') as HTMLTextAreaElement;

        await user.click(getByRole(document.body, 'radio', { name: 'first implicated CLO-52 lane dependency card' }));
        await user.type(reason, 'Temporary lifecycle reason');
        await user.click(
            getByRole(document.body, 'checkbox', { name: /acknowledge the planning-only boundary/i })
        );

        window.dispatchEvent(new Event('pagehide'));
        expect(reason).toHaveValue('');
        expect(getByRole(document.body, 'radio', { name: 'first implicated CLO-52 lane dependency card' })).not.toBeChecked();

        await user.type(reason, 'State restored by a browser would be cleared');
        const pageshow = new Event('pageshow');
        Object.defineProperty(pageshow, 'persisted', { value: true });
        window.dispatchEvent(pageshow);

        expect(reason).toHaveValue('');
        expect(getByRole(document.body, 'heading', { level: 1 })).toHaveFocus();
    });

    it('keeps fixture and reviewer markup inert and safely serializes embedded JSON', async () => {
        const fixture = {
            ...loadFixture(),
            workflow_title: '</script><img src=x onerror=alert(1)> & invented\u2028title\u2029',
            planning_purpose: '<script>globalThis.fixtureExecuted=true</script>'
        };
        const html = renderFirstSliceReviewerDocument({ fixture, nonce: 'test-nonce' });

        expect(html).not.toContain('</script><img');
        expect(html).not.toContain('<script>globalThis.fixtureExecuted');
        expect(html).toContain('\\u003c');
        expect(html).toContain('\\u003e');
        expect(html).toContain('\\u0026');
        expect(html).toContain('\\u2028');
        expect(html).toContain('\\u2029');

        mountSurface(fixture);
        expect(document.getElementById('workflow-title')).toHaveTextContent(
            '</script><img src=x onerror=alert(1)> & invented title'
        );
        expect(document.querySelector('img')).toBeNull();
        expect(document.querySelectorAll('script')).toHaveLength(2);

        const user = userEvent.setup();
        await user.click(getByRole(document.body, 'radio', { name: 'hold / clarify' }));
        await user.type(document.getElementById('reason') as HTMLTextAreaElement, '<img src=x onerror=alert(2)>');
        await user.click(
            getByRole(document.body, 'checkbox', { name: /acknowledge the planning-only boundary/i })
        );
        await user.click(getByRole(document.body, 'button', { name: 'Preview evidence' }));

        expect(document.getElementById('evidence-preview')).toHaveTextContent('<img src=x onerror=alert(2)>');
        expect(document.querySelector('img')).toBeNull();
    });

    it('contains no prohibited browser API or HTML insertion surface', () => {
        const source = `${renderFirstSliceReviewerDocument({ fixture: loadFixture(), nonce: 'test-nonce' })}\n${initializeFirstSliceReviewerSurface.toString()}`;

        expect(source).not.toMatch(
            /localStorage|sessionStorage|indexedDB|caches\.|document\.cookie|serviceWorker|pushState|replaceState|clipboard|fetch\(|XMLHttpRequest|WebSocket|EventSource|sendBeacon|innerHTML|outerHTML|insertAdjacentHTML/i
        );
        expect(source).not.toContain('form.submit');
    });

    it('renders blocked fixtures with safe field paths and messages only', () => {
        const html = renderFirstSliceReviewerBlockedDocument({
            nonce: 'test-nonce',
            errors: [
                {
                    path: 'planning_purpose',
                    code: 'source_retrieval',
                    message: 'Source retrieval instructions are not permitted.'
                }
            ]
        });

        document.open();
        document.write(html);
        document.close();

        expect(getByRole(document.body, 'heading', { name: 'Fixture blocked' })).toBeVisible();
        expect(document.body).toHaveTextContent('planning_purpose: Source retrieval instructions are not permitted.');
        expect(queryByRole(document.body, 'form')).toBeNull();
        expect(within(document.body).queryByText(/filesystem|stack trace|fixture contents/i)).toBeNull();
    });
});
