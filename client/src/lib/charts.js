import {
  Chart as ChartJs,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJs.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

ChartJs.defaults.responsive = true;
ChartJs.defaults.maintainAspectRatio = false;
ChartJs.defaults.plugins.legend.position = "bottom";
ChartJs.defaults.plugins.legend.labels.padding = 20;
ChartJs.defaults.plugins.legend.labels.usePointStyle = true;
ChartJs.defaults.plugins.legend.labels.pointStyle = "circle";
