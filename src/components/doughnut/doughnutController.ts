import {Chart, DoughnutController} from "chart.js";

export class CustomDoughnutController extends DoughnutController {
    draw() {
        super.draw();

        let chart = this.chart;
        let width = chart.width,
            height = chart.height,
            ctx = chart.ctx;

        let fontSize = (height / 114).toFixed(2);
        ctx.font = fontSize + "em sans-serif";
        ctx.textBaseline = "middle";

        let sum = '';
        for (let i = 0; i < chart.config.data.datasets[0].data.length; i++) {
            sum += Number(chart.config.data.datasets[0].data[i]) + ' ' + chart.config.data.labels && chart.config.data.labels?.length? chart.config.data.labels[i] : '';
        }

        let text = sum,
            textX = Math.round((width - ctx.measureText(text).width) / 2),
            textY = height / 2;

        ctx.fillText(text, textX, textY);
    }
};

CustomDoughnutController.id = 'customDoughnutController';
CustomDoughnutController.defaults = DoughnutController.defaults;

// Stores the controller so that the chart initialization routine can look it up
Chart.register(CustomDoughnutController);
