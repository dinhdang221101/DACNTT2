import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const SalesChart = ({ salesData }) => {
    const labels = salesData.map(item => item.dayOfWeek);
    const revenueData = {
        labels: labels,
        datasets: [
            {
                label: 'Doanh thu (vnđ)',
                data: salesData.map(item => item.totalAmount),
                backgroundColor: 'rgba(255, 99, 132, 0.6)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
            },
        ],
    };

    const quantityData = {
        labels: labels,
        datasets: [
            {
                label: 'Số lượng bán',
                data: salesData.map(item => item.totalProducts),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    const options = {
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    return (
        <div>
            <h2>Biểu Đồ Doanh Thu và Số Lượng Bán</h2>
            <div className="chart-container">
                <div className="chart">
                    <h3>Doanh thu theo ngày</h3>
                    <Bar data={revenueData} options={options} />
                </div>
                <div className="chart">
                    <h3>Số lượng bán theo ngày</h3>
                    <Bar data={quantityData} options={options} />
                </div>
            </div>
        </div>
    );
};

export default SalesChart;