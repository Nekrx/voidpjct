import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../contests/auth';
import { FiHome, FiSettings, FiBookmark, FiCodesandbox, FiChevronsUp, FiCornerUpLeft, FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import './header.css';

export default function Header() {
  const { user } = useContext(AuthContext);
  
  const [isSidebarHidden, setIsSidebarHidden] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarHidden(!isSidebarHidden);
  };

  return (
    <div className={`sidebar ${isSidebarHidden ? 'hidden' : ''}`}>
      <div>
      <Link to="/dashboard">
        <FiHome size={24} />
        {!isSidebarHidden && 'Home'}
      </Link>
      <Link to="/">
        <FiCodesandbox size={24} />
        {!isSidebarHidden && 'Criar Evento'}
      </Link>
      <Link to="/">
        <FiBookmark size={24} />
        {!isSidebarHidden && 'Eventos passados'}
      </Link>
      </div>
      
      <button className="toggle-button" onClick={toggleSidebar}>
      <h3>{!isSidebarHidden && 'Esconder'}</h3>
      {isSidebarHidden ? <FiArrowRight size={50} /> : <FiArrowLeft size={50} />}
      </button>

      
      <div>
          <Link to="/">
            <FiSettings size={24} />
            {!isSidebarHidden && 'Profile'}
          </Link>
          <Link to="/">
            <FiChevronsUp size={24} />
            {!isSidebarHidden && 'Alterar plano'}
          </Link>
          <Link className="logoutbtn" to="/">
            <FiCornerUpLeft size={24} />
            {!isSidebarHidden && 'Logout'}
          </Link>
      </div>

    </div>
  );
}
