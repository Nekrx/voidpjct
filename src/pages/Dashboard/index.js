import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../contests/auth";
import Header from "../../components/header";
import './dashboard.css';
import Title from '../../components/Title';
import { FiPlus, FiMessageSquare, FiSearch, FiEdit2 } from "react-icons/fi";
import { Link } from "react-router-dom";
import { collection, getDocs, orderBy, limit, startAfter, query } from "firebase/firestore";
import { db } from "../../services/firebaseConnections";
import {format} from "date-fns";

function App() {
    return (
      <Header>
        <Title></Title>
      </Header>
    );
  }
  
  export default App;