import '@testing-library/jest-dom';
import { screen } from '@testing-library/react';
import { render } from '@testing-library/react';

import { Section } from './Section';

describe('Section component tests', () => {
    it('renders with default props', () => {
        render(<Section classes="">Children</Section>);
        const sectionElement = screen.getByText('Children');
        expect(sectionElement).toBeInTheDocument();
        expect(sectionElement.tagName).toBe('SECTION');
    });

    it('renders with custom styles and classes', () => {
        const styles = { backgroundColor: 'red', color: 'white' };
        render(
            <Section styles={styles} classes="custom-class">
                Children
            </Section>
        );
        const sectionElement = screen.getByText('Children');
        expect(sectionElement).toBeInTheDocument();
        expect(sectionElement.tagName).toBe('SECTION');
        expect(sectionElement).toHaveStyle('backgroundColor: red');
        expect(sectionElement).toHaveStyle('color: white');
        expect(sectionElement).toHaveClass('custom-class');
    });

    it('renders children', () => {
        render(
            <Section classes="">
                <div>Child 1</div>
                <div>Child 2</div>
            </Section>
        );
        const child1 = screen.getByText('Child 1');
        const child2 = screen.getByText('Child 2');
        expect(child1).toBeInTheDocument();
        expect(child2).toBeInTheDocument();
    });
});
