// src/helpers/chartToSVG.ts

export interface ChartDataPoint {
    x: number | string;
    y: number;
    label?: string;
}

export class ChartSVGGenerator {
    /**
     * Generate SVG line chart
     */
    static generateLineChart(
        data: ChartDataPoint[],
        color: string,
        width = 500,
        height = 250
    ): string {
        if (!data || data.length === 0) return '';

        const padding = { top: 20, right: 20, bottom: 40, left: 50 };
        const chartWidth = width - padding.left - padding.right;
        const chartHeight = height - padding.top - padding.bottom;

        const maxY = Math.max(...data.map(d => d.y), 1);
        const minY = 0;

        const points = data.map((point, index) => {
            const x = padding.left + (index / (data.length - 1 || 1)) * chartWidth;
            const y = padding.top + chartHeight - ((point.y - minY) / (maxY - minY || 1)) * chartHeight;
            return `${x},${y}`;
        });

        const pathD = `M ${points.join(' L ')}`;

        const yTicks = 5;
        const yAxisLabels = Array.from({ length: yTicks }, (_, i) => {
            const value = Math.round(minY + (maxY - minY) * (i / (yTicks - 1)));
            const y = padding.top + chartHeight - ((value - minY) / (maxY - minY || 1)) * chartHeight;
            return `<text x="${padding.left - 10}" y="${y + 4}" text-anchor="end" font-size="10" fill="#666">${value}</text>`;
        }).join('');

        const xTickInterval = Math.max(1, Math.floor(data.length / 7));
        const xAxisLabels = data
            .filter((_, i) => i % xTickInterval === 0 || i === data.length - 1)
            .map((point, i) => {
                const index = data.indexOf(point);
                const x = padding.left + (index / (data.length - 1 || 1)) * chartWidth;
                return `<text x="${x}" y="${height - 10}" text-anchor="middle" font-size="10" fill="#666">${point.x}</text>`;
            }).join('');

        return `
            <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
                ${Array.from({ length: yTicks }, (_, i) => {
            const y = padding.top + (chartHeight / (yTicks - 1)) * i;
            return `<line x1="${padding.left}" y1="${y}" x2="${width - padding.right}" y2="${y}" stroke="#e5e5e5" stroke-width="1"/>`;
        }).join('')}
                
                <path d="${pathD}" fill="none" stroke="${color}" stroke-width="2"/>
                
                ${data.map((point, index) => {
            const x = padding.left + (index / (data.length - 1 || 1)) * chartWidth;
            const y = padding.top + chartHeight - ((point.y - minY) / (maxY - minY || 1)) * chartHeight;
            return `<circle cx="${x}" cy="${y}" r="3" fill="${color}"/>`;
        }).join('')}
                
                <line x1="${padding.left}" y1="${padding.top}" x2="${padding.left}" y2="${height - padding.bottom}" stroke="#333" stroke-width="1"/>
                ${yAxisLabels}
                
                <line x1="${padding.left}" y1="${height - padding.bottom}" x2="${width - padding.right}" y2="${height - padding.bottom}" stroke="#333" stroke-width="1"/>
                ${xAxisLabels}
            </svg>
        `;
    }

