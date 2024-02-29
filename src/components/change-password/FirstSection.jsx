import React, { useState } from 'react';
import axios from 'axios';
import env from '../../env';

const FirstSection = ({setEmail, textInput, email, setUserImage, setStatus, setUserId, setLoading, error, setError}) => {
    const handleSend = (e) => {
        setLoading(true);
        e.preventDefault();

        axios.post(`${env.API_URL}/changePassword`, {
            email: email
        })
            .then(res => {
                setLoading(false);
                setStatus(1);
                setUserImage(res.data.image);
                setUserId(res.data.userId);
            })
            .catch(err => {
                setLoading(false);

                if(err.response.status === 404) {
                    setError('El correo ingresado no existe.');
                } else {
                    setError('Ha ocurrido un error, intentelo más tarde.');
                }
            });
    }

    return (
        <>
            <input type="email" name="email" placeholder='Ingrese su correo electrónico' onChange={(e) => setEmail(e.target.value)}/>
            <input type="submit" style={{
                color: 'black',
                cursor: 'pointer',
            }} value={textInput} onClick={(e) => handleSend(e)} />
            {error && <p style={{color: 'red', textAlign: 'center', margin: '0px 0'}}>{error}</p>}
        </>
    );
}

export default FirstSection;
