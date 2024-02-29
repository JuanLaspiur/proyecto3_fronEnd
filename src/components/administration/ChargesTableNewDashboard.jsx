import { Add, ForwardToInbox } from '@mui/icons-material';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import React from 'react'

const headCells = [
    {
        id: "_id",
        disablePadding: true,
        label: "N° Contrato",
    },
    {
        id: "name",
        disablePadding: true,
        label: "Nombre",
    },
    {
        id: "date",
        disablePadding: false,
        label: "Fecha",
    },
    {
        id: "description",
        disablePadding: false,
        label: "actions",
    }
];

export default function ChargesTableNewDashboard({charges}) {
    return (
        <Table>
            <TableHead>
                <TableRow>
                    {headCells.map((headCell) => (
                        <TableCell
                            key={headCell.id}
                            align={headCell.numeric ? "right" : "left"}
                            padding={headCell.disablePadding ? "none" : "normal"}
                            sx={{ fontWeight: "bold", border: 'none', color: 'white' }}
                        >
                            {headCell.label}
                        </TableCell>
                    ))}
                </TableRow>
            </TableHead>

            <TableBody>
                {charges.map((charge) => (
                    <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={charge._id}
                        sx={{ border: 'none', color: 'white' }}
                    >
                        <TableCell align="left">{charge._id}</TableCell>
                        <TableCell align="left">{charge.name}</TableCell>
                        <TableCell align="left">{charge.date}</TableCell>
                        <TableCell align="left">
                            <Add />
                            <ForwardToInbox />
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}
