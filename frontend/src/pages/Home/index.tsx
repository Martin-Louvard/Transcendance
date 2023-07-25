import Authentication from "../../components/Authentication";
import Dashboard from "../../components/Dashboard";
import { useAppSelector } from "../../hooks";

const Home = () => {
    const user = useAppSelector((state) => state.user);
    
    return <>
    {
        user.isLoggedIn ?  <Dashboard/> : <Authentication/>
    }
    </>
}
export default Home;