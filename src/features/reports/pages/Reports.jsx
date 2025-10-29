import { useEffect, useMemo, useState } from "react";
import {
    Box, Grid, Stack, Paper, Typography, TextField, MenuItem,
    CircularProgress,
} from "@mui/material";
import dayjs from "dayjs";
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
    LineChart, Line, PieChart, Pie, Cell, Legend,
} from "recharts";
import {
    getAppointmentsPerVet,
    getVaccinesPerMonth,
    getTopProducts,
    getPetsPerOwner,
    getTopDiagnoses,
    getPetsBySpecies,
    getPetsByGender,
    getAppointmentsByPeriod,
    getAveragePetAge,
    getTopDiagnosesBySpecies,
} from "../api/vet-stats.api";

const TOP_OPTIONS = [5, 10];
const CURRENT_YEAR = dayjs().year();
const COLORS = ["#3781E3", "#7027A0", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

const StatCard = ({ title, value, subtitle }) => (
    <Paper elevation={2} sx={{ p: 2, borderRadius: 2, textAlign: "center" }}>
        <Typography variant="overline" color="text.secondary">{title}</Typography>
        <Typography variant="h4" fontWeight={800}>{value}</Typography>
        {subtitle && <Typography variant="body2" color="text.secondary">{subtitle}</Typography>}
    </Paper>
);

const Reports = () => {
    const [year, setYear] = useState(CURRENT_YEAR);
    const [topN, setTopN] = useState(5);
    const [loading, setLoading] = useState(true);
    const [periodType, setPeriodType] = useState("month");

    // datasets
    const [appointmentsPerVet, setAppointmentsPerVet] = useState([]);
    const [vaccinesPerMonth, setVaccinesPerMonth] = useState([]);
    const [topProducts, setTopProducts] = useState([]);
    const [petsPerOwner, setPetsPerOwner] = useState([]);
    const [topDiagnoses, setTopDiagnoses] = useState([]);
    const [diagnosesBySpecies, setDiagnosesBySpecies] = useState([]);
    const [petsBySpecies, setPetsBySpecies] = useState([]);
    const [petsByGender, setPetsByGender] = useState([]);
    const [appointmentsByPeriod, setAppointmentsByPeriod] = useState([]);
    const [averagePetAge, setAveragePetAge] = useState(0);

    const fetchAll = async () => {
        setLoading(true);
        try {
            const [
                apv, vpm, tpr, ppo, tdx,
                pbs, pbg, abp, apa, tdbs
            ] = await Promise.all([
                getAppointmentsPerVet(topN),
                getVaccinesPerMonth(year),
                getTopProducts(topN),
                getPetsPerOwner(topN),
                getTopDiagnoses(topN),
                getPetsBySpecies(),
                getPetsByGender(),
                getAppointmentsByPeriod(periodType, year),
                getAveragePetAge(),
                getTopDiagnosesBySpecies(topN),
            ]);
            setAppointmentsPerVet(apv);
            setVaccinesPerMonth(vpm);
            setTopProducts(tpr);
            setPetsPerOwner(ppo);
            setTopDiagnoses(tdx);
            setPetsBySpecies(pbs);
            setPetsByGender(pbg);
            setAppointmentsByPeriod(abp);
            setAveragePetAge(apa);
            setDiagnosesBySpecies(tdbs);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchAll(); }, [year, topN, periodType]);

    const totalVaccinesYear = useMemo(
        () => vaccinesPerMonth.reduce((acc, it) => acc + (it.count || 0), 0),
        [vaccinesPerMonth]
    );

    return (
        <Stack spacing={2}>
            {/* Header + filtros */}
            <Paper elevation={0} sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
                <Typography variant="h4" fontWeight={800}>Reportes & Estadísticas</Typography>
                <Box sx={{ flexGrow: 1 }} />
                <TextField
                    select size="small" label="Año" value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                >
                    {[CURRENT_YEAR, CURRENT_YEAR - 1, CURRENT_YEAR - 2].map((y) => (
                        <MenuItem key={y} value={y}>{y}</MenuItem>
                    ))}
                </TextField>
                <TextField
                    select size="small" label="Top N" value={topN}
                    onChange={(e) => setTopN(Number(e.target.value))}
                >
                    {TOP_OPTIONS.map((n) => <MenuItem key={n} value={n}>{n}</MenuItem>)}
                </TextField>
                <TextField
                    select size="small" label="Periodo turnos" value={periodType}
                    onChange={(e) => setPeriodType(e.target.value)}
                >
                    <MenuItem value="month">Mensual</MenuItem>
                    <MenuItem value="week">Semanal</MenuItem>
                </TextField>
            </Paper>

            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight={280}>
                    <CircularProgress />
                </Box>
            ) : (
                <Grid container spacing={2}>
                    {/* KPIs */}
                    <Grid item xs={12} md={3}><StatCard title="Promedio edad mascotas" value={`${averagePetAge} años`} /></Grid>
                    <Grid item xs={12} md={3}><StatCard title="Vacunas aplicadas" value={totalVaccinesYear} subtitle={`Año ${year}`} /></Grid>
                    <Grid item xs={12} md={3}><StatCard title="Especies registradas" value={petsBySpecies.length} /></Grid>
                    <Grid item xs={12} md={3}><StatCard title="Géneros registrados" value={petsByGender.length} /></Grid>

                    {/* Vacunas por mes */}
                    <Grid item xs={12} md={6}>
                        <Paper elevation={2} sx={{ p: 2, borderRadius: 2 }}>
                            <Typography variant="h6" fontWeight={700}>Vacunas aplicadas por mes ({year})</Typography>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={vaccinesPerMonth}>
                                    <XAxis dataKey="month" />
                                    <YAxis allowDecimals={false} />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="count" stroke={COLORS[0]} strokeWidth={2} />
                                </LineChart>
                            </ResponsiveContainer>
                        </Paper>
                    </Grid>

                    {/* Turnos por veterinario */}
                    <Grid item xs={12} md={6}>
                        <Paper elevation={2} sx={{ p: 2, borderRadius: 2 }}>
                            <Typography variant="h6" fontWeight={700}>Turnos por veterinario (Top {topN})</Typography>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={appointmentsPerVet}>
                                    <XAxis dataKey="vetName" />
                                    <YAxis allowDecimals={false} />
                                    <Tooltip />
                                    <Bar dataKey="count" fill={COLORS[1]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </Paper>
                    </Grid>

                    {/* Turnos por periodo */}
                    <Grid item xs={12} md={6}>
                        <Paper elevation={2} sx={{ p: 2, borderRadius: 2 }}>
                            <Typography variant="h6" fontWeight={700}>
                                Turnos por {periodType === "month" ? "mes" : "semana"} ({year})
                            </Typography>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={appointmentsByPeriod}>
                                    <XAxis dataKey="period" />
                                    <YAxis allowDecimals={false} />
                                    <Tooltip />
                                    <Bar dataKey="count" fill={COLORS[2]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </Paper>
                    </Grid>

                    {/* Mascotas por especie */}
                    <Grid item xs={12} md={6}>
                        <Paper elevation={2} sx={{ p: 2, borderRadius: 2 }}>
                            <Typography variant="h6" fontWeight={700}>Mascotas atendidas por especie</Typography>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie data={petsBySpecies} dataKey="count" nameKey="species" label outerRadius={100}>
                                        {petsBySpecies.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </Paper>
                    </Grid>

                    {/* Mascotas por género */}
                    <Grid item xs={12} md={6}>
                        <Paper elevation={2} sx={{ p: 2, borderRadius: 2 }}>
                            <Typography variant="h6" fontWeight={700}>Mascotas por género</Typography>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie data={petsByGender} dataKey="count" nameKey="gender" label outerRadius={100}>
                                        {petsByGender.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </Paper>
                    </Grid>

                    {/* Productos más usados */}
                    <Grid item xs={12} md={6}>
                        <Paper elevation={2} sx={{ p: 2, borderRadius: 2 }}>
                            <Typography variant="h6" fontWeight={700}>Productos más usados (Top {topN})</Typography>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={topProducts}>
                                    <XAxis dataKey="productName" />
                                    <YAxis allowDecimals={false} />
                                    <Tooltip />
                                    <Bar dataKey="count" fill={COLORS[3]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </Paper>
                    </Grid>

                    {/* Diagnósticos más frecuentes */}
                    <Grid item xs={12} md={6}>
                        <Paper elevation={2} sx={{ p: 2, borderRadius: 2 }}>
                            <Typography variant="h6" fontWeight={700}>Diagnósticos más frecuentes (Top {topN})</Typography>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie data={topDiagnoses} dataKey="count" nameKey="diagnosis" label outerRadius={100}>
                                        {topDiagnoses.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </Paper>
                    </Grid>

                    {/* 🧩 Diagnósticos más frecuentes por especie */}
                    <Grid item xs={12}>
                        <Paper elevation={2} sx={{ p: 2, borderRadius: 2 }}>
                            <Typography variant="h6" fontWeight={700}>
                                Diagnósticos más frecuentes por especie (Top {topN})
                            </Typography>
                            <ResponsiveContainer width="100%" height={350}>
                                <BarChart
                                    data={Object.values(
                                        diagnosesBySpecies.reduce((acc, curr) => {
                                            const diagnosis = curr.diagnosis;
                                            const species = curr.species
                                                ? curr.species.charAt(0).toUpperCase() + curr.species.slice(1).toLowerCase()
                                                : "Desconocido";
                                            if (!acc[diagnosis]) acc[diagnosis] = { diagnosis };
                                            acc[diagnosis][species] = curr.count;
                                            return acc;
                                        }, {})
                                    )}
                                    margin={{ top: 20, right: 30, left: 0, bottom: 40 }}
                                >
                                    <XAxis dataKey="diagnosis" angle={-30} textAnchor="end" interval={0} />
                                    <YAxis allowDecimals={false} />
                                    <Tooltip />
                                    <Legend />
                                    {Array.from(
                                        new Set(
                                            diagnosesBySpecies.map((d) =>
                                                d.species
                                                    ? d.species.charAt(0).toUpperCase() + d.species.slice(1).toLowerCase()
                                                    : "Desconocido"
                                            )
                                        )
                                    ).map((species, i) => (
                                        <Bar key={species} dataKey={species} fill={COLORS[i % COLORS.length]} name={species} />
                                    ))}
                                </BarChart>
                            </ResponsiveContainer>
                        </Paper>
                    </Grid>

                    {/* Dueños con más mascotas */}
                    <Grid item xs={12}>
                        <Paper elevation={2} sx={{ p: 2, borderRadius: 2 }}>
                            <Typography variant="h6" fontWeight={700}>Dueños con más mascotas (Top {topN})</Typography>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={petsPerOwner}>
                                    <XAxis dataKey="ownerName" />
                                    <YAxis allowDecimals={false} />
                                    <Tooltip />
                                    <Bar dataKey="count" fill={COLORS[4]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </Paper>
                    </Grid>
                </Grid>
            )}
        </Stack>
    );
};

export default Reports;
