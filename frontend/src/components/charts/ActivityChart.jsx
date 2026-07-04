import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";

export default function ActivityChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart
        data={data}
        margin={{ top: 10, right: 10, left: -18, bottom: 0 }}
      >
        <CartesianGrid stroke="rgba(217,204,244,0.08)" vertical={false} />
        <XAxis
          dataKey="day"
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
        />
        <Tooltip
          contentStyle={{
            background: "#1D1530",
            border: "1px solid rgba(217,204,244,0.2)",
            borderRadius: 10,
            fontSize: 13,
          }}
          cursor={{ fill: "rgba(255,255,255,0.04)" }}
        />
        <Bar dataKey="count" radius={[6, 6, 0, 0]}>
          {data.map((_, i) => (
            <Cell
              key={i}
              fill={i === data.length - 1 ? "#00E5C7" : "#5B3FA0"}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
