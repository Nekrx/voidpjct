import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../contests/auth";
import Header from "../../components/header";
import './dashboard.css';
import Title from '../../components/Title';
import { FiMessageSquare } from "react-icons/fi";
import { Link } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../services/firebaseConnections";

const listRef = collection(db, "tournaments");

export default function Dashboard() {
  const { logout } = useContext(AuthContext);
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEmpty, setIsEmpty] = useState(false);

  async function fetchTournaments() {
    try {
      const querySnapshot = await getDocs(listRef); 

      if (querySnapshot.empty) {
        setIsEmpty(true);
        return;
      }

      let lista = [];
      querySnapshot.forEach((doc) => {
        const tournament = doc.data();
        console.log("Tournament:", tournament); 

        lista.push({
          id: doc.id, 
          name: tournament.name, 
        });
      });

      setTournaments(lista);
    } catch (error) {
      console.error("Erro ao buscar torneios: ", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTournaments();
  }, []);

  if (loading) {
    return (
      <div>
        <Header />
        <div className="content">
          <Title name="Dashboard">
            <FiMessageSquare size={25} />
          </Title>

          <div className="container dashboard">
            <span>Carregando...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="content">
        <Title name="Dashboard">
          <FiMessageSquare size={25} />
        </Title>

        {tournaments.length === 0 ? (
          <div className="container dashboard">
            <span>Nenhum torneio encontrado...</span>
          </div>
        ) : (
          <div className="tournaments-list">
            {tournaments.map((tournament, index) => (
              <div key={index} className="tournament-item">
                <span>{tournament.name} - {tournament.id}</span>
                <Link to={`/evento/${tournament.id}`} className="btn-enter">Ver Detalhes</Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
