import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { format, subMonths } from "date-fns";

const SpendingChart = ({ transactions, categories }) => {
  const [chartType, setChartType] = useState("pie");
  const [timeRange, setTimeRange] = useState("current");
  const [chartData, setChartData] = useState({ series: [], options: {} });

  useEffect(() => {
    generateChartData();
  }, [transactions, categories, chartType, timeRange]);

  const getFilteredTransactions = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      
      if (timeRange === "current") {
        return transactionDate.getMonth() === currentMonth && 
               transactionDate.getFullYear() === currentYear;
      } else if (timeRange === "last3") {
        const threeMonthsAgo = subMonths(now, 3);
        return transactionDate >= threeMonthsAgo;
      } else if (timeRange === "last6") {
        const sixMonthsAgo = subMonths(now, 6);
        return transactionDate >= sixMonthsAgo;
      }
      
      return true;
    });
  };

  const generateChartData = () => {
    const filteredTransactions = getFilteredTransactions();
    
    if (chartType === "pie") {
      generatePieChart(filteredTransactions);
    } else {
      generateLineChart(filteredTransactions);
    }
  };

  const generatePieChart = (transactions) => {
    const categoryTotals = {};
    
    transactions
      .filter(t => t.type === "expense")
      .forEach(transaction => {
        if (categoryTotals[transaction.category]) {
          categoryTotals[transaction.category] += transaction.amount;
        } else {
          categoryTotals[transaction.category] = transaction.amount;
        }
      });

    const chartCategories = Object.keys(categoryTotals);
    const chartValues = Object.values(categoryTotals);
    const colors = chartCategories.map(categoryName => {
      const category = categories.find(cat => cat.name === categoryName);
      return category?.color || "#64748b";
    });

    setChartData({
      series: chartValues,
      options: {
        chart: {
          type: "pie",
          height: 350,
          toolbar: { show: false },
          animations: {
            enabled: true,
            easing: "easeinout",
            speed: 800
          }
        },
        labels: chartCategories,
        colors: colors,
        legend: {
          position: "bottom",
          fontSize: "14px",
          fontFamily: "Inter, sans-serif",
          markers: {
            width: 12,
            height: 12,
            radius: 6
          }
        },
        plotOptions: {
          pie: {
            donut: {
              size: "0%"
            }
          }
        },
        dataLabels: {
          enabled: true,
          style: {
            fontSize: "12px",
            fontFamily: "Inter, sans-serif",
            fontWeight: "500"
          },
          formatter: function(val) {
            return val.toFixed(1) + "%";
          }
        },
        tooltip: {
          y: {
            formatter: function(val) {
              return "$" + val.toFixed(2);
            }
          }
        },
        responsive: [{
          breakpoint: 640,
          options: {
            legend: {
              position: "bottom",
              fontSize: "12px"
            }
          }
        }]
      }
    });
  };

  const generateLineChart = (transactions) => {
    const monthlyData = {};
    
    // Initialize months
    const months = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const month = subMonths(now, i);
      const monthKey = format(month, "yyyy-MM");
      const monthLabel = format(month, "MMM yyyy");
      months.push({ key: monthKey, label: monthLabel });
      monthlyData[monthKey] = { income: 0, expenses: 0 };
    }

    // Populate data
    transactions.forEach(transaction => {
      const monthKey = format(new Date(transaction.date), "yyyy-MM");
      if (monthlyData[monthKey]) {
        if (transaction.type === "income") {
          monthlyData[monthKey].income += transaction.amount;
        } else {
          monthlyData[monthKey].expenses += transaction.amount;
        }
      }
    });

    const incomeData = months.map(month => monthlyData[month.key].income);
    const expenseData = months.map(month => monthlyData[month.key].expenses);
    const monthLabels = months.map(month => month.label);

    setChartData({
      series: [
        {
          name: "Income",
          data: incomeData,
          color: "#10b981"
        },
        {
          name: "Expenses", 
          data: expenseData,
          color: "#ef4444"
        }
      ],
      options: {
        chart: {
          type: "line",
          height: 350,
          toolbar: { show: true },
          animations: {
            enabled: true,
            easing: "easeinout",
            speed: 800
          }
        },
        stroke: {
          curve: "smooth",
          width: 3
        },
        xaxis: {
          categories: monthLabels,
          labels: {
            style: {
              fontFamily: "Inter, sans-serif"
            }
          }
        },
        yaxis: {
          labels: {
            formatter: function(val) {
              return "$" + val.toFixed(0);
            },
            style: {
              fontFamily: "Inter, sans-serif"
            }
          }
        },
        legend: {
          fontSize: "14px",
          fontFamily: "Inter, sans-serif"
        },
        tooltip: {
          y: {
            formatter: function(val) {
              return "$" + val.toFixed(2);
            }
          }
        },
        grid: {
          borderColor: "#e2e8f0",
          strokeDashArray: 5
        },
        markers: {
          size: 6,
          strokeWidth: 2,
          strokeColors: ["#10b981", "#ef4444"],
          fillColors: ["#10b981", "#ef4444"]
        }
      }
    });
  };

  const timeRangeOptions = [
    { value: "current", label: "This Month" },
    { value: "last3", label: "Last 3 Months" },
    { value: "last6", label: "Last 6 Months" }
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="flex items-center gap-2">
            <ApperIcon name="BarChart3" className="w-5 h-5 text-primary-600" />
            Spending Analysis
          </CardTitle>
          
          <div className="flex flex-wrap gap-2">
            <div className="flex rounded-lg border border-gray-200 overflow-hidden">
              <Button
                variant={chartType === "pie" ? "primary" : "ghost"}
                size="sm"
                onClick={() => setChartType("pie")}
                className="rounded-none border-r border-gray-200"
              >
                <ApperIcon name="PieChart" className="w-4 h-4" />
                <span className="hidden sm:inline ml-2">Pie Chart</span>
              </Button>
              <Button
                variant={chartType === "line" ? "primary" : "ghost"}
                size="sm"
                onClick={() => setChartType("line")}
                className="rounded-none"
              >
                <ApperIcon name="TrendingUp" className="w-4 h-4" />
                <span className="hidden sm:inline ml-2">Trend</span>
              </Button>
            </div>
            
            <div className="flex rounded-lg border border-gray-200 overflow-hidden">
              {timeRangeOptions.map((option, index) => (
                <Button
                  key={option.value}
                  variant={timeRange === option.value ? "primary" : "ghost"}
                  size="sm"
                  onClick={() => setTimeRange(option.value)}
                  className={`rounded-none ${index < timeRangeOptions.length - 1 ? "border-r border-gray-200" : ""}`}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {chartData.series && chartData.series.length > 0 ? (
          <div className="h-80">
            <ReactApexChart
              options={chartData.options}
              series={chartData.series}
              type={chartType}
              height={320}
            />
          </div>
        ) : (
          <div className="text-center py-16">
            <ApperIcon name="BarChart3" className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No data to display</h3>
            <p className="text-gray-600">
              Add some transactions to see your spending analysis
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SpendingChart;