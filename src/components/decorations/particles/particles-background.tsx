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

    const options = useMemo(() => ({
            fullScreen: {
                enable: false
            },
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
                    enable: true,
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
                    speed: 0.8,
                    straight: true,
                    vibrate: false,
                    attract: {
                        enable: true,
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
                    value: 3,
                    density: {
                        enable: true,
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
                    random: true,
                    anim: {
                        enable: true,
                        speed: 2,
                        size_min: 20,
                        sync: false
                    }
                }
            },
            detectRetina: true
        }),
        []
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
