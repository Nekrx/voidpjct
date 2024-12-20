import { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { AuthContext } from '../../contests/auth';
import { FiHome, FiSettings, FiBookmark, FiCodesandbox, FiChevronsUp} from 'react-icons/fi';
import './header.css';
import { CgFormatUppercase } from 'react-icons/cg';


export default function Header(){
    const {user} = useContext(AuthContext);
  
    return(
        <div className="sidebar">
            <Link to="/dashboard">
            <FiHome color="#FFF" size= {24}/>
            Home
            </Link>
            <Link to="/">
            <FiCodesandbox color="#FFF" size= {24}/>
            Criar Evento
            </Link>
            <Link to="/">
            <FiBookmark color="#FFF" size= {24}/>
            Eventos passados
            </Link>
            <Link to="/">
            <FiSettings color="#FFF" size= {24}/>
            Profile
            </Link>
            <Link to="/">
            <FiChevronsUp color="#FFF" size= {24}/>
            Alterar plano
            </Link>
            </div>
    )
}