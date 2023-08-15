import Authentication from "../../components/Authentication/Authentication";
import Dashboard from "../../components/Dashboard/Dashboard";
import { useAppSelector } from "../../redux/hooks";

const Home = () => {
    const user = useAppSelector((state) => state.session.user);

    return <>
    {
        user && user?.id && user.id != 0 ?  <Dashboard/> : <Authentication/>
    }
    </>
}
export default Home;