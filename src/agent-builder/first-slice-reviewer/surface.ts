import type { FirstSliceReviewerFixture } from './schema';
import type { FirstSliceValidationError } from './validation';

const escapeHtml = (value: string) =>
    value.replace(/[&<>"']/g, character => {
        const entities: Record<string, string> = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        };

        return entities[character] ?? character;
    });

export const serializeFirstSliceEmbeddedJson = (value: unknown) =>
    JSON.stringify(value).replace(/[<>&\u2028\u2029]/g, character => {
        const escapes: Record<string, string> = {
            '<': '\\u003c',
            '>': '\\u003e',
            '&': '\\u0026',
            '\u2028': '\\u2028',
            '\u2029': '\\u2029'
        };

        return escapes[character] ?? character;
    });

const sharedStyle = `
:root { color-scheme: light dark; font-family: system-ui, sans-serif; line-height: 1.5; }
body { margin: 0; background: Canvas; color: CanvasText; }
main { width: min(56rem, calc(100% - 2rem)); margin: 0 auto; padding: 2rem 0 4rem; }
h1, h2, legend { line-height: 1.2; }
.posture { border: 0.2rem solid #8a4b00; padding: 1rem; font-weight: 700; }
.context, form, .panel, [role="dialog"] { border: 0.1rem solid GrayText; border-radius: 0.4rem; padding: 1rem; margin-block: 1rem; }
dl { display: grid; grid-template-columns: minmax(10rem, 1fr) minmax(0, 2fr); gap: 0.5rem 1rem; }
dt { font-weight: 700; }
dd { margin: 0; overflow-wrap: anywhere; }
fieldset { margin: 0 0 1rem; padding: 1rem; }
.choice { display: block; margin-block: 0.65rem; }
label { font-weight: 650; }
textarea { display: block; box-sizing: border-box; width: 100%; min-height: 7rem; margin-block: 0.4rem 1rem; font: inherit; }
button { min-height: 2.75rem; margin: 0.35rem 0.5rem 0.35rem 0; padding: 0.55rem 0.9rem; font: inherit; }
button, input, textarea { accent-color: Highlight; }
:focus-visible, [tabindex="-1"]:focus { outline: 0.22rem solid Highlight; outline-offset: 0.2rem; }
.error { color: CanvasText; border-inline-start: 0.25rem solid Highlight; padding-inline-start: 0.5rem; font-weight: 700; }
[aria-invalid="true"] { border: 0.18rem solid Highlight; }
pre { white-space: pre-wrap; overflow-wrap: anywhere; border: 0.1rem solid GrayText; padding: 1rem; user-select: text; }
[hidden] { display: none !important; }
@media (max-width: 40rem) { main { width: min(100% - 1rem, 56rem); padding-top: 0.75rem; } dl { grid-template-columns: 1fr; } }
@media (forced-colors: active) { .error { color: CanvasText; border-color: Highlight; } [aria-invalid="true"] { border-color: Highlight; } .posture, .context, form, .panel, [role="dialog"], pre { border-color: CanvasText; } }
`;

