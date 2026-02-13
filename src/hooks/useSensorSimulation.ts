import { useEffect, useRef } from 'react';
import { useFactoryStore } from '../store/factoryStore';

export const useSensorSimulation = () => {
    const { isDataFlowing, updateSimulation, sClockPeriod } = useFactoryStore();
    const intervalRef = useRef<number | null>(null);

    useEffect(() => {
        if (isDataFlowing) {
            // Start simulation loop
            intervalRef.current = window.setInterval(() => {
                updateSimulation();
            }, sClockPeriod);
        } else {
            // Stop simulation
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isDataFlowing, updateSimulation]);
};
