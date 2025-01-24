type ButtonProps = {
    isPending: boolean;
    className: string;
    type: 'button' | 'submit' | 'reset' | undefined;
};

export const Button = ({ isPending, className, type = 'button' }: ButtonProps) => {
    return (
        <button type={type} className={className} aria-disabled={isPending}>
            <span>Subscribe</span>
        </button>
    );
};
