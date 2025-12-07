import React, { useEffect, useRef } from 'react';
import { useInView, animate } from 'framer-motion';

export const AnimatedCounter: React.FC<{ from?: number; to: number; duration?: number }> = ({ from = 0, to, duration = 2 }) => {
    const nodeRef = useRef<HTMLSpanElement>(null);
    const isInView = useInView(nodeRef, { once: true, margin: "-50px" });

    useEffect(() => {
        if (!isInView) return;
        const node = nodeRef.current;

        const controls = animate(from, to, {
            duration,
            ease: "easeOut",
            onUpdate(value) {
                if (node) node.textContent = Math.round(value).toString();
            },
        });

        return () => controls.stop();
    }, [from, to, duration, isInView]);

    return <span ref={nodeRef}>{from}</span>;
};
