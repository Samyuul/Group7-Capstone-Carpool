import "./logout.css"
import { Link, useOutletContext } from 'react-router-dom';

const Logout = (props) => {

    const [userName, setUserName] = useOutletContext();

    return (

        <div id="logout-page">
            <h2> Logout Page </h2>
            <p>
                Are you sure?
            </p>
            <div>
                <Link id="logout-button" to={"/login"} onClick={() => setUserName("")}>
                    Yes
                </Link>
                <Link id="logout-cancel-button" to={-1}>
                    No
                </Link>
            </div>
        </div>

    )

} 

export default Logout