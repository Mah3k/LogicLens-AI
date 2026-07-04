import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import "./Charts.css";

export default function ScoreChart({
  data,
  xKey = "label",
}) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart
        data={data}
        margin={{ top: 10, right: 10, left: -18, bottom: 0 }}
      >
        <defs>
          <linearGradient
            id="scoreFill"
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop
              offset="0%"
              stopColor="#9B7FDB"
              stopOpacity={0.55}
            />
            <stop
              offset="100%"
              stopColor="#9B7FDB"
              stopOpacity={0}
            />
          </linearGradient>
        </defs>

        <CartesianGrid
          stroke="rgba(217,204,244,0.08)"
          vertical={false}
        />

        <XAxis
          dataKey={xKey}
          stroke="rgba(239,233,250,0.45)"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />

        <YAxis
          stroke="rgba(239,233,250,0.45)"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          domain={[0, 100]}
        />

        <Tooltip
          contentStyle={{
            background: "#1D1530",
            border: "1px solid rgba(217,204,244,0.2)",
            borderRadius: 10,
            fontSize: 13,
          }}
          labelStyle={{
            color: "#D9CCF4",
          }}
        />

        <Area
          type="monotone"
          dataKey="score"
          stroke="#9B7FDB"
          strokeWidth={2.5}
          fill="url(#scoreFill)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}