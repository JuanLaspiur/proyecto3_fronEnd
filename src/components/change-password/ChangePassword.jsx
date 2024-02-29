import React, { useState } from 'react';
import styles from './ChangePassword.module.scss';
import ChangePasswordSection from './ChangePasswordSection';
import { Close } from '@mui/icons-material';

export default function ChangePassword({setIsModal}) {
  const [status, setStatus] = useState(0);
  const [userImage, setUserImage] = useState(null);
  const [email, setEmail] = useState('');
  const [userId, setUserId] = useState(null);

  return (
    <section className={styles.modal}>

      <div className={styles.container}>
        <Close className={styles.close} onClick={() => setIsModal(false)}/>

        <div className={styles.slider} style={{left: `-${status}00%`}}>
          <ChangePasswordSection 
            text={"¿Perdiste tu contraseña?"}
            numberStatus={0}
            setStatus={setStatus}
            setUserImage={setUserImage}
            email={email}
            setEmail={setEmail}
            setUserId={setUserId}
          />

          <ChangePasswordSection 
            userImage={userImage} 
            email={email}
            text={"Ingresa tu código"}
            subtext={"Hemos enviado un código a tu correo electrónico."}
            numberStatus={1}
            setStatus={setStatus}
          />
          
          <ChangePasswordSection 
            userImage={userImage} 
            text={"Establecer contraseña"}
            numberStatus={2}
            textInput={"Cambiar clave"}
            email={email}
            setStatus={setStatus}
            userId={userId}
          />

          <ChangePasswordSection 
            img={"https://upload.wikimedia.org/wikipedia/commons/c/c6/Sign-check-icon.png"} 
            text={"Contraseña cambiada!"}
            numberStatus={3}
          />
        </div>
      </div>

    </section>
  )
}
