import React, { useRef, useState } from 'react';
import axios from 'axios';
const env = require('../../env.js')
import { useSnackbar } from 'notistack';

const ThirdSection = ({ textInput, email, setStatus }) => {
    const password = useRef();
    const validatePassword = useRef();
    const [error, setError] = useState(false);
    const { enqueueSnackbar } = useSnackbar();

    const handleChange = (e) => {
        e.preventDefault(e);
        if (password.current.value !== validatePassword.current.value) return enqueueSnackbar('Las contraseñas no coinciden', { variant: 'error' });

        axios.put(`${env.API_URL}/changePassword`, {
            newPassword: password.current.value,
            email: email
        })
            .then(res => setStatus(3))
            .catch(err => {
                enqueueSnackbar('Ha ocurrido un error, por favor intente de nuevo', { variant: 'error' });
            })
    };

    return (
        <>
            <input type="password" placeHolder="Ingresa nueva contraseña" ref={password} />
            <input type="password" placeHolder="Repetir contraseña" ref={validatePassword} />

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <input
                type="submit"
                value={textInput}
                onClick={(e) => handleChange(e)}
                style={{ cursor: 'pointer', color: 'black' }}
            />
        </>
    );
}

export default ThirdSection;
