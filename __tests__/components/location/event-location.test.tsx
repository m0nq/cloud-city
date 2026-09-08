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

    it('renders fallback text when address is missing', () => {
        render(<EventLocation address="" />);

        expect(screen.getByText('Location TBA')).toBeInTheDocument();
    });
});
