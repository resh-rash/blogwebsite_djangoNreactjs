import { Navbar, Nav, NavDropdown} from 'react-bootstrap';
import { FaFacebook, FaInstagram } from "react-icons/fa";
import '../styles/style.css';


const Menu = () =>{
    return(
        <div>  
        <Navbar className="header" variant="dark" fixed="top">
                <Navbar.Brand><img src='/images/immuno_logo.png' alt="Logo" style={{ height: '50px', marginRight: '10px'}} /></Navbar.Brand>
                <Nav className="me-auto" > {/* me-auto=> margin-end => Pushes everything after it(the next Nav item) to the far right*/}
                    <Nav.Link href="/">Home</Nav.Link>
                    <Nav.Link href="#aboutus">About Us</Nav.Link>
                    <Nav.Link href="/blogs">Blogs</Nav.Link>
                    <NavDropdown title="Researches" id="basic-nav-dropdown">
                        <NavDropdown.Item href="#">Research1</NavDropdown.Item>
                        <NavDropdown.Item href="#">Research2</NavDropdown.Item>
                        <NavDropdown.Item href="#">Research3</NavDropdown.Item>
                    </NavDropdown>
                    <Nav.Link href="#contactus">Contact Us</Nav.Link>         
                </Nav>

                <Nav >
                    <a href="https://facebook.com"
                        target="_blank"
                        rel="noopener noreferrer"  //it’s a security & privacy attribute used in anchor (<a>) tags, especially when using target="_blank"
                        //Protecting your page from malicious manipulation (noopener). Protecting the user’s privacy by not revealing your URL (noreferrer).
                        className="text-white me-3"
                        >
                        <FaFacebook size={20} />
                    </a>
                    <a href="https://instagram.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white me-3"
                        >
                        <FaInstagram size={20} />
                    </a>
                </Nav>
        </Navbar>
        </div>
    );
};

export {Menu};