import {Container, Row, Col, Form} from 'react-bootstrap';
import '../styles/style.css';


const Footer = () => (
    <footer className="footer">
        <Container>
        <Row>
            <Col md={4}>
                <img src='/images/immuno_logo.png' alt="Logo" style={{ height: '50px', marginRight: '10px'}} /> 
            </Col>
            <Col md={4}>
                <Form class="border border-2 p-3 rounded"> {/*A bootstrap utility class for form border*/}
                    <h6>Get our new blogs</h6>
                        <Form.Group class="d-flex align-items-center gap-2">
                            <Form.Label>Email*</Form.Label>
                            <Form.Control type="email" size="sm"/>
                        </Form.Group>
                        <Form.Check type='checkbox'
                            id='blogcheck'
                            label='Yes, subscribe me to your newsletter. *'/>                  
                 </Form>
            </Col>
            <Col md={4} className="text-md-end" style={{textAlign: 'right'}}>
                <p>Email: immuno@gmail.com</p>
                <p>Phone: +91 1234567892</p>
            </Col>
        </Row><hr></hr>
        <Row style={{textAlign: 'center'}}>
            <p>&copy; {new Date().getFullYear()} Immuno Clinic. All rights reserved.</p>
        </Row>
        </Container>
    </footer>
);

export {Footer};