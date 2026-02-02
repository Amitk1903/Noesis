import { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import Chart from 'chart.js/auto';
import { create, all } from 'mathjs';

const math = create(all);

const colors = [
  'rgb(167, 139, 250)',
  'rgb(249, 115, 22)',
  'rgb(34, 197, 94)',
  'rgb(236, 72, 153)',
  'rgb(59, 130, 246)',
  'rgb(234, 179, 8)'
];

export default function Math() {
  const [equations, setEquations] = useState([{ value: '', color: colors[0] }]);
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    plotGraph();
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [equations]);

  const addEquation = () => {
    setEquations([...equations, { value: '', color: colors[equations.length % colors.length] }]);
  };

  const removeEquation = (index) => {
    setEquations(equations.filter((_, i) => i !== index));
  };

  const updateEquation = (index, value) => {
    const newEquations = [...equations];
    newEquations[index].value = value;
    setEquations(newEquations);
  };

  const plotGraph = () => {
    if (!chartRef.current) return;

    const ctx = chartRef.current.getContext('2d');
    const datasets = [];

    equations.forEach((eq) => {
      const equation = eq.value.trim();
      if (!equation) return;

      try {
        const node = math.parse(equation);
        const code = node.compile();

        const domain = { min: -10, max: 10 };
        const data = [];
        const step = (domain.max - domain.min) / 200;

        const symbols = node.filter(n => n.isSymbolNode).map(n => n.name);
        const funcs = ['sin', 'cos', 'tan', 'sqrt', 'exp', 'log', 'abs', 'ceil', 'floor', 'round', 'sign', 'ln', 'asin', 'acos', 'atan', 'sinh', 'cosh', 'tanh'];
        const vars = symbols.filter(s => !funcs.includes(s));
        const varName = vars[0] || 'x';

        for (let val = domain.min; val <= domain.max; val += step) {
          const scope = {};
          scope[varName] = val;

          try {
            const result = code.evaluate(scope);
            if (typeof result === 'number' && isFinite(result)) {
              data.push({ x: val, y: result });
            }
          } catch (e) {
          }
        }

        if (data.length > 0) {
          datasets.push({
            label: equation,
            data: data,
            borderColor: eq.color,
            backgroundColor: eq.color.replace('rgb', 'rgba').replace(')', ', 0.1)'),
            borderWidth: 2,
            tension: 0.4,
            pointRadius: 0
          });
        }
      } catch (error) {
        console.error('Error parsing equation:', equation, error);
      }
    });

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    chartInstanceRef.current = new Chart(ctx, {
      type: 'line',
      data: { datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          x: {
            type: 'linear',
            grid: {
              color: 'rgba(82, 82, 82, 0.3)'
            },
            ticks: {
              color: 'rgb(163, 163, 163)'
            }
          },
          y: {
            grid: {
              color: 'rgba(82, 82, 82, 0.3)'
            },
            ticks: {
              color: 'rgb(163, 163, 163)'
            }
          }
        }
      }
    });
  };

  return (
    <div className="h-screen bg-neutral-950 text-neutral-200">
      <div className="flex flex-col h-full">
        <Header />

        <main className="flex flex-1 overflow-hidden pt-24">
          <aside className="w-80 border-r border-neutral-800 p-5 overflow-y-auto space-y-2">
            <div className="space-y-2">
              {equations.map((eq, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: eq.color }}
                  />
                  <input
                    type="text"
                    className="flex-1 bg-transparent border-b border-neutral-700 focus:border-neutral-500 p-2 text-base focus:outline-none font-mono"
                    placeholder="x^2"
                    value={eq.value}
                    onChange={(e) => updateEquation(index, e.target.value)}
                  />
                  <button
                    onClick={() => removeEquation(index)}
                    className="text-neutral-500 hover:text-neutral-200 text-xl w-6 h-6 flex-shrink-0"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={addEquation}
              className="w-full text-neutral-500 hover:text-neutral-300 text-sm py-2"
            >
              + Add equation
            </button>
          </aside>

          <section className="flex-1 flex flex-col bg-gradient-to-br from-neutral-900 to-black">
            <div className="flex-1 p-8">
              <canvas ref={chartRef}></canvas>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