export const initializeFirstSliceReviewerSurface = (
    browserWindow: Window,
    fixture: FirstSliceReviewerFixture
) => {
    const browserDocument = browserWindow.document;
    const elementAccess = {
        require<ElementType extends HTMLElement>(id: string) {
            const element = browserDocument.getElementById(id);

            if (!element) {
                throw new Error('The local reviewer document is incomplete.');
            }

            return element as ElementType;
        }
    };

    const heading = elementAccess.require<HTMLHeadingElement>('reviewer-heading');
    const form = elementAccess.require<HTMLFormElement>('review-form');
    const classificationGroup = elementAccess.require<HTMLFieldSetElement>('classification-group');
    const reason = elementAccess.require<HTMLTextAreaElement>('reason');
    const acknowledgement = elementAccess.require<HTMLInputElement>('boundary-acknowledgement');
    const errorSummary = elementAccess.require<HTMLElement>('error-summary');
    const errorList = elementAccess.require<HTMLUListElement>('error-list');
    const previewPanel = elementAccess.require<HTMLElement>('preview-panel');
    const previewHeading = elementAccess.require<HTMLHeadingElement>('preview-heading');
    const previewText = elementAccess.require<HTMLElement>('evidence-preview');
    const completionPanel = elementAccess.require<HTMLElement>('completion-panel');
    const completionHeading = elementAccess.require<HTMLHeadingElement>('completion-heading');
    const resetDialog = elementAccess.require<HTMLElement>('reset-dialog');
    const resetDialogHeading = elementAccess.require<HTMLHeadingElement>('reset-dialog-heading');
    const status = elementAccess.require<HTMLElement>('review-status');
    const previewButton = elementAccess.require<HTMLButtonElement>('preview-button');
    const editButton = elementAccess.require<HTMLButtonElement>('edit-button');
    const completeButton = elementAccess.require<HTMLButtonElement>('complete-button');
    const previewResetButton = elementAccess.require<HTMLButtonElement>('preview-reset-button');
    const cancelResetButton = elementAccess.require<HTMLButtonElement>('cancel-reset-button');
    const confirmResetButton = elementAccess.require<HTMLButtonElement>('confirm-reset-button');
    const resetButtons = Array.from(browserDocument.querySelectorAll<HTMLButtonElement>('[data-reset-review]'));
    const classificationError = elementAccess.require<HTMLElement>('classification-error');
    const reasonError = elementAccess.require<HTMLElement>('reason-error');
    const acknowledgementError = elementAccess.require<HTMLElement>('acknowledgement-error');
    const radios = Array.from(browserDocument.querySelectorAll<HTMLInputElement>('input[name="classification"]'));

    let lastEditFocus: HTMLElement = previewButton;
    let focusBeforeReset: HTMLElement | null = null;

    const actions = {
        setText(id: string, value: string) {
            elementAccess.require(id).textContent = value;
        },
        appendLabels(id: string, labels: string[]) {
            const list = elementAccess.require<HTMLUListElement>(id);
            list.replaceChildren();

            for (const label of labels) {
                const item = browserDocument.createElement('li');
                item.textContent = label;
                list.append(item);
            }
        },
        hideFieldErrors() {
            classificationError.hidden = true;
            reasonError.hidden = true;
            acknowledgementError.hidden = true;
            classificationGroup.removeAttribute('aria-invalid');
            reason.removeAttribute('aria-invalid');
            acknowledgement.removeAttribute('aria-invalid');
        },
        clearState({ focusHeading, message }: { focusHeading: boolean; message: string }) {
            form.reset();
            for (const radio of radios) {
                radio.checked = false;
            }
            reason.value = '';
            acknowledgement.checked = false;
            previewText.textContent = '';
            errorList.replaceChildren();
            errorSummary.hidden = true;
            previewPanel.hidden = true;
            completionPanel.hidden = true;
            resetDialog.hidden = true;
            editButton.hidden = false;
            completeButton.hidden = false;
            previewResetButton.hidden = false;
            form.hidden = false;
            actions.hideFieldErrors();
            status.textContent = message;
            lastEditFocus = previewButton;
            focusBeforeReset = null;

            if (focusHeading) {
                heading.focus();
            }
        },
        showErrors(errors: Array<{ field: 'classification' | 'reason' | 'acknowledgement'; message: string }>) {
            actions.hideFieldErrors();
            errorList.replaceChildren();

            for (const error of errors) {
                const item = browserDocument.createElement('li');
                item.textContent = error.message;
                errorList.append(item);

                if (error.field === 'classification') {
                    classificationError.hidden = false;
                    classificationGroup.setAttribute('aria-invalid', 'true');
                } else if (error.field === 'reason') {
                    reasonError.hidden = false;
                    reason.setAttribute('aria-invalid', 'true');
                } else {
                    acknowledgementError.hidden = false;
                    acknowledgement.setAttribute('aria-invalid', 'true');
                }
            }

            errorSummary.hidden = false;
            status.textContent = 'Review the highlighted planning fields.';
            errorSummary.focus();
        },
        openResetConfirmation(event: Event) {
            focusBeforeReset = event.currentTarget instanceof HTMLElement ? event.currentTarget : null;
            resetDialog.hidden = false;
            resetDialogHeading.focus();
        }
    };

    actions.setText('fixture-id', fixture.fixture_id);
    actions.setText('planning-reference', fixture.planning_reference);
    actions.setText('workflow-title', fixture.workflow_title);
    actions.setText('context-category', fixture.context_category);
    actions.setText('planning-purpose', fixture.planning_purpose);
    actions.setText('reviewer-role', fixture.reviewer_role);
    actions.setText('stop-condition', fixture.stop_condition);
    actions.setText('non-approval-reminder', fixture.non_approval_reminder);

    actions.appendLabels('allowed-references', fixture.allowed_references);
    actions.appendLabels('forbidden-uses', fixture.forbidden_uses);

    form.addEventListener('submit', event => {
        event.preventDefault();
        const selected = radios.find(radio => radio.checked);
        const trimmedReason = reason.value.trim();
        const errors: Array<{ field: 'classification' | 'reason' | 'acknowledgement'; message: string }> = [];

        if (!selected) {
            errors.push({ field: 'classification', message: 'Choose one planning classification.' });
        }

        if (!trimmedReason) {
            errors.push({ field: 'reason', message: 'Enter one concise rationale or hold reason.' });
        } else if (trimmedReason.length > 1000) {
            errors.push({ field: 'reason', message: 'The rationale or hold reason must be 1,000 characters or fewer.' });
        }

        if (!acknowledgement.checked) {
            errors.push({ field: 'acknowledgement', message: 'Acknowledge the planning-only boundary.' });
        }

        if (errors.length > 0 || !selected) {
            actions.showErrors(errors);
            return;
        }

        lastEditFocus = previewButton;
        reason.value = trimmedReason;
        const reasonLabel = selected.value === 'hold / clarify' ? 'Hold reason' : 'Rationale';
        previewText.textContent = [
            `Fixture ID: ${fixture.fixture_id}`,
            `Synthetic planning reference: ${fixture.planning_reference}`,
            `Planning classification: ${selected.value}`,
            `${reasonLabel}: ${trimmedReason}`,
            'Boundary acknowledgement: acknowledged — planning classification only',
            `Derived repo path: docs/agent-builder/review-evidence/${fixture.fixture_id}.md`,
            `Non-approval reminder: ${fixture.non_approval_reminder}`
        ].join('\n');
        actions.hideFieldErrors();
        errorSummary.hidden = true;
        form.hidden = true;
        completionPanel.hidden = true;
        editButton.hidden = false;
        completeButton.hidden = false;
        previewResetButton.hidden = false;
        previewPanel.hidden = false;
        status.textContent =
            selected.value === 'hold / clarify'
                ? 'Hold / clarify evidence preview ready.'
                : 'Evidence preview ready.';
        previewHeading.focus();
    });

    editButton.addEventListener('click', () => {
        previewPanel.hidden = true;
        completionPanel.hidden = true;
        form.hidden = false;
        status.textContent = 'Planning classification ready to edit.';
        lastEditFocus.focus();
    });

    completeButton.addEventListener('click', () => {
        form.hidden = true;
        editButton.hidden = true;
        completeButton.hidden = true;
        previewResetButton.hidden = true;
        completionPanel.hidden = false;
        status.textContent = 'Interaction complete for manual human transfer only.';
        completionHeading.focus();
    });

    for (const resetButton of resetButtons) {
        resetButton.addEventListener('click', actions.openResetConfirmation);
    }

    cancelResetButton.addEventListener('click', () => {
        resetDialog.hidden = true;
        status.textContent = 'Reset cancelled.';
        focusBeforeReset?.focus();
        focusBeforeReset = null;
    });

    confirmResetButton.addEventListener('click', () => {
        actions.clearState({ focusHeading: true, message: 'Review state cleared.' });
    });

    browserWindow.addEventListener('pagehide', () => {
        actions.clearState({ focusHeading: false, message: '' });
    });

    browserWindow.addEventListener('pageshow', event => {
        if ('persisted' in event && event.persisted === true) {
            actions.clearState({ focusHeading: true, message: 'Review state cleared after return.' });
        }
    });

    actions.clearState({ focusHeading: false, message: '' });
};

