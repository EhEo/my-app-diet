import React, { useState, useEffect } from 'react';
import { useAppData } from '../context/AppDataContext';
import { Syringe, Clock, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const MounjaroTracker = () => {
    const { injections, addInjection, clinicVisitDate } = useAppData();
    const [timeLeft, setTimeLeft] = useState('');
    const [isAlert, setIsAlert] = useState(false);

    const completedCount = injections.filter(i => i.completed).length;
    const currentDose = completedCount >= 4 ? 5.0 : 2.5;

    const getNextThursday = () => {
        const now = new Date();
        const nextThursday = new Date();
        let daysUntilThursday = (4 - now.getDay() + 7) % 7;
        if (daysUntilThursday === 0 && now.getHours() >= 19) daysUntilThursday = 7;
        nextThursday.setDate(now.getDate() + daysUntilThursday);
        nextThursday.setHours(19, 0, 0, 0);
        return nextThursday;
    };

    const targetDate = getNextThursday();

    const getHighlightStyle = () => {
        const doses = [2.5, 5, 7.5, 10, 12.5, 15];
        const index = doses.indexOf(currentDose);
        const width = 100 / 6;
        return {
            left: `${index * width}%`,
            width: `${width}%`
        };
    };

    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date();
            const diff = targetDate - now;
            if (diff <= 0) {
                setTimeLeft('지금 가능');
            } else {
                const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
                const mins = Math.floor((diff / (1000 * 60)) % 60);
                setTimeLeft(`${days}일 ${hours}시간 ${mins}분 남음`);
            }

            if (now.getTime() >= targetDate.getTime()) {
                const lastInjection = injections[injections.length - 1];
                const lastDate = new Date(lastInjection?.date);
                const isThisCycleDone = lastDate >= new Date(targetDate.getTime() - 1000 * 60 * 60 * 24 * 6);
                setIsAlert(!isThisCycleDone);
            } else {
                setIsAlert(false);
            }
        };

        const timer = setInterval(calculateTimeLeft, 60000);
        calculateTimeLeft();
        return () => clearInterval(timer);
    }, [injections, targetDate]);

    const handleInject = () => {
        const now = new Date();
        if (now < targetDate) return;
        addInjection(now.toISOString().split('T')[0], currentDose);
        setIsAlert(false);
    };

    const canInject = new Date() >= targetDate;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card"
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Syringe size={18} color="#007A33" />
                    <h3 style={{ fontSize: '1rem', fontWeight: '700' }}>마운자로 관리</h3>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <span className="dose-badge">{currentDose}mg</span>
                    <span style={{ fontSize: '0.75rem', color: '#7f8c8d', marginLeft: '8px' }}>{completedCount + 1}회차 예정</span>
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8f9fa', padding: '10px 14px', borderRadius: '12px', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Clock size={14} color="#FF9800" />
                    <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#2c3e50' }}>{timeLeft}</span>
                </div>
                <span style={{ fontSize: '0.75rem', color: '#7f8c8d' }}>
                    {targetDate.toLocaleDateString('ko-KR').slice(2)} 19:00
                </span>
            </div>

            <div className="pens-container">
                <img src="/assets/mounjaro_pens.png" alt="Mounjaro Pens" className="pens-image" />
                <div className="pens-highlight" style={getHighlightStyle()} />
            </div>

            {isAlert && (
                <div style={{ background: '#FFF3E0', padding: '10px', borderRadius: '12px', display: 'flex', gap: '8px', color: '#E65100', marginBottom: '12px', alignItems: 'center' }}>
                    <AlertCircle size={16} />
                    <span style={{ fontSize: '0.8rem', fontWeight: '600' }}>지금 투약 시간입니다!</span>
                </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f0f0f0', paddingTop: '12px' }}>
                <span style={{ fontSize: '0.75rem', color: '#7f8c8d' }}>진료 정보: {clinicVisitDate}</span>
                <button
                    className="btn-primary"
                    onClick={handleInject}
                    disabled={!canInject}
                    style={{
                        background: !canInject ? '#eee' : (isAlert ? '#FF9800' : '#007A33'),
                        padding: '6px 16px',
                        fontSize: '0.8rem',
                        width: 'auto',
                        color: !canInject ? '#999' : 'white',
                        cursor: !canInject ? 'not-allowed' : 'pointer',
                        borderRadius: '20px',
                        fontWeight: '700'
                    }}
                >
                    {isAlert ? '지금 투약 완료' : (canInject ? '투약 기록' : '대기')}
                </button>
            </div>
        </motion.div>
    );
};

export default MounjaroTracker;
