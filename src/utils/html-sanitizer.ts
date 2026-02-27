import sanitizeHtml, { IOptions } from 'sanitize-html';

const normalizeAnchorRel = (rel: string | undefined): string => {
    const relTokens = new Set(
        (rel ?? '')
            .split(/\s+/)
            .filter(Boolean)
            .map(token => token.toLowerCase())
    );

    relTokens.add('noopener');
    relTokens.add('noreferrer');

    return [...relTokens].join(' ');
};

const sanitizeOptions: IOptions = {
    allowedTags: [...sanitizeHtml.defaults.allowedTags, 'img', 'figure', 'figcaption', 'iframe'],
    allowedAttributes: {
        ...sanitizeHtml.defaults.allowedAttributes,
        a: ['href', 'name', 'target', 'rel'],
        img: ['src', 'srcset', 'alt', 'title', 'width', 'height', 'loading', 'decoding'],
        iframe: ['src', 'title', 'width', 'height', 'allow', 'allowfullscreen', 'frameborder', 'loading', 'referrerpolicy']
    },
    allowedSchemes: ['http', 'https', 'mailto', 'tel'],
    transformTags: {
        a: (_, attribs) => ({
            tagName: 'a',
            attribs: {
                ...attribs,
                target: '_blank',
                rel: normalizeAnchorRel(attribs.rel)
            }
        })
    }
};

export const sanitizeContent = (content: string): string => sanitizeHtml(content, sanitizeOptions);
