import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../../services/firebaseConnections";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import "./gerenciarTorneio.css";


export default function GerenciarTorneioSuico() {
  const { id } = useParams();
  const [tournament, setTournament] = useState(null);
  const [players, setPlayers] = useState([]);
  const [rounds, setRounds] = useState([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [newPlayerName, setNewPlayerName] = useState("");
  const [timeAdjustment, setTimeAdjustment] = useState(0);
  const [isRepairementRequested, setIsRepairementRequested] = useState(false);
  const [minPlayers, setMinPlayers] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTournament = async () => {
      try {
        const docRef = doc(db, "tournaments", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const tournamentData = docSnap.data();
          setTournament({ id: docSnap.id, ...tournamentData });
          setPlayers(tournamentData.participants || []);
          setTimeLeft(
            tournamentData.duration === "Ilimitado"
              ? 0
              : tournamentData.duration * 60,
            setMinPlayers(tournamentData.minPlayers),

          );
        } else {
          console.error("Torneio não encontrado.");
          navigate("/");
        }
      } catch (error) {
        console.error("Erro ao carregar torneio:", error);
      }
    };

    fetchTournament();
  }, [id, navigate]);

  useEffect(() => {
    let timer;
    if (isTimerRunning) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isTimerRunning]);

  const addPlayer = () => {
    if (newPlayerName.trim()) {
      const updatedPlayers = [
        ...players,
        { name: newPlayerName.trim(), points: 0, tiebreak: 0 },
      ];
      setPlayers(updatedPlayers);
      setNewPlayerName("");
    }
  };

  const savePlayers = async () => {
    try {
      const docRef = doc(db, "tournaments", id);
      await updateDoc(docRef, { participants: players });
      console.log("Jogadores atualizados com sucesso.");
    } catch (error) {
      console.error("Erro ao salvar jogadores:", error);
    }
  };

  const calculateRounds = () => {
    const numPlayers = players.length;
    if (numPlayers <= 8) return 3;
    if (numPlayers <= 16) return 4;
    if (numPlayers <= 32) return 5;
    if (numPlayers <= 64) return 6;
    return 3;
  };

  const generatePairings = () => {
    if (players.length < minPlayers) {
      alert(`Você precisa de pelo menos ${minPlayers} jogadores para iniciar o torneio.`);
      return;
    }
    const activePlayers = players.filter((player) => !player.eliminated);
    let pairings = [];
    const shuffledPlayers = [...activePlayers].sort(() => Math.random() - 0.5);
    for (let i = 0; i < shuffledPlayers.length; i += 2) {
      if (shuffledPlayers[i + 1]) {
        pairings.push({
          player1: shuffledPlayers[i],
          player2: shuffledPlayers[i + 1],
          result: null,
        });
      } else {
      }
    }
    console.log(pairings);
  
    setRounds((prevRounds) => [...prevRounds, pairings]);
    setCurrentRound((prevRound) => prevRound + 1);
  };

  const handleStartTournament = () => {
    if (players.length < minPlayers) {
      alert(`Você precisa de pelo menos ${minPlayers} jogadores para iniciar o torneio.`);
    } else {
      generatePairings();
    }
  };

  const handleResultChange = (roundIndex, matchIndex, result) => {
    const updatedRounds = [...rounds];
    const match = updatedRounds[roundIndex][matchIndex];

    match.result = result;

    const updatePoints = (player, points, tiebreak) => {
      const playerIndex = players.findIndex((p) => p.name === player.name);
      if (playerIndex !== -1) {
        const updatedPlayers = [...players];
        updatedPlayers[playerIndex].points += points;
        updatedPlayers[playerIndex].tiebreak += tiebreak;
        setPlayers(updatedPlayers);
      }
    };

    if (result === "player1") {
      updatePoints(match.player1, 3, match.player2.points);
    } else if (result === "player2") {
      updatePoints(match.player2, 3, match.player1.points);
    } else if (result === "draw") {
      updatePoints(match.player1, 1, 0.5);
      updatePoints(match.player2, 1, 0.5);
    }

    setRounds(updatedRounds);
  };

  const toggleTimer = () => {
    setIsTimerRunning((prev) => !prev);
  };

  const adjustTime = () => {
    setTimeLeft((prevTime) => prevTime + timeAdjustment * 60);
    setTimeAdjustment(0);
  };

  const openTimerWindow = () => {
    const timerWindow = window.open("", "_blank", "width=300,height=200");
    timerWindow.document.write(`<p style="font-size: 24px;">${formatTime(timeLeft)}</p>`);
    timerWindow.document.close();
  };

  const formatTime = (time) => {
    if (isNaN(time)) {
      return "Tempo inválido";
    }
    
    const absTime = Math.abs(time);
    const prefix = time < 0 ? "-" : "";
    return `${prefix}${new Date(absTime * 1000).toISOString().substr(11, 8)}`;
  };

  const reviewRound = (roundIndex) => {
    setCurrentRound(roundIndex);
  };

  const isRoundComplete = (roundIndex) => {
    return rounds[roundIndex].every((match) => match.result);
  };

  const handleFinishTournament = async () => {
    try {
      const docRef = doc(db, "tournaments", id);
      await updateDoc(docRef, {
        status: "finalizado",
        finalResults: players,
      });
      alert("Torneio finalizado com sucesso!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Erro ao finalizar torneio:", error);
    }
  };

  const handleNextRound = () => {
    if (currentRound < rounds.length) {
      const nextRound = currentRound + 1;
      setCurrentRound(nextRound);
    }
  };

  const isAllRoundsCompleted = () => {
    return rounds.every(round => round.every(match => match.result !== null));
  };

  return (
    <div className="tournament-management">
      {tournament ? (
        <>
          <h1>Gerenciar Torneio: {tournament.name}</h1>
          <div className="timer">
            <p>Timer: {formatTime(timeLeft)}</p>
            <button onClick={toggleTimer}>
              {isTimerRunning ? "Pause" : "Play"}
            </button>
            <button onClick={adjustTime}>Ajustar Tempo</button>
            <input
              type="number"
              placeholder="Minutos"
              value={timeAdjustment}
              onChange={(e) => setTimeAdjustment(Number(e.target.value))}
            />
            <button onClick={openTimerWindow}>Abrir Timer</button>
          </div>

          {currentRound === 0 ? (
            <div className="pre-start">
              <h2>Lista de Jogadores</h2>
              <ul>
                {players.map((player, index) => (
                  <li key={index}>
                    {player.name}
                  </li>
                ))}
              </ul>
              <input
                type="text"
                placeholder="Nome do jogador"
                value={newPlayerName}
                onChange={(e) => setNewPlayerName(e.target.value)}
              />
              <button onClick={addPlayer}>Adicionar Jogador</button>
              <button onClick={savePlayers}>Salvar Jogadores</button>
              <button onClick={handleStartTournament}>Começar Torneio</button>
            </div>
          ) : (
            <div className="rounds">
              {rounds.map((round, roundIndex) => (
                <div key={roundIndex} className="round">
                  <h2>
                    Rodada {roundIndex + 1}
                    <button onClick={() => reviewRound(roundIndex)}>Revisar</button>
                  </h2>
                  {round.map((match, matchIndex) => (
                    <div key={matchIndex} className="match">
                      <span>
                        {match.player1.name} vs {match.player2.name}
                      </span>
                      <select
                        value={match.result || ""}
                        onChange={(e) =>
                          handleResultChange(roundIndex, matchIndex, e.target.value)
                        }
                      >
                        <option value="" disabled>
                          Selecione o resultado
                        </option>
                        <option value="player1">Vitória {match.player1.name}</option>
                        <option value="player2">Vitória {match.player2.name}</option>
                        <option value="draw">Empate</option>
                      </select>
                    </div>
                  ))}
                  {isRoundComplete(roundIndex) && currentRound < rounds.length - 1 && (
                    <button onClick={handleNextRound}>Próxima Rodada</button>
                  )}
                </div>
              ))}
            </div>
          )}

          {(isAllRoundsCompleted() || currentRound > rounds.length - 1) && (
            <button onClick={handleFinishTournament}>Finalizar Torneio</button>
          )}
        </>
      ) : (
        <p>Carregando torneio...</p>
      )}
    </div>
  );
}