    /**
     * Generate SVG bar chart
     */
    static generateBarChart(
        data: { name: string; value: number; color: string }[],
        width = 500,
        height = 300
    ): string {
        if (!data || data.length === 0) return '';

        const padding = { top: 20, right: 20, bottom: 60, left: 60 };
        const chartWidth = width - padding.left - padding.right;
        const chartHeight = height - padding.top - padding.bottom;

        const maxValue = Math.max(...data.map(d => Math.abs(d.value))) * 1.2;
        const minValue = Math.min(...data.map(d => d.value), 0) * 1.2;
        const valueRange = maxValue - minValue;

        const barWidth = chartWidth / data.length * 0.7;
        const barGap = chartWidth / data.length * 0.3;

        const bars = data.map((item, index) => {
            const x = padding.left + index * (barWidth + barGap) + barGap / 2;
            const zeroY = padding.top + chartHeight - ((0 - minValue) / valueRange) * chartHeight;
            const barHeight = Math.abs((item.value / valueRange) * chartHeight);
            const y = item.value >= 0 ? zeroY - barHeight : zeroY;

            return `
                <rect x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" 
                      fill="${item.color}" rx="4" ry="4"/>
                <text x="${x + barWidth / 2}" y="${height - padding.bottom + 20}" 
                      text-anchor="middle" font-size="10" fill="#666">${item.name}</text>
                <text x="${x + barWidth / 2}" y="${y - 5}" 
                      text-anchor="middle" font-size="9" fill="#333">${item.value.toFixed(2)}</text>
            `;
        }).join('');

        const yTicks = 5;
        const yAxisLabels = Array.from({ length: yTicks }, (_, i) => {
            const value = minValue + (valueRange * i / (yTicks - 1));
            const y = padding.top + chartHeight - ((value - minValue) / valueRange) * chartHeight;
            return `<text x="${padding.left - 10}" y="${y + 4}" text-anchor="end" font-size="10" fill="#666">${value.toFixed(0)}</text>`;
        }).join('');

        return `
            <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
                ${Array.from({ length: yTicks }, (_, i) => {
            const y = padding.top + (chartHeight / (yTicks - 1)) * i;
            return `<line x1="${padding.left}" y1="${y}" x2="${width - padding.right}" y2="${y}" stroke="#e5e5e5" stroke-width="1"/>`;
        }).join('')}
                
                <line x1="${padding.left}" y1="${padding.top}" x2="${padding.left}" y2="${height - padding.bottom}" stroke="#333" stroke-width="2"/>
                <line x1="${padding.left}" y1="${height - padding.bottom}" x2="${width - padding.right}" y2="${height - padding.bottom}" stroke="#333" stroke-width="2"/>
                
                ${yAxisLabels}
                ${bars}
            </svg>
        `;
    }

    /**
     * Generate SVG pie/donut chart
     */
    static generateDonutChart(
        data: { name: string; value: number; color: string }[],
        width = 300,
        height = 300,
        innerRadiusPercent = 65
    ): string {
        if (!data || data.length === 0) return '';

        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) / 2 - 20;
        const innerRadius = radius * (innerRadiusPercent / 100);

        const total = data.reduce((sum, item) => sum + item.value, 0);
        if (total === 0) return '';

        let currentAngle = -90; // Start at top

        const slices = data.map((item) => {
            const sliceAngle = (item.value / total) * 360;
            const startAngle = currentAngle;
            const endAngle = currentAngle + sliceAngle;

            const startRad = (startAngle * Math.PI) / 180;
            const endRad = (endAngle * Math.PI) / 180;

            const x1 = centerX + radius * Math.cos(startRad);
            const y1 = centerY + radius * Math.sin(startRad);
            const x2 = centerX + radius * Math.cos(endRad);
            const y2 = centerY + radius * Math.sin(endRad);

            const x3 = centerX + innerRadius * Math.cos(endRad);
            const y3 = centerY + innerRadius * Math.sin(endRad);
            const x4 = centerX + innerRadius * Math.cos(startRad);
            const y4 = centerY + innerRadius * Math.sin(startRad);

            const largeArc = sliceAngle > 180 ? 1 : 0;

            const pathData = [
                `M ${x1} ${y1}`,
                `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
                `L ${x3} ${y3}`,
                `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4}`,
                'Z'
            ].join(' ');

            currentAngle = endAngle;

            return `<path d="${pathData}" fill="${item.color}"/>`;
        }).join('');

        return `
            <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
                ${slices}
            </svg>
        `;
    }

    /**
     * Generate horizontal bar chart
     */
    static generateHorizontalBarChart(
        data: { name: string; value: number; color: string }[],
        width = 500,
        height = 300
    ): string {
        if (!data || data.length === 0) return '';

        const padding = { top: 20, right: 60, bottom: 20, left: 120 };
        const chartWidth = width - padding.left - padding.right;
        const chartHeight = height - padding.top - padding.bottom;

        const maxValue = Math.max(...data.map(d => d.value)) * 1.1;
        const barHeight = chartHeight / data.length * 0.7;
        const barGap = chartHeight / data.length * 0.3;

        const bars = data.map((item, index) => {
            const y = padding.top + index * (barHeight + barGap) + barGap / 2;
            const barWidth = (item.value / maxValue) * chartWidth;

            return `
                <rect x="${padding.left}" y="${y}" width="${barWidth}" height="${barHeight}" 
                      fill="${item.color}" rx="4" ry="4"/>
                <text x="${padding.left - 10}" y="${y + barHeight / 2 + 4}" 
                      text-anchor="end" font-size="10" fill="#333">${item.name}</text>
                <text x="${padding.left + barWidth + 10}" y="${y + barHeight / 2 + 4}" 
                      text-anchor="start" font-size="9" fill="#333">${item.value.toFixed(2)}</text>
            `;
        }).join('');

        return `
            <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
                ${bars}
            </svg>
        `;
    }
}