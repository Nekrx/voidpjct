import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../contests/auth";
import Header from "../../components/header";
import './dashboard.css';
import Title from '../../components/Title';
import { FiPlus, FiMessageSquare, FiSearch, FiEdit2 } from "react-icons/fi";
import { Link } from "react-router-dom";
import { collection, getDocs, orderBy, limit, startAfter, query } from "firebase/firestore";
import { db } from "../../services/firebaseConnections";
import { format } from "date-fns";

const listRef = collection(db, "Torneios");

export default function Dashboard() {
  const { logout } = useContext(AuthContext);
  const [torneios, setTorneios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEmpty, setIsEmpty] = useState(false);
  const [lastDocs, setLastDocs] = useState();
  const [loadingMore, setLoadingMore] = useState(false);


  async function fetchTorneios() {
    const q = query(listRef, orderBy("created", "desc"), limit(5));
    const querySnapshot = await getDocs(q);

    const isCollectionEmpty = querySnapshot.size === 0;
    if (!isCollectionEmpty) {
      let lista = [];
      querySnapshot.forEach((doc) => {
        lista.push(doc.data());
      });

      const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
      setTorneios(lista);
      setLastDocs(lastDoc);
    } else {
      setIsEmpty(true);
    }

    setLoading(false);
  }

  useEffect(() => {
    fetchTorneios();
  }, []);

  async function handleMore() {
    setLoadingMore(true);

    const q = query(listRef, orderBy("created", "desc"), startAfter(lastDocs), limit(5));
    const querySnapshot = await getDocs(q);
    const isCollectionEmpty = querySnapshot.size === 0;

    if (!isCollectionEmpty) {
      let lista = [];
      querySnapshot.forEach((doc) => {
        lista.push(doc.data());
      });

      const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
      setTorneios((prevTorneios) => [...prevTorneios, ...lista]);
      setLastDocs(lastDoc);
    } else {
      setIsEmpty(true);
    }

    setLoadingMore(false);
  }

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

        {torneios.length === 0 ? (
          <div className="container dashboard">
            <span> Nenhum torneio encontrado...</span>
          </div>
        ) : (
          <>
            <table>
              <thead>
                <tr>
                  <th scope="col">Torneio</th>
                  <th scope="col">Rodadas</th>
                  <th scope="col">Timer</th>
                  <th scope="col">Data</th>
                </tr>
              </thead>
            </table>

            {loadingMore && <h3>Buscando mais torneios...</h3>}
            {!loadingMore && !isEmpty && (
              <button className="btn-more" onClick={handleMore}>
               Buscar mais...
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
