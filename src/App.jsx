import React, { useState, useEffect, useRef } from "react";

// NetworkStatus Component - Detects connection and shows data-saving status
const NetworkStatus = ({ onNetworkChange }) => {
  const [networkInfo, setNetworkInfo] = useState({
    isSlowConnection: false,
    connectionType: "unknown",
    dataSaverMode: false,
  });

  useEffect(() => {
    // Check if Network Information API is available
    if ("connection" in navigator) {
      const connection = navigator.connection;

      const updateNetworkInfo = () => {
        const isSlowConnection =
          connection.effectiveType === "slow-2g" ||
          connection.effectiveType === "2g" ||
          connection.saveData === true;

        const info = {
          isSlowConnection,
          connectionType: connection.effectiveType || "unknown",
          dataSaverMode: connection.saveData || false,
        };

        setNetworkInfo(info);
        onNetworkChange(info);
      };

      updateNetworkInfo();

      // Listen for connection changes
      connection.addEventListener("change", updateNetworkInfo);

      return () => {
        connection.removeEventListener("change", updateNetworkInfo);
      };
    } else {
      // Fallback for browsers without Network Information API
      setNetworkInfo({
        isSlowConnection: false,
        connectionType: "unknown",
        dataSaverMode: false,
      });
      onNetworkChange({
        isSlowConnection: false,
        connectionType: "unknown",
        dataSaverMode: false,
      });
    }
  }, [onNetworkChange]);

  return (
    <div className="mb-4 p-3 bg-gray-100 rounded-lg">
      <h3 className="text-sm font-semibold mb-2">Network Status</h3>
      <div className="flex items-center gap-4 text-xs">
        <div className="flex items-center gap-1">
          <div
            className={`w-2 h-2 rounded-full ${
              networkInfo.isSlowConnection ? "bg-red-500" : "bg-green-500"
            }`}
          ></div>
          <span>Connection: {networkInfo.connectionType}</span>
        </div>
        {networkInfo.dataSaverMode && (
          <span className="px-2 py-1 bg-orange-200 text-orange-800 rounded">
            Data Saver ON
          </span>
        )}
        {networkInfo.isSlowConnection && (
          <span className="px-2 py-1 bg-red-200 text-red-800 rounded">
            Low Data Mode
          </span>
        )}
      </div>
    </div>
  );
};

