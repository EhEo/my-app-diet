import React, { useState } from 'react';
import { useAppData } from '../context/AppDataContext';
import { Camera, Loader2, Scale, CheckCircle } from 'lucide-react';
import Tesseract from 'tesseract.js';
import { motion } from 'framer-motion';

const WeightOCR = () => {
    const { addWeightRecord } = useAppData();
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setLoading(true);
        try {
            const { data: { text } } = await Tesseract.recognize(file, 'kor+eng', {
                logger: m => console.log(m)
            });

            console.log("OCR Raw Text:", text);

            // 샤오미 Zepp/Mi Fit 앱 (이미지 제공 기준)
            // 1. 모든 소수점 형태의 숫자 추출
            const decimalPattern = /([0-9]{2,3})\s?[:.;, ]\s?([0-9])/g;
            const matches = [...text.matchAll(decimalPattern)];
            const numbers = matches.map(m => parseFloat(`${m[1]}.${m[2]}`));

            console.log("Detected Numbers:", numbers);

            let weight = 0, bmi = 0, bodyFat = 0, muscle = 0;

            // 상단의 가장 큰/첫 번째 숫자를 체중으로 인식
            if (numbers.length >= 1) weight = numbers[0];

            // 키워드 기반 정밀 매칭 (이미지 상 숫자가 키워드 위에 있으므로 앞에 나타날 확률이 높음)
            const tokens = text.toLowerCase().split(/\s+/);
            const findValueFor = (keyword, fallbackIdx) => {
                const idx = tokens.findIndex(t => t.includes(keyword.toLowerCase()));
                if (idx !== -1) {
                    // 키워드 주변 5개 토큰 탐색
                    for (let i = 1; i <= 5; i++) {
                        const prev = tokens[idx - i];
                        const next = tokens[idx + i];
                        const check = (s) => {
                            const m = s?.match(/([0-9]{2,3})\s?[:.;, ]\s?([0-9])/);
                            return m ? parseFloat(`${m[1]}.${m[2]}`) : null;
                        };
                        const pVal = check(prev);
                        if (pVal !== null) return pVal;
                        const nVal = check(next);
                        if (nVal !== null) return nVal;
                    }
                }
                return numbers[fallbackIdx] || 0;
            };

            bmi = findValueFor('bmi', 1);
            bodyFat = findValueFor('fat', 2) || findValueFor('percentage', 2) || findValueFor('체지방', 2);
            muscle = findValueFor('muscle', 3) || findValueFor('근육', 3);

            // 만약 numbers가 딱 4개라면 순서대로 매칭될 확률이 높음 [체중, BMI, 체지방, 근육]
            if (numbers.length === 4) {
                weight = numbers[0];
                bmi = numbers[1];
                bodyFat = numbers[2];
                muscle = numbers[3];
            }

            const record = {
                weight,
                bmi,
                bodyFat,
                muscle,
                date: new Date().toISOString().split('T')[0]
            };

            setResult(record);
        } catch (error) {
            console.error("OCR Error:", error);
            alert("이미지 인식 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    const handleConfirm = () => {
        addWeightRecord(result);
        setResult(null);
    };

    return (
        <div className="glass-card">
            <div className="section-title">
                <Scale size={20} color="#007A33" />
                <span>체중계 데이터 스마트 입력</span>
            </div>

            {!result ? (
                <label className="ocr-dropzone">
                    {loading ? (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                            <Loader2 className="animate-spin" size={32} color="#007A33" />
                            <p style={{ fontSize: '0.85rem' }}>샤오미 데이터 분석 중...</p>
                        </div>
                    ) : (
                        <>
                            <Camera size={32} color="#999" style={{ marginBottom: '8px' }} />
                            <p style={{ fontSize: '0.85rem', color: '#666' }}>샤오미 앱 캡처 파일 업로드</p>
                            <input type="file" hidden accept="image/*" onChange={handleFileUpload} />
                        </>
                    )}
                </label>
            ) : (
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ background: '#E8F5E9', padding: '16px', borderRadius: '16px' }}>
                    <p style={{ fontWeight: 'bold', marginBottom: '16px', textAlign: 'center', color: '#007A33' }}>인식된 결과 (수정 가능)</p>

                    <div className="ocr-results-grid">
                        <div className="input-card">
                            <span style={{ fontSize: '0.7rem', color: '#666' }}>체중 (kg)</span>
                            <input
                                type="number"
                                step="0.1"
                                value={result.weight}
                                onChange={e => setResult({ ...result, weight: parseFloat(e.target.value) })}
                                style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '1.1rem' }}
                            />
                        </div>
                        <div className="input-card">
                            <span style={{ fontSize: '0.7rem', color: '#666' }}>BMI</span>
                            <input
                                type="number"
                                step="0.1"
                                value={result.bmi}
                                onChange={e => setResult({ ...result, bmi: parseFloat(e.target.value) })}
                                style={{ textAlign: 'center' }}
                            />
                        </div>
                        <div className="input-card">
                            <span style={{ fontSize: '0.7rem', color: '#666' }}>체지방 (%)</span>
                            <input
                                type="number"
                                step="0.1"
                                value={result.bodyFat}
                                onChange={e => setResult({ ...result, bodyFat: parseFloat(e.target.value) })}
                                style={{ textAlign: 'center' }}
                            />
                        </div>
                        <div className="input-card">
                            <span style={{ fontSize: '0.7rem', color: '#666' }}>근육량 (kg)</span>
                            <input
                                type="number"
                                step="0.1"
                                value={result.muscle}
                                onChange={e => setResult({ ...result, muscle: parseFloat(e.target.value) })}
                                style={{ textAlign: 'center' }}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="btn-primary" onClick={handleConfirm} style={{ flex: 2, height: '40px' }}>
                            저장하기
                        </button>
                        <button
                            onClick={() => setResult(null)}
                            style={{ flex: 1, background: '#fff', border: '1px solid #ddd', borderRadius: '12px', fontSize: '0.85rem' }}
                        >
                            취소
                        </button>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default WeightOCR;