export const renderFirstSliceReviewerDocument = ({
    fixture,
    nonce
}: {
    fixture: FirstSliceReviewerFixture;
    nonce: string;
}) => {
    const safeNonce = escapeHtml(nonce);
    const fixtureJson = serializeFirstSliceEmbeddedJson(fixture);
    // Keep one typed initializer source while restricting it to syntax that the repository's tsx transform
    // emits without undeclared helper closures. The rendered-artifact regression executes this exact boundary.
    const initializer = `(${initializeFirstSliceReviewerSurface.toString()})(window, JSON.parse(document.getElementById('first-slice-fixture-data').textContent));`;

    return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="referrer" content="no-referrer">
<title>First-slice planning reviewer</title>
<style nonce="${safeNonce}">${sharedStyle}</style>
</head>
<body>
<main>
<h1 id="reviewer-heading" tabindex="-1">First-slice planning reviewer</h1>
<p id="non-approval-reminder" class="posture"></p>
<aside class="panel" aria-label="Stale loaded-document instruction">
<p>Terminating the CLI stops the loopback server and future loads and requests. It does not notify or clear this already-loaded document.</p>
<p id="stale-document-instruction">After you terminate the CLI or confirm the loopback URL is unavailable, this document is stale. Stop interacting with it. Do not rely on, copy, or manually transfer evidence from it, and close the tab before continuing review.</p>
</aside>
<section class="context" aria-labelledby="context-heading">
<h2 id="context-heading">Bounded synthetic planning context</h2>
<dl>
<dt>Fixture ID</dt><dd id="fixture-id"></dd>
<dt>Synthetic planning reference</dt><dd id="planning-reference"></dd>
<dt>Workflow title</dt><dd id="workflow-title"></dd>
<dt>Context category</dt><dd id="context-category"></dd>
<dt>Planning purpose</dt><dd id="planning-purpose"></dd>
<dt>Reviewer role</dt><dd id="reviewer-role"></dd>
<dt>Allowed references</dt><dd><ul id="allowed-references"></ul></dd>
<dt>Forbidden uses</dt><dd><ul id="forbidden-uses"></ul></dd>
<dt>Stop condition</dt><dd id="stop-condition"></dd>
</dl>
</section>
<section id="error-summary" class="panel error" role="alert" tabindex="-1" hidden>
<h2>Review the highlighted fields</h2>
<ul id="error-list"></ul>
</section>
<form id="review-form" aria-label="Planning classification review" autocomplete="off" novalidate>
<fieldset id="classification-group" aria-describedby="classification-error">
<legend>Choose one planning classification</legend>
<label class="choice"><input type="radio" name="classification" value="later bounded L2 candidate" autocomplete="off"> later bounded L2 candidate</label>
<label class="choice"><input type="radio" name="classification" value="first implicated CLO-52 lane dependency card" autocomplete="off"> first implicated CLO-52 lane dependency card</label>
<label class="choice"><input type="radio" name="classification" value="hold / clarify" autocomplete="off"> hold / clarify</label>
<p id="classification-error" class="error" hidden>Choose one planning classification.</p>
</fieldset>
<label for="reason">Concise rationale or hold reason</label>
<textarea id="reason" name="reason" maxlength="1000" aria-describedby="reason-guidance reason-error" autocomplete="off"></textarea>
<p id="reason-guidance">Use 1–1,000 characters. This text remains only in this document's memory.</p>
<p id="reason-error" class="error" hidden>Enter one concise rationale or hold reason.</p>
<label class="choice" for="boundary-acknowledgement">
<input id="boundary-acknowledgement" type="checkbox" autocomplete="off" aria-describedby="acknowledgement-error">
I acknowledge the planning-only boundary and manual human transfer requirement.
</label>
<p id="acknowledgement-error" class="error" hidden>Acknowledge the planning-only boundary.</p>
<button id="preview-button" type="submit">Preview evidence</button>
<button type="button" data-reset-review>Reset review</button>
</form>
<section id="preview-panel" class="panel" aria-labelledby="preview-heading" hidden>
<h2 id="preview-heading" tabindex="-1">Evidence preview</h2>
<p>Select the plain text for manual human transfer. Nothing is copied or written automatically.</p>
<pre id="evidence-preview" tabindex="0"></pre>
<button id="edit-button" type="button">Edit planning classification</button>
<button id="complete-button" type="button">Complete for manual transfer</button>
<button id="preview-reset-button" type="button" data-reset-review>Reset review</button>
</section>
<section id="completion-panel" class="panel" aria-labelledby="completion-heading" hidden>
<h2 id="completion-heading" tabindex="-1">Complete for manual transfer</h2>
<p>The interaction is complete for manual human transfer only. The selectable evidence preview remains above in this document's memory until a browser lifecycle event clears it. If you terminate the CLI or confirm loopback unavailability, this document is stale: do not rely on, copy, or manually transfer evidence from it, and close the tab before continuing review.</p>
<button type="button" data-reset-review>Reset review</button>
</section>
<section id="reset-dialog" role="dialog" aria-modal="false" aria-labelledby="reset-dialog-heading" aria-describedby="reset-dialog-description" hidden>
<h2 id="reset-dialog-heading" tabindex="-1">Reset this review?</h2>
<p id="reset-dialog-description">This clears the temporary planning classification, reason, acknowledgement, and evidence preview.</p>
<button id="confirm-reset-button" type="button">Confirm reset</button>
<button id="cancel-reset-button" type="button">Cancel reset</button>
</section>
<p id="review-status" role="status" aria-live="polite" aria-atomic="true"></p>
</main>
<script id="first-slice-fixture-data" type="application/json" nonce="${safeNonce}">${fixtureJson}</script>
<script nonce="${safeNonce}">${initializer}</script>
</body>
</html>`;
};

export const renderFirstSliceReviewerBlockedDocument = ({
    errors,
    nonce
}: {
    errors: FirstSliceValidationError[];
    nonce: string;
}) => {
    const safeNonce = escapeHtml(nonce);
    const items = errors
        .map(error => `<li><strong>${escapeHtml(error.path)}</strong>: ${escapeHtml(error.message)}</li>`)
        .join('');

    return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="referrer" content="no-referrer">
<title>Fixture blocked</title>
<style nonce="${safeNonce}">${sharedStyle}</style>
</head>
<body>
<main>
<h1>Fixture blocked</h1>
<p class="posture">The selected synthetic fixture does not satisfy the bounded planning contract. No reviewer interaction is available.</p>
<section class="panel" aria-labelledby="blocked-details-heading">
<h2 id="blocked-details-heading">Contract findings</h2>
<ul>${items}</ul>
</section>
</main>
</body>
</html>`;
};

export const renderFirstSliceReviewerTechnicalErrorDocument = ({ nonce }: { nonce: string }) => {
    const safeNonce = escapeHtml(nonce);

    return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="referrer" content="no-referrer">
<title>Local reviewer unavailable</title>
<style nonce="${safeNonce}">${sharedStyle}</style>
</head>
<body>
<main>
<h1>Local reviewer unavailable</h1>
<p class="posture">The bounded local planning surface could not be prepared. No reviewer interaction is available.</p>
</main>
</body>
</html>`;
};
