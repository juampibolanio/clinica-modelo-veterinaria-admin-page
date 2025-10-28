import { useEffect, useState } from "react";
import { Box, Stack, Typography, Paper, Divider, CircularProgress, Button } from "@mui/material";
import dayjs from "dayjs";
import { useParams, useNavigate } from "react-router-dom";
import { getClinicalHistoryById } from "../api/clinical-history.api";

const ClinicalHistoryDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const data = await getClinicalHistoryById(id);
                setItem(data);
            } finally {
                setLoading(false);
            }
        })();
    }, [id]);

    if (loading) return <CircularProgress />;
    if (!item) return null;

    return (
        <Stack spacing={2}>
            <Stack direction="row" alignItems="center">
                <Typography variant="h4" fontWeight={800}>Historia #{item.id}</Typography>
                <Button sx={{ ml: "auto" }} onClick={() => navigate(`/clinical-history/${id}/edit`)} variant="contained">
                    Editar
                </Button>
            </Stack>

            <Paper sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" fontWeight={700}>Información</Typography>
                <Divider sx={{ my: 2 }} />
                <Box>Fecha: <b>{item.date ? dayjs(item.date).format("DD/MM/YYYY") : "-"}</b></Box>
                <Box>Tipo: <b>{item.consultationType}</b></Box>
                <Box>Motivo: <b>{item.consultationReason}</b></Box>
                <Box>Diagnóstico: <b>{item.diagnosis || "-"}</b></Box>
                <Box>Tratamiento: <b>{item.treatment || "-"}</b></Box>
                <Box>Observaciones: <b>{item.observations || "-"}</b></Box>
                <Divider sx={{ my: 2 }} />
                <Box>Mascota: <b>#{item.petId} - {item.petName}</b></Box>
                <Box>Veterinario: <b>#{item.veterinarianId} - {item.veterinarianName}</b></Box>
            </Paper>
        </Stack>
    );
};

export default ClinicalHistoryDetail;
