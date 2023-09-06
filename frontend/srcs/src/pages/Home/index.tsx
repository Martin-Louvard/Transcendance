import { useNavigate } from "react-router-dom";
import Authentication from "../../components/Authentication/Authentication";
import Dashboard from "../../components/Dashboard/Dashboard";
import { useAppSelector } from "../../redux/hooks";
import verify from "../../components/Authentication/verify"
import { useEffect } from "react";

function Home() {
    return <Dashboard/>
}
export default Home;