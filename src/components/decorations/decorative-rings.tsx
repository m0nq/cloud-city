import { ReactNode } from 'react';

interface DecorativeRingsProps {
    color?: string;
    className?: string;
    rotations?: [number, number, number];
    opacity?: [number, number];
}

export const DecorativeRings = ({
    color = '#FF69B4',
    className = '',
    rotations = [15, -15, 45],
    opacity = [0.6, 0.2]
}: DecorativeRingsProps): ReactNode => {
    // Fixed dimensions with padding for rotation
    const width = 780;
    const height = 409;
    const padding = 200; // Add padding to accommodate rotation
    
    // Center points for the actual ellipses
    const cx = width / 2 + padding;
    const cy = height / 2 + padding;
    const rx = width / 2;
    const ry = height / 2;

    return (
        <div className={className}>
            <svg 
                viewBox={`0 0 ${width + padding * 2} ${height + padding * 2}`}
                width={width + padding * 2}
                height={height + padding * 2}
                style={{ margin: -padding }} // Offset the padding
            >
                <defs>
                    <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={color} stopOpacity={opacity[0]} />
                        <stop offset="100%" stopColor={color} stopOpacity={opacity[1]} />
                    </linearGradient>
                </defs>
                {rotations.map((rotation, index) => (
                    <ellipse
                        key={index}
                        cx={cx}
                        cy={cy}
                        rx={rx}
                        ry={ry}
                        fill="none"
                        stroke="url(#ringGradient)"
                        strokeWidth={1}
                        transform={`rotate(${rotation}, ${cx}, ${cy})`}
                    />
                ))}
            </svg>
        </div>
    );
};
