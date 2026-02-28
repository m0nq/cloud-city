import { ReactNode } from 'react';
import { useCallback } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useMemo } from 'react';

import { Particles } from '@tsparticles/react';
import { initParticlesEngine } from '@tsparticles/react';
import { Engine } from '@tsparticles/engine';
import { MoveDirection } from '@tsparticles/engine';
import { OutMode } from '@tsparticles/engine';
import { loadSlim } from '@tsparticles/slim';

import styles from './particles-background.module.css';

const CLOUD_CLUSTER_OFFSETS = [
    { x: -8, y: 1 },
    { x: 0, y: -2 },
    { x: 9, y: 2 }
];

const createRandomClusterCenters = (count: number) => {
    const randomInRange = (min: number, max: number) => min + Math.random() * (max - min);
    const minCenterDistance = 28;
    const maxAttempts = 24;
    const centers: Array<{ x: number; y: number }> = [];

    while (centers.length < count) {
        let nextCenter: { x: number; y: number } | null = null;

        for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
            const candidate = {
                x: randomInRange(12, 88),
                y: randomInRange(20, 52)
            };
            const isFarEnough = centers.every((center) => {
                const distance = Math.hypot(candidate.x - center.x, candidate.y - center.y);

                return distance >= minCenterDistance;
            });

            if (isFarEnough) {
                nextCenter = candidate;
                break;
            }
        }

        centers.push(nextCenter ?? {
            x: randomInRange(12, 88),
            y: randomInRange(20, 52)
        });
    }

    return centers;
};

const ParticlesBackground = (): ReactNode => {
    const [init, setInit] = useState<boolean>(false);

    useEffect(() => {
        initParticlesEngine(async (engine: Engine) => {
            await loadSlim(engine);
        }).then(() => {
            setInit(true);
        });
    }, []);

    const particlesLoaded = useCallback(async (container: any) => {
        await container;
    }, []);

    const manualParticles = useMemo(() => {
        const centers = createRandomClusterCenters(2);

        return centers.flatMap((center) => (
            CLOUD_CLUSTER_OFFSETS.map(({ x, y }) => ({
                position: {
                    x: center.x + x,
                    y: center.y + y
                }
            }))
        ));
    }, []);

    const options = useMemo(() => ({
            fullScreen: {
                enable: false
            },
            manualParticles,
            background: {
                color: {
                    value: 'transparent'
                }
            },
            fpsLimit: 60,
            interactivity: {
                events: {
                    onClick: {
                        enable: false
                    },
                    onHover: {
                        enable: false
                    }
                },
                modes: {
                    connect: {
                        distance: 100,
                        radius: 431,
                        links: {
                            opacity: 0.2
                        }
                    },
                    grab: {
                        distance: 100,
                        links: {
                            opacity: 0.2
                        }
                    },
                    bubble: {
                        distance: 100,
                        size: 40,
                        duration: 0.4
                    },
                    repulse: {
                        distance: 200,
                        duration: 1.2
                    },
                    push: {
                        quantity: 4
                    },
                    remove: {
                        quantity: 4
                    }
                }
            },
            particles: {
                blur: {
                    enable: true,
                    value: 5
                },
                color: {
                    value: ['#98ddfc', '#5b17ef', '#c5c0c3']
                },
                links: {
                    color: '#ffffff',
                    distance: 80,
                    enable: false,
                    opacity: 0.4,
                    width: 2
                },
                move: {
                    direction: MoveDirection.left,
                    enable: true,
                    outModes: {
                        default: OutMode.out
                    },
                    random: false,
                    speed: 0.65,
                    straight: true,
                    vibrate: false,
                    attract: {
                        enable: false,
                        distance: 100,
                        rotate: {
                            x: 2000,
                            y: 2000
                        }
                    },
                    trail: {
                        enable: false
                    },
                    spin: {
                        enable: false
                    },
                    gravity: {
                        enable: false
                    }
                },
                number: {
                    value: 0,
                    density: {
                        enable: false,
                        area: 600
                    }
                },
                opacity: {
                    value: 0.7,
                    random: true,
                    anim: {
                        enable: true,
                        speed: 0.5,
                        opacity_min: 0.4,
                        sync: false
                    }
                },
                shape: {
                    type: 'circle'
                },
                size: {
                    value: 250,
                    random: false,
                    anim: {
                        enable: false,
                        speed: 2,
                        size_min: 250,
                        sync: false
                    }
                }
            },
            detectRetina: true
        }),
        [manualParticles]
    );

    if (init) {
        return (
            <Particles
                id="tsparticles"
                particlesLoaded={particlesLoaded}
                options={options}
                className={`${styles.particlesContainer} ${styles.particlesCanvas}`}
            />
        );
    }

    return <></>;
};

export default ParticlesBackground;
