import Authentication from "../Authentication";
import { useSelector } from 'react-redux';

const Home = () => {
    const user = useSelector((state) => state.user);

    return <>
    {
        user.email ? <h6>Connected with email: {user.email}</h6> : <Authentication/>
    }
        
    </>
}
export default Home;