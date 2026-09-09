import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { EventLocation } from '@/components/location/event-location';

describe('EventLocation', () => {
    it('renders a native keyboard-accessible Google Maps link', async () => {
        const user = userEvent.setup();

        render(<EventLocation address="123 Main St, San Francisco, CA" />);

        const locationLink = screen.getByRole('link', { name: '123 Main St, San Francisco, CA' });

        expect(locationLink).toHaveAttribute(
            'href',
            'https://www.google.com/maps/search/?api=1&query=123%20Main%20St%2C%20San%20Francisco%2C%20CA'
        );
        expect(locationLink).toHaveAttribute('target', '_blank');
        expect(locationLink).toHaveAttribute('rel', 'noopener noreferrer');

        await user.tab();
        expect(locationLink).toHaveFocus();
    });

    it.each(['TBA', 'tba', 'TBD', 'Location TBD', '', '   '])(
        'renders %j as non-interactive unresolved location context', address => {
            render(<EventLocation address={address} />);

            const displayedAddress = address.trim() || 'Location TBA';
            const locationText = screen.getByText(displayedAddress);
            const locationContainer = locationText.parentElement;

            expect(locationText).toBeInTheDocument();
            expect(screen.queryByRole('link')).not.toBeInTheDocument();
            expect(locationContainer).not.toHaveClass('cursor-pointer');
            expect(locationContainer).not.toHaveAttribute('href');
            expect(locationContainer).not.toHaveAttribute('target');
            expect(locationContainer).not.toHaveAttribute('rel');
        }
    );

    it('keeps a similar-letter address as a real Maps link', () => {
        render(<EventLocation address="TBAA Arts Center" />);

        const locationLink = screen.getByRole('link', { name: 'TBAA Arts Center' });

        expect(locationLink).toHaveAttribute(
            'href',
            'https://www.google.com/maps/search/?api=1&query=TBAA%20Arts%20Center'
        );
    });

    it('preserves the displayed placeholder text', () => {
        render(<EventLocation address="Venue TBA" />);

        expect(screen.getByText('Venue TBA')).toBeInTheDocument();
    });
});
