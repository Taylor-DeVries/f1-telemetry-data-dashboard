'use client';

import dynamic from 'next/dynamic';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

interface TelemetryChartProps {
  data: Plotly.Data[];
  title: string;
  height?: number;
  showLegend?: boolean;
  colors?: string[];
}

export default function TelemetryChart({ 
  data, 
  title, 
  height = 400,
  showLegend = true,
  colors = ['#00D4FF', '#FF6B35', '#FFD23F', '#06FFA5', '#FF006E', '#8338EC']
}: TelemetryChartProps) {
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
          {title}
        </h3>
      </div>
      
      <div className="h-96 bg-black rounded-lg p-2">
        <Plot
          data={data.map((trace, index) => ({
            ...trace,
            line: {
              ...(trace as Plotly.ScatterData).line,
              color: colors[index % colors.length],
              width: 2
            }
          })) as Plotly.Data[]}
          layout={{
            title: { text: '' },
            xaxis: { 
              title: { text: 'LAP PROGRESSION', font: { color: '#9CA3AF', size: 10 } },
              gridcolor: '#374151',
              color: '#9CA3AF',
              showgrid: true,
              zeroline: false,
              tickfont: { color: '#9CA3AF', size: 9 }
            },
            yaxis: { 
              title: { text: 'VALUE', font: { color: '#9CA3AF', size: 10 } },
              gridcolor: '#374151',
              color: '#9CA3AF',
              showgrid: true,
              zeroline: false,
              tickfont: { color: '#9CA3AF', size: 9 }
            },
            hovermode: 'x unified',
            showlegend: showLegend,
            paper_bgcolor: 'rgba(0,0,0,0)',
            plot_bgcolor: 'rgba(0,0,0,0)',
            font: { color: '#E5E7EB', family: 'system-ui' },
            legend: { 
              x: 0, 
              y: 1,
              bgcolor: 'rgba(0,0,0,0.8)',
              bordercolor: '#4B5563',
              borderwidth: 1,
              font: { color: '#E5E7EB', size: 10 }
            },
            margin: { t: 20, r: 50, b: 50, l: 60 }
          }}
          config={{
            responsive: true,
            displayModeBar: true,
            modeBarButtonsToRemove: ['pan2d', 'lasso2d', 'select2d', 'autoScale2d'],
            displaylogo: false,
            toImageButtonOptions: {
              format: 'png',
              filename: 'f1-telemetry-chart',
              height: height,
              width: 800,
              scale: 2
            }
          }}
          style={{ width: '100%', height: '100%' }}
        />
      </div>
    </div>
  );
}
