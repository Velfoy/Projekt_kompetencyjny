import {Container} from "react-bootstrap";
import {Link} from "react-router-dom";
const Error= ()=>{
    return (
        <Container>
            <h1>Error 404</h1>
            <p>Page not found</p>
            <Link to="/" replace={true}>
            Looks like you've reached to non-existent page.<br/>
            How about to go to main page?
            </Link>
        </Container>
    );
}
export default Error;