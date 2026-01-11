import React, { createContext, useContext, useState, useEffect } from 'react';

const AppDataContext = createContext();

export const useAppData = () => useContext(AppDataContext);

export const AppDataProvider = ({ children }) => {
    const [injections, setInjections] = useState(() => {
        const saved = localStorage.getItem('mounjaro_injections');
        return saved ? JSON.parse(saved) : [
            { id: 1, date: '2025-12-18', dose: 2.5, completed: true },
            { id: 2, date: '2025-12-25', dose: 2.5, completed: true },
            { id: 3, date: '2026-01-01', dose: 2.5, completed: true },
            { id: 4, date: '2026-01-08', dose: 2.5, completed: true },
        ];
    });

    const [meals, setMeals] = useState(() => {
        const saved = localStorage.getItem('mounjaro_meals');
        return saved ? JSON.parse(saved) : [];
    });

    const [weightHistory, setWeightHistory] = useState(() => {
        const saved = localStorage.getItem('mounjaro_weight');
        return saved ? JSON.parse(saved) : [];
    });

    const clinicVisitDate = '2026-03-07';

    useEffect(() => {
        localStorage.setItem('mounjaro_injections', JSON.stringify(injections));
    }, [injections]);

    useEffect(() => {
        localStorage.setItem('mounjaro_meals', JSON.stringify(meals));
    }, [meals]);

    useEffect(() => {
        localStorage.setItem('mounjaro_weight', JSON.stringify(weightHistory));
    }, [weightHistory]);

    const addInjection = (date, dose) => {
        setInjections([...injections, { id: Date.now(), date, dose, completed: true }]);
    };

    const addMeal = (meal) => {
        setMeals([...meals, { ...meal, id: Date.now(), timestamp: new Date().toISOString() }]);
    };

    const addWeightRecord = (record) => {
        setWeightHistory([...weightHistory, { ...record, id: Date.now(), timestamp: new Date().toISOString() }]);
    };

    return (
        <AppDataContext.Provider value={{
            injections,
            meals,
            weightHistory,
            clinicVisitDate,
            addInjection,
            addMeal,
            addWeightRecord
        }}>
            {children}
        </AppDataContext.Provider>
    );
};
