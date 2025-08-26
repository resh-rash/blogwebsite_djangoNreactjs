import { useEffect, useState } from 'react';
import { fetchBlogs } from '../../api/api';   //2 levels up
import {Menu} from '../../components/navbar';
import '../../styles/style.css';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import Card from 'react-bootstrap/Card';
import {Container, Button, Form, Row, Col} from 'react-bootstrap';
import immuno_default_pic1 from '../../assets/immuno_default_pic.png';
import CategoryList from './categorylist';
import { useLocation, useNavigate } from 'react-router-dom'; //useLocation — To read current query params (?category=...) from the URL.


const BlogList = () => {
    const [blogs, setBlogs] = useState([]);
    const [search, setSearch] = useState('');
    const [hasSearched, setHasSearched] = useState(false);

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search); //get the query params from the URL
    const categoryId = queryParams.get('category');  // get ?category=ID value if present
    const navigate = useNavigate();

    useEffect(() => {
        if (categoryId) {
            fetch(`http://localhost:8000/api/blogs/?category=${categoryId}`)
            .then(res => res.json())
            .then(data => setBlogs(data));
        } else {
            fetchBlogs()
            .then((res) => setBlogs(res.data))
            .catch((err) => console.error(err));
        }
    }, [categoryId]);

    const searchBlogs = (searchQuery = '') => {
        let url = 'http://localhost:8000/api/blogs/';
        console.log("searching: ", searchQuery)
        if (searchQuery) {
        url += `?search=${encodeURIComponent(searchQuery)}`; //a JavaScript built-in function that encodes 
        // special characters in a string so it can be safely included in a URL as URLs can't contain certain characters like: 
        // spaces, &, =, ?, /, etc.
        }
        fetch(url)
        .then(res => res.json())
        .then(data => {
            setBlogs(data);
            setHasSearched(true); // Mark that a search was made
        });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        console.log('clicked search: ', search)
        searchBlogs(search);
    };

    const handleCategoryClick = (category) => {        
        navigate(`/blogs?category=${category}`);//Instead of refreshing page, it uses React Router navigate() to update the URL,
        //  which triggers useEffect. Both fetch() & navigate() don't reload the page
    };

    const stripHtml = (html) => {    //removes HTML tags from a string and returns only the plain text content.
        const temporaryDiv = document.createElement("div"); //Creates a temp <div> element in memory & acts like a sandbox for parsing HTML 
        temporaryDiv.innerHTML = html;
        return temporaryDiv.textContent || temporaryDiv.innerText || "";
    };

    return (
        <Container fluid style={{ minHeight: '700px' }}> {/*use 'Container' to avoid horizontal scrolling and 
        'fluid': makes it take the full width of the viewport responsively. 
        'minHeight': ensures layout height is maintained without setting a fixed height.*/}
            <Menu/>
            <br/><br/><br/>
            <Form style={{marginTop:'10px'}}>
                <Row>
                <Col xs="auto" style={{marginLeft:'70%'}}>
                    <Form.Control
                    type="text"
                    placeholder="Search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    size='sm'
                    />
                </Col>
                <Col xs="auto">
                    <Button variant="outline-dark" size='sm' onClick={handleSearch}>Submit</Button>
                </Col>
                </Row>
            </Form> <br/>
            <Row> 
                <Col md={1}></Col>     {/* Empty spacer column */}
                <Col md={9}>
                <Row xs={1} md={3} className="g-2" >
                    {blogs.length > 0 ? (
                    blogs.map((blog, idx=1) => (    //map function
                    <Col key={idx} >
                        <Card style={{ width: '23rem', height: '27rem'}} key={blog.id}>
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
                                <Card.Title style={{color: '#51260d'}}>{blog.title}</Card.Title>
                                <Card.Text>{stripHtml(blog.content.split(' ').slice(0, 25).join(' ')) + '...'}</Card.Text>  {/*split on spaces and limit by words instead*/}
                                <Button size='sm' style={{backgroundColor: '#8f4418', borderColor:'#8f4418'}} href={`/blog/${blog.slug}`}>Read more</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                    ))
                    ):(hasSearched && (
                    <div className="text-center mt-4">
                        <h5>No blogs found for “{search}”.</h5>
                        <p>Try a different keyword.</p>
                    </div>)
                )}
                </Row>
                </Col>

                <Col md={2}>
                    <CategoryList handleCategoryClick={handleCategoryClick}/> 
                </Col>
            </Row>
        </Container>
    );
};

export default BlogList;