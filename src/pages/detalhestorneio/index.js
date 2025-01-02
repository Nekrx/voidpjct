import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import { db } from "../../services/firebaseConnections";
import { doc, getDoc } from "firebase/firestore";

export default function EntrarTorneio() {
  const { id } = useParams();
  const [tournament, setTournament] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTournament = async () => {
      try {
        console.log("Buscando torneio com ID:", id);
        const docRef = doc(db, "tournaments", id);
        const docSnap = await getDoc(docRef);
  
        if (docSnap.exists()) {
          console.log("Documento encontrado:", docSnap.data());
          setTournament({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.log("Torneio não encontrado");
        }
      } catch (error) {
        console.error("Erro ao carregar o torneio:", error);
        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    };
  
    fetchTournament();
  }, [id, navigate]);

  if (loading) {
    return <p>Carregando...</p>;
  }

  return (
    <div className="tournament-details">
      {tournament ? (
        <>
          <h1><strong>Nome:</strong> {tournament.name}</h1>
          <p><strong>Modalidade:</strong> {tournament.mode}</p>
          <p><strong>Código do Torneio:</strong> {tournament.id}</p>
          <QRCodeCanvas value={`https://seusite.com/detalhestorneio/${tournament.id}`} />
          <br />
          <button onClick={() => navigate("/dashboard")}>Voltar ao Dashboard</button>
        </>
      ) : (
        <p>Torneio não encontrado.</p>
      )}
    </div>
  );
}