import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const BPChart = ({ data }) => {
    // Process data for the chart - reverse so oldest is left, newest right
    const chartData = [...data].reverse().map(d => ({
        ...d,
        dateFormatted: format(new Date(d.measured_at), 'dd/MM', { locale: ptBR }),
    }));

    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart
                data={chartData}
                margin={{
                    top: 5,
                    right: 10,
                    left: -20,
                    bottom: 0,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis
                    dataKey="dateFormatted"
                    tick={{ fontSize: 12, fill: '#6B7280' }}
                    axisLine={false}
                    tickLine={false}
                    interval="preserveStartEnd"
                />
                <YAxis
                    domain={[60, 180]}
                    tick={{ fontSize: 12, fill: '#6B7280' }}
                    axisLine={false}
                    tickLine={false}
                />
                <Tooltip
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                />
                <ReferenceLine y={120} stroke="#10B981" strokeDasharray="3 3" />
                <ReferenceLine y={80} stroke="#10B981" strokeDasharray="3 3" />

                <Line
                    type="monotone"
                    dataKey="systolic"
                    stroke="var(--secondary-color)"
                    strokeWidth={3}
                    dot={{ fill: 'var(--secondary-color)' }}
                    name="Sistólica"
                />
                <Line
                    type="monotone"
                    dataKey="diastolic"
                    stroke="var(--primary-color)"
                    strokeWidth={3}
                    dot={{ fill: 'var(--primary-color)' }}
                    name="Diastólica"
                />
            </LineChart>
        </ResponsiveContainer>
    );
};

export default BPChart;
