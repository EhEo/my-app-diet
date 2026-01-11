import React, { useState } from 'react';
import { useAppData } from '../context/AppDataContext';
import { Utensils, Plus, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FOOD_DB = {
    '닭가슴살': 165, // 100g당
    '고구마': 130,
    '현미밥': 150,
    '계란': 75, // 1개
    '샐러드': 50,
    '단백질쉐이크': 120
};

const MealLog = () => {
    const { addMeal, meals } = useAppData();
    const [mealType, setMealType] = useState('breakfast');
    const [food, setFood] = useState('');
    const [amount, setAmount] = useState(''); // g 또는 개수
    const [protein, setProtein] = useState(0);

    const todayMeals = meals.filter(m => {
        const d = new Date(m.timestamp);
        return d.toDateString() === new Date().toDateString();
    });

    const handleAddMeal = () => {
        if (!food && mealType !== 'breakfast') return;

        // 칼로리 계산 (간이 DB 사용, 없으면 기본 100)
        const calPerUnit = FOOD_DB[food] || 100;
        const calories = mealType === 'breakfast' ? 120 : (calPerUnit * (parseInt(amount) || 100) / 100);

        addMeal({
            type: mealType,
            food: mealType === 'breakfast' ? '단백질 대체식' : food,
            protein: parseInt(protein),
            calories: Math.round(calories)
        });

        setFood('');
        setAmount('');
        setProtein(0);
    };

    return (
        <div className="glass-card">
            <div className="section-title">
                <Utensils size={20} color="#007A33" />
                <span>오늘의 식단 기록</span>
            </div>

            <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', overflowX: 'auto', paddingBottom: '4px' }}>
                    {['breakfast', 'lunch', 'dinner', 'snack'].map(type => (
                        <button
                            key={type}
                            onClick={() => setMealType(type)}
                            style={{
                                padding: '6px 12px',
                                borderRadius: '20px',
                                border: '1px solid #007A33',
                                background: mealType === type ? '#007A33' : 'transparent',
                                color: mealType === type ? 'white' : '#007A33',
                                fontSize: '0.8rem',
                                whiteSpace: 'nowrap',
                                cursor: 'pointer'
                            }}
                        >
                            {type === 'breakfast' ? '아침' : type === 'lunch' ? '점심' : type === 'dinner' ? '저녁' : '간식'}
                        </button>
                    ))}
                </div>

                {mealType === 'breakfast' ? (
                    <div className="glass-card" style={{ background: '#F1F8E9', border: '1px dashed #A5D6A7' }}>
                        <p style={{ fontSize: '0.9rem', marginBottom: '8px', fontWeight: 'bold' }}>아침: 단백질 30g 대체식</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <input
                                type="number"
                                placeholder="단백질 (g)"
                                value={protein}
                                onChange={(e) => setProtein(e.target.value)}
                                style={{ background: 'white' }}
                            />
                            <button className="btn-primary" onClick={handleAddMeal} style={{ width: 'auto' }}>
                                기록
                            </button>
                        </div>
                        {protein >= 30 && (
                            <motion.p
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="protein-reached"
                                style={{ fontSize: '0.8rem', marginTop: '4px', textAlign: 'center' }}
                            >
                                ✨ 목표 단백질 30g 달성! ✨
                            </motion.p>
                        )}
                    </div>
                ) : (
                    <div className="meal-input-group">
                        <input
                            list="food-list"
                            placeholder="음식명"
                            value={food}
                            onChange={(e) => setFood(e.target.value)}
                        />
                        <datalist id="food-list">
                            {Object.keys(FOOD_DB).map(f => <option key={f} value={f} />)}
                        </datalist>
                        <input
                            type="number"
                            placeholder="양 (g/개)"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                        <input
                            type="number"
                            placeholder="단백질 (g)"
                            value={protein}
                            onChange={(e) => setProtein(e.target.value)}
                        />
                        <button className="btn-primary" onClick={handleAddMeal}>
                            <Plus size={18} /> 기록
                        </button>
                    </div>
                )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <AnimatePresence>
                    {todayMeals.map(meal => (
                        <motion.div
                            key={meal.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            style={{
                                background: 'white',
                                padding: '10px 16px',
                                borderRadius: '12px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.03)'
                            }}
                        >
                            <div>
                                <span style={{ fontSize: '0.75rem', color: '#999', marginRight: '8px' }}>
                                    {meal.type === 'breakfast' ? '아침' : meal.type === 'lunch' ? '점심' : meal.type === 'dinner' ? '저녁' : '간식'}
                                </span>
                                <span style={{ fontWeight: '600' }}>{meal.food}</span>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: meal.protein >= 30 ? '#007A33' : '#444' }}>
                                    {meal.protein}g P
                                </div>
                                <div style={{ fontSize: '0.75rem', color: '#888' }}>{meal.calories}kcal</div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default MealLog;
