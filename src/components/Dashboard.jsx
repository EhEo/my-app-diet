import React from 'react';
import { useAppData } from '../context/AppDataContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingDown, Activity } from 'lucide-react';

const Dashboard = () => {
    const { weightHistory, meals } = useAppData();

    const chartData = weightHistory.map(r => ({
        date: r.date.split('-').slice(1).join('/'),
        weight: r.weight,
        bodyFat: r.bodyFat
    })).slice(-7); // 최근 7개 기록

    const todayCalories = meals
        .filter(m => new Date(m.timestamp).toDateString() === new Date().toDateString())
        .reduce((acc, m) => acc + m.calories, 0);

    return (
        <div className="glass-card">
            <div className="section-title">
                <Activity size={20} color="#007A33" />
                <span>변화 대시보드</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                <div style={{ background: '#f8f9fa', padding: '12px', borderRadius: '12px' }}>
                    <p style={{ fontSize: '0.75rem', color: '#888' }}>오늘 섭취</p>
                    <p style={{ fontSize: '1.1rem', fontWeight: '800' }}>{todayCalories} kcal</p>
                </div>
                <div style={{ background: '#f8f9fa', padding: '12px', borderRadius: '12px' }}>
                    <p style={{ fontSize: '0.75rem', color: '#888' }}>최근 체중</p>
                    <p style={{ fontSize: '1.1rem', fontWeight: '800' }}>
                        {weightHistory.length > 0 ? `${weightHistory[weightHistory.length - 1].weight} kg` : '-'}
                    </p>
                </div>
            </div>

            <div className="chart-container">
                {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                            <XAxis dataKey="date" fontSize={10} axisLine={false} tickLine={false} />
                            <YAxis domain={['dataMin - 1', 'dataMax + 1']} hide />
                            <Tooltip
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                            />
                            <Line
                                type="monotone"
                                dataKey="weight"
                                stroke="#007A33"
                                strokeWidth={3}
                                dot={{ r: 4, fill: '#007A33' }}
                                activeDot={{ r: 6 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                ) : (
                    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc', fontSize: '0.9rem' }}>
                        입력된 체중 데이터가 없습니다.
                    </div>
                )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '12px', color: '#007A33', fontSize: '0.85rem', fontWeight: '600' }}>
                <TrendingDown size={14} />
                <span>건강한 변화를 응원합니다!</span>
            </div>
        </div>
    );
};

export default Dashboard;