// PieChart Component - Uses Canvas API to draw investment pie chart
const PieChart = ({ investments, isLowDataMode }) => {
  const canvasRef = useRef(null);
  const [animationProgress, setAnimationProgress] = useState(0);
  const animationRef = useRef(null);

  // Colors for different investments
  const colors = [
    "#3B82F6",
    "#EF4444",
    "#10B981",
    "#F59E0B",
    "#8B5CF6",
    "#06B6D4",
    "#F97316",
    "#84CC16",
    "#EC4899",
    "#6B7280",
  ];

  // Calculate total investment amount
  const total = investments.reduce((sum, inv) => sum + inv.amount, 0);

  // Draw pie chart on canvas
  const drawPieChart = (progress = 1) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 20;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (investments.length === 0) {
      // Draw empty state
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.strokeStyle = "#E5E7EB";
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = "#6B7280";
      ctx.font = "14px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("No investments yet", centerX, centerY);
      return;
    }

    let currentAngle = -Math.PI / 2; // Start from top

    investments.forEach((investment, index) => {
      const sliceAngle = (investment.amount / total) * 2 * Math.PI * progress;

      // Draw slice
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(
        centerX,
        centerY,
        radius,
        currentAngle,
        currentAngle + sliceAngle
      );
      ctx.closePath();
      ctx.fillStyle = colors[index % colors.length];
      ctx.fill();

      // Draw slice border
      ctx.strokeStyle = "#FFFFFF";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw percentage label (only if slice is large enough)
      if (sliceAngle > 0.2) {
        const percentage = ((investment.amount / total) * 100).toFixed(1);
        const labelAngle = currentAngle + sliceAngle / 2;
        const labelX = centerX + Math.cos(labelAngle) * (radius * 0.7);
        const labelY = centerY + Math.sin(labelAngle) * (radius * 0.7);

        ctx.fillStyle = "#FFFFFF";
        ctx.font = "bold 12px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(`${percentage}%`, labelX, labelY);
      }

      currentAngle += sliceAngle;
    });
  };

  // Animation effect (disabled in low data mode)
  useEffect(() => {
    if (isLowDataMode) {
      setAnimationProgress(1);
      drawPieChart(1);
      return;
    }

    setAnimationProgress(0);
    const startTime = Date.now();
    const duration = 1000; // 1 second animation

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      setAnimationProgress(progress);
      drawPieChart(progress);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [investments, isLowDataMode]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Investment Distribution</h2>

      <div className="flex flex-col items-center">
        <canvas
          ref={canvasRef}
          width={300}
          height={300}
          className="border rounded-lg mb-4"
        />

        {/* Legend */}
        <div className="w-full">
          <h3 className="text-sm font-semibold mb-2">Legend</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {investments.map((investment, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <div
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: colors[index % colors.length] }}
                ></div>
                <span className="truncate">
                  {investment.name}: ${investment.amount.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Total */}
        <div className="mt-4 p-3 bg-gray-100 rounded-lg w-full text-center">
          <span className="text-lg font-bold">
            Total Portfolio: ${total.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};

// InvestmentForm Component - Form for adding investment name and amount
const InvestmentForm = ({ onAddInvestment }) => {
  const [investmentName, setInvestmentName] = useState("");
  const [investmentAmount, setInvestmentAmount] = useState("");
  const [errors, setErrors] = useState({});

  // Validate form inputs
  const validateForm = () => {
    const newErrors = {};

    if (!investmentName.trim()) {
      newErrors.name = "Investment name is required";
    }

    if (!investmentAmount.trim()) {
      newErrors.amount = "Investment amount is required";
    } else {
      const amount = parseFloat(investmentAmount);
      if (isNaN(amount) || amount <= 0) {
        newErrors.amount = "Please enter a valid positive number";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = () => {
    if (validateForm()) {
      onAddInvestment({
        name: investmentName.trim(),
        amount: parseFloat(investmentAmount),
      });

      // Reset form
      setInvestmentName("");
      setInvestmentAmount("");
      setErrors({});
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Add New Investment</h2>

      <div className="space-y-4">
        {/* Investment Name Input */}
        <div>
          <label
            htmlFor="investmentName"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Investment Name
          </label>
          <input
            type="text"
            id="investmentName"
            value={investmentName}
            onChange={(e) => setInvestmentName(e.target.value)}
            placeholder="e.g., Bitcoin, Tesla Stock, Real Estate"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.name ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name}</p>
          )}
        </div>

        {/* Investment Amount Input */}
        <div>
          <label
            htmlFor="investmentAmount"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Amount ($)
          </label>
          <input
            type="number"
            id="investmentAmount"
            value={investmentAmount}
            onChange={(e) => setInvestmentAmount(e.target.value)}
            placeholder="e.g., 5000"
            step="0.01"
            min="0"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.amount ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.amount && (
            <p className="text-red-500 text-xs mt-1">{errors.amount}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="button"
          onClick={handleSubmit}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          Add Investment
        </button>
      </div>
    </div>
  );
};

// Main App Component - Main logic and state management
const App = () => {
  const [investments, setInvestments] = useState([]);
  const [networkInfo, setNetworkInfo] = useState({
    isSlowConnection: false,
    connectionType: "unknown",
    dataSaverMode: false,
  });
  const [lastSyncTime, setLastSyncTime] = useState(new Date());
  const backgroundSyncRef = useRef(null);

  // Handle adding new investment
  const handleAddInvestment = (newInvestment) => {
    setInvestments((prev) => [...prev, newInvestment]);
  };

  // Handle network status change
  const handleNetworkChange = (info) => {
    setNetworkInfo(info);
  };

  // Background sync simulation (Background Tasks API simulation)
  useEffect(() => {
    const performBackgroundSync = () => {
      const total = investments.reduce((sum, inv) => sum + inv.amount, 0);
      const timestamp = new Date().toLocaleTimeString();

      console.log(
        `[Background Sync ${timestamp}] Total portfolio value: $${total.toLocaleString()}`
      );
      console.log(
        `[Background Sync ${timestamp}] Number of investments: ${investments.length}`
      );

      setLastSyncTime(new Date());

      // Simulate some background calculation or API call
      if (investments.length > 0) {
        const avgInvestment = total / investments.length;
        console.log(
          `[Background Sync ${timestamp}] Average investment: $${avgInvestment.toFixed(
            2
          )}`
        );
      }
    };

    // Initial sync
    performBackgroundSync();

    // Set up interval for background sync every 15 seconds
    backgroundSyncRef.current = setInterval(performBackgroundSync, 15000);

    // Cleanup interval on component unmount
    return () => {
      if (backgroundSyncRef.current) {
        clearInterval(backgroundSyncRef.current);
      }
    };
  }, [investments]);

  // Clear all investments
  const handleClearAll = () => {
    setInvestments([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Smart Portfolio Assistant
          </h1>
          <p className="text-gray-600">
            Track and visualize your investment portfolio
          </p>
        </div>

        {/* Network Status */}
        <NetworkStatus onNetworkChange={handleNetworkChange} />

        {/* Background Sync Status */}
        <div className="mb-6 p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-between text-sm">
            <span className="text-blue-800">Background Sync Active</span>
            <span className="text-blue-600">
              Last sync: {lastSyncTime.toLocaleTimeString()}
            </span>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Investment Form */}
          <div>
            <InvestmentForm onAddInvestment={handleAddInvestment} />

            {/* Clear All Button */}
            {investments.length > 0 && (
              <button
                onClick={handleClearAll}
                className="mt-4 w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
              >
                Clear All Investments
              </button>
            )}
          </div>

          {/* Pie Chart */}
          <div>
            <PieChart
              investments={investments}
              isLowDataMode={
                networkInfo.isSlowConnection || networkInfo.dataSaverMode
              }
            />
          </div>
        </div>

        {/* Investment List */}
        {investments.length > 0 && (
          <div className="mt-8 bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Your Investments</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Investment</th>
                    <th className="text-right py-2">Amount</th>
                    <th className="text-right py-2">Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  {investments.map((investment, index) => {
                    const total = investments.reduce(
                      (sum, inv) => sum + inv.amount,
                      0
                    );
                    const percentage = (
                      (investment.amount / total) *
                      100
                    ).toFixed(1);

                    return (
                      <tr key={index} className="border-b">
                        <td className="py-2">{investment.name}</td>
                        <td className="text-right py-2">
                          ${investment.amount.toLocaleString()}
                        </td>
                        <td className="text-right py-2">{percentage}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>
            Smart Portfolio Assistant - Built with React, Canvas API, and
            Network Information API
          </p>
        </div>
      </div>
    </div>
  );
};

export default App;
