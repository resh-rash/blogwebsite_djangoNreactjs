import { useEffect, useState } from "react";
import { fetchBlogs } from '../../api/api';  //2 levels up
import {Container, Row, Col, Button, Form, Card, Image} from 'react-bootstrap';
import Carousel from 'react-bootstrap/Carousel'; //to add image slider
import immuno_default_pic1 from '../../assets/immuno_default_pic.png';
import { useNavigate } from 'react-router-dom';
import '../../styles/style.css';
import {Menu} from '../../components/navbar'
import {Footer} from '../../components/footer'


const Home = () => {
    const [blogs, setBlogs] = useState([]);
    const navigate = useNavigate();
    const doctors = [
        { name: "Dr. Aisha Khan", degree: "BAMS, MD", img: "/images/doctor.jpg" },
        { name: "Dr. Rajesh Kumar", degree: "BAMS, MD", img: "/images/doctor.jpg" },
        { name: "Dr. Priya Sharma", degree: "BHMS, MD", img: "/images/doctor.jpg" },
        { name: "Dr. John Mathew", degree: "MBBS, MD", img: "/images/doctor.jpg" },
    ];
        // Group doctors in pairs (or 3 per slide)
    const groupedDoctors = [];
    for (let i = 0; i < doctors.length; i += 3) {
        groupedDoctors.push(doctors.slice(i, i + 3));
    }

    useEffect(() => {
        fetchBlogs()
            .then((res) => {
                // Show only the latest 3 blogs
                const latest = res.data.slice(0, 3);
                setBlogs(latest);
            })
            .catch((err) => console.error(err));
    }, []);
  

    return(
        <div>
            <Menu/>
            {/* Hero Section */}
            <section className="body" style={{ textAlign: "center"}}>
                <Carousel pause='hover' >
                    <Carousel.Item>
                        <img src='images/img_slide1.jpg' style={{ height: '50vw', width: '100vw', objectFit: "cover"}}/> {/* objectFit:cover => fill the container completely, cropping parts of the image if necessary, while keeping its aspect ratio (proportions) correct.*/} 
                        <div className="custom-caption">
                            <h2 style={{color:'rgba(242, 210, 6, 1)'}}>Strengthen your Immunity with Ayurveda</h2>
                            <p>Beyond treatment, we are committed to patient education, sharing the latest insights in immunology through our Blog.</p>
                            <p>At Immuno, your well-being is our ultimate goal.</p>
                            <div className="book-btn">
                                <Button variant="info" onClick={() => navigate("/blogs")}>Go to Blogs</Button>
                            </div>
                        </div>
                    </Carousel.Item>
                    <Carousel.Item>
                        <img src='/images/img_slide2.jpg' style={{ height: '50vw', width: '100vw', objectFit: "cover"}}/> {/*vw=>viewport width*/}               
                        <div className="custom-caption">
                            <h2 style={{color: 'rgba(162, 248, 75, 1)'}}>Immuno Clinic</h2>
                            <p style={{color: 'rgba(240, 169, 27, 1)'}}>Your health, our mission — focused on Immunology</p>
                            <p>At Immuno, we specialize in the care and management of autoimmune disorders. 
                                Our expert doctors provide personalized consultations and evidence-based treatments, 
                                combining the wisdom of Ayurveda with a holistic approach that embraces effective practices from multiple medical streams.</p>
                            <div className="book-btn">
                                <Button variant="info" href="#team">Meet our team of expert Doctors</Button>
                            </div>
                            <div className="book-btn">
                                <Button variant="success" href='#contactus'>Book Consultation</Button>
                            </div>
                        </div>
                    </Carousel.Item>
                    <Carousel.Item>
                        <img src="images/img_slide3.jpg" style={{ height: '50vw', width: '100vw', objectFit: "cover"}}/>
                        <div className="custom-blog-caption">
                            <h3 style={{color: 'rgba(115, 187, 250, 1)'}}>Healthy Habits make a Happy Family</h3>
                            <div>
                                <Form class="border border-2 p-3 rounded"> {/*A bootstrap utility class for form border*/}
                                    <p>Mind your mailbox for new blogs</p>
                                    {/*Bootstrap has utility classes for inline form elements=> class="d-flex align-items-center gap-2"
                                    d-flex → makes the container a flexbox
                                    align-items-center → vertically centers label & input
                                    gap-2 → small space between elements
                                    w-auto → prevents input from stretching full width
                                    mb-0 → removes extra bottom margin on the label*/}
                                    <Form.Group class="d-flex align-items-center gap-2">
                                        <Form.Label>Email*</Form.Label>
                                        <Form.Control type="email" placeholder="name@example.com" />
                                    </Form.Group>
                                    <Form.Check type='checkbox'
                                        id='blogcheck'
                                        label='Yes, subscribe me to your newsletter. *'/>
                                    
                                </Form>
                            </div>
                            <div className="book-btn">
                                <Button variant="success">Subscribe</Button>
                            </div>
                        </div>
                    </Carousel.Item>
                </Carousel>
            </section>

            {/* Recent Blogs section */}
            <section className="body" style={{ paddingTop: "80px"}}> 
                <Container>
                    <h2 className="mb-4 text-center">Recent Blogs</h2>
                    <Row>
                        <Col md={11}>
                            <Row xs={1} md={3} className="g-2" >
                                {blogs.length > 0 ? (
                                blogs.map((blog, idx=1) => (    //map function
                                <Col key={idx} >
                                    <Card style={{ width: '100%', height: '18rem'}} key={blog.id}>
                                        <Card.Img variant="top" 
                                        src={blog.images.length > 0 ? blog.images[0].image : immuno_default_pic1} 
                                        alt={blog.title}
                                        style={{
                                            width: '100%',
                                            height: '200px',
                                            objectFit: 'cover'  //Resize the image to completely cover the 200px-high box, even if that means cropping part of it
                                        }}
                                        onError={() => console.log("Image failed to load:", blog.images[0])}/>
                                        <Card.Body>
                                            <Card.Link href={`/blog/${blog.slug}`}>{blog.title}</Card.Link>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                ))):((
                                    <div className="text-center mt-4">
                                        <h5>No blogs yet.</h5>
                                    </div>
                                ))}
                            </Row>
                        </Col>
                        <Col md={1}>
                            <Button className='blog_buttons' variant="outline-dark" size='sm'
                            onClick={() => navigate("/blogs")}
                            style={{ marginTop: '80px'}}>View more</Button>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* Services / Features Section */}
            <section className="body" style={{ paddingTop: "80px" }}>
                <Container>
                <h2 className="text-center mb-4">Our Services</h2>
                <Row>
                    <Col md={4}>
                        <h5>Specialist Consultations</h5>
                        <p>Expert Ayurvedic and immunology advice, tailored to your unique health needs. Holistic care for lasting immunity and balance.</p>
                    </Col>
                    <Col md={4}>
                        <h5>Evidence-Based Treatment</h5>
                        <p>Ancient wisdom meets modern science for proven, personalized wellness. Treatments you can trust for real results.</p>
                    </Col>
                    <Col md={4}>
                        <h5>Immunology Blog Updates</h5>
                        <p>Simple, insightful posts on Ayurveda and immunity. Stay informed and inspired with the latest health research.</p>
                    </Col>
                </Row>
                </Container>
            </section>

            {/* About Us Section */}
            {/*since nav bar is fixed at top, when jumping to this section, the heading gets covered under the nav bar. To avoid it, add paddingTop to the size of nav bar height*/}
            <section id='aboutus' className="body" style={{ paddingTop: "80px"}}>
                <Container>
                <h2 className="text-center mb-4">About Us</h2>
                <Row>
                    <Col md={7}>                   
                    <p>
                        Welcome to Immuno, where we care for people living with autoimmune disorders. 
                        Our friendly and experienced doctors offer thoughtful consultations and evidence-based treatments, blending the time-tested wisdom of Ayurveda with a holistic approach that draws from the best of other medical systems. 
                        We believe in treating the person, not just the condition — and in keeping you informed with the latest updates in immunology through our blog. 
                        At Immuno, your health, comfort, and long-term well-being are always at the heart of what we do.
                    </p>
                    </Col>
                    <Col md={5}>
                        <Carousel fade controls={false} indicators={false} interval={2000}>   {/*fade=>for transition, controls={false}=>to hide nav arrows, indicators=>to hide nav dots */}
                            <Carousel.Item>
                                <img src="images/aboutus_1.jpg"
                                    alt="About Us"
                                    style={{ height: '15vw', width: '100vw', objectFit: "cover"}}
                                    className="img-fluid rounded shadow"/>
                            </Carousel.Item>
                            <Carousel.Item>
                                <img src="images/aboutus_2.jpg"
                                    alt="About Us 2"
                                    style={{ height: '15vw', width: '100vw', objectFit: "cover"}}
                                    className="img-fluid rounded shadow"/>
                            </Carousel.Item>
                            <Carousel.Item>
                                <img src="images/aboutus_3.jpg"
                                    alt="About Us"
                                    style={{ height: '15vw', width: '100vw', objectFit: "cover"}}
                                    className="img-fluid rounded shadow"/>
                            </Carousel.Item>
                            <Carousel.Item>
                                <img src="images/aboutus_4.jpg"
                                    alt="About Us"
                                    style={{ height: '15vw', width: '100vw', objectFit: "cover"}}
                                    className="img-fluid rounded shadow"/>
                            </Carousel.Item>
                        </Carousel>
                    </Col>
                </Row>
                </Container>
            </section>

            {/* Meet our Team Section */}
            <section id='team' className="body" style={{ paddingTop: "80px"}}>
                <Container>
                    <h2 className="text-center mb-4">Meet our Team of Expert Doctors</h2>
                    <Carousel indicators={true} controls={true} interval={2000}>
                        {groupedDoctors.map((group, index) => (
                            <Carousel.Item key={index}>
                                <Row className="justify-content-left">
                                    {group.map((doc, idx) => (
                                    <Col md={4} sm={6} xs={12} key={idx} className="text-center">
                                        <Image
                                        src={doc.img}
                                        alt={doc.name}
                                        roundedCircle
                                        style={{
                                            width: "180px",
                                            height: "180px",
                                            objectFit: "cover",
                                            border: "2px solid grey",
                                        }}/>                                        
                                        <h5 className="mt-3">{doc.name}</h5>
                                        <p style={{ color: "grey" }}>{doc.degree}</p>
                                    </Col>
                                    ))}
                                </Row>
                            </Carousel.Item>
                        ))}
                    </Carousel>
                </Container>
            </section>

            {/* Contact us Section */}
            <section id='contactus' className="body" style={{ paddingTop: "80px"}}>
                <Container>
                    <h2 className="text-center mb-4">Contact Us</h2>
                    <Row>
                        {/* Left Side - Contact Details */}
                        <Col md={6} style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                            <h3>We’d Love to Hear From You!</h3>
                            <p>Whether you have a question, feedback, or just want to say hello, our team is always ready to connect with you.</p>
                            <p>Bookings for Offline consultations & Online consultations are handled only via the phone number provided below.</p>
                            <p><strong>Book consultations (Online/Offline):</strong> +91 1234567890</p>
                            <p><strong>Phone:</strong> +91 1234567892</p>
                            <p><strong>Email:</strong> immuno@gmail.com</p>
                            <p><strong>Address:</strong> 123 Street, City</p>
                        </Col>

                        {/* Right Side - Contact Form */}
                        <Col md={6}>
                            <Form style={{ backgroundColor: "white", padding: "20px", borderRadius: "10px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
                            <Form.Group className="mb-3">
                                <Form.Label>Name</Form.Label>
                                <Form.Control type="text" placeholder="Enter your name" />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Email</Form.Label>
                                <Form.Control type="email" placeholder="Enter your email" />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Contact Number</Form.Label>
                                <Form.Control type="phone" placeholder="Enter your mobile number" />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Message</Form.Label>
                                <Form.Control as="textarea" rows={4} placeholder="Type your message" />
                            </Form.Group>

                            <Button variant="success" type="submit">
                                Send
                            </Button>
                            </Form>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* Footer */}
            <Footer />
        </div>

    );
};

export {Home};