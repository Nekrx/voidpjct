import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../services/firebaseConnections";
import { collection, doc, setDoc } from "firebase/firestore";
import './criarevento.css';


export default function CriarEvento() {
  const [name, setName] = useState("");
  const [mode, setMode] = useState("");
  const [minPlayers, setMinPlayers] = useState("");
  const [duration, setDuration] = useState("");
  const navigate = useNavigate();

  const getMinimumPlayers = (selectedMode) => {
    switch (selectedMode) {
      case "suiço":
      case "matamata":
      case "multiplayer":
      case "competitivo":
        return 4;
      case "2x2":
      case "draft":
        return 8;
      default:
        return null;
    }
  };

  const handleModeChange = (e) => {
    const selectedMode = e.target.value;
    setMode(selectedMode);
    const minPlayersRequired = getMinimumPlayers(selectedMode);
    setMinPlayers(minPlayersRequired !== null ? minPlayersRequired : "");
  };

  const handleMinPlayersChange = (e) => {
    const newMinPlayers = parseInt(e.target.value, 10);
    const minPlayersAllowed = getMinimumPlayers(mode);
    if (newMinPlayers >= minPlayersAllowed) {
      setMinPlayers(newMinPlayers);
    } else {
      e.target.value = minPlayers;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const minPlayersRequired = getMinimumPlayers(mode);
    if (minPlayers < minPlayersRequired) {
      alert(`O número mínimo de jogadores deve ser pelo menos ${minPlayersRequired}.`);
      return;
    }

    try {
      const tournamentId = Math.random().toString(36).substring(2, 10).toUpperCase().slice(0, 8);
      console.log("Tournament ID:", tournamentId);

      const tournamentData = {
        name,
        mode,
        minPlayers: parseInt(minPlayers, 10),
        duration: duration === "Ilimitado" ? duration : parseInt(duration, 10),
        participants: [],
      };

      const docRef = doc(db, "tournaments", tournamentId);
      await setDoc(docRef, tournamentData);
      console.log("Tournament added with ID:", tournamentId);

      window.open(`/entrarevento/${tournamentId}`, "_blank");

      navigate(`/evento/${tournamentId}`);
    } catch (error) {
      console.error("Erro ao criar torneio:", error);
    }
  };

  const isSubmitDisabled = () => {
    const minPlayersRequired = getMinimumPlayers(mode);
    return minPlayersRequired !== null && (minPlayers < minPlayersRequired);
  };

  return (
    <div className="container">
      <h1>Criar Torneio</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Nome do Torneio:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <label>
          Modalidade:
          <br/>
          <select value={mode} onChange={handleModeChange} required>
            <option value="" disabled>Selecione a modalidade</option>
            <option value="suiço">Suiço</option>
            <option value="matamata">Mata-mata</option>
            <option value="multiplayer">Multiplayer</option>
            <option value="competitivo">Competitivo</option>
            <option value="2x2">Duplas</option>
            <option value="draft">Booster Draft</option>
            <option value="listajog">Lista de Jogadores</option>
            <option value="sorteio">Sorteio</option>
          </select>
        </label>
        <label>
          <p>Número mínimo de jogadores:</p>
          <input
            type="number"
            value={minPlayers}
            onChange={handleMinPlayersChange}
            required={getMinimumPlayers(mode) !== null && minPlayers >= getMinimumPlayers(mode)}
            disabled={getMinimumPlayers(mode) === null}
          />
        </label>
        <label>
          Duração do torneio:
          <select value={duration} onChange={(e) => setDuration(e.target.value)} required>
            {[...Array(12).keys()].map(i => (
              <option key={i} value={(i + 1) * 5}>{(i + 1) * 5} minutos</option>
            ))}
            <option value="Ilimitado">Ilimitado</option>
          </select>
        </label>
        <button type="submit" disabled={isSubmitDisabled()}>Criar Torneio</button>
      </form>
    </div>
  );
}