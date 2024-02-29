import React, { useState, useEffect } from 'react'
import { Card, CardContent, Grid, Typography } from '@mui/material'
import { Close } from '@mui/icons-material'

export default function CommentsOfDayView({ handleClose, day, month, year }) {
    const [comments, setComments] = useState([]);
    const [datas, setDatas] = useState([])
    const [totalMinutes, setTotalMinutes] = useState(day?.totalMinutes || 0 )

    useEffect(() => {
        const aux = [];
        const datas = []

        console.log("day", day)

        if (day.exit1) {
            const dataComment = { message: day.message1, time: day.exit1, name: "Salida 1", nameEntry: "Entrada 1", timeEntry: day.entry1}
            if (day.data1) {
                dataComment.minutes = day.data1[0]?.minutes
                datas.push(day.data1)
            }
            aux.push(dataComment)
        };

        if (day.exit2) {
            const dataComment = { message: day.message2, time: day.exit2, name: "Salida 2", nameEntry: "Entrada 2", timeEntry: day.entry2}
            if (day.data2) {
                dataComment.minutes = day.data2[0]?.minutes
                datas.push(day.data2)
            }
            aux.push(dataComment)
        };

        if (day.exit3) {
            const dataComment = { message: day.message3, time: day.exit3, name: "Salida 3", nameEntry: "Entrada 3", timeEntry: day.entry3}
            if (day.data3) {
                dataComment.minutes = day.data3[0]?.minutes
                datas.push(day.data3)
            }
            aux.push(dataComment)
        };

        setComments(aux)
        setDatas(datas[0])
    }, [])

    return (
        <div
            style={{
                width: "100vw",
                height: "100vh",
                position: "fixed",
                top: 0,
                left: 0,
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                zIndex: 1102,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Close onClick={handleClose} style={{ position: "absolute", top: 10, right: 40, cursor: "pointer", fontSize: 40, color: 'white' }} />

            <Card sx={{ width: '50%', overflowY: 'auto', maxHeight: '80%' }}>
                <CardContent sx={{ textAlign: "center" }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant="h5" component="div">
                                {day.day < 10 ? `0${day.day}` : day.day}/
                                {day.month ? day.month < 10 ? `0${day.month}` : day.month : month < 10 ? `0${month}` : month}/
                                {day.year ? day.year : year}
                            </Typography>
                        </Grid>

                        {!comments.length && !datas && <Grid item xs={12}><p style={{ textAlign: 'center' }}>No existen registros para este dia</p></Grid>}
                        
                        <Grid item xs={12}>
                            {comments.length ? comments.map(comment => (
                                <Grid container spacing={2} key={comment.name}>
                                    <Grid item xs={12}>
                                        <p style={{ textAlign: 'left' }}>
                                            {comment.name} - {comment.time}
                                        </p>

                                        <p style={{ textAlign: 'left' }}>
                                            Total Minutos - {comment.minutes}
                                        </p>

                                        <p style={{ textAlign: 'left', margin: 30 }}>
                                            {typeof comment.message === 'string' && comment.message}
                                        </p>
                                    </Grid>
                                </Grid>
                            )) : <></>}

                            {datas && datas.length 
                                ? datas.map(data => (
                                    <Grid container spacing={2} key={data.name}>
                                        <Grid item xs={12}>
                                            <p style={{ textAlign: 'left' }}>
                                                Proyecto: {data.project.name}
                                                <br />
                                                Comentario: {data.message}
                                                <br />
                                                <br />
                                                <br />
                                            </p>
                                        </Grid>
                                    </Grid>
                                ))
                                : <></>
                            }
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </div>
    )
}


