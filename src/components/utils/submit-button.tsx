type SubmitButtonProps = { isPending: boolean; }

export const SubmitButton = ({ isPending }: SubmitButtonProps) => {

    return (
        <button type="submit" className="submit-button" aria-disabled={isPending}>
            <span>Subscribe</span>
        </button>
    );
};
