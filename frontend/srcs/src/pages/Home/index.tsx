import { useNavigate } from "react-router-dom";
import Authentication from "../../components/Authentication/Authentication";
import Dashboard from "../../components/Dashboard/Dashboard";
import { useAppSelector } from "../../redux/hooks";
import verify from "../../components/Authentication/verify"
import { useEffect } from "react";

function Home() {
    const navigate = useNavigate();
    const user = useAppSelector((state) => state.session.user);

    useEffect(() => {
        async function verifyToken() {
            console.log(await verify(user.access_token));
            if (!await verify(user.access_token))
                navigate('/login');
        }
        if (user && user.access_token)
            verifyToken();
        else
            navigate('/login');
    }, [])


    return <Dashboard/>
}
export default Home;