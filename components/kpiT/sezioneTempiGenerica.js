import Sezione from "./sezione";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import CardsTempo from "../../components/kpiT/cardsTempo";
import { Typography } from "@mui/material";
import CardGrafico from "./cards/cardGrafico";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from "recharts";
import dayjs from "dayjs";
import MUIDataTable from "mui-datatables";
import { getTraduzioneTabella } from "../my-mui-data-table/traduzioneTabella";

export default function SezioneTempiGenerica({
  titolo,
  descrizione,
  minTempo,
  maxTempo,
  avgTempo,
  dataList,
}) {

  if (dataList === undefined || dataList.length === 0) return null;
  const convertiInGiorni = (dataList) => {
    return dataList.map((data) => ({
      ...data,
      min: Math.round(data.min / 86400),
      max: Math.round(data.max / 86400),
      avg: Math.round(data.avg / 86400),
    }));
  };
  const traduzione = getTraduzioneTabella();
  return (
    <Sezione
      label={titolo}
      icon={<AccessTimeFilledIcon color="primary" fontSize="medium" />}
      subsection
    >
      <Typography>{descrizione}</Typography>
      <CardsTempo minTempo={minTempo} maxTempo={maxTempo} avgTempo={avgTempo} />
      <CardGrafico title={"Situazione mensile"}>
        <Typography>Min</Typography>
        <ResponsiveContainer width="100%" height="100%" aspect={5}>
          <AreaChart
            width={500}
            height={200}
            data={convertiInGiorni(dataList)}
            syncId="anyId"
            margin={{
              top: 0,
              right: 0,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mese" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area
              type="monotone"
              dataKey="min"
              stroke="#82ca9d"
              fill="#82ca9d"
            />
          </AreaChart>
        </ResponsiveContainer>
        <Typography>Avg</Typography>
        <ResponsiveContainer width="100%" height="100%" aspect={5}>
          <AreaChart
            width={500}
            height={200}
            data={convertiInGiorni(dataList)}
            syncId="anyId"
            margin={{
              top: 0,
              right: 0,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mese" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area
              type="monotone"
              dataKey="avg"
              stroke="#f7d31b"
              fill="#f7d31b"
            />
          </AreaChart>
        </ResponsiveContainer>
        <Typography>Max</Typography>
        <ResponsiveContainer width="100%" height="100%" aspect={5}>
          <AreaChart
            width={500}
            height={200}
            data={convertiInGiorni(dataList)}
            syncId="anyId"
            margin={{
              top: 0,
              right: 0,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mese" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area
              type="monotone"
              dataKey="max"
              stroke="#f52c2c"
              fill="#f52c2c"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardGrafico>
      <MUIDataTable
        title="Situazione mensile"
        columns={["mese", "min", "avg", "max"]}
        options={{
          selectableRows: false,
          textLabels: traduzione,
          rowsPerPage: 100,
        }}
        data={convertiInGiorni(dataList)}
      />
    </Sezione>
  );
}
