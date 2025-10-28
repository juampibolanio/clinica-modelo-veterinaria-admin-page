import { useEffect, useMemo, useState } from "react";
import {
    Box, Grid, Stack, Paper, Typography, TextField, MenuItem,
    Divider, CircularProgress,
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
} from "../api/vet-stats.api";

const TOP_OPTIONS = [5, 10];
const CURRENT_YEAR = dayjs().year();

const StatCard = ({ title, value, subtitle }) => (
    <Paper elevation={2} sx={{ p: 2, borderRadius: 2 }}>
        <Typography variant="overline" color="text.secondary">{title}</Typography>
        <Typography variant="h4" fontWeight={800}>{value}</Typography>
        {subtitle && <Typography variant="body2" color="text.secondary">{subtitle}</Typography>}
    </Paper>
);

const Reports = () => {
    const [year, setYear] = useState(CURRENT_YEAR);
    const [topN, setTopN] = useState(5);
    const [loading, setLoading] = useState(true);

    const [appointmentsPerVet, setAppointmentsPerVet] = useState([]);
    const [vaccinesPerMonth, setVaccinesPerMonth] = useState([]);
    const [topProducts, setTopProducts] = useState([]);
    const [petsPerOwner, setPetsPerOwner] = useState([]);
    const [topDiagnoses, setTopDiagnoses] = useState([]);

    const fetchAll = async () => {
        setLoading(true);
        try {
            const [
                apv, vpm, tpr, ppo, tdx
            ] = await Promise.all([
                getAppointmentsPerVet(topN),
                getVaccinesPerMonth(year),
                getTopProducts(topN),
                getPetsPerOwner(topN),
                getTopDiagnoses(topN),
            ]);
            setAppointmentsPerVet(apv);
            setVaccinesPerMonth(vpm);
            setTopProducts(tpr);
            setPetsPerOwner(ppo);
            setTopDiagnoses(tdx);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchAll(); }, [year, topN]);

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
            </Paper>

            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight={280}>
                    <CircularProgress />
                </Box>
            ) : (
                <Grid container spacing={2}>
                    {/* Vacunas por mes */}
                    <Grid item xs={12} md={6}>
                        <Paper elevation={2} sx={{ p: 2, borderRadius: 2 }}>
                            <Typography variant="h6" fontWeight={700}>Vacunas aplicadas por mes ({year})</Typography>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={vaccinesPerMonth}>
                                    <XAxis dataKey="month" />
                                    <YAxis allowDecimals={false} />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="count" strokeWidth={2} />
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
                                    <Bar dataKey="count" />
                                </BarChart>
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
                                    <Bar dataKey="count" />
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
                                    <Pie
                                        data={topDiagnoses}
                                        dataKey="count"
                                        nameKey="diagnosis"
                                        outerRadius={100}
                                        label
                                    >
                                        {topDiagnoses.map((_, i) => <Cell key={i} />)}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
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
                                    <Bar dataKey="count" />
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
