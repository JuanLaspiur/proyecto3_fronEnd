import React, { useState, useRef } from 'react';
import styles from './ChangePasswordSection.module.scss';
import axios from 'axios';
import env from '../../env';

const SecondSection = ({textInput, setStatus, email}) => {
    const [error, setError] = useState(false);

    const form = {
        0: useRef(),
        1: useRef(),
        2: useRef(),
        3: useRef(),
        4: useRef(),
        5: useRef()
    };

    const handleVerificate = (e) => {
        e.preventDefault();
        const code = [];
        
        for (let index = 0; index <= 5; index++) {
            const element = form[index].current.value;
            code.push(element);
        }

        axios.post(`${env.API_URL}/changePassword/verifyCode`, {email: email, code: code.join('')})
            .then(res => {
                setStatus(2);
            })
            .catch(err => {
                console.log(err);
                setError('El código ingresado es incorrecto.');
            })
    }

    return (
        <>
            <ol className={styles.password_code}>
                <input style={{textAlign: 'center', marginRight: 10}} maxLength={1} type="text" name="" id="0" ref={form[0]} />
                <input style={{textAlign: 'center', marginRight: 10}} maxLength={1} type="text" name="" id="1" ref={form[1]} />
                <input style={{textAlign: 'center', marginRight: 10}} maxLength={1} type="text" name="" id="2" ref={form[2]} />
                <input style={{textAlign: 'center', marginRight: 10}} maxLength={1} type="text" name="" id="3" ref={form[3]} />
                <input style={{textAlign: 'center', marginRight: 10}} maxLength={1} type="text" name="" id="4" ref={form[4]} />
                <input style={{textAlign: 'center', marginRight: 10}} maxLength={1} type="text" name="" id="5" ref={form[5]} />
            </ol>

            {error && <p style={{color: 'red', marginBottom: 20, textAlign: 'center'}}>{error}</p>}

            <input type="submit" style={{cursor: 'pointer', color: 'black'}} value={textInput} onClick={(e) => handleVerificate(e)}/>
        </>
    );
}

export default SecondSection;
