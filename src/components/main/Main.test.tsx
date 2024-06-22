import { screen } from '@testing-library/react';
import { render } from '@testing-library/react';

import { Main } from './Main';

jest.mock('@components/projects/Projects', () => require('../../../__mocks__/Projects'));

xdescribe('Main', () => {
    it('renders the About component', () => {
        render(<Main />);
        const aboutSection = screen.getByTestId('about');
        expect(aboutSection).toBeInTheDocument();
    });

    it('renders the Skills component', () => {
        render(<Main />);
        const skillsSection = screen.getByTestId('skills');
        expect(skillsSection).toBeInTheDocument();
    });

    it('renders the Projects component', () => {
        render(<Main />);
        const projectsSection = screen.getByTestId('projects');
        expect(projectsSection).toBeInTheDocument();
    });

    it('renders the main wrapper', () => {
        render(<Main />);
        const mainWrapper = screen.getByRole('main');
        expect(mainWrapper).toBeInTheDocument();
    });

    it('renders the item list wrapper', () => {
        render(<Main />);
        const itemListWrapper = screen.getByTestId('main-content-wrapper');
        expect(itemListWrapper).toBeInTheDocument();
    });

    it('renders the item list', () => {
        render(<Main />);
        const itemList = screen.getByTestId('inner-content-wrapper');
        expect(itemList).toBeInTheDocument();
    });
});
