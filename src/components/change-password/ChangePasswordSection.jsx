import React, { useState, useEffect } from "react";
import styles from "./ChangePasswordSection.module.scss";
import axios from "axios";
import FirstSection from "./FirstSection";
import SecondSection from "./SecondSection";
import ThirdSection from "./ThirdSection";
import LoadingModal from "../common/LoadingModal";

export default function ChangePasswordSection({
  img,
  text,
  subtext,
  numberStatus,
  setStatus,
  userImage,
  setUserImage,
  setEmail,
  email,
  setUserId,
  userId
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  if(loading) return (
    <div className={styles.container}>
      <LoadingModal />
    </div>
  )

  return (
    <div className={styles.container}>
      <img src={img || userImage} alt={text} style={{width: 200, height: 200, marginBottom: 30}}/>

      <h3 style={{marginBottom: 10}}>{text}</h3>
      {subtext && <p>{subtext}</p>}

      <form action="">
        {numberStatus === 0 && (
          <FirstSection
            email={email}
            setUserImage={setUserImage}
            setStatus={setStatus}
            textInput="Enviar recuperación"
            setEmail={setEmail}
            setUserId={setUserId}
            setLoading={setLoading}
            error={error}
            setError={setError}
          />
        )}

        {numberStatus === 1 && (
          <SecondSection
            textInput="Ingresar código"
            setStatus={setStatus}
            email={email}
            setLoading={setLoading}
          />
        )}

        {numberStatus === 2 && <ThirdSection textInput={'Cambiar contraseña'} setStatus={setStatus} userId={userId} setLoading={setLoading} email={email}/> }
      </form>
    </div>
  );
}
